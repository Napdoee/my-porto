import React, { useEffect, useState } from 'react';
import { Gamepad2, Archive, CheckCircle, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import { adminFetch, logoutAdmin } from '../lib/adminAuth';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await adminFetch('/api/admin/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      } else if (res.status === 401 || res.status === 403) {
        window.location.href = '/admin/login';
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    }
  };

  const extractLevel = (detail) => {
    const match = (detail || '').match(/\[(.*?)\]/);
    return match ? match[1] : 'General Quest';
  };

  const handleMarkRead = async (id) => {
    try {
      const res = await adminFetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'READ' })
      });
      if (res.ok) {
        const updated = await res.json();
        setInquiries(inquiries.map(inq => inq.id === id ? updated : inq));
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(updated);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleArchive = async (id) => {
    try {
      const res = await adminFetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ARCHIVED' })
      });
      if (res.ok) {
        const updated = await res.json();
        setInquiries(inquiries.map(inq => inq.id === id ? updated : inq));
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(updated);
        }
      }
    } catch (err) {
      console.error('Failed to archive inquiry:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0EFE6', color: 'var(--color-text)' }}>
      {/* Admin HUD Nav Header */}
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
            <a href="/admin/inquiries" className="font-retro-label active-nav">INBOX</a>
            <a href="/admin/settings" className="font-retro-label">SETTINGS</a>
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

      {/* Main Inbox Container */}
      <main className="container" style={{ padding: '40px 24px', maxWidth: '1200px' }}>
        <h2 className="font-retro-game" style={{ fontSize: '18px', marginBottom: '32px' }}>INBOX MONITOR</h2>

        <div className="grid-bento">
          {/* List panel */}
          <div style={{ gridColumn: selectedInquiry ? 'span 7' : 'span 12' }}>
            <PixelCard stageLabel="PLAYER SUBMISSIONS">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                      <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>SENDER</th>
                      <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>LEVEL TARGET</th>
                      <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px' }}>DATE</th>
                      <th className="font-retro-label" style={{ padding: '12px', fontSize: '11px', textAlign: 'center' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inq) => {
                      let statusBg = '#FFF';
                      let statusColor = '#000';
                      if (inq.status === 'NEW') {
                        statusBg = 'var(--color-highlight)';
                        statusColor = '#FFF';
                      } else if (inq.status === 'READ') {
                        statusBg = 'var(--color-accent)';
                        statusColor = '#FFF';
                      } else {
                        statusBg = 'var(--color-base)';
                        statusColor = '#FFF';
                      }

                      const isSelected = selectedInquiry && selectedInquiry.id === inq.id;

                      return (
                        <tr 
                          key={inq.id} 
                          onClick={() => setSelectedInquiry(inq)}
                          className="cursor-pointer"
                          style={{ 
                            borderBottom: '1px solid #CCC',
                            backgroundColor: isSelected ? 'rgba(255, 107, 53, 0.05)' : 'transparent',
                            fontWeight: inq.status === 'NEW' ? 'bold' : 'normal'
                          }}
                        >
                          <td style={{ padding: '14px 12px', fontSize: '13px' }}>
                            <div>{inq.nama}</div>
                            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{inq.email}</div>
                          </td>
                          <td className="font-retro-label" style={{ padding: '14px 12px', fontSize: '10px' }}>{extractLevel(inq.detail)}</td>
                          <td style={{ padding: '14px 12px', fontSize: '12px' }}>{inq.createdAt ? inq.createdAt.substring(0, 10) : ''}</td>
                          <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                            <span 
                              className="font-retro-label"
                              style={{
                                fontSize: '8px',
                                padding: '2px 6px',
                                backgroundColor: statusBg,
                                color: statusColor,
                                border: '1px solid var(--color-border)',
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
          </div>

          {/* Details Panel */}
          {selectedInquiry && (
            <div style={{ gridColumn: 'span 5' }} className="animate-jump">
              <PixelCard stageLabel="SUBMISSION DESCRIPTOR">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                  <div style={{ borderBottom: '2px dashed var(--color-border)', paddingBottom: '12px' }}>
                    <div className="font-retro-label" style={{ fontSize: '10px', color: 'var(--color-highlight)', fontWeight: 'bold', marginBottom: '4px' }}>
                      SENDER DETAILS
                    </div>
                    <h3 className="font-retro-game" style={{ fontSize: '14px', color: 'var(--color-text)' }}>
                      {selectedInquiry.nama.toUpperCase()}
                    </h3>
                    <p style={{ fontSize: '13px', marginTop: '6px', color: '#333' }}>
                      <span className="font-retro-label" style={{ fontSize: '10px', color: '#666' }}>EMAIL:</span> {selectedInquiry.email}
                    </p>
                    <p style={{ fontSize: '13px', marginTop: '4px', color: '#333' }}>
                      <span className="font-retro-label" style={{ fontSize: '10px', color: '#666' }}>WHATSAPP:</span> {selectedInquiry.whatsapp}
                    </p>
                  </div>

                  <div>
                    <div className="font-retro-label" style={{ fontSize: '10px', color: '#666', marginBottom: '6px' }}>
                      PROJECT SPECS TARGET LEVEL
                    </div>
                    <div 
                      className="font-retro-label"
                      style={{
                        display: 'inline-block',
                        fontSize: '11px',
                        border: '2px solid var(--color-border)',
                        padding: '4px 8px',
                        backgroundColor: '#FFF'
                      }}
                    >
                      {extractLevel(selectedInquiry.detail)}
                    </div>
                  </div>

                  <div>
                    <div className="font-retro-label" style={{ fontSize: '10px', color: '#666', marginBottom: '6px' }}>
                      QUEST DETAIL DESCRIPTION
                    </div>
                    <div 
                      className="pixel-box"
                      style={{
                        padding: '16px',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        backgroundColor: '#FFF',
                        minHeight: '120px',
                        boxShadow: '2px 2px 0px var(--color-border)'
                      }}
                    >
                      {selectedInquiry.detail}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    {selectedInquiry.status === 'NEW' && (
                      <PixelButton
                        onClick={() => handleMarkRead(selectedInquiry.id)}
                        ariaLabel="Tandai sudah dibaca"
                        style={{
                          flex: 1,
                          fontSize: '9px',
                          padding: '8px 12px',
                          minHeight: '40px',
                          gap: '4px'
                        }}
                      >
                        <CheckCircle size={14} /> MARK READ
                      </PixelButton>
                    )}
                    {selectedInquiry.status !== 'ARCHIVED' && (
                      <PixelButton
                        variant="gray"
                        onClick={() => handleArchive(selectedInquiry.id)}
                        ariaLabel="Arsipkan pesan"
                        style={{
                          flex: 1,
                          fontSize: '9px',
                          padding: '8px 12px',
                          minHeight: '40px',
                          gap: '4px'
                        }}
                      >
                        <Archive size={14} /> ARCHIVE
                      </PixelButton>
                    )}
                  </div>
                </div>
              </PixelCard>
            </div>
          )}
        </div>
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

export default AdminInquiries;
