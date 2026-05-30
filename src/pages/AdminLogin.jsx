import React, { useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';

const parseResponseBody = async (response) => {
  const raw = await response.text();

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return { error: raw };
  }
};

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await parseResponseBody(res);

      if (!res.ok) {
        throw new Error(data?.error || `LOGIN FAILED (${res.status})`);
      }

      if (!data?.token) {
        throw new Error('LOGIN RESPONSE TIDAK VALID');
      }

      localStorage.setItem('adminToken', data.token);
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setErrorMsg(err.message.toUpperCase());
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#1E1E1E', // Dark Arcade style
        color: '#FFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div style={{ maxWidth: '420px', width: '100%' }}>
        {/* Lock icon header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div 
            className="pixel-box animate-jump"
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-highlight)',
              color: '#FFF',
              borderWidth: '3px',
              boxShadow: '4px 4px 0px 0px #000'
            }}
          >
            <Shield size={36} />
          </div>
        </div>

        <PixelCard stageLabel="ADMIN SECURITY GATEWAY">
          <div style={{ padding: '8px 0' }}>
            <h2 
              className="font-retro-game"
              style={{
                fontSize: '12px',
                textAlign: 'center',
                marginBottom: '24px',
                color: 'var(--color-text)'
              }}
            >
              INSERT CREDENTIALS TO LOG IN
            </h2>

            {errorMsg && (
              <div 
                className="pixel-box"
                style={{
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  border: '2px solid #F44336',
                  padding: '12px',
                  marginBottom: '20px',
                  color: '#F44336',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '11px'
                }}
              >
                <AlertTriangle size={16} />
                <span className="font-retro-label">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="pixel-label" htmlFor="username">USERNAME</label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter admin username"
                  className="pixel-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="pixel-label" htmlFor="password">PASSWORD</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  className="pixel-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <PixelButton
                variant="orange"
                type="submit"
                ariaLabel="Log in to admin CMS"
                style={{ width: '100%', marginTop: '8px', fontSize: '11px' }}
              >
                AUTHENTICATE &rarr;
              </PixelButton>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <a 
                href="/" 
                className="font-retro-label"
                style={{ 
                  fontSize: '11px', 
                  color: '#666', 
                  textDecoration: 'none'
                }}
              >
                &larr; BACK TO SITE CORES
              </a>
            </div>
          </div>
        </PixelCard>
      </div>
    </div>
  );
};

export default AdminLogin;
