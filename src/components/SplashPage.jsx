import { useCallback, useEffect, useState } from 'react';
import { playBoot } from '../lib/soundEngine';

const bootLines = [
  'Checking Quest OS firmware...',
  'Mounting C:\\PORTFOLIO drive...',
  'Loading project explorer modules...',
  'Syncing character sheet stats...',
  'Starting desktop environment...',
];

const SplashPage = ({ brandName = 'NAPDOEE', onComplete }) => {
  const [bootProgress, setBootProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const triggerStart = useCallback(() => {
    if (!isReady || fadeOut) return;

    playBoot();
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500); // match transition
  }, [fadeOut, isReady, onComplete]);

  useEffect(() => {
    const duration = 1800;
    const startTime = performance.now();

    const animateBoot = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setBootProgress(Math.floor(easedProgress * 100));

      if (progress < 1) {
        requestAnimationFrame(animateBoot);
      } else {
        setIsReady(true);
      }
    };

    requestAnimationFrame(animateBoot);
  }, []);

  // Handle keys (Enter or Space) to press start
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        triggerStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerStart]);

  const visibleBootLines = bootLines.slice(0, Math.max(1, Math.ceil((bootProgress / 100) * bootLines.length)));

  return (
    <div
      className="laptop-boot-screen"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at 50% 35%, #26344f 0%, #111827 42%, #07080d 100%)',
        color: '#E7F0FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '24px',
        transition: 'all 500ms steps(4)',
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? 'scale(1.04)' : 'scale(1)',
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
      onClick={triggerStart}
    >
      <div className="laptop-device">
        <div className="laptop-lid">
          <div className="laptop-camera" />
          <div className="laptop-display">
            <div className="boot-scanlines" />
            <div className="boot-topbar">
              <span className="font-retro-label">{brandName.toUpperCase()} QUEST OS</span>
              <span className="font-retro-label">BIOS v2.6</span>
            </div>

            <div className="boot-content">
              <div className="boot-logo-mark">
                <span />
                <strong className="font-retro-game">Q</strong>
              </div>
              <h1 className="font-retro-game">Booting Quest OS</h1>
              <p className="font-retro-label">Preparing interactive portfolio desktop...</p>

              <div className="boot-progress-shell" aria-label="Boot progress">
                <div className="boot-progress-bar" style={{ width: `${bootProgress}%` }} />
              </div>
              <div className="boot-progress-meta font-retro-label">
                <span>SYS_LOAD</span>
                <span>{String(bootProgress).padStart(3, '0')}%</span>
              </div>

              <div className="boot-log">
                {visibleBootLines.map((line, index) => (
                  <div key={line} className="font-retro-label">
                    <span>{String(index + 1).padStart(2, '0')}&gt;</span> {line} <strong>OK</strong>
                  </div>
                ))}
              </div>

              <button type="button" className={`boot-start-button font-retro-game ${isReady ? 'ready' : ''}`} disabled={!isReady}>
                {isReady ? 'CLICK / ENTER TO OPEN DESKTOP' : 'PLEASE WAIT...'}
              </button>
            </div>
          </div>
        </div>
        <div className="laptop-base">
          <div className="laptop-trackpad" />
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
