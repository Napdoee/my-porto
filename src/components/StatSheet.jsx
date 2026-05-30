import React, { useEffect, useState, useRef } from 'react';
import PixelCard from './PixelCard';

const StatSheet = ({ settings = {} }) => {
  const [animateProgress, setAnimateProgress] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setAnimateProgress(true);
        }
      },
      { threshold: 0.15 } // Trigger when at least 15% is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const stats = [
    { name: 'HP (ENERGY/CREATIVITY)', val: `${settings.hp || '99'}/99`, barColor: 'var(--color-accent)' },
    { name: 'MP (LOGIC/CLEAN CODE)', val: `${settings.mp || '88'}/99`, barColor: '#39FF14' },
    { name: 'SPEED (VITE/FAST HMR)', val: `${settings.speed || '95'}/99`, barColor: 'var(--color-highlight)' },
    { name: 'DEFENSE (SECURITY/HASHING)', val: `${settings.defense || '90'}/99`, barColor: '#aa3bff' },
  ];

  const skills = [
    { name: settings.skill_1_name || 'React.js & Frontend design', percentage: parseInt(settings.skill_1_pct) || 90, xp: '18,500' },
    { name: settings.skill_2_name || 'Node.js & Express API', percentage: parseInt(settings.skill_2_pct) || 85, xp: '15,200' },
    { name: settings.skill_3_name || 'Prisma ORM & PostgreSQL', percentage: parseInt(settings.skill_3_pct) || 80, xp: '12,800' },
    { name: settings.skill_4_name || 'Guitar & Audio Editing', percentage: parseInt(settings.skill_4_pct) || 75, xp: '9,400' },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        padding: '80px 0',
        backgroundColor: '#FAF7F0',
        borderBottom: '4px solid var(--color-border)',
      }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span 
            className="font-retro-label"
            style={{
              fontSize: '14px',
              color: 'var(--color-highlight)',
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}
          >
            STAGE 01
          </span>
          <h2 style={{ fontSize: '24px', marginTop: '8px', color: 'var(--color-text)' }}>
            CHARACTER SHEET
          </h2>
        </div>

        <div className="grid-bento">
          {/* LEFT COLUMN: PIXEL AVATAR */}
          <div style={{ gridColumn: 'span 4' }}>
            <PixelCard stageLabel="AVATAR" style={{ height: '100%' }}>
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '16px 0'
                }}
              >
                {/* Scaled Crisp Pixel Art SVG Avatar */}
                <div 
                  className="pixel-box"
                  style={{
                    width: '160px',
                    height: '160px',
                    backgroundColor: '#EAE5D9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: '4px'
                  }}
                >
                  <svg width="128" height="128" viewBox="0 0 16 16" style={{ shapeRendering: 'crispEdges' }}>
                    {/* Hair */}
                    <path d="M4 1h8v4H4V1zm1 4h6v1H5V5z" fill="#1A1A1A" />
                    {/* Face skin */}
                    <path d="M4 5h8v6H4V5z" fill="#FFDBAC" />
                    {/* Glasses frame */}
                    <path d="M3 6h10v2H3V6z" fill="#1A1A1A" />
                    {/* Lenses */}
                    <rect x="4" y="7" width="2" height="1" fill="#FFF" />
                    <rect x="10" y="7" width="2" height="1" fill="#FFF" />
                    {/* Cheeks blush */}
                    <rect x="4" y="9" width="1" height="1" fill="#FFB6C1" />
                    <rect x="11" y="9" width="1" height="1" fill="#FFB6C1" />
                    {/* Mouth */}
                    <rect x="7" y="10" width="2" height="1" fill="#D2B48C" />
                    {/* Shirt */}
                    <path d="M3 11h10v4H3v-4z" fill="var(--color-highlight)" />
                    {/* Necktie / Collar */}
                    <path d="M7 11h2v3H7v-3z" fill="#FFF" />
                    <path d="M7 12h2v3H7v-3z" fill="#1A1A1A" />
                  </svg>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <h4 className="font-retro-game" style={{ fontSize: '13px', marginBottom: '6px' }}>{settings.dev_name || 'NAPDOEE'}</h4>
                  <p className="font-retro-label" style={{ fontSize: '12px', color: '#666' }}>CLASS: {settings.class || 'LEVEL 99 WEB MAGE'}</p>
                  <p className="font-retro-label" style={{ fontSize: '10px', color: 'var(--color-highlight)', marginTop: '4px' }}>LOCATION: {settings.location || 'MAKASSAR, ID'}</p>
                </div>
              </div>
            </PixelCard>
          </div>

          {/* MIDDLE COLUMN: RPG CHARACTER STATS */}
          <div style={{ gridColumn: 'span 4' }}>
            <PixelCard stageLabel="ATTRIBUTES" style={{ height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '8px 0' }}>
                {stats.map((stat, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                      <span className="font-retro-label" style={{ fontWeight: 'bold' }}>{stat.name}</span>
                      <span className="font-retro-game" style={{ fontSize: '10px' }}>{stat.val}</span>
                    </div>
                    {/* Retro health bar outline */}
                    <div 
                      style={{
                        height: '14px',
                        backgroundColor: '#E5E4E7',
                        border: '2px solid var(--color-border)',
                        overflow: 'hidden'
                      }}
                    >
                      <div 
                        style={{
                          height: '100%',
                          backgroundColor: stat.barColor,
                          width: animateProgress ? `${(parseInt(stat.val.split('/')[0]) / parseInt(stat.val.split('/')[1])) * 100}%` : '0%',
                          transition: `width ${600 + i * 200}ms steps(6)`,
                          backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
                          backgroundSize: '16px 16px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </PixelCard>
          </div>

          {/* RIGHT COLUMN: SKILLS XP */}
          <div style={{ gridColumn: 'span 4' }}>
            <PixelCard stageLabel="SKILLS EXPERIENCES" style={{ height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '8px 0' }}>
                {skills.map((skill, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                      <span className="font-retro-label" style={{ fontWeight: 'bold' }}>{skill.name}</span>
                      <span className="font-retro-game" style={{ fontSize: '9px', color: 'var(--color-highlight)' }}>
                        {skill.percentage}% XP
                      </span>
                    </div>
                    {/* XP Progress loader */}
                    <div 
                      style={{
                        height: '16px',
                        backgroundColor: '#E5E4E7',
                        border: '2px solid var(--color-border)',
                        position: 'relative'
                      }}
                    >
                      <div 
                        style={{
                          height: '100%',
                          backgroundColor: 'var(--color-accent)',
                          width: animateProgress ? `${skill.percentage}%` : '0%',
                          transition: `width ${800 + i * 200}ms cubic-bezier(0.1, 0.8, 0.3, 1)`,
                        }}
                      />
                      <span 
                        className="font-retro-label"
                        style={{
                          position: 'absolute',
                          right: '6px',
                          top: '1px',
                          fontSize: '8px',
                          color: '#000',
                          pointerEvents: 'none'
                        }}
                      >
                        {skill.xp} PTS
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </PixelCard>
          </div>
        </div>

        {/* Bio Text segment */}
        <div style={{ marginTop: '32px' }}>
          <PixelCard>
            <p 
              className="font-retro-label"
              style={{
                fontSize: '15px',
                textAlign: 'left',
                lineHeight: 1.8,
                color: 'var(--color-text)'
              }}
            >
              &gt; {settings.bio || "Hello Explorer! I'm a Makassar-based Web Developer who builds sleek retro systems and clean digital playgrounds. My core capability is executing robust full-stack applications with high performance. When I'm not tweaking HMR bundles in React or managing Postgres instances with Prisma, I code custom CSS parallax scroll triggers, play retro melodies on my guitar, and edit video content. Let's start the level selection maps below!"}
            </p>
          </PixelCard>
        </div>
      </div>
    </section>
  );
};

export default StatSheet;
