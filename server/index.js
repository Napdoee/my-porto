import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './middleware/auth.js';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

const WHATSAPP_PATTERN = /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_INQUIRY_STATUS = ['NEW', 'READ', 'ARCHIVED'];
const SETTINGS_WITH_NUMERIC_LIMITS = new Set(['hp', 'mp', 'speed', 'defense', 'skill_1_pct', 'skill_2_pct', 'skill_3_pct', 'skill_4_pct']);

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return process.env.JWT_SECRET;
}

function setAuthCookie(res, token) {
  res.cookie('adminToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  });
}

function clearAuthCookie(res) {
  res.clearCookie('adminToken', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

function parseId(value) {
  const id = Number.parseInt(value, 10);
  return Number.isInteger(id) ? id : null;
}

function normalizeWhatsapp(value) {
  return String(value || '').trim().replace(/\s+/g, '');
}

function sanitizeTags(tags) {
  const rawTags = Array.isArray(tags) ? tags : String(tags || '').split(',');
  return rawTags.map((tag) => tag.trim()).filter(Boolean);
}

function sanitizeSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sanitizeStringList(values) {
  const rawValues = Array.isArray(values) ? values : String(values || '').split(',');
  return rawValues.map((value) => String(value).trim()).filter(Boolean);
}

function sanitizeCategoryIds(values) {
  const rawValues = Array.isArray(values) ? values : [values];
  return Array.from(new Set(rawValues.map((value) => Number.parseInt(value, 10)).filter((value) => Number.isInteger(value) && value > 0)));
}

function parseCategory(category) {
  return {
    ...category,
    slug: String(category.slug || '').trim().toLowerCase(),
    label: String(category.label || '').trim(),
  };
}

function parseExperience(experience) {
  return {
    ...experience,
    category: experience.category ? parseCategory(experience.category) : null,
    categoryId: experience.categoryId ?? experience.category?.id ?? null,
    highlights: Array.isArray(experience.highlights) ? experience.highlights : sanitizeStringList(experience.highlights),
    skills: Array.isArray(experience.skills) ? experience.skills : sanitizeStringList(experience.skills),
  };
}

function parseProject(project) {
  return {
    ...project,
    tags: Array.isArray(project.tags) ? project.tags : sanitizeTags(project.tags),
    categories: Array.isArray(project.categories) ? project.categories.map(parseCategory) : [],
  };
}

function validateCategoryPayload(payload, { partial = false } = {}) {
  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'label')) {
    if (!String(payload.label || '').trim()) {
      return 'Category label is required';
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'slug')) {
    if (!sanitizeSlug(payload.slug || payload.label)) {
      return 'Category slug is required';
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'color') && payload.color) {
    const color = String(payload.color).trim();
    if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color)) {
      return 'Category color must be a valid hex color';
    }
  }

  return null;
}

function validateSettingsPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return 'Invalid settings payload';
  }

  for (const [key, rawValue] of Object.entries(payload)) {
    const value = String(rawValue ?? '').trim();

    if (!value) {
      return `Setting ${key} cannot be empty`;
    }

    if (key === 'whatsapp' && !WHATSAPP_PATTERN.test(normalizeWhatsapp(value))) {
      return 'Invalid Indonesian WhatsApp number';
    }

    if (['github', 'linkedin', 'instagram'].includes(key)) {
      try {
        new URL(value);
      } catch {
        return `Setting ${key} must be a valid URL`;
      }
    }

    if (SETTINGS_WITH_NUMERIC_LIMITS.has(key)) {
      const max = key.startsWith('skill_') ? 100 : 99;
      const numericValue = Number.parseInt(value, 10);
      if (!Number.isInteger(numericValue) || numericValue < 0 || numericValue > max) {
        return `Setting ${key} must be between 0 and ${max}`;
      }
    }
  }

  return null;
}

function validateExperiencePayload(payload, { partial = false } = {}) {
  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'title')) {
    if (!String(payload.title || '').trim()) {
      return 'Title is required';
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'organization')) {
    if (!String(payload.organization || '').trim()) {
      return 'Organization is required';
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'category')) {
    const categoryId = Number.parseInt(payload.categoryId ?? payload.category, 10);
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return 'Category is required';
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'period')) {
    if (!String(payload.period || '').trim()) {
      return 'Period is required';
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'description')) {
    if (!String(payload.description || '').trim()) {
      return 'Description is required';
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'skills')) {
    if (sanitizeStringList(payload.skills).length === 0) {
      return 'At least one skill is required';
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'highlights')) {
    if (sanitizeStringList(payload.highlights).length === 0) {
      return 'At least one highlight is required';
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'credentialUrl') && payload.credentialUrl) {
    try {
      new URL(String(payload.credentialUrl).trim());
    } catch {
      return 'Credential URL must be a valid URL';
    }
  }

  return null;
}

function validateProjectPayload(payload, { partial = false } = {}) {
  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'title')) {
    if (!String(payload.title || '').trim()) {
      return 'Title is required';
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'description')) {
    if (!String(payload.description || '').trim()) {
      return 'Description is required';
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'tags')) {
    if (sanitizeTags(payload.tags).length === 0) {
      return 'At least one tech tag is required';
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'categoryIds')) {
    if (sanitizeCategoryIds(payload.categoryIds).length === 0) {
      return 'At least one category is required';
    }
  }

  for (const key of ['thumbnail', 'liveUrl', 'repoUrl']) {
    if (Object.prototype.hasOwnProperty.call(payload, key) && payload[key]) {
      try {
        new URL(String(payload[key]).trim());
      } catch {
        return `${key} must be a valid URL`;
      }
    }
  }

  return null;
}

async function ensureCategoryExists(categoryId) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  return category || null;
}

async function ensureCategoriesExist(categoryIds) {
  const categories = await prisma.category.findMany({ where: { id: { in: categoryIds } } });
  return categories.length === categoryIds.length ? categories : null;
}

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ── PUBLIC ROUTES ────────────────────────────────────────────────────────────

// GET /api/settings — all landing page settings as a flat key/value object
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    const result = {};
    for (const s of settings) result[s.key] = s.value;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { label: 'asc' }],
    });
    res.json(categories.map(parseCategory));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/experiences — active experiences only (public)
app.get('/api/experiences', async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { order: 'asc' },
    });
    res.json(experiences.map(parseExperience));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects — all projects, featured first (public)
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { categories: { where: { isActive: true }, orderBy: [{ order: 'asc' }, { label: 'asc' }] } },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
    const parsed = projects.map(parseProject);
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inquiries — submit contact form
app.post('/api/inquiries', async (req, res) => {
  try {
    const { nama, whatsapp, email, detail } = req.body;
    const normalizedWhatsapp = normalizeWhatsapp(whatsapp);

    if (!nama || !whatsapp || !email || !detail) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!WHATSAPP_PATTERN.test(normalizedWhatsapp)) {
      return res.status(400).json({ error: 'Invalid Indonesian WhatsApp number' });
    }

    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const inquiry = await prisma.inquiry.create({
      data: { nama: String(nama).trim(), whatsapp: normalizedWhatsapp, email: String(email).trim(), detail: String(detail).trim(), status: 'NEW' },
    });
    res.status(201).json({ success: true, id: inquiry.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login — admin login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return res.status(401).json({ error: 'GAME OVER. Invalid credentials.' });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ error: 'GAME OVER. Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      getJwtSecret(),
      { expiresIn: '24h' }
    );

    setAuthCookie(res, token);
    res.json({ token, username: admin.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/session', authMiddleware, async (req, res) => {
  res.json({ authenticated: true, admin: req.admin });
});

app.post('/api/auth/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true });
});

// ── PROTECTED ADMIN ROUTES ───────────────────────────────────────────────────

// GET /api/admin/stats — dashboard stats
app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  try {
    const startOfWindow = new Date();
    startOfWindow.setDate(startOfWindow.getDate() - 7);

    const [totalInquiries, newThisWeek, totalExperiences, totalProjects] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { createdAt: { gte: startOfWindow } } }),
      prisma.experience.count(),
      prisma.project.count(),
    ]);
    res.json({ totalInquiries, newThisWeek, totalExperiences, totalProjects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Settings CRUD ────────────────────────────────────────────────────────────

// GET /api/admin/settings — all settings (admin)
app.get('/api/admin/settings', authMiddleware, async (req, res) => {
  try {
    const settings = await prisma.setting.findMany({ orderBy: { key: 'asc' } });
    const result = {};
    for (const s of settings) result[s.key] = s.value;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/settings — update multiple settings at once
app.put('/api/admin/settings', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    const validationError = validateSettingsPayload(updates);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const ops = Object.entries(updates).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: key === 'whatsapp' ? normalizeWhatsapp(value) : String(value).trim() },
        create: { key, value: key === 'whatsapp' ? normalizeWhatsapp(value) : String(value).trim() },
      })
    );
    await Promise.all(ops);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Categories CRUD ───────────────────────────────────────────────────────────

app.get('/api/admin/categories', authMiddleware, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: [{ order: 'asc' }, { label: 'asc' }] });
    res.json(categories.map(parseCategory));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/categories', authMiddleware, async (req, res) => {
  try {
    const validationError = validateCategoryPayload(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const slug = sanitizeSlug(req.body.slug || req.body.label);
    const category = await prisma.category.create({
      data: {
        slug,
        label: String(req.body.label).trim(),
        color: req.body.color ? String(req.body.color).trim() : null,
        icon: req.body.icon ? String(req.body.icon).trim() : null,
        description: req.body.description ? String(req.body.description).trim() : null,
        order: Number.parseInt(req.body.order, 10) || 0,
        isActive: req.body.isActive ?? true,
      },
    });
    res.status(201).json(parseCategory(category));
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Category slug already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/categories/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid category id' });
    }

    const validationError = validateCategoryPayload(req.body, { partial: true });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const data = {
      label: Object.prototype.hasOwnProperty.call(req.body, 'label') ? String(req.body.label).trim() : undefined,
      slug: Object.prototype.hasOwnProperty.call(req.body, 'slug') ? sanitizeSlug(req.body.slug || req.body.label) : undefined,
      color: Object.prototype.hasOwnProperty.call(req.body, 'color') ? (req.body.color ? String(req.body.color).trim() : null) : undefined,
      icon: Object.prototype.hasOwnProperty.call(req.body, 'icon') ? (req.body.icon ? String(req.body.icon).trim() : null) : undefined,
      description: Object.prototype.hasOwnProperty.call(req.body, 'description') ? (req.body.description ? String(req.body.description).trim() : null) : undefined,
      order: Object.prototype.hasOwnProperty.call(req.body, 'order') ? (Number.parseInt(req.body.order, 10) || 0) : undefined,
      isActive: Object.prototype.hasOwnProperty.call(req.body, 'isActive') ? Boolean(req.body.isActive) : undefined,
    };

    const category = await prisma.category.update({ where: { id }, data });
    res.json(parseCategory(category));
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Category slug already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/categories/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid category id' });
    }

    const [experienceCount, projectCount] = await Promise.all([
      prisma.experience.count({ where: { categoryId: id } }),
      prisma.project.count({ where: { categories: { some: { id } } } }),
    ]);

    if (experienceCount > 0 || projectCount > 0) {
      return res.status(400).json({ error: 'Category is still used by experiences or projects' });
    }

    await prisma.category.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Experiences CRUD ─────────────────────────────────────────────────────────

app.get('/api/admin/experiences', authMiddleware, async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({ include: { category: true }, orderBy: { order: 'asc' } });
    res.json(experiences.map(parseExperience));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/experiences', authMiddleware, async (req, res) => {
  try {
    const { title, organization, categoryId, period, description, highlights, skills, credentialUrl, icon, isActive, order } = req.body;
    const validationError = validateExperiencePayload(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const normalizedCategoryId = Number.parseInt(categoryId ?? req.body.category, 10);
    const category = await ensureCategoryExists(normalizedCategoryId);
    if (!category) {
      return res.status(400).json({ error: 'Category is invalid' });
    }

    const experience = await prisma.experience.create({
      include: { category: true },
      data: {
        title: String(title).trim(),
        organization: String(organization).trim(),
        categoryId: normalizedCategoryId,
        period: String(period).trim(),
        description: String(description).trim(),
        highlights: sanitizeStringList(highlights),
        skills: sanitizeStringList(skills),
        credentialUrl: credentialUrl ? String(credentialUrl).trim() : null,
        icon: icon ? String(icon).trim() : null,
        isActive: isActive ?? true,
        order: Number.parseInt(order, 10) || 0,
      },
    });
    res.status(201).json(parseExperience(experience));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/experiences/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid experience id' });
    }

    const validationError = validateExperiencePayload(req.body, { partial: true });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    let normalizedCategoryId;
    if (Object.prototype.hasOwnProperty.call(req.body, 'categoryId') || Object.prototype.hasOwnProperty.call(req.body, 'category')) {
      normalizedCategoryId = Number.parseInt(req.body.categoryId ?? req.body.category, 10);
      const category = await ensureCategoryExists(normalizedCategoryId);
      if (!category) {
        return res.status(400).json({ error: 'Category is invalid' });
      }
    }

    const data = {
      title: Object.prototype.hasOwnProperty.call(req.body, 'title') ? String(req.body.title).trim() : undefined,
      organization: Object.prototype.hasOwnProperty.call(req.body, 'organization') ? String(req.body.organization).trim() : undefined,
      categoryId: normalizedCategoryId,
      period: Object.prototype.hasOwnProperty.call(req.body, 'period') ? String(req.body.period).trim() : undefined,
      description: Object.prototype.hasOwnProperty.call(req.body, 'description') ? String(req.body.description).trim() : undefined,
      highlights: Object.prototype.hasOwnProperty.call(req.body, 'highlights') ? sanitizeStringList(req.body.highlights) : undefined,
      skills: Object.prototype.hasOwnProperty.call(req.body, 'skills') ? sanitizeStringList(req.body.skills) : undefined,
      credentialUrl: Object.prototype.hasOwnProperty.call(req.body, 'credentialUrl') ? (req.body.credentialUrl ? String(req.body.credentialUrl).trim() : null) : undefined,
      icon: Object.prototype.hasOwnProperty.call(req.body, 'icon') ? (req.body.icon ? String(req.body.icon).trim() : null) : undefined,
      order: Object.prototype.hasOwnProperty.call(req.body, 'order') ? (Number.parseInt(req.body.order, 10) || 0) : undefined,
    };
    const experience = await prisma.experience.update({ where: { id }, data, include: { category: true } });
    res.json(parseExperience(experience));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/experiences/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid experience id' });
    }

    await prisma.experience.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Projects CRUD ────────────────────────────────────────────────────────────

app.get('/api/admin/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { categories: { orderBy: [{ order: 'asc' }, { label: 'asc' }] } },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
    const parsed = projects.map(parseProject);
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/projects', authMiddleware, async (req, res) => {
  try {
    const { title, description, thumbnail, tags, liveUrl, repoUrl, isFeatured, categoryIds } = req.body;
    const validationError = validateProjectPayload(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const parsedTags = sanitizeTags(tags);
    const parsedCategoryIds = sanitizeCategoryIds(categoryIds);
    const categories = await ensureCategoriesExist(parsedCategoryIds);
    if (!categories) {
      return res.status(400).json({ error: 'One or more project categories are invalid' });
    }

    const project = await prisma.project.create({
      include: { categories: { orderBy: [{ order: 'asc' }, { label: 'asc' }] } },
      data: {
        title: String(title).trim(),
        description: String(description).trim(),
        thumbnail: thumbnail ? String(thumbnail).trim() : null,
        tags: parsedTags,
        liveUrl: liveUrl ? String(liveUrl).trim() : null,
        repoUrl: repoUrl ? String(repoUrl).trim() : null,
        isFeatured: isFeatured ?? false,
        categories: {
          connect: parsedCategoryIds.map((id) => ({ id })),
        },
      },
    });
    res.status(201).json(parseProject(project));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/projects/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid project id' });
    }

    const validationError = validateProjectPayload(req.body, { partial: true });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { title, description, thumbnail, tags, liveUrl, repoUrl, isFeatured, categoryIds } = req.body;
    let parsedCategoryIds;
    if (Object.prototype.hasOwnProperty.call(req.body, 'categoryIds')) {
      parsedCategoryIds = sanitizeCategoryIds(categoryIds);
      const categories = await ensureCategoriesExist(parsedCategoryIds);
      if (!categories) {
        return res.status(400).json({ error: 'One or more project categories are invalid' });
      }
    }

    const project = await prisma.project.update({
      where: { id },
      include: { categories: { orderBy: [{ order: 'asc' }, { label: 'asc' }] } },
      data: {
        title: Object.prototype.hasOwnProperty.call(req.body, 'title') ? String(title).trim() : undefined,
        description: Object.prototype.hasOwnProperty.call(req.body, 'description') ? String(description).trim() : undefined,
        thumbnail: Object.prototype.hasOwnProperty.call(req.body, 'thumbnail') ? (thumbnail ? String(thumbnail).trim() : null) : undefined,
        tags: Object.prototype.hasOwnProperty.call(req.body, 'tags') ? sanitizeTags(tags) : undefined,
        liveUrl: Object.prototype.hasOwnProperty.call(req.body, 'liveUrl') ? (liveUrl ? String(liveUrl).trim() : null) : undefined,
        repoUrl: Object.prototype.hasOwnProperty.call(req.body, 'repoUrl') ? (repoUrl ? String(repoUrl).trim() : null) : undefined,
        isFeatured,
        categories: Object.prototype.hasOwnProperty.call(req.body, 'categoryIds')
          ? { set: parsedCategoryIds.map((categoryId) => ({ id: categoryId })) }
          : undefined,
      },
    });
    res.json(parseProject(project));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/projects/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid project id' });
    }

    await prisma.project.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Inquiries ────────────────────────────────────────────────────────────────

app.get('/api/admin/inquiries', authMiddleware, async (req, res) => {
  try {
    const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/inquiries/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid inquiry id' });
    }

    const { status } = req.body;
    if (!ALLOWED_INQUIRY_STATUS.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const inquiry = await prisma.inquiry.update({ where: { id }, data: { status } });
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎮 Napdoee API Server running on http://localhost:${PORT}`);
});
