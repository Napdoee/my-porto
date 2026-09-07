import React, { useEffect, useState } from 'react';
import { Gamepad2, Inbox, Cpu, ClipboardList, LogOut, ArrowRight, UserCheck } from 'lucide-react';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import { adminFetch, logoutAdmin } from '../lib/adminAuth';

const AdminDashboard = () => {
  const [inquiryCount, setInquiryCount] = useState(0);
  const [newThisWeekCount, setNewThisWeekCount] = useState(0);
  const [experiencesCount, setExperiencesCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [recentInquiries, setRecentInquiries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await adminFetch('/api/admin/stats');
        if (statsRes.ok) {
          const stats = await statsRes.json();
          setInquiryCount(stats.totalInquiries);
          setNewThisWeekCount(stats.newThisWeek);
          setExperiencesCount(stats.totalExperiences);
          setProjectsCount(stats.totalProjects);
        } else if (statsRes.status === 401 || statsRes.status === 403) {
          window.location.href = '/admin/login';
          return;
        }

        const inquiriesRes = await adminFetch('/api/admin/inquiries');
        if (inquiriesRes.ok) {
          const list = await inquiriesRes.json();
          setRecentInquiries(list.slice(0, 3));
        } else if (inquiriesRes.status === 401 || inquiriesRes.status === 403) {
          window.location.href = '/admin/login';
        }
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = '/admin/login';
  };

  const extractLevel = (detail) => {
    const match = (detail || '').match(/\[(.*?)\]/);
    return match ? match[1] : 'General Quest';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0EFE6', color: 'var(--color-text)' }}>
      {/* Admin HUD Nav */}
      <header style={{ borderBottom: '4px solid var(--color-border)', backgroundColor: '#FFF', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="font-retro-game">
            <Gamepad2 size={24} style={{ color: 'var(--color-highlight)' }} />
            <span style={{ fontSize: '13px' }}>CMS HUD</span>
          </div>

          <nav style={{ display: 'flex', gap: '20px' }} className="admin-nav">
            <a href="/admin/dashboard" className="font-retro-label active-nav">DASHBOARD</a>
            <a href="/admin/experiences" className="font-retro-label">EXPERIENCES</a>
            <a href="/admin/projects" className="font-retro-label">PROJECTS</a>
            <a href="/admin/inquiries" className="font-retro-label">INBOX</a>
            <a href="/admin/settings" className="font-retro-label">SETTINGS</a>
          </nav>

          <PixelButton 
            variant="gray" 
            onClick={handleLogout}
            style={{ minHeight: '36px', minWidth: '90px', padding: '6px 12px', fontSize: '9px' }}
          >
            <LogOut size={12} style={{ marginRight: '6px' }} /> LOGOUT
          </PixelButton>
        </div>
      </header>

      {/* Main Admin Deck */}
      <main className="container" style={{ padding: '40px 24px', maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 className="font-retro-game" style={{ fontSize: '18px' }}>ADMIN CONSOLE</h2>
          <span 
            className="font-retro-label"
            style={{
              border: '2px solid var(--color-border)',
              padding: '4px 10px',
              backgroundColor: 'var(--color-accent)',
              color: '#FFF',
              fontSize: '11px',
              fontWeight: 'bold',
              boxShadow: '2px 2px 0px var(--color-border)'
            }}
          >
            STATUS: ONLINE
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid-bento" style={{ marginBottom: '40px' }}>
          {/* Card 1 */}
          <div style={{ gridColumn: 'span 4' }}>
            <PixelCard stageLabel="STATS 01">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
                <div style={{ padding: '12px', backgroundColor: 'rgba(255, 107, 53, 0.1)', border: '2px solid var(--color-highlight)', color: 'var(--color-highlight)' }}>
                  <Inbox size={28} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span className="font-retro-label" style={{ fontSize: '10px', color: '#666' }}>INQUIRIES RECORDED</span>
                  <h3 className="font-retro-game" style={{ fontSize: '20px', marginTop: '4px' }}>{inquiryCount}</h3>
                </div>
              </div>
            </PixelCard>
          </div>

          {/* Card 2 */}
          <div style={{ gridColumn: 'span 4' }}>
            <PixelCard stageLabel="STATS 02">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
                <div style={{ padding: '12px', backgroundColor: 'rgba(255, 107, 53, 0.1)', border: '2px solid var(--color-highlight)', color: 'var(--color-highlight)' }}>
                  <UserCheck size={28} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span className="font-retro-label" style={{ fontSize: '10px', color: '#666' }}>NEW THIS WEEK</span>
                  <h3 className="font-retro-game" style={{ fontSize: '20px', marginTop: '4px' }}>{newThisWeekCount}</h3>
                </div>
              </div>
            </PixelCard>
          </div>

          {/* Card 3 */}
          <div style={{ gridColumn: 'span 4' }}>
            <PixelCard stageLabel="STATS 03">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
                <div style={{ padding: '12px', backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '2px solid var(--color-accent)', color: 'var(--color-accent)' }}>
                  <Cpu size={28} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span className="font-retro-label" style={{ fontSize: '10px', color: '#666' }}>TOTAL EXPERIENCES</span>
                  <h3 className="font-retro-game" style={{ fontSize: '20px', marginTop: '4px' }}>{experiencesCount}</h3>
                </div>
              </div>
            </PixelCard>
          </div>

          {/* Card 4 */}
          <div style={{ gridColumn: 'span 4' }}>
            <PixelCard stageLabel="STATS 04">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
                <div style={{ padding: '12px', backgroundColor: 'rgba(170, 59, 255, 0.1)', border: '2px solid #aa3bff', color: '#aa3bff' }}>
                  <ClipboardList size={28} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span className="font-retro-label" style={{ fontSize: '10px', color: '#666' }}>TOTAL PROJECTS</span>
                  <h3 className="font-retro-game" style={{ fontSize: '20px', marginTop: '4px' }}>{projectsCount}</h3>
                </div>
              </div>
            </PixelCard>
          </div>
        </div>

        {/* Recent Inquiries List */}
        <PixelCard stageLabel="INBOX FEEDBACK">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-border)', paddingBottom: '12px', marginBottom: '20px' }}>
            <h3 className="font-retro-game" style={{ fontSize: '12px', margin: 0 }}>RECENT PLAYER SUBMISSIONS</h3>
            <a href="/admin/inquiries" className="font-retro-label" style={{ fontSize: '11px', color: 'var(--color-highlight)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              VIEW FULL INBOX <ArrowRight size={14} />
            </a>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>NAME</th>
                  <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>EMAIL</th>
                  <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>LEVEL TARGET</th>
                  <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>DATE</th>
                  <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px', textAlign: 'center' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inq, idx) => {
                  const statusBg = inq.status === 'NEW' ? 'var(--color-highlight)' : inq.status === 'READ' ? 'var(--color-accent)' : 'var(--color-base)';
                  const statusColor = '#FFF';

                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #CCC' }}>
                      <td className="font-retro-label" style={{ padding: '14px 12px', fontSize: '12px', fontWeight: 'bold' }}>{inq.nama}</td>
                      <td style={{ padding: '14px 12px', fontSize: '14px' }}>{inq.email}</td>
                      <td className="font-retro-label" style={{ padding: '14px 12px', fontSize: '11px' }}>{extractLevel(inq.detail)}</td>
                      <td style={{ padding: '14px 12px', fontSize: '13px' }}>{inq.createdAt ? inq.createdAt.substring(0, 10) : ''}</td>
                      <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                        <span 
                          className="font-retro-label"
                          style={{
                            fontSize: '9px',
                            padding: '3px 8px',
                            backgroundColor: statusBg,
                            color: statusColor,
                            border: '1px solid var(--color-border)',
                            boxShadow: '1px 1px 0px var(--color-border)',
                            fontWeight: 'bold'
                          }}
                        >
                          {inq.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </PixelCard>
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

export default AdminDashboard;
