import React, { useEffect, useState } from 'react';
import { Gamepad2, Save, RefreshCw, AlertCircle, Check } from 'lucide-react';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import { adminFetch, logoutAdmin } from '../lib/adminAuth';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    dev_name: '',
    tagline: '',
    class: '',
    location: '',
    hp: '',
    mp: '',
    speed: '',
    defense: '',
    bio: '',
    whatsapp: '',
    github: '',
    linkedin: '',
    instagram: '',
    skill_1_name: '',
    skill_1_pct: '',
    skill_2_name: '',
    skill_2_pct: '',
    skill_3_name: '',
    skill_3_pct: '',
    skill_4_name: '',
    skill_4_pct: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await adminFetch('/api/admin/settings');
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          window.location.href = '/admin/login';
          return;
        }
        throw new Error('Gagal mengambil data settings.');
      }
      const data = await res.json();
      setSettings(prev => ({
        ...prev,
        ...data
      }));
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    // Client-side validations
    const hpVal = parseInt(settings.hp);
    const mpVal = parseInt(settings.mp);
    const speedVal = parseInt(settings.speed);
    const defenseVal = parseInt(settings.defense);

    if (isNaN(hpVal) || hpVal < 0 || hpVal > 99 ||
        isNaN(mpVal) || mpVal < 0 || mpVal > 99 ||
        isNaN(speedVal) || speedVal < 0 || speedVal > 99 ||
        isNaN(defenseVal) || defenseVal < 0 || defenseVal > 99) {
      setErrorMsg('CORE ATTRIBUTES (HP, MP, SPEED, DEFENSE) HARUS DI ANTARA 0 - 99');
      setSaving(false);
      return;
    }

    // WA Validation
    const waPattern = /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/;
    if (!settings.whatsapp || !waPattern.test(settings.whatsapp.replace(/\s+/g, ''))) {
      setErrorMsg('FORMAT WHATSAPP INDONESIA TIDAK VALID (CONTOH: 08123456789 atau 628123456789)');
      setSaving(false);
      return;
    }

    try {
      const res = await adminFetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!res.ok) {
        throw new Error('Gagal menyimpan perubahan settings.');
      }

      setSuccessMsg('VICTORY! SETTINGS TELAH BERHASIL DIPERBAHARUI.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F0EFE6', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="font-retro-game">
          <RefreshCw className="animate-spin" size={20} /> LOADING SETTINGS CONSOLE...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0EFE6', color: 'var(--color-text)' }}>
      {/* HUD Nav Header */}
      <header style={{ borderBottom: '4px solid var(--color-border)', backgroundColor: '#FFF', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="font-retro-game">
            <Gamepad2 size={24} style={{ color: 'var(--color-highlight)' }} />
            <span style={{ fontSize: '13px' }}>CMS HUD</span>
          </div>

          <nav style={{ display: 'flex', gap: '20px' }} className="admin-nav">
            <a href="/admin/dashboard" className="font-retro-label">DASHBOARD</a>
            <a href="/admin/experiences" className="font-retro-label">EXPERIENCES</a>
            <a href="/admin/projects" className="font-retro-label">PROJECTS</a>
            <a href="/admin/inquiries" className="font-retro-label">INBOX</a>
            <a href="/admin/settings" className="font-retro-label active-nav">SETTINGS</a>
          </nav>

          <PixelButton 
            variant="gray" 
            onClick={async () => {
              await logoutAdmin();
              window.location.href = '/admin/login';
            }}
            style={{ minHeight: '36px', minWidth: '90px', padding: '6px 12px', fontSize: '9px' }}
          >
            LOGOUT
          </PixelButton>
        </div>
      </header>

      {/* Main settings console */}
      <main className="container" style={{ padding: '40px 24px', maxWidth: '1200px' }}>
        <h2 className="font-retro-game" style={{ fontSize: '18px', marginBottom: '32px' }}>SETTINGS CONFIG</h2>

        {successMsg && (
          <div 
            className="pixel-box animate-jump"
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              border: '3px solid var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
              color: 'var(--color-accent)'
            }}
          >
            <Check size={18} />
            <span className="font-retro-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div 
            className="pixel-box"
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              border: '3px solid #F44336',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
              color: '#F44336'
            }}
          >
            <AlertCircle size={18} />
            <span className="font-retro-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
          
          {/* Left Column: Character Meta info */}
          <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <PixelCard stageLabel="CHARACTER INFORMATION">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                <div>
                  <label className="pixel-label" htmlFor="dev_name">DEVELOPER NAME</label>
                  <input
                    id="dev_name"
                    type="text"
                    className="pixel-input"
                    value={settings.dev_name}
                    onChange={(e) => handleInputChange('dev_name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="pixel-label" htmlFor="class">CLASS/LEVEL NAME</label>
                  <input
                    id="class"
                    type="text"
                    className="pixel-input"
                    value={settings.class}
                    onChange={(e) => handleInputChange('class', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="pixel-label" htmlFor="location">LOCATION</label>
                  <input
                    id="location"
                    type="text"
                    className="pixel-input"
                    value={settings.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="pixel-label" htmlFor="tagline">SHORT TAGLINE</label>
                  <textarea
                    id="tagline"
                    rows="3"
                    className="pixel-input"
                    style={{ resize: 'none', padding: '12px' }}
                    value={settings.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    required
                  />
                </div>
              </div>
            </PixelCard>

            <PixelCard stageLabel="CORE ATTRIBUTES (0-99 MAX)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'left' }}>
                <div>
                  <label className="pixel-label" htmlFor="hp">HP VALUE</label>
                  <input
                    id="hp"
                    type="number"
                    min="0"
                    max="99"
                    className="pixel-input"
                    value={settings.hp}
                    onChange={(e) => handleInputChange('hp', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="pixel-label" htmlFor="mp">MP VALUE</label>
                  <input
                    id="mp"
                    type="number"
                    min="0"
                    max="99"
                    className="pixel-input"
                    value={settings.mp}
                    onChange={(e) => handleInputChange('mp', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="pixel-label" htmlFor="speed">SPEED VALUE</label>
                  <input
                    id="speed"
                    type="number"
                    min="0"
                    max="99"
                    className="pixel-input"
                    value={settings.speed}
                    onChange={(e) => handleInputChange('speed', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="pixel-label" htmlFor="defense">DEFENSE VALUE</label>
                  <input
                    id="defense"
                    type="number"
                    min="0"
                    max="99"
                    className="pixel-input"
                    value={settings.defense}
                    onChange={(e) => handleInputChange('defense', e.target.value)}
                    required
                  />
                </div>
              </div>
            </PixelCard>
          </div>

          {/* Right Column: Bio, WA & Skills */}
          <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <PixelCard stageLabel="BIOGRAPHY & CONTACTS">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                <div>
                  <label className="pixel-label" htmlFor="bio">RPG BIO TEXT</label>
                  <textarea
                    id="bio"
                    rows="6"
                    className="pixel-input"
                    style={{ resize: 'none', padding: '12px', lineHeight: '1.6' }}
                    value={settings.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="pixel-label" htmlFor="whatsapp">WHATSAPP TARGET NUMBER</label>
                  <input
                    id="whatsapp"
                    type="text"
                    className="pixel-input"
                    value={settings.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    required
                  />
                </div>
              </div>
            </PixelCard>

            <PixelCard stageLabel="SOCIAL CHANNELS">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                <div>
                  <label className="pixel-label" htmlFor="github">GITHUB LINK</label>
                  <input
                    id="github"
                    type="url"
                    className="pixel-input"
                    value={settings.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                  />
                </div>

                <div>
                  <label className="pixel-label" htmlFor="linkedin">LINKEDIN LINK</label>
                  <input
                    id="linkedin"
                    type="url"
                    className="pixel-input"
                    value={settings.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  />
                </div>

                <div>
                  <label className="pixel-label" htmlFor="instagram">INSTAGRAM LINK</label>
                  <input
                    id="instagram"
                    type="url"
                    className="pixel-input"
                    value={settings.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                  />
                </div>
              </div>
            </PixelCard>
          </div>

          {/* Full Width Row: Skills specs */}
          <div style={{ gridColumn: 'span 12' }}>
            <PixelCard stageLabel="SKILLS EXPERIENCES SYSTEM">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', textAlign: 'left' }}>
                
                {/* Skill 1 */}
                <div style={{ border: '2px dashed #CCC', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="pixel-label" style={{ color: 'var(--color-highlight)' }}>SKILL SLOT 01</label>
                  <input
                    type="text"
                    className="pixel-input"
                    placeholder="Skill Name"
                    value={settings.skill_1_name}
                    onChange={(e) => handleInputChange('skill_1_name', e.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="pixel-input"
                    placeholder="XP Pct (0-100)"
                    value={settings.skill_1_pct}
                    onChange={(e) => handleInputChange('skill_1_pct', e.target.value)}
                  />
                </div>

                {/* Skill 2 */}
                <div style={{ border: '2px dashed #CCC', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="pixel-label" style={{ color: 'var(--color-highlight)' }}>SKILL SLOT 02</label>
                  <input
                    type="text"
                    className="pixel-input"
                    placeholder="Skill Name"
                    value={settings.skill_2_name}
                    onChange={(e) => handleInputChange('skill_2_name', e.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="pixel-input"
                    placeholder="XP Pct (0-100)"
                    value={settings.skill_2_pct}
                    onChange={(e) => handleInputChange('skill_2_pct', e.target.value)}
                  />
                </div>

                {/* Skill 3 */}
                <div style={{ border: '2px dashed #CCC', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="pixel-label" style={{ color: 'var(--color-highlight)' }}>SKILL SLOT 03</label>
                  <input
                    type="text"
                    className="pixel-input"
                    placeholder="Skill Name"
                    value={settings.skill_3_name}
                    onChange={(e) => handleInputChange('skill_3_name', e.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="pixel-input"
                    placeholder="XP Pct (0-100)"
                    value={settings.skill_3_pct}
                    onChange={(e) => handleInputChange('skill_3_pct', e.target.value)}
                  />
                </div>

                {/* Skill 4 */}
                <div style={{ border: '2px dashed #CCC', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="pixel-label" style={{ color: 'var(--color-highlight)' }}>SKILL SLOT 04</label>
                  <input
                    type="text"
                    className="pixel-input"
                    placeholder="Skill Name"
                    value={settings.skill_4_name}
                    onChange={(e) => handleInputChange('skill_4_name', e.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="pixel-input"
                    placeholder="XP Pct (0-100)"
                    value={settings.skill_4_pct}
                    onChange={(e) => handleInputChange('skill_4_pct', e.target.value)}
                  />
                </div>
              </div>
            </PixelCard>
          </div>

          {/* Submit Row */}
          <div style={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'flex-start', marginTop: '16px' }}>
            <PixelButton
              variant="orange"
              type="submit"
              disabled={saving}
              ariaLabel="Save settings"
              style={{ width: '220px', fontSize: '11px', minHeight: '44px' }}
            >
              {saving ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <RefreshCw className="animate-spin" size={14} /> SAVING CHANGES...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                  <Save size={14} /> SAVE CHARACTER STATS
                </span>
              )}
            </PixelButton>
          </div>

        </form>
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

export default AdminSettings;
