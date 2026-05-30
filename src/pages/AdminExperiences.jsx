import React, { useEffect, useState } from 'react';
import { Gamepad2, Plus, Edit2, Trash2, Eye, EyeOff, Save, X, FolderTree } from 'lucide-react';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import { adminFetch, logoutAdmin } from '../lib/adminAuth';

const emptyExperience = {
  title: '',
  organization: '',
  categoryId: '',
  period: '',
  description: '',
  highlights: '',
  skills: '',
  credentialUrl: '',
  icon: 'briefcase',
  isActive: true,
  order: 0,
};

const emptyCategory = {
  label: '',
  slug: '',
  color: '',
  icon: '',
  description: '',
  order: 0,
  isActive: true,
};

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const AdminExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyExperience);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);

  const fetchData = async () => {
    try {
      const [experienceRes, categoryRes] = await Promise.all([
        adminFetch('/api/admin/experiences'),
        adminFetch('/api/admin/categories'),
      ]);

      if (experienceRes.status === 401 || experienceRes.status === 403 || categoryRes.status === 401 || categoryRes.status === 403) {
        window.location.href = '/admin/login';
        return;
      }

      if (experienceRes.ok) {
        setExperiences(await experienceRes.json());
      }
      if (categoryRes.ok) {
        setCategories(await categoryRes.json());
      }
    } catch (err) {
      console.error('Failed to fetch experience admin data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setForm(emptyExperience);
  };

  const resetCategoryForm = () => {
    setIsAddingCategory(false);
    setEditingCategoryId(null);
    setCategoryForm(emptyCategory);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = '/admin/login';
  };

  const handleToggleActive = async (experience) => {
    try {
      const res = await adminFetch(`/api/admin/experiences/${experience.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !experience.isActive }),
      });

      if (res.ok) {
        const updated = await res.json();
        setExperiences((current) => current.map((item) => (item.id === experience.id ? updated : item)));
      }
    } catch (err) {
      console.error('Failed to toggle experience status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus experience ini dari quest log?')) {
      return;
    }

    try {
      const res = await adminFetch(`/api/admin/experiences/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExperiences((current) => current.filter((item) => item.id !== id));
        if (editingId === id) {
          resetForm();
        }
      }
    } catch (err) {
      console.error('Failed to delete experience:', err);
    }
  };

  const handleStartAdd = () => {
    setEditingId(null);
    setIsAdding((current) => {
      const next = !current;
      setForm(next ? { ...emptyExperience, order: experiences.length + 1, categoryId: categories[0]?.id || '' } : emptyExperience);
      return next;
    });
  };

  const handleStartEdit = (experience) => {
    setIsAdding(false);
    setEditingId(experience.id);
    setForm({
      title: experience.title || '',
      organization: experience.organization || '',
      categoryId: experience.categoryId || experience.category?.id || '',
      period: experience.period || '',
      description: experience.description || '',
      highlights: Array.isArray(experience.highlights) ? experience.highlights.join(', ') : '',
      skills: Array.isArray(experience.skills) ? experience.skills.join(', ') : '',
      credentialUrl: experience.credentialUrl || '',
      icon: experience.icon || 'briefcase',
      isActive: Boolean(experience.isActive),
      order: experience.order || 0,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      title: form.title,
      organization: form.organization,
      categoryId: Number.parseInt(form.categoryId, 10),
      period: form.period,
      description: form.description,
      highlights: form.highlights.split(',').map((item) => item.trim()).filter(Boolean),
      skills: form.skills.split(',').map((item) => item.trim()).filter(Boolean),
      credentialUrl: form.credentialUrl,
      icon: form.icon,
      isActive: form.isActive,
      order: Number.parseInt(form.order, 10) || 0,
    };

    try {
      const res = await adminFetch(editingId ? `/api/admin/experiences/${editingId}` : '/api/admin/experiences', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan experience');
      }

      setExperiences((current) => {
        if (editingId) {
          return current.map((item) => (item.id === editingId ? data : item));
        }

        return [...current, data].sort((a, b) => a.order - b.order);
      });
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStartAddCategory = () => {
    setEditingCategoryId(null);
    setIsAddingCategory((current) => {
      const next = !current;
      setCategoryForm(next ? { ...emptyCategory, order: categories.length + 1 } : emptyCategory);
      return next;
    });
  };

  const handleStartEditCategory = (category) => {
    setIsAddingCategory(false);
    setEditingCategoryId(category.id);
    setCategoryForm({
      label: category.label || '',
      slug: category.slug || '',
      color: category.color || '',
      icon: category.icon || '',
      description: category.description || '',
      order: category.order || 0,
      isActive: Boolean(category.isActive),
    });
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();

    const payload = {
      label: categoryForm.label,
      slug: slugify(categoryForm.slug || categoryForm.label),
      color: categoryForm.color,
      icon: categoryForm.icon,
      description: categoryForm.description,
      order: Number.parseInt(categoryForm.order, 10) || 0,
      isActive: categoryForm.isActive,
    };

    try {
      const res = await adminFetch(editingCategoryId ? `/api/admin/categories/${editingCategoryId}` : '/api/admin/categories', {
        method: editingCategoryId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan category');
      }

      setCategories((current) => {
        if (editingCategoryId) {
          return current.map((item) => (item.id === editingCategoryId ? data : item)).sort((a, b) => a.order - b.order);
        }

        return [...current, data].sort((a, b) => a.order - b.order);
      });
      resetCategoryForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Hapus category ${category.label}?`)) {
      return;
    }

    try {
      const res = await adminFetch(`/api/admin/categories/${category.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus category');
      }

      setCategories((current) => current.filter((item) => item.id !== category.id));
      if (editingCategoryId === category.id) {
        resetCategoryForm();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0EFE6', color: 'var(--color-text)' }}>
      <header style={{ borderBottom: '4px solid var(--color-border)', backgroundColor: '#FFF', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="font-retro-game">
            <Gamepad2 size={24} style={{ color: 'var(--color-highlight)' }} />
            <span style={{ fontSize: '13px' }}>CMS HUD</span>
          </div>

          <nav style={{ display: 'flex', gap: '20px' }} className="admin-nav">
            <a href="/admin/dashboard" className="font-retro-label">DASHBOARD</a>
            <a href="/admin/experiences" className="font-retro-label active-nav">EXPERIENCES</a>
            <a href="/admin/projects" className="font-retro-label">PROJECTS</a>
            <a href="/admin/inquiries" className="font-retro-label">INBOX</a>
            <a href="/admin/settings" className="font-retro-label">SETTINGS</a>
          </nav>

          <PixelButton variant="gray" onClick={handleLogout} style={{ minHeight: '36px', minWidth: '90px', padding: '6px 12px', fontSize: '9px' }}>
            LOGOUT
          </PixelButton>
        </div>
      </header>

      <main className="container" style={{ padding: '40px 24px', maxWidth: '1200px', display: 'grid', gap: '32px' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 className="font-retro-game" style={{ fontSize: '18px' }}>EXPERIENCE QUEST LOG</h2>
            <PixelButton variant="orange" onClick={handleStartAdd} style={{ minHeight: '40px', padding: '8px 16px', fontSize: '10px' }}>
              <Plus size={14} style={{ marginRight: '4px' }} /> {isAdding ? 'CANCEL ENTRY' : 'ADD EXPERIENCE'}
            </PixelButton>
          </div>

          {(isAdding || editingId) && (
            <div style={{ marginBottom: '40px' }} className="animate-jump">
              <PixelCard stageLabel={editingId ? 'EDIT RECORD' : 'NEW RECORD'}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', textAlign: 'left' }}>
                  <div>
                    <label className="pixel-label" htmlFor="title">EXPERIENCE TITLE</label>
                    <input id="title" type="text" className="pixel-input" value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} required />
                  </div>

                  <div>
                    <label className="pixel-label" htmlFor="organization">ORGANIZATION / COMPANY</label>
                    <input id="organization" type="text" className="pixel-input" value={form.organization} onChange={(e) => setForm((current) => ({ ...current, organization: e.target.value }))} required />
                  </div>

                  <div>
                    <label className="pixel-label" htmlFor="categoryId">CATEGORY</label>
                    <select id="categoryId" className="pixel-input" value={form.categoryId} onChange={(e) => setForm((current) => ({ ...current, categoryId: e.target.value }))} required>
                      <option value="">Pilih category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="pixel-label" htmlFor="period">PERIOD</label>
                    <input id="period" type="text" className="pixel-input" value={form.period} onChange={(e) => setForm((current) => ({ ...current, period: e.target.value }))} placeholder="Contoh: Jan 2024 - Mar 2024" required />
                  </div>

                  <div>
                    <label className="pixel-label" htmlFor="icon">ICON KEY</label>
                    <input id="icon" type="text" className="pixel-input" value={form.icon} onChange={(e) => setForm((current) => ({ ...current, icon: e.target.value }))} placeholder="briefcase / users / graduation-cap / badge-check" />
                  </div>

                  <div>
                    <label className="pixel-label" htmlFor="order">DISPLAY ORDER</label>
                    <input id="order" type="number" min="0" className="pixel-input" value={form.order} onChange={(e) => setForm((current) => ({ ...current, order: e.target.value }))} />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="pixel-label" htmlFor="description">DESCRIPTION</label>
                    <textarea id="description" rows="4" className="pixel-input" style={{ resize: 'none', padding: '12px' }} value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} required />
                  </div>

                  <div>
                    <label className="pixel-label" htmlFor="highlights">HIGHLIGHTS (COMMA SEPARATED)</label>
                    <textarea id="highlights" rows="3" className="pixel-input" style={{ resize: 'none', padding: '12px' }} value={form.highlights} onChange={(e) => setForm((current) => ({ ...current, highlights: e.target.value }))} required />
                  </div>

                  <div>
                    <label className="pixel-label" htmlFor="skills">SKILLS (COMMA SEPARATED)</label>
                    <textarea id="skills" rows="3" className="pixel-input" style={{ resize: 'none', padding: '12px' }} value={form.skills} onChange={(e) => setForm((current) => ({ ...current, skills: e.target.value }))} required />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="pixel-label" htmlFor="credentialUrl">CREDENTIAL URL</label>
                    <input id="credentialUrl" type="url" className="pixel-input" value={form.credentialUrl} onChange={(e) => setForm((current) => ({ ...current, credentialUrl: e.target.value }))} />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                    <input id="active-toggle" type="checkbox" checked={form.isActive} onChange={(e) => setForm((current) => ({ ...current, isActive: e.target.checked }))} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                    <label className="font-retro-label" htmlFor="active-toggle" style={{ fontSize: '11px', cursor: 'pointer' }}>VISIBLE ON PUBLIC QUEST LOG</label>
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <PixelButton variant="orange" type="submit" ariaLabel="Simpan experience" style={{ width: '220px', marginTop: '12px', fontSize: '11px' }}>
                      <Save size={14} style={{ marginRight: '6px' }} /> {editingId ? 'UPDATE RECORD' : 'SAVE RECORD'}
                    </PixelButton>
                    <PixelButton variant="gray" type="button" onClick={resetForm} style={{ width: '180px', marginTop: '12px', fontSize: '11px' }}>
                      <X size={14} style={{ marginRight: '6px' }} /> CANCEL EDIT
                    </PixelButton>
                  </div>
                </form>
              </PixelCard>
            </div>
          )}

          <PixelCard stageLabel="LOADED QUEST RECORDS">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '980px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>TITLE</th>
                    <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>ORGANIZATION</th>
                    <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>CATEGORY</th>
                    <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>PERIOD</th>
                    <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>ORDER</th>
                    <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px', textAlign: 'center' }}>VISIBILITY</th>
                    <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px', textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {experiences.map((experience) => (
                    <tr key={experience.id} style={{ borderBottom: '1px solid #CCC', opacity: experience.isActive ? 1 : 0.6 }}>
                      <td style={{ padding: '14px 12px' }}>
                        <div className="font-retro-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>{experience.title}</div>
                        <div style={{ fontSize: '12px', color: '#555', marginTop: '6px' }}>{experience.description}</div>
                      </td>
                      <td style={{ padding: '14px 12px', fontSize: '13px' }}>{experience.organization}</td>
                      <td className="font-retro-label" style={{ padding: '14px 12px', fontSize: '10px' }}>{experience.category?.label || '-'}</td>
                      <td className="font-retro-game" style={{ padding: '14px 12px', fontSize: '10px', color: 'var(--color-accent)' }}>{experience.period}</td>
                      <td className="font-retro-label" style={{ padding: '14px 12px', fontSize: '10px' }}>{experience.order}</td>
                      <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                        <button onClick={() => handleToggleActive(experience)} className="pixel-box cursor-pointer" style={{ padding: '6px 10px', fontSize: '9px', borderWidth: '2px', boxShadow: '1px 1px 0px var(--color-border)', backgroundColor: experience.isActive ? 'var(--color-accent)' : '#FFF', color: experience.isActive ? '#FFF' : 'var(--color-text)', fontFamily: 'var(--font-label)', fontWeight: 'bold' }}>
                          {experience.isActive ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={12} /> ACTIVE</span> : <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><EyeOff size={12} /> HIDDEN</span>}
                        </button>
                      </td>
                      <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button onClick={() => handleStartEdit(experience)} className="pixel-box cursor-pointer" style={{ padding: '6px', borderWidth: '2px', boxShadow: '1px 1px 0px var(--color-border)', backgroundColor: '#FFF' }} title="Edit experience">
                            <Edit2 size={12} />
                          </button>
                          <button onClick={() => handleDelete(experience.id)} className="pixel-box cursor-pointer" style={{ padding: '6px', borderWidth: '2px', boxShadow: '1px 1px 0px var(--color-border)', backgroundColor: '#F44336', color: '#FFF' }} title="Delete experience">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PixelCard>
        </section>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="font-retro-game" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}><FolderTree size={18} /> CATEGORY REGISTRY</h2>
            <PixelButton variant="orange" onClick={handleStartAddCategory} style={{ minHeight: '40px', padding: '8px 16px', fontSize: '10px' }}>
              <Plus size={14} style={{ marginRight: '4px' }} /> {isAddingCategory ? 'CANCEL CATEGORY' : 'ADD CATEGORY'}
            </PixelButton>
          </div>

          {(isAddingCategory || editingCategoryId) && (
            <div style={{ marginBottom: '32px' }} className="animate-jump">
              <PixelCard stageLabel={editingCategoryId ? 'EDIT CATEGORY' : 'NEW CATEGORY'}>
                <form onSubmit={handleCategorySubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', textAlign: 'left' }}>
                  <div>
                    <label className="pixel-label" htmlFor="category-label">LABEL</label>
                    <input id="category-label" type="text" className="pixel-input" value={categoryForm.label} onChange={(e) => setCategoryForm((current) => ({ ...current, label: e.target.value, slug: current.slug ? current.slug : slugify(e.target.value) }))} required />
                  </div>
                  <div>
                    <label className="pixel-label" htmlFor="category-slug">SLUG</label>
                    <input id="category-slug" type="text" className="pixel-input" value={categoryForm.slug} onChange={(e) => setCategoryForm((current) => ({ ...current, slug: slugify(e.target.value) }))} required />
                  </div>
                  <div>
                    <label className="pixel-label" htmlFor="category-color">HEX COLOR</label>
                    <input id="category-color" type="text" className="pixel-input" value={categoryForm.color} onChange={(e) => setCategoryForm((current) => ({ ...current, color: e.target.value }))} placeholder="#FF6B35" />
                  </div>
                  <div>
                    <label className="pixel-label" htmlFor="category-icon">ICON KEY</label>
                    <input id="category-icon" type="text" className="pixel-input" value={categoryForm.icon} onChange={(e) => setCategoryForm((current) => ({ ...current, icon: e.target.value }))} placeholder="briefcase / users / graduation-cap" />
                  </div>
                  <div>
                    <label className="pixel-label" htmlFor="category-order">DISPLAY ORDER</label>
                    <input id="category-order" type="number" min="0" className="pixel-input" value={categoryForm.order} onChange={(e) => setCategoryForm((current) => ({ ...current, order: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '32px' }}>
                    <input id="category-active" type="checkbox" checked={categoryForm.isActive} onChange={(e) => setCategoryForm((current) => ({ ...current, isActive: e.target.checked }))} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                    <label className="font-retro-label" htmlFor="category-active" style={{ fontSize: '11px', cursor: 'pointer' }}>CATEGORY ACTIVE</label>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="pixel-label" htmlFor="category-description">DESCRIPTION</label>
                    <textarea id="category-description" rows="3" className="pixel-input" style={{ resize: 'none', padding: '12px' }} value={categoryForm.description} onChange={(e) => setCategoryForm((current) => ({ ...current, description: e.target.value }))} />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <PixelButton variant="orange" type="submit" ariaLabel="Simpan category" style={{ width: '220px', marginTop: '12px', fontSize: '11px' }}>
                      <Save size={14} style={{ marginRight: '6px' }} /> {editingCategoryId ? 'UPDATE CATEGORY' : 'SAVE CATEGORY'}
                    </PixelButton>
                    <PixelButton variant="gray" type="button" onClick={resetCategoryForm} style={{ width: '180px', marginTop: '12px', fontSize: '11px' }}>
                      <X size={14} style={{ marginRight: '6px' }} /> CANCEL EDIT
                    </PixelButton>
                  </div>
                </form>
              </PixelCard>
            </div>
          )}

          <PixelCard stageLabel="LOADED CATEGORY REGISTRY">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '860px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>LABEL</th>
                    <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>SLUG</th>
                    <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>ICON</th>
                    <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>COLOR</th>
                    <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>ORDER</th>
                    <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>STATUS</th>
                    <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px', textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} style={{ borderBottom: '1px solid #CCC', opacity: category.isActive ? 1 : 0.65 }}>
                      <td style={{ padding: '14px 12px' }}>
                        <div className="font-retro-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>{category.label}</div>
                        <div style={{ fontSize: '12px', color: '#555', marginTop: '6px' }}>{category.description || '-'}</div>
                      </td>
                      <td className="font-retro-label" style={{ padding: '14px 12px', fontSize: '10px' }}>{category.slug}</td>
                      <td className="font-retro-label" style={{ padding: '14px 12px', fontSize: '10px' }}>{category.icon || '-'}</td>
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '14px', height: '14px', border: '1px solid var(--color-border)', backgroundColor: category.color || '#ffffff', display: 'inline-block' }} />
                          <span className="font-retro-label" style={{ fontSize: '10px' }}>{category.color || '-'}</span>
                        </div>
                      </td>
                      <td className="font-retro-label" style={{ padding: '14px 12px', fontSize: '10px' }}>{category.order}</td>
                      <td className="font-retro-label" style={{ padding: '14px 12px', fontSize: '10px' }}>{category.isActive ? 'ACTIVE' : 'HIDDEN'}</td>
                      <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button onClick={() => handleStartEditCategory(category)} className="pixel-box cursor-pointer" style={{ padding: '6px', borderWidth: '2px', boxShadow: '1px 1px 0px var(--color-border)', backgroundColor: '#FFF' }} title="Edit category">
                            <Edit2 size={12} />
                          </button>
                          <button onClick={() => handleDeleteCategory(category)} className="pixel-box cursor-pointer" style={{ padding: '6px', borderWidth: '2px', boxShadow: '1px 1px 0px var(--color-border)', backgroundColor: '#F44336', color: '#FFF' }} title="Delete category">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PixelCard>
        </section>
      </main>

      <style>{`
        .admin-nav a {
          text-decoration: none;
          color: var(--color-text);
          font-size: 11px;
          padding: 4px 8px;
          border-bottom: 3px solid transparent;
        }
        .admin-nav a:hover {
          color: var(--color-highlight);
        }
        .admin-nav a.active-nav {
          color: var(--color-highlight);
          border-bottom: 3px solid var(--color-highlight);
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default AdminExperiences;
