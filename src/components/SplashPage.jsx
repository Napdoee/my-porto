import React, { useState, useEffect } from 'react';

const SplashPage = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Score ticking animation up to 2026
    const targetScore = 2026;
    const duration = 1200; // ms
    const startTime = performance.now();

    const animateScore = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for score ticking
      const currentScore = Math.floor(progress * targetScore);
      setScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animateScore);
      } else {
        setIsReady(true);
      }
    };

    requestAnimationFrame(animateScore);
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
  }, [isReady]);

  const triggerStart = () => {
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500); // match transition
  };

  const formatScore = (num) => {
    return String(num).padStart(6, '0');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#111111',
        color: '#39FF14', // Matrix green / Retro Arcade green
        fontFamily: 'var(--font-body)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '24px',
        transition: 'all 500ms steps(4)',
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? 'scale(1.1)' : 'scale(1)',
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
      onClick={triggerStart}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '600px',
          textAlign: 'left',
          border: '4px solid #39FF14',
          padding: '24px',
          backgroundColor: '#000000',
          boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)',
          position: 'relative'
        }}
      >
        {/* Retro scanlines effect overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
            backgroundSize: '100% 4px',
            pointerEvents: 'none',
            zIndex: 10
          }}
        />

        <div style={{ marginBottom: '24px' }}>
          <p className="font-retro-label" style={{ fontSize: '12px', opacity: 0.8 }}>NAPDOEE OS [VERSION 1.0.0]</p>
          <p className="font-retro-label" style={{ fontSize: '11px', opacity: 0.6 }}>(C) 2026 DINO RUNNER. ALL RIGHTS RESERVED.</p>
        </div>

        <div 
          style={{
            borderBottom: '2px dashed #39FF14',
            paddingBottom: '16px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
            <span className="font-retro-game" style={{ fontSize: '11px' }}>HI-SCORE</span>
            <span className="font-retro-game" style={{ fontSize: '11px' }}>999999</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}>
            <span className="font-retro-game" style={{ fontSize: '13px' }}>YOUR SCORE</span>
            <span className="font-retro-game" style={{ fontSize: '13px', color: '#FF6B35' }}>
              {formatScore(score)}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', margin: '40px 0 20px 0' }}>
          <p 
            className="font-retro-game blink" 
            style={{ 
              fontSize: '14px', 
              color: '#FFF', 
              textShadow: '0 0 10px rgba(255,255,255,0.8)',
              userSelect: 'none'
            }}
          >
            {isReady ? 'PRESS START TO RUN' : 'LOADING RUNNER...'}
          </p>
          <p 
            className="font-retro-label" 
            style={{ 
              fontSize: '11px', 
              marginTop: '12px', 
              opacity: 0.5,
              color: '#FFF'
            }}
          >
            [ CLICK SCREEN OR PRESS ENTER/SPACE ]
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
