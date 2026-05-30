import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Check,
  ExternalLink,
  GraduationCap,
  Laptop,
  MessageSquare,
  Users,
} from 'lucide-react';
import SplashPage from '../components/SplashPage';
import GameHUD from '../components/GameHUD';
import ParallaxHero from '../components/ParallaxHero';
import StatSheet from '../components/StatSheet';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';

const Github = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }} {...props}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const fallbackCategoryMap = {
  work: { id: 1, slug: 'work', label: 'WORK', color: '#FF6B35', icon: 'briefcase', order: 1 },
  organization: { id: 2, slug: 'organization', label: 'ORGANIZATION', color: '#4CAF50', icon: 'users', order: 2 },
  training: { id: 3, slug: 'training', label: 'TRAINING', color: '#5b7cfa', icon: 'graduation-cap', order: 3 },
  certification: { id: 4, slug: 'certification', label: 'CERTIFICATION', color: '#aa3bff', icon: 'badge-check', order: 4 },
};

const fallbackExperiences = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    organization: 'Studio Produk Digital Makassar',
    categoryId: fallbackCategoryMap.work.id,
    category: fallbackCategoryMap.work,
    period: 'Jun 2024 - Aug 2024',
    description: 'Mengembangkan antarmuka dashboard internal dan landing page campaign dengan fokus pada performa, konsistensi UI, serta integrasi API yang rapi.',
    skills: ['React', 'Vite', 'REST API', 'Responsive UI'],
    icon: 'briefcase',
  },
  {
    id: 2,
    title: 'Head of Media and Documentation',
    organization: 'Himpunan Mahasiswa Teknik Informatika',
    categoryId: fallbackCategoryMap.organization.id,
    category: fallbackCategoryMap.organization,
    period: '2023 - 2024',
    description: 'Memimpin tim visual dan dokumentasi untuk kebutuhan publikasi acara, konten sosial media, serta arsip digital kegiatan organisasi.',
    skills: ['Leadership', 'Content Planning', 'Canva'],
    icon: 'users',
  },
  {
    id: 3,
    title: 'Backend API Bootcamp Graduate',
    organization: 'Dicoding / Program Intensif Backend',
    categoryId: fallbackCategoryMap.training.id,
    category: fallbackCategoryMap.training,
    period: 'Batch Spring 2024',
    description: 'Menyelesaikan pelatihan intensif backend meliputi desain REST API, otentikasi JWT, ORM, validasi data, dan deployment dasar.',
    skills: ['Node.js', 'Express', 'Prisma'],
    icon: 'graduation-cap',
  },
  {
    id: 4,
    title: 'Responsive Web Design Certification',
    organization: 'freeCodeCamp',
    categoryId: fallbackCategoryMap.certification.id,
    category: fallbackCategoryMap.certification,
    period: 'Issued 2024',
    description: 'Sertifikasi fundamental desain web responsif dengan pendekatan HTML semantik, layout modern, dan aksesibilitas.',
    skills: ['HTML', 'CSS', 'Accessibility'],
    icon: 'badge-check',
  },
];

const fallbackProjects = [
  {
    id: 1,
    title: 'T-Rex Endless Runner Game',
    description: 'Modifikasi game Dino Run legendaris Google dengan karakter kustomisasi RPG, power-ups item, dan high score global database.',
    tags: ['HTML5 Canvas', 'Vanilla JS', 'Local Storage'],
    categories: [fallbackCategoryMap.training],
    repoUrl: 'https://github.com',
    liveUrl: 'https://google.com',
    isFeatured: true,
  },
  {
    id: 2,
    title: 'Makassar Smart E-Commerce',
    description: 'Platform jual beli kerajinan khas lokal terintegrasi dengan payment gateway dan tracking ekspedisi.',
    tags: ['Next.js', 'Prisma', 'PostgreSQL'],
    categories: [fallbackCategoryMap.work],
    repoUrl: 'https://github.com',
    liveUrl: 'https://google.com',
    isFeatured: true,
  },
  {
    id: 3,
    title: 'Retro-Beats Synth DAW',
    description: 'Synthesizer audio 8-bit dalam browser untuk membuat musik chiptunes secara interaktif.',
    tags: ['Web Audio API', 'React', 'Tailwind'],
    categories: [fallbackCategoryMap.training],
    repoUrl: 'https://github.com',
    liveUrl: 'https://google.com',
    isFeatured: false,
  },
];

const experienceTerminalTheme = {
  shellBg: '#d7d4cd',
  shellInnerBg: '#ece8e0',
  shellHeaderBg: '#c3c0ba',
  shellHeaderText: '#2a2926',
  panelBgA: '#f6f2ea',
  panelBgB: '#ebe6de',
  panelBorder: '#8a8478',
  panelInset: '#d7d1c7',
  titleText: '#2a2926',
  bodyText: '#4f4a42',
  mutedText: '#70695f',
  commandText: '#4f7b59',
  summaryText: '#46627c',
  skillBg: '#ddd8cf',
  skillBorder: '#8a8478',
  skillText: '#3f5f4a',
  divider: '#b4ab9d',
  iconBg: '#f9f4ea',
  iconBorder: '#8a8478',
};

function getCategoryLabel(category) {
  if (category && typeof category === 'object') {
    return String(category.label || category.slug || 'OTHER').toUpperCase();
  }

  return String(category || 'OTHER').trim().toUpperCase();
}

function getCategorySlug(category) {
  if (category && typeof category === 'object') {
    return String(category.slug || category.label || 'other').trim().toLowerCase();
  }

  return String(category || 'other').trim().toLowerCase();
}

function getExperienceColor(category) {
  if (category && typeof category === 'object' && category.color) {
    return category.color;
  }

  switch (getCategoryLabel(category)) {
    case 'WORK':
      return 'var(--color-highlight)';
    case 'ORGANIZATION':
      return 'var(--color-accent)';
    case 'TRAINING':
      return '#5b7cfa';
    case 'CERTIFICATION':
      return '#aa3bff';
    default:
      return 'var(--color-border)';
  }
}

function getExperienceIcon(iconName) {
  const normalizedIcon = typeof iconName === 'object' ? iconName?.icon : iconName;

  switch (normalizedIcon) {
    case 'briefcase':
      return <Briefcase size={16} style={{ color: 'var(--color-highlight)' }} />;
    case 'users':
      return <Users size={16} style={{ color: 'var(--color-accent)' }} />;
    case 'graduation-cap':
      return <GraduationCap size={16} style={{ color: '#5b7cfa' }} />;
    case 'badge-check':
      return <BadgeCheck size={16} style={{ color: '#aa3bff' }} />;
    default:
      return <Laptop size={16} style={{ color: 'var(--color-highlight)' }} />;
  }
}

function getProjectHighlights(project) {
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

function getProjectCategory(project) {
  const lowerTitle = String(project.title || '').toLowerCase();
  const lowerDescription = String(project.description || '').toLowerCase();
  const lowerTags = Array.isArray(project.tags) ? project.tags.join(' ').toLowerCase() : '';
  const searchableText = `${lowerTitle} ${lowerDescription} ${lowerTags}`;

  if (project.isFeatured) {
    return 'FEATURED';
  }
  if (/(game|runner|canvas|audio|synth|daw)/.test(searchableText)) {
    return 'GAME';
  }
  if (/(client|e-commerce|ecommerce|dashboard|company|brand|landing|payment|shop|catalog)/.test(searchableText)) {
    return 'CLIENT';
  }

  return 'EXPERIMENT';
}

const Home = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeStage, setActiveStage] = useState('hero');
  const [formData, setFormData] = useState({ name: '', whatsapp: '', email: '', detail: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedProjectName, setSelectedProjectName] = useState('');
  const [settings, setSettings] = useState({});
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectFilter, setProjectFilter] = useState('ALL');

  const sections = {
    hero: useRef(null),
    about: useRef(null),
    experiences: useRef(null),
    projects: useRef(null),
    contact: useRef(null),
  };

  const scrollToSection = (id) => {
    const element = sections[id]?.current;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveStage(id);
    }
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [settingsRes, experiencesRes, projectsRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/experiences'),
          fetch('/api/projects'),
        ]);

        if (settingsRes.ok) {
          setSettings(await settingsRes.json());
        }
        if (experiencesRes.ok) {
          setExperiences(await experiencesRes.json());
        }
        if (projectsRes.ok) {
          setProjects(await projectsRes.json());
        }
      } catch (err) {
        console.error('Gagal memuat konten dari backend database:', err);
      }
    };

    loadContent();
  }, []);

  useEffect(() => {
    if (showSplash) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStage(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: '-30% 0px -40% 0px', threshold: 0.1 }
    );

    Object.values(sections).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sections).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [showSplash]);

  const activeExperiences = experiences.length > 0 ? experiences : fallbackExperiences;
  const activeProjects = projects.length > 0 ? projects : fallbackProjects;
  const experienceCategoryOrder = ['work', 'organization', 'training', 'certification'];
  const experiencesByCategoryMap = activeExperiences.reduce((acc, experience) => {
    const category = experience.category || { label: 'OTHER', slug: 'other' };
    const categoryKey = getCategorySlug(category);
    if (!acc[categoryKey]) {
      acc[categoryKey] = { category, items: [] };
    }
    acc[categoryKey].items.push(experience);
    return acc;
  }, {});
  const experienceCategories = Object.values(experiencesByCategoryMap).sort((a, b) => {
    const aSlug = getCategorySlug(a.category);
    const bSlug = getCategorySlug(b.category);
    const aIndex = experienceCategoryOrder.indexOf(aSlug);
    const bIndex = experienceCategoryOrder.indexOf(bSlug);
    if (aIndex === -1 && bIndex === -1) {
      const aOrder = Number.isInteger(a.category?.order) ? a.category.order : Number.MAX_SAFE_INTEGER;
      const bOrder = Number.isInteger(b.category?.order) ? b.category.order : Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return getCategoryLabel(a.category).localeCompare(getCategoryLabel(b.category));
    }
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
  const experienceCategoryRows = [];

  for (let index = 0; index < experienceCategories.length; index += 2) {
    experienceCategoryRows.push(experienceCategories.slice(index, index + 2));
  }
  const projectsByExperienceCategory = activeProjects.reduce((acc, project) => {
    const categories = Array.isArray(project.categories) ? project.categories : [];
    categories.forEach((category) => {
      const categoryKey = getCategorySlug(category);
      if (!acc[categoryKey]) {
        acc[categoryKey] = [];
      }
      acc[categoryKey].push(project);
    });
    return acc;
  }, {});

  const projectFilters = ['ALL', 'FEATURED', 'CLIENT', 'EXPERIMENT', 'GAME'];
  const filteredProjects = activeProjects.filter((project) => {
    if (projectFilter === 'ALL') return true;
    if (projectFilter === 'FEATURED') return Boolean(project.isFeatured);
    return getProjectCategory(project) === projectFilter;
  });

  useEffect(() => {
    if (filteredProjects.length === 0) {
      setSelectedProjectId(null);
      return;
    }

    const exists = filteredProjects.some((project) => String(project.id || project.title) === String(selectedProjectId));
    if (!exists) {
      setSelectedProjectId(filteredProjects[0].id || filteredProjects[0].title);
    }
  }, [projectFilter, projects.length]);

  const selectedProject = filteredProjects.find((project) => String(project.id || project.title) === String(selectedProjectId)) || filteredProjects[0] || null;

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'NAMA HARUS DIISI';

    const waPattern = /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/;
    if (!formData.whatsapp.trim()) {
      errors.whatsapp = 'NOMOR WHATSAPP HARUS DIISI';
    } else if (!waPattern.test(formData.whatsapp.trim().replace(/\s+/g, ''))) {
      errors.whatsapp = 'FORMAT WHATSAPP INDONESIA TIDAK VALID (CONTOH: 08123456789)';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'EMAIL HARUS DIISI';
    } else if (!emailPattern.test(formData.email.trim())) {
      errors.email = 'FORMAT EMAIL TIDAK VALID';
    }

    if (!formData.detail.trim()) errors.detail = 'DETAIL PROJECT HARUS DIISI';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: formData.name,
          whatsapp: formData.whatsapp,
          email: formData.email,
          detail: formData.detail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengirim inquiry');
      }

      setSubmitSuccess(true);
      const waText = encodeURIComponent(
        `GG! HIGH SCORE SUBMITTED!\n\n` +
        `Nama: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `WhatsApp: ${formData.whatsapp}\n` +
        `Detail Project: ${formData.detail}`
      );
      const whatsappTarget = settings.whatsapp || '62895803273374';
      setTimeout(() => {
        window.open(`https://wa.me/${whatsappTarget}?text=${waText}`, '_blank');
      }, 1000);
    } catch (err) {
      alert(`GAME OVER. Submit failed: ${err.message}`);
    }
  };

  const handleDiscussProject = (project) => {
    setSelectedProjectName(project.title);
    setFormData((prev) => ({
      ...prev,
      detail: `Halo ${settings.dev_name || 'Napdoee'}, saya tertarik mendiskusikan project [${project.title}] dan kebutuhan serupa. Berikut konteks yang ingin saya bahas: `,
    }));
    scrollToSection('contact');
  };

  if (showSplash) {
    return <SplashPage onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="scroll-container">
      <GameHUD activeStage={activeStage} scrollToSection={scrollToSection} />

      <div id="hero" ref={sections.hero}>
        <ParallaxHero onStartClick={() => scrollToSection('about')} devName={settings.dev_name} tagline={settings.tagline} />
      </div>

      <div id="about" ref={sections.about}>
        <StatSheet settings={settings} />
      </div>

      <section id="experiences" ref={sections.experiences} style={{ padding: '80px 0', backgroundColor: '#FAF7F0', borderBottom: '4px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '34px' }}>
            <span className="font-retro-label" style={{ fontSize: '14px', color: 'var(--color-highlight)', fontWeight: 'bold' }}>STAGE 02</span>
            <h2 style={{ fontSize: '22px', marginTop: '8px', color: 'var(--color-text)' }}>EXPERIENCE ARCHIVE</h2>
            <p className="font-retro-label" style={{ marginTop: '12px', fontSize: '11px', color: '#666', maxWidth: '700px', marginInline: 'auto', lineHeight: 1.7 }}>
              Arsip pendukung dari perjalanan kerja, organisasi, pelatihan, dan sertifikasi. Bagian ini sengaja dibuat tenang supaya perhatian utama tetap ke project builds.
            </p>
          </div>

          <div style={{ maxWidth: '1400px', margin: '0 auto', border: '3px solid var(--color-border)', backgroundColor: experienceTerminalTheme.shellBg, boxShadow: '6px 6px 0px var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', borderBottom: '3px solid var(--color-border)', backgroundColor: experienceTerminalTheme.shellHeaderBg, display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="font-retro-label" style={{ fontSize: '9px', color: experienceTerminalTheme.shellHeaderText }}>TERMINAL.EXE</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', border: '2px solid var(--color-border)', backgroundColor: '#fff5dd' }} />
                <span style={{ width: '12px', height: '12px', border: '2px solid var(--color-border)', backgroundColor: '#f3cf85' }} />
                <span style={{ width: '12px', height: '12px', border: '2px solid var(--color-border)', backgroundColor: 'var(--color-highlight)' }} />
              </div>
            </div>

            <div style={{ padding: '18px', display: 'grid', gap: '16px', backgroundColor: experienceTerminalTheme.shellInnerBg, color: experienceTerminalTheme.bodyText }}>
              <div className="font-retro-label" style={{ fontSize: '10px', color: experienceTerminalTheme.commandText, lineHeight: 1.8 }}>
                <div>C:\portfolio&gt; dir /a</div>
                <div>Scanning archive records...</div>
                <div>{activeExperiences.length} entries loaded successfully.</div>
              </div>

              {experienceCategoryRows.map((row, rowIndex) => {
                const isWideLeft = rowIndex % 2 === 0;

                return (
                  <div key={rowIndex} className="experience-row-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
                    {row.map((categoryEntry, itemIndex) => {
                      const globalIndex = rowIndex * 2 + itemIndex;
                      const category = categoryEntry.category;
                      const categoryKey = getCategorySlug(category);
                      const categoryExperiences = categoryEntry.items || [];
                      const relatedProjects = projectsByExperienceCategory[categoryKey] || [];
                      const isWideCard = row.length === 1 || (isWideLeft ? itemIndex === 0 : itemIndex === 1);

                      return (
                        <div
                          key={categoryKey || globalIndex}
                          className="experience-terminal-card"
                          style={{
                            gridColumn: row.length === 1 ? '1 / -1' : `span ${isWideCard ? 2 : 1}`,
                            border: `2px solid ${experienceTerminalTheme.panelBorder}`,
                            backgroundColor: globalIndex % 2 === 0 ? experienceTerminalTheme.panelBgA : experienceTerminalTheme.panelBgB,
                            boxShadow: `inset 0 0 0 1px ${experienceTerminalTheme.panelInset}`,
                          }}
                        >
                          <div style={{ padding: '12px 14px', display: 'grid', gap: '12px', minHeight: '228px' }}>
                            <div className="font-retro-label" style={{ fontSize: '9px', color: getExperienceColor(category), lineHeight: 1.7 }}>
                              <div>[{getCategoryLabel(category)}] STATUS: READY</div>
                              <div>C:\portfolio\experience&gt; open {getCategorySlug(category)}</div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${experienceTerminalTheme.iconBorder}`, backgroundColor: experienceTerminalTheme.iconBg }}>
                                  {getExperienceIcon(category.icon || categoryExperiences[0]?.icon)}
                                </div>
                                <h3 className="font-retro-game" style={{ fontSize: isWideCard ? '13px' : '11px', color: experienceTerminalTheme.titleText }}>{getCategoryLabel(category)}</h3>
                              </div>
                              <div className="font-retro-label" style={{ fontSize: '8px', color: experienceTerminalTheme.mutedText }}>{categoryExperiences.length} RECORDS</div>
                            </div>

                            <div style={{ display: 'grid', gap: '10px' }}>
                              {categoryExperiences.map((experience, experienceIndex) => (
                                <div key={experience.id || `${categoryKey}-${experienceIndex}`} className="font-retro-label" style={{ fontSize: '10px', color: experienceTerminalTheme.summaryText, lineHeight: 1.8, paddingBottom: '10px', borderBottom: experienceIndex === categoryExperiences.length - 1 ? 'none' : `1px dashed ${experienceTerminalTheme.divider}` }}>
                                  <div>{String(experienceIndex + 1).padStart(2, '0')}&gt; {experience.title.toUpperCase()}</div>
                                  <div style={{ color: experienceTerminalTheme.titleText }}>{experience.organization}</div>
                                  <div style={{ color: experienceTerminalTheme.mutedText }}>{experience.period}</div>
                                  {isWideCard && <div style={{ color: experienceTerminalTheme.summaryText }}>summary: {experience.description}</div>}
                                </div>
                              ))}
                            </div>

                            {/* {relatedProjects.length > 0 && (
                              <>
                                <div className="font-retro-label" style={{ fontSize: '9px', color: '#7cff7c', lineHeight: 1.7 }}>
                                  <div>C:\portfolio\projects&gt; dir /category {getCategorySlug(category)}</div>
                                </div>

                                <div style={{ display: 'grid', gap: '8px' }}>
                                  {relatedProjects.map((project, projectIndex) => (
                                    <div key={project.id || `${categoryKey}-project-${projectIndex}`} className="font-retro-label" style={{ fontSize: '9px', color: '#7cff7c', lineHeight: 1.7 }}>
                                      <div>- {project.title.toUpperCase()}</div>
                                      {isWideCard && <div style={{ color: '#b2b2b2' }}>{getProjectCategory(project)} / {(project.tags || []).join(', ')}</div>}
                                    </div>
                                  ))}
                                </div>
                              </>
                            )} */}

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {Array.from(new Set(categoryExperiences.flatMap((experience) => experience.skills || []))).slice(0, isWideCard ? 6 : 3).map((skill, skillIndex) => (
                                <span key={skillIndex} className="font-retro-label" style={{ fontSize: '8px', padding: '4px 7px', border: `1px solid ${experienceTerminalTheme.skillBorder}`, backgroundColor: experienceTerminalTheme.skillBg, color: experienceTerminalTheme.skillText }}>
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              <div className="font-retro-label terminal-blink" style={{ fontSize: '9px', color: experienceTerminalTheme.commandText }}>
                C:\portfolio&gt; _
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" ref={sections.projects} style={{ padding: '80px 0', backgroundColor: '#FAF7F0', borderBottom: '4px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="font-retro-label" style={{ fontSize: '14px', color: 'var(--color-highlight)', fontWeight: 'bold' }}>STAGE 03</span>
            <h2 style={{ fontSize: '24px', marginTop: '8px', color: 'var(--color-text)' }}>PROJECT FOLDER EXPLORER</h2>
            <p className="font-retro-label" style={{ marginTop: '12px', fontSize: '12px', color: '#555', maxWidth: '760px', marginInline: 'auto', lineHeight: 1.7 }}>
              Buka folder project satu per satu untuk melihat build summary, isi stack, highlight penting, dan jalur diskusi jika kamu ingin sesuatu yang serupa.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
            {projectFilters.map((filter) => {
              const isActive = projectFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setProjectFilter(filter)}
                  className="font-retro-label cursor-pointer"
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive ? '3px solid var(--color-highlight)' : '3px solid transparent',
                    color: isActive ? 'var(--color-highlight)' : '#5d5d5d',
                    padding: '4px 2px',
                    fontSize: '10px',
                  }}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          <div className="quest-layout" style={{ border: '3px solid var(--color-border)', backgroundColor: '#c9c7c2', boxShadow: '6px 6px 0px var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', borderBottom: '3px solid var(--color-border)', backgroundColor: '#264785', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div className="font-retro-label" style={{ fontSize: '9px', color: '#fff' }}>EXPLORER :: C:\PORTFOLIO\PROJECTS</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '14px', height: '14px', border: '2px solid var(--color-border)', backgroundColor: '#d8d8d8' }} />
                <span style={{ width: '14px', height: '14px', border: '2px solid var(--color-border)', backgroundColor: '#d8d8d8' }} />
                <span style={{ width: '14px', height: '14px', border: '2px solid var(--color-border)', backgroundColor: '#e78670' }} />
              </div>
            </div>

            <div className="explorer-layout" style={{ display: 'grid', gridTemplateColumns: '220px minmax(0, 1fr)', minHeight: '720px' }}>
              <div style={{ borderRight: '3px solid var(--color-border)', backgroundColor: '#d9d7cf' }}>
                <div style={{ padding: '12px 14px', borderBottom: '2px solid #8f8b82', backgroundColor: '#ece9de' }}>
                  <div className="font-retro-game" style={{ fontSize: '11px' }}>DIRECTORY TREE</div>
                  <div className="font-retro-label" style={{ fontSize: '8px', color: '#5e574b', marginTop: '4px' }}>QUICK ACCESS</div>
                </div>

                <div style={{ padding: '10px 12px', display: 'grid', gap: '8px' }}>
                  <div className="font-retro-label" style={{ fontSize: '8px', color: '#545047', padding: '0 2px 4px 2px' }}>C:\PORTFOLIO</div>
                  {[
                    { label: 'Desktop', value: 'ALL' },
                    { label: 'Featured', value: 'FEATURED' },
                    { label: 'Client', value: 'CLIENT' },
                    { label: 'Experiment', value: 'EXPERIMENT' },
                    { label: 'Game', value: 'GAME' },
                  ].map((item) => {
                    const isActive = projectFilter === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setProjectFilter(item.value)}
                        className="font-retro-label cursor-pointer"
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          border: '2px solid var(--color-border)',
                          backgroundColor: isActive ? '#fff8c9' : '#f4f1e6',
                          color: '#222',
                          padding: '9px 10px',
                          fontSize: '9px',
                          boxShadow: isActive ? '2px 2px 0px var(--color-border)' : 'none',
                        }}
                      >
                        <span style={{ display: 'inline-block', width: '18px', color: '#264785' }}>{isActive ? '[-]' : '[+]'}</span>
                        {item.label.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ backgroundColor: '#f0efea', display: 'grid', gridTemplateRows: 'auto auto 1fr', minWidth: 0 }}>
                <div style={{ padding: '10px 14px', borderBottom: '2px solid #8f8b82', backgroundColor: '#e3e0d7', display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ width: '18px', height: '18px', border: '2px solid #6c675d', backgroundColor: '#f5f1e7' }} />
                    <span style={{ width: '18px', height: '18px', border: '2px solid #6c675d', backgroundColor: '#f5f1e7' }} />
                    <span style={{ width: '18px', height: '18px', border: '2px solid #6c675d', backgroundColor: '#f5f1e7' }} />
                  </div>
                  <div style={{ border: '2px solid #8f8b82', backgroundColor: '#f7f5ee', padding: '6px 10px' }}>
                    <div className="font-retro-label" style={{ fontSize: '9px', color: '#3e3a31' }}>C:\PORTFOLIO\PROJECTS\{projectFilter}</div>
                  </div>
                </div>

                <div className="project-main-panel" style={{ display: 'grid', gridTemplateColumns: selectedProject ? 'minmax(0, 1fr) 360px' : '1fr', minHeight: 0 }}>
                  <div className="project-desktop-grid" style={{ padding: '22px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(150px, 1fr))', gap: '22px', alignItems: 'start', alignContent: 'start' }}>
                    {filteredProjects.map((project, index) => {
                      const projectKey = project.id || project.title;
                      const isSelected = String(projectKey) === String(selectedProject?.id || selectedProject?.title);

                      return (
                        <button
                          key={projectKey}
                          type="button"
                          onClick={() => setSelectedProjectId(projectKey)}
                          className="cursor-pointer project-folder-button"
                          style={{
                            border: isSelected ? '3px solid var(--color-highlight)' : '3px solid transparent',
                            backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
                            textAlign: 'center',
                            padding: '10px 8px',
                            boxShadow: isSelected ? '4px 4px 0px rgba(26, 26, 26, 0.7)' : 'none',
                          }}
                        >
                          <div style={{ width: '92px', margin: '0 auto 10px auto', position: 'relative' }}>
                            <div style={{ width: '92px', height: '58px', border: '3px solid var(--color-border)', background: isSelected ? 'linear-gradient(180deg, #f5cf72 0%, #e5ab39 100%)' : 'linear-gradient(180deg, #eccb8c 0%, #d9a95c 100%)' }} />
                            <div style={{ position: 'absolute', top: '-11px', left: '8px', width: '36px', height: '12px', border: '3px solid var(--color-border)', borderBottom: 'none', backgroundColor: isSelected ? '#f5cf72' : '#eccb8c' }} />
                            <div style={{ position: 'absolute', top: '14px', left: '0', width: '92px', borderTop: '3px solid rgba(255, 255, 255, 0.25)' }} />
                          </div>
                          <div className="font-retro-game" style={{ fontSize: '11px', color: '#171717', lineHeight: 1.5 }}>{project.title.toUpperCase()}</div>
                          <div className="font-retro-label" style={{ fontSize: '8px', color: '#4f4b43', marginTop: '5px' }}>
                            {getProjectCategory(project)} / {project.isFeatured ? 'TOP BUILD' : String(index + 1).padStart(2, '0')}
                          </div>
                          <div className="font-retro-label" style={{ fontSize: '8px', color: '#6a6357', marginTop: '4px' }}>
                            {(project.tags || []).length} item(s)
                          </div>
                        </button>
                      );
                    })}

                    {filteredProjects.length === 0 && (
                      <div style={{ gridColumn: '1 / -1', border: '2px solid var(--color-border)', backgroundColor: '#fffef9', padding: '18px' }}>
                        <div className="font-retro-label" style={{ fontSize: '10px', color: '#3f3f3f' }}>NO FOLDER FOUND IN THIS DIRECTORY.</div>
                      </div>
                    )}
                  </div>

                  {selectedProject && (
                    <div style={{ height: '645px', borderLeft: '3px solid var(--color-border)', backgroundColor: '#f7f5ee', minWidth: 0 }}>
                      <div style={{ padding: '12px 16px', borderBottom: '2px solid #8f8b82', backgroundColor: '#ece9de', display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                          <div className="font-retro-label" style={{ fontSize: '8px', color: '#595348', marginBottom: '4px' }}>PREVIEW PANEL</div>
                          <div className="font-retro-game" style={{ fontSize: '12px' }}>{selectedProject.title.toUpperCase()}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {selectedProject.isFeatured && <span className="font-retro-label" style={{ fontSize: '8px', padding: '3px 6px', backgroundColor: 'var(--color-highlight)', color: '#FFF', border: '1px solid var(--color-border)' }}>TOP BUILD</span>}
                          <span className="font-retro-label" style={{ fontSize: '8px', padding: '3px 6px', backgroundColor: '#fff', color: '#444', border: '1px solid var(--color-border)' }}>{getProjectCategory(selectedProject)}</span>
                        </div>
                      </div>

                      <div style={{ padding: '18px', display: 'grid', gap: '18px' }}>
                        <div style={{ border: '2px solid var(--color-border)', backgroundColor: '#fffef9' }}>
                          <div style={{ padding: '8px 12px', borderBottom: '2px solid var(--color-border)', backgroundColor: '#f2ead9' }} className="font-retro-label">
                            <span style={{ fontSize: '8px', color: '#6f6654' }}>README.TXT</span>
                          </div>
                          <div style={{ padding: '14px 14px 16px 14px' }}>
                            <p className="font-retro-label" style={{ fontSize: '12px', lineHeight: 1.8, color: '#333', margin: 0 }}>{selectedProject.description}</p>
                          </div>
                        </div>

                        <div className="project-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '18px' }}>
                          <div style={{ border: '2px solid var(--color-border)', backgroundColor: '#fff' }}>
                            <div style={{ padding: '8px 12px', borderBottom: '2px solid var(--color-border)', backgroundColor: '#f2ead9' }} className="font-retro-label">
                              <span style={{ fontSize: '8px', color: '#6f6654' }}>STACK.INDEX</span>
                            </div>
                            <div style={{ padding: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {(selectedProject.tags || []).map((tag, index) => (
                                <span key={index} className="font-retro-label" style={{ fontSize: '9px', padding: '3px 7px', border: '1px solid var(--color-border)', backgroundColor: '#faf3e5' }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <a href={selectedProject.liveUrl || '#'} target="_blank" rel="noreferrer" className="btn-pixel btn-pixel-orange cursor-pointer" style={{ minHeight: '42px', padding: '8px 14px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                            OPEN PREVIEW <ArrowUpRight size={14} />
                          </a>
                          <a href={selectedProject.repoUrl || '#'} target="_blank" rel="noreferrer" className="btn-pixel btn-pixel-gray cursor-pointer" style={{ minHeight: '42px', padding: '8px 14px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                            OPEN FOLDER <Github size={14} />
                          </a>
                          <PixelButton variant="primary" onClick={() => handleDiscussProject(selectedProject)} ariaLabel={`Diskusikan project ${selectedProject.title}`}>
                            <MessageSquare size={14} style={{ marginRight: '6px' }} /> DISCUSS THIS PROJECT
                          </PixelButton>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" ref={sections.contact} style={{ padding: '80px 0', backgroundColor: '#FAF7F0' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="font-retro-label" style={{ fontSize: '14px', color: 'var(--color-highlight)', fontWeight: 'bold' }}>STAGE 04</span>
            <h2 style={{ fontSize: '24px', marginTop: '8px', color: 'var(--color-text)' }}>SUBMIT HIGH SCORE</h2>
          </div>

          <PixelCard stageLabel="PLAYER INQUIRY">
            {submitSuccess ? (
              <div style={{ padding: '40px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} className="animate-jump">
                <div className="pixel-box" style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderWidth: '3px', boxShadow: '2px 2px 0px var(--color-border)', color: '#FFF' }}>
                  <Check size={36} />
                </div>
                <h3 className="font-retro-game" style={{ fontSize: '16px', color: 'var(--color-accent)' }}>VICTORY!</h3>
                <p className="font-retro-label" style={{ fontSize: '13px', lineHeight: 1.6 }}>GG! Inquiry Anda telah berhasil di-submit ke database.</p>
                <p className="font-retro-label" style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>Membuka deep-link konfirmasi WhatsApp...</p>
                <PixelButton variant="gray" onClick={() => setSubmitSuccess(false)} style={{ marginTop: '16px', padding: '8px 16px', fontSize: '10px', minHeight: '40px' }}>
                  KIRIM PESAN BARU &larr;
                </PixelButton>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                {selectedProjectName && (
                  <div className="pixel-box" style={{ padding: '8px 16px', backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '2px solid var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="font-retro-label" style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 'bold' }}>PROJECT DIPILIH: {selectedProjectName.toUpperCase()}</span>
                    <button type="button" onClick={() => { setSelectedProjectName(''); setFormData((prev) => ({ ...prev, detail: '' })); }} style={{ background: 'none', border: 'none', color: '#F44336', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
                      X
                    </button>
                  </div>
                )}

                <div>
                  <label className="pixel-label" htmlFor="name">NAMA LENGKAP</label>
                  <input id="name" type="text" placeholder="Masukan nama lengkap Anda" className={`pixel-input ${formErrors.name ? 'pixel-input-error' : ''}`} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  {formErrors.name && <div className="error-text" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.name}</div>}
                </div>

                <div>
                  <label className="pixel-label" htmlFor="whatsapp">NOMOR WHATSAPP</label>
                  <input id="whatsapp" type="tel" placeholder="Contoh: 08123456789" className={`pixel-input ${formErrors.whatsapp ? 'pixel-input-error' : ''}`} value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} />
                  {formErrors.whatsapp && <div className="error-text" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.whatsapp}</div>}
                </div>

                <div>
                  <label className="pixel-label" htmlFor="email">EMAIL VALID</label>
                  <input id="email" type="email" placeholder="nama@email.com" className={`pixel-input ${formErrors.email ? 'pixel-input-error' : ''}`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  {formErrors.email && <div className="error-text" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.email}</div>}
                </div>

                <div>
                  <label className="pixel-label" htmlFor="detail">DETAIL TUJUAN / INQUIRY PROJECT</label>
                  <textarea id="detail" rows="5" placeholder="Jelaskan kebutuhan website, kerja sama, atau project yang ingin Anda diskusikan" className={`pixel-input ${formErrors.detail ? 'pixel-input-error' : ''}`} style={{ resize: 'none', padding: '12px' }} value={formData.detail} onChange={(e) => setFormData({ ...formData, detail: e.target.value })} />
                  {formErrors.detail && <div className="error-text" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.detail}</div>}
                </div>

                <PixelButton variant="orange" type="submit" ariaLabel="Submit Form inquiry" style={{ width: '100%', marginTop: '12px', fontSize: '13px' }}>
                  SUBMIT HIGH SCORE ▶
                </PixelButton>
              </form>
            )}
          </PixelCard>
        </div>
      </section>

      <footer style={{ borderTop: '4px solid var(--color-border)', backgroundColor: '#111', color: '#FFF', padding: '40px 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <h3 className="font-retro-game" style={{ fontSize: '14px', color: 'var(--color-highlight)' }}>GAME OVER. THANKS FOR PLAYING!</h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href={settings.github || 'https://github.com'} target="_blank" rel="noreferrer" className="font-retro-label cursor-pointer" style={{ color: '#FFF', textDecoration: 'none', fontSize: '12px' }}>[ GITHUB ]</a>
              <a href={settings.linkedin || 'https://linkedin.com'} target="_blank" rel="noreferrer" className="font-retro-label cursor-pointer" style={{ color: '#FFF', textDecoration: 'none', fontSize: '12px' }}>[ LINKEDIN ]</a>
              <a href={settings.instagram || 'https://instagram.com'} target="_blank" rel="noreferrer" className="font-retro-label cursor-pointer" style={{ color: '#FFF', textDecoration: 'none', fontSize: '12px' }}>[ INSTAGRAM ]</a>
            </div>
            <p className="font-retro-label" style={{ fontSize: '10px', color: '#666', marginTop: '16px' }}>
              (C) 2026 {settings.dev_name ? settings.dev_name.toUpperCase() : 'NAPDOEE'} DINO RUNNER. CREATED WITH React + Vite + Vanilla CSS.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        .terminal-blink {
          animation: animateBlink 1s infinite steps(2);
        }

        .project-folder-button {
          transition: transform 150ms steps(3), box-shadow 150ms steps(3), background-color 150ms steps(3);
        }

        .project-folder-button:hover {
          transform: translate(2px, 2px);
          box-shadow: 3px 3px 0px rgba(26, 26, 26, 0.65);
          background-color: rgba(255, 255, 255, 0.75);
        }

        @media (max-width: 1100px) {
          .project-desktop-grid {
            grid-template-columns: repeat(2, minmax(150px, 1fr)) !important;
          }
        }

        @media (max-width: 900px) {
          .quest-layout,
          .explorer-layout,
          .project-main-panel,
          .project-detail-grid {
            grid-template-columns: 1fr !important;
          }

          .experience-row-grid {
            grid-template-columns: 1fr !important;
          }

          .experience-terminal-card {
            grid-column: auto !important;
          }
        }

        @media (max-width: 680px) {
          .project-desktop-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
