import { useEffect, useState } from 'react';

export const fallbackCategoryMap = {
  work: { id: 1, slug: 'work', label: 'WORK', color: '#FF6B35', icon: 'briefcase', order: 1 },
  organization: { id: 2, slug: 'organization', label: 'ORGANIZATION', color: '#4CAF50', icon: 'users', order: 2 },
  training: { id: 3, slug: 'training', label: 'TRAINING', color: '#5b7cfa', icon: 'graduation-cap', order: 3 },
  certification: { id: 4, slug: 'certification', label: 'CERTIFICATION', color: '#aa3bff', icon: 'badge-check', order: 4 },
};

export const fallbackExperiences = [
  {
    id: 1,
    title: 'Web Developer',
    organization: 'PT Aulia Duta Haramain',
    categoryId: fallbackCategoryMap.work.id,
    category: fallbackCategoryMap.work,
    period: 'Jan 2026 - Present',
    description: 'Mengelola dan melakukan pemeliharaan website untuk menjaga performa, stabilitas, dan keandalan sistem. Melakukan perbaikan bug serta mengoptimalkan tampilan dan fungsionalitas website untuk meningkatkan pengalaman pengguna.',
    skills: ['Website Maintenance', 'Bug Fixing', 'Performance Optimization', 'UI/UX'],
    icon: 'briefcase',
  },
  {
    id: 2,
    title: 'Asisten Praktikum',
    organization: 'Sistem Informasi - UIN Alauddin Makassar',
    categoryId: fallbackCategoryMap.training.id,
    category: fallbackCategoryMap.training,
    period: 'Des 2025 - Jul 2026',
    description: 'Membimbing lebih dari 25 mahasiswa dalam praktikum Computational Thinking, Algoritma & Pemrograman. Memberikan pendampingan dalam memahami materi serta membantu mahasiswa menyelesaikan permasalahan teknis selama praktikum.',
    skills: ['Teaching', 'Computational Thinking', 'Algorithms', 'Programming Mentorship'],
    icon: 'graduation-cap',
  },
  {
    id: 3,
    title: 'Anggota Bidang Keilmuwan',
    organization: 'HMJ Sistem Informasi',
    categoryId: fallbackCategoryMap.organization.id,
    category: fallbackCategoryMap.organization,
    period: 'Apr 2026 - Present',
    description: 'Ditunjuk sebagai Ketua Panitia dalam kegiatan Company Visit ke OJK (Otoritas Jasa Keuangan). Berkoordinasi dengan Program Studi dalam melaksanakan program kerja di bidang akademik.',
    skills: ['Leadership', 'Event Management', 'Academic Coordination'],
    icon: 'users',
  },
  {
    id: 4,
    title: 'Web Maintenance',
    organization: 'PT. Edukasi Tiga Bersama',
    categoryId: fallbackCategoryMap.work.id,
    category: fallbackCategoryMap.work,
    period: 'Apr 2026 - Mei 2026',
    description: 'Mengembangkan dan memelihara aplikasi web responsif menggunakan Laravel dan MySQL, dengan fokus pada struktur basis data dan alur kerja aplikasi.',
    skills: ['Laravel', 'MySQL', 'Responsive Design', 'Database Design'],
    icon: 'briefcase',
  },
  {
    id: 5,
    title: 'Belajar Back-End Pemula dengan JavaScript',
    organization: 'Dicoding',
    categoryId: fallbackCategoryMap.certification.id,
    category: fallbackCategoryMap.certification,
    period: 'Issued 2024',
    description: 'Sertifikasi pengembangan backend menggunakan JavaScript dengan fokus pada Node.js, Express, dan konsep fundamental backend development.',
    skills: ['JavaScript', 'Node.js', 'Express', 'Backend Development'],
    icon: 'badge-check',
  },
];

export const fallbackProjects = [
  {
    id: 1,
    title: 'Laravel Web Application',
    description: 'Aplikasi web responsif yang dikembangkan menggunakan Laravel dan MySQL dengan fokus pada struktur basis data yang rapi dan alur kerja aplikasi yang efisien untuk PT. Edukasi Tiga Bersama.',
    tags: ['Laravel', 'MySQL', 'PHP', 'Responsive Design'],
    categories: [fallbackCategoryMap.work],
    repoUrl: 'https://github.com/Napdoee',
    liveUrl: '#',
    isFeatured: true,
  },
  {
    id: 2,
    title: 'Company Website Maintenance',
    description: 'Pemeliharaan dan optimasi website perusahaan dengan fokus pada performa, stabilitas sistem, perbaikan bug, dan peningkatan pengalaman pengguna untuk PT Aulia Duta Haramain.',
    tags: ['Website Maintenance', 'Performance Optimization', 'Bug Fixing'],
    categories: [fallbackCategoryMap.work],
    repoUrl: 'https://github.com/Napdoee',
    liveUrl: '#',
    isFeatured: true,
  },
  {
    id: 3,
    title: 'Learning Management System',
    description: 'Sistem manajemen pembelajaran untuk membantu praktikum Computational Thinking dan Algoritma & Pemrograman di UIN Alauddin Makassar.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Education'],
    categories: [fallbackCategoryMap.training],
    repoUrl: 'https://github.com/Napdoee',
    liveUrl: '#',
    isFeatured: false,
  },
];

export function getCategoryLabel(category) {
  if (category && typeof category === 'object') {
    return String(category.label || category.slug || 'OTHER').toUpperCase();
  }

  return String(category || 'OTHER').trim().toUpperCase();
}

export function getCategorySlug(category) {
  if (category && typeof category === 'object') {
    return String(category.slug || category.label || 'other').trim().toLowerCase();
  }

  return String(category || 'other').trim().toLowerCase();
}

export function getProjectCategory(project) {
  const lowerTitle = String(project.title || '').toLowerCase();
  const lowerDescription = String(project.description || '').toLowerCase();
  const lowerTags = Array.isArray(project.tags) ? project.tags.join(' ').toLowerCase() : '';
  const searchableText = `${lowerTitle} ${lowerDescription} ${lowerTags}`;

  if (project.isFeatured) return 'FEATURED';
  if (/(game|runner|canvas|audio|synth|daw)/.test(searchableText)) return 'GAME';
  if (/(client|e-commerce|ecommerce|dashboard|company|brand|landing|payment|shop|catalog)/.test(searchableText)) return 'CLIENT';

  return 'EXPERIMENT';
}

export function getProjectHighlights(project) {
  const lowerTitle = String(project.title || '').toLowerCase();
  const lowerTags = Array.isArray(project.tags) ? project.tags.join(' ').toLowerCase() : '';

  if (lowerTitle.includes('e-commerce')) {
    return ['Checkout flow terstruktur', 'Integrasi transaksi dan data produk', 'Arsitektur siap scale untuk katalog dan dashboard'];
  }
  if (lowerTitle.includes('runner') || lowerTags.includes('canvas')) {
    return ['Gameplay loop interaktif', 'Animasi stateful di browser', 'Eksperimen visual dengan nuansa arcade'];
  }
  if (lowerTags.includes('prisma') || lowerTags.includes('postgresql')) {
    return ['Query layer rapi', 'Data model jelas', 'Integrasi frontend dan backend stabil'];
  }

  return ['Interaksi UI kuat', 'Struktur build cukup rapi', 'Fokus pada maintainability dan presentasi'];
}

export function getProjectKey(project) {
  return String(project.id || project.title || '').trim();
}

export function usePortfolioData() {
  const [settings, setSettings] = useState({});
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadContent = async () => {
      try {
        const [settingsRes, experiencesRes, projectsRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/experiences'),
          fetch('/api/projects'),
        ]);

        if (!mounted) return;

        if (settingsRes.ok) setSettings(await settingsRes.json());
        if (experiencesRes.ok) setExperiences(await experiencesRes.json());
        if (projectsRes.ok) setProjects(await projectsRes.json());
      } catch (err) {
        console.error('Gagal memuat konten dari backend database:', err);
      }
    };

    loadContent();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    settings,
    experiences: experiences.length > 0 ? experiences : fallbackExperiences,
    projects: projects.length > 0 ? projects : fallbackProjects,
  };
}
