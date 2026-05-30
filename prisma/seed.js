import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Napdoee database...');

  // ── Admin User ──────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: hashedPassword },
  });
  console.log('✅ Admin user created: admin / admin123');

  // ── Landing Page Settings ───────────────────────────────────────────────────
  const defaultSettings = [
    { key: 'dev_name',    value: 'NAPDOEE' },
    { key: 'tagline',     value: 'Fullstack Developer based in Makassar, Indonesia. Building clean, fast, and interactive web experiences.' },
    { key: 'class',       value: 'LEVEL 99 WEB MAGE' },
    { key: 'location',    value: 'MAKASSAR, ID' },
    { key: 'hp',          value: '99' },
    { key: 'mp',          value: '88' },
    { key: 'speed',       value: '95' },
    { key: 'defense',     value: '90' },
    { key: 'bio',         value: "Hello Explorer! I'm a Makassar-based Web Developer who builds sleek retro systems and clean digital playgrounds. My core capability is executing robust full-stack applications with high performance. When I'm not tweaking HMR bundles in React or managing Postgres instances with Prisma, I code custom CSS parallax scroll triggers, play retro melodies on my guitar, and edit video content. Let's start the level selection maps below!" },
    { key: 'whatsapp',   value: '6282296181518' },
    { key: 'github',      value: 'https://github.com' },
    { key: 'linkedin',    value: 'https://linkedin.com' },
    { key: 'instagram',   value: 'https://instagram.com' },
    { key: 'skill_1_name', value: 'React.js & Frontend Design' },
    { key: 'skill_1_pct',  value: '90' },
    { key: 'skill_2_name', value: 'Node.js & Express API' },
    { key: 'skill_2_pct',  value: '85' },
    { key: 'skill_3_name', value: 'Prisma ORM & PostgreSQL' },
    { key: 'skill_3_pct',  value: '80' },
    { key: 'skill_4_name', value: 'Guitar & Audio Editing' },
    { key: 'skill_4_pct',  value: '75' },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('✅ Landing page settings seeded');

  const defaultCategories = [
    {
      slug: 'work',
      label: 'WORK',
      color: '#FF6B35',
      icon: 'briefcase',
      description: 'Client work, internships, and production builds.',
      order: 1,
      isActive: true,
    },
    {
      slug: 'organization',
      label: 'ORGANIZATION',
      color: '#4CAF50',
      icon: 'users',
      description: 'Campus, community, and organization records.',
      order: 2,
      isActive: true,
    },
    {
      slug: 'training',
      label: 'TRAINING',
      color: '#5b7cfa',
      icon: 'graduation-cap',
      description: 'Bootcamp, course, and intensive training records.',
      order: 3,
      isActive: true,
    },
    {
      slug: 'certification',
      label: 'CERTIFICATION',
      color: '#aa3bff',
      icon: 'badge-check',
      description: 'Certificates and assessment records.',
      order: 4,
      isActive: true,
    },
  ];

  const categoryMap = {};
  for (const category of defaultCategories) {
    categoryMap[category.label] = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }
  console.log('✅ Categories seeded');

  // ── Default Experiences ─────────────────────────────────────────────────────
  const experiences = [
    {
      title: 'Full Stack Developer',
      organization: 'Sahihbodyfeed',
      categorySlug: 'work',
      period: 'April 2026 - Present',
      description: 'Mengembangkan dan memelihara aplikasi web menggunakan teknologi full stack serta berkontribusi pada perancangan, pengembangan, dan improvement fitur aplikasi.',
      highlights: ['Mengembangkan aplikasi web full stack', 'Memelihara dan meningkatkan fitur aplikasi', 'Berkontribusi pada perancangan solusi aplikasi'],
      skills: ['Full Stack Development', 'Web Development', 'Feature Improvement'],
      credentialUrl: null,
      icon: 'briefcase',
      isActive: true,
      order: 1,
    },
    {
      title: 'Web Developer',
      organization: 'PT Adha Tour & Travel',
      categorySlug: 'work',
      period: 'January 2026 - Present',
      description: 'Merancang dan mengembangkan website perusahaan serta mengimplementasikan fitur-fitur sesuai kebutuhan bisnis pariwisata.',
      highlights: ['Merancang website perusahaan', 'Mengembangkan fitur sesuai kebutuhan bisnis', 'Mendukung kebutuhan digital sektor pariwisata'],
      skills: ['Web Development', 'Website Design', 'Business Requirement Implementation'],
      credentialUrl: null,
      icon: 'briefcase',
      isActive: true,
      order: 2,
    },
    {
      title: 'Social Media Editor',
      organization: 'Ikatan Mahasiswa Sistem Informasi Korwil 8',
      categorySlug: 'organization',
      period: '2026 - Present',
      description: 'Mengelola dan mengedit konten media sosial organisasi tingkat wilayah serta membuat desain dan caption yang menarik untuk meningkatkan engagement.',
      highlights: ['Mengelola konten media sosial organisasi', 'Mengedit desain dan caption promosi', 'Mendorong peningkatan engagement audiens'],
      skills: ['Social Media Management', 'Content Editing', 'Design'],
      credentialUrl: null,
      icon: 'users',
      isActive: true,
      order: 3,
    },
    {
      title: 'Academic and Research Division Member',
      organization: 'HMJ Sistem Informasi - Universitas Islam Negeri Alauddin',
      categorySlug: 'organization',
      period: 'March 2026 - Present',
      description: 'Mendukung kegiatan akademik dan penelitian mahasiswa Sistem Informasi serta menjadi Project Lead pada acara Company Visit ke OJK pada April 2026.',
      highlights: ['Mendukung kegiatan akademik mahasiswa', 'Terlibat dalam kegiatan penelitian mahasiswa', 'Menjadi Project Lead Company Visit ke OJK'],
      skills: ['Academic Support', 'Research Coordination', 'Project Leadership'],
      credentialUrl: null,
      icon: 'users',
      isActive: true,
      order: 4,
    },
    {
      title: 'Practicum Assistant - Algorithms & Programming',
      organization: 'Universitas Islam Negeri Alauddin',
      categorySlug: 'work',
      period: 'April 2026 - Present',
      description: 'Membimbing mahasiswa dalam praktikum algoritma dan pemrograman serta memberikan asistensi dan penjelasan materi pemrograman.',
      highlights: ['Membimbing praktikum algoritma', 'Memberikan asistensi materi pemrograman', 'Mendampingi mahasiswa selama sesi praktikum'],
      skills: ['Algorithms', 'Programming', 'Teaching Assistance'],
      credentialUrl: null,
      icon: 'briefcase',
      isActive: true,
      order: 5,
    },
    {
      title: 'Practicum Assistant - Computational Thinking',
      organization: 'Universitas Islam Negeri Alauddin',
      categorySlug: 'work',
      period: 'October 2025 - December 2025',
      description: 'Membantu dosen dalam pelaksanaan praktikum Computational Thinking serta memberikan tutorial dan evaluasi kepada mahasiswa.',
      highlights: ['Mendukung pelaksanaan praktikum dosen', 'Memberikan tutorial kepada mahasiswa', 'Membantu evaluasi pembelajaran'],
      skills: ['Computational Thinking', 'Tutorial Delivery', 'Evaluation'],
      credentialUrl: null,
      icon: 'briefcase',
      isActive: true,
      order: 6,
    },
    {
      title: 'Operations Administrator',
      organization: 'PT. Malika Tellu Cappa',
      categorySlug: 'work',
      period: 'November 2023 - December 2024',
      description: 'Mengelola operasional administrasi perusahaan, menangani dokumen, korespondensi, dan koordinasi internal.',
      highlights: ['Mengelola administrasi operasional', 'Menangani dokumen dan korespondensi', 'Mendukung koordinasi internal perusahaan'],
      skills: ['Administration', 'Documentation', 'Internal Coordination'],
      credentialUrl: null,
      icon: 'briefcase',
      isActive: true,
      order: 7,
    },
    {
      title: 'Banking Administration Intern',
      organization: 'Bank BRI (KCP Unit Antang)',
      categorySlug: 'work',
      period: 'February 2022 - April 2022',
      description: 'Membantu proses administrasi perbankan, melayani nasabah, dan melakukan penginputan data.',
      highlights: ['Membantu administrasi perbankan', 'Melayani kebutuhan nasabah', 'Melakukan penginputan data operasional'],
      skills: ['Banking Administration', 'Customer Service', 'Data Entry'],
      credentialUrl: null,
      icon: 'briefcase',
      isActive: true,
      order: 8,
    },
  ];

  await prisma.experience.deleteMany();

  for (const experience of experiences) {
    const { categorySlug, ...experienceData } = experience;
    await prisma.experience.create({
      data: {
        ...experienceData,
        category: {
          connect: { slug: categorySlug },
        },
      },
    });
  }
  console.log('✅ Default experiences seeded');

  // ── Default Projects ────────────────────────────────────────────────────────
  const projects = [
    {
      title: 'Sahihbodyfeed Web Application Development',
      description: 'Pengembangan dan pemeliharaan aplikasi web Sahihbodyfeed dengan fokus pada perancangan fitur, pengembangan, dan improvement aplikasi.',
      tags: ['Full Stack Development', 'Web Application', 'Feature Improvement'],
      liveUrl: null,
      repoUrl: null,
      isFeatured: true,
      categorySlugs: ['work'],
    },
    {
      title: 'PT Adha Tour & Travel Company Website',
      description: 'Perancangan dan pengembangan website perusahaan untuk mendukung kebutuhan bisnis pariwisata dan implementasi fitur sesuai kebutuhan operasional.',
      tags: ['Web Development', 'Company Website', 'Tourism Business'],
      liveUrl: null,
      repoUrl: null,
      isFeatured: true,
      categorySlugs: ['work'],
    },
    {
      title: 'Company Visit OJK Event Lead',
      description: 'Memimpin pelaksanaan project acara Company Visit ke OJK dalam peran sebagai Project Lead pada divisi akademik dan riset HMJ Sistem Informasi.',
      tags: ['Project Leadership', 'Event Coordination', 'Organization'],
      liveUrl: null,
      repoUrl: null,
      isFeatured: false,
      categorySlugs: ['organization'],
    },
    {
      title: 'Regional Student Organization Social Media Content',
      description: 'Pengelolaan, editing, dan pengemasan konten media sosial organisasi wilayah untuk meningkatkan kualitas publikasi dan engagement audiens.',
      tags: ['Social Media', 'Content Editing', 'Engagement'],
      liveUrl: null,
      repoUrl: null,
      isFeatured: false,
      categorySlugs: ['organization'],
    },
  ];

  await prisma.project.deleteMany();

  for (const project of projects) {
    const { categorySlugs, ...projectData } = project;
    await prisma.project.create({
      data: {
        ...projectData,
        categories: {
          connect: categorySlugs.map((slug) => ({ slug })),
        },
      },
    });
  }
  console.log('✅ Default projects seeded');

  console.log('\n🎮 Seed complete! Admin: admin / admin123\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
