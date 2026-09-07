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
    { key: 'dev_name',    value: 'HIDAYAT SULA IDRIS' },
    { key: 'tagline',     value: 'Mahasiswa Sistem Informasi dengan pengalaman dalam pengembangan web dan pengelolaan media sosial.' },
    { key: 'class',       value: 'WEB DEV & SI STUDENT' },
    { key: 'location',    value: 'MAKASSAR, SULSEL' },
    { key: 'hp',          value: '85' },
    { key: 'mp',          value: '80' },
    { key: 'speed',       value: '88' },
    { key: 'defense',     value: '82' },
    { key: 'bio',         value: "Hello! Saya Hidayat Sula Idris, mahasiswa Sistem Informasi di UIN Alauddin Makassar dengan pengalaman dalam pengembangan dan pemeliharaan web. Saat ini bekerja sebagai Web Developer di PT Aulia Duta Haramain dan aktif sebagai Asisten Praktikum serta anggota organisasi kemahasiswaan. Menguasai React, Node.js, Laravel, Python, dan teknologi web modern. Cepat belajar dan siap berkontribusi dalam proyek teknologi informasi. Mari jelajahi proyek dan pengalaman saya!" },
    { key: 'whatsapp',   value: '6288237106135' },
    { key: 'github',      value: 'https://github.com/Napdoee' },
    { key: 'linkedin',    value: 'https://linkedin.com/in/hidayat-sula-idris' },
    { key: 'instagram',   value: 'https://instagram.com' },
    { key: 'skill_1_name', value: 'React & Frontend Development' },
    { key: 'skill_1_pct',  value: '85' },
    { key: 'skill_2_name', value: 'Node.js & Backend API' },
    { key: 'skill_2_pct',  value: '80' },
    { key: 'skill_3_name', value: 'Laravel & MySQL Database' },
    { key: 'skill_3_pct',  value: '75' },
    { key: 'skill_4_name', value: 'Python & JavaScript' },
    { key: 'skill_4_pct',  value: '85' },
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
      title: 'Web Developer',
      organization: 'PT Aulia Duta Haramain',
      categorySlug: 'work',
      period: 'January 2026 - Present',
      description: 'Mengelola dan melakukan pemeliharaan website untuk menjaga performa, stabilitas, dan keandalan sistem. Melakukan perbaikan bug serta mengoptimalkan tampilan dan fungsionalitas website untuk meningkatkan pengalaman pengguna.',
      highlights: ['Website management and maintenance', 'Bug fixing and optimization', 'UI/UX improvement'],
      skills: ['Website Maintenance', 'Bug Fixing', 'Performance Optimization', 'UI/UX'],
      credentialUrl: null,
      icon: 'briefcase',
      isActive: true,
      order: 1,
    },
    {
      title: 'Web Maintenance',
      organization: 'PT. Edukasi Tiga Bersama',
      categorySlug: 'work',
      period: 'April 2026 - May 2026',
      description: 'Mengembangkan dan memelihara aplikasi web responsif menggunakan Laravel dan MySQL, dengan fokus pada struktur basis data dan alur kerja aplikasi.',
      highlights: ['Responsive web application development', 'Database structure design', 'Application workflow optimization'],
      skills: ['Laravel', 'MySQL', 'Responsive Design', 'Database Design'],
      credentialUrl: null,
      icon: 'briefcase',
      isActive: true,
      order: 2,
    },
    {
      title: 'Asisten Praktikum',
      organization: 'Sistem Informasi - UIN Alauddin Makassar',
      categorySlug: 'training',
      period: 'December 2025 - July 2026',
      description: 'Membimbing lebih dari 25 mahasiswa dalam praktikum Computational Thinking, Algoritma & Pemrograman. Memberikan pendampingan dalam memahami materi serta membantu mahasiswa menyelesaikan permasalahan teknis selama praktikum.',
      highlights: ['Mentored 25+ students', 'Computational Thinking and Algorithms teaching', 'Technical problem solving assistance'],
      skills: ['Teaching', 'Computational Thinking', 'Algorithms', 'Programming Mentorship'],
      credentialUrl: null,
      icon: 'graduation-cap',
      isActive: true,
      order: 3,
    },
    {
      title: 'Anggota Bidang Keilmuwan',
      organization: 'HMJ Sistem Informasi',
      categorySlug: 'organization',
      period: 'April 2026 - Present',
      description: 'Ditunjuk sebagai Ketua Panitia dalam kegiatan Company Visit ke OJK (Otoritas Jasa Keuangan). Berkoordinasi dengan Program Studi dalam melaksanakan program kerja di bidang akademik.',
      highlights: ['Committee Chair for OJK Company Visit', 'Academic program coordination', 'Study program liaison'],
      skills: ['Leadership', 'Event Management', 'Academic Coordination'],
      credentialUrl: null,
      icon: 'users',
      isActive: true,
      order: 4,
    },
    {
      title: 'Anggota Department Kominfo',
      organization: 'Ikatan Mahasiswa Sistem Informasi',
      categorySlug: 'organization',
      period: 'April 2026 - Present',
      description: 'Mendukung pengelolaan konten dan publikasi informasi melalui media sosial organisasi.',
      highlights: ['Social media content management', 'Information publication', 'Organization communication'],
      skills: ['Social Media Management', 'Content Management', 'Communication'],
      credentialUrl: null,
      icon: 'users',
      isActive: true,
      order: 5,
    },
    {
      title: 'Administrator Operasional',
      organization: 'PT. Malika Tellu Cappa',
      categorySlug: 'work',
      period: 'November 2023 - December 2024',
      description: 'Mencatat dan memantau arus kas sederhana untuk mendukung administrasi keuangan klinik gigi. Bertanggung jawab membuka dan mengawasi operasional klinik.',
      highlights: ['Cash flow monitoring', 'Financial administration support', 'Clinic operational supervision'],
      skills: ['Administration', 'Financial Recording', 'Operational Management'],
      credentialUrl: null,
      icon: 'briefcase',
      isActive: true,
      order: 6,
    },
    {
      title: 'Praktik Kerja Industri',
      organization: 'Bank BRI (KCP Unit Antang)',
      categorySlug: 'work',
      period: 'February 2022 - April 2022',
      description: 'Mendukung pengelolaan data dan administrasi operasional. Mengelola dan mengarsipkan dokumen serta membantu penyusunan laporan operasional.',
      highlights: ['Data management support', 'Document archiving', 'Operational report preparation'],
      skills: ['Data Management', 'Document Management', 'Administration'],
      credentialUrl: null,
      icon: 'briefcase',
      isActive: true,
      order: 7,
    },
    {
      title: 'Belajar Back-End Pemula dengan JavaScript',
      organization: 'Dicoding',
      categorySlug: 'certification',
      period: 'Issued 2024',
      description: 'Sertifikasi pengembangan backend menggunakan JavaScript dengan fokus pada Node.js, Express, dan konsep fundamental backend development.',
      highlights: ['Backend JavaScript certification', 'Node.js fundamentals', 'Express framework'],
      skills: ['JavaScript', 'Node.js', 'Express', 'Backend Development'],
      credentialUrl: null,
      icon: 'badge-check',
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
      title: 'Laravel Web Application',
      description: 'Aplikasi web responsif yang dikembangkan menggunakan Laravel dan MySQL dengan fokus pada struktur basis data yang rapi dan alur kerja aplikasi yang efisien untuk PT. Edukasi Tiga Bersama.',
      tags: ['Laravel', 'MySQL', 'PHP', 'Responsive Design', 'Database Design'],
      liveUrl: null,
      repoUrl: null,
      isFeatured: true,
      categorySlugs: ['work'],
    },
    {
      title: 'Company Website Maintenance',
      description: 'Pemeliharaan dan optimasi website perusahaan dengan fokus pada performa, stabilitas sistem, perbaikan bug, dan peningkatan pengalaman pengguna untuk PT Aulia Duta Haramain.',
      tags: ['Website Maintenance', 'Performance Optimization', 'Bug Fixing', 'UI/UX'],
      liveUrl: null,
      repoUrl: null,
      isFeatured: true,
      categorySlugs: ['work'],
    },
    {
      title: 'Learning Management System',
      description: 'Sistem manajemen pembelajaran untuk membantu praktikum Computational Thinking dan Algoritma & Pemrograman di UIN Alauddin Makassar.',
      tags: ['React', 'Node.js', 'PostgreSQL', 'Education', 'LMS'],
      liveUrl: null,
      repoUrl: null,
      isFeatured: false,
      categorySlugs: ['training'],
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
