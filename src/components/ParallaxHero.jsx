import React, { useEffect, useRef } from 'react';
import PixelButton from './PixelButton';

const ParallaxHero = ({ onStartClick, devName, tagline }) => {
  const skyRef = useRef(null);
  const cloudsRef = useRef(null);
  const mountainsRef = useRef(null);
  const cactiRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // GPU accelerated direct DOM transforms to preserve 60fps and prevent paint jank
      if (skyRef.current) {
        skyRef.current.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
      }
      if (cloudsRef.current) {
        cloudsRef.current.style.transform = `translate3d(0, ${scrollY * 0.25}px, 0)`;
      }
      if (mountainsRef.current) {
        mountainsRef.current.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
      }
      if (cactiRef.current) {
        cactiRef.current.style.transform = `translate3d(0, ${scrollY * 0.65}px, 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        backgroundColor: '#F7F3E9', // parchment BG
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 24px',
        borderBottom: '4px solid var(--color-border)',
      }}
    >
      {/* 1. SKY LAYER (moves slowest) */}
      <div
        ref={skyRef}
        className="will-change-scroll"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: '80px',
          opacity: 0.7
        }}
      >
        {/* Pixel Sun SVG */}
        <svg width="80" height="80" viewBox="0 0 10 10" style={{ shapeRendering: 'crispEdges' }}>
          <rect x="2" y="0" width="6" height="10" fill="#FFD275" />
          <rect x="0" y="2" width="10" height="6" fill="#FFD275" />
          <rect x="1" y="1" width="8" height="8" fill="#FFD275" />
        </svg>
      </div>

      {/* 2. CLOUDS LAYER */}
      <div
        ref={cloudsRef}
        className="will-change-scroll"
        style={{
          position: 'absolute',
          top: '12%',
          left: 0,
          width: '100%',
          height: '40%',
          pointerEvents: 'none',
          opacity: 0.65
        }}
      >
        {/* Repeating moving clouds */}
        <div style={{ position: 'absolute', top: '10%', left: '15%' }}>
          <svg width="120" height="40" viewBox="0 0 24 8" style={{ shapeRendering: 'crispEdges' }}>
            <path d="M4 2h16v4H4V2z M8 0h8v8H8V0z" fill="#FFF" />
          </svg>
        </div>
        <div style={{ position: 'absolute', top: '40%', left: '70%', transform: 'scale(0.8)' }}>
          <svg width="120" height="40" viewBox="0 0 24 8" style={{ shapeRendering: 'crispEdges' }}>
            <path d="M4 2h16v4H4V2z M8 0h8v8H8V0z" fill="#FFF" />
          </svg>
        </div>
      </div>

      {/* 3. DISTANT DUNES / MOUNTAINS */}
      <div
        ref={mountainsRef}
        className="will-change-scroll"
        style={{
          position: 'absolute',
          bottom: '80px',
          left: 0,
          width: '100%',
          height: '200px',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'flex-end',
          opacity: 0.35
        }}
      >
        {/* Pixel style mountain shapes */}
        <svg width="100%" height="150" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ shapeRendering: 'crispEdges' }}>
          <path d="M0 20 L20 10 L30 15 L50 5 L70 17 L85 10 L100 20 Z" fill="#535353" />
        </svg>
      </div>

      {/* 4. CACTI LAYER (foreground objects) */}
      <div
        ref={cactiRef}
        className="will-change-scroll"
        style={{
          position: 'absolute',
          bottom: '50px',
          left: 0,
          width: '100%',
          height: '150px',
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          padding: '0 10%',
          opacity: 0.95
        }}
      >
        {/* Cactus silhouette left */}
        <svg width="32" height="64" viewBox="0 0 8 16" style={{ shapeRendering: 'crispEdges' }}>
          <path d="M3 0h2v16H3V0zm-2 4h2v4H1V4zm0 2h4v2H1V6zm4 2h2v4H5V8zm0 2h2v2H5v-2z" fill="#4CAF50" />
        </svg>

        {/* Cactus silhouette right */}
        <svg width="24" height="48" viewBox="0 0 8 16" style={{ shapeRendering: 'crispEdges', transform: 'scaleX(-1)' }}>
          <path d="M3 0h2v16H3V0zm-2 4h2v4H1V4zm0 2h4v2H1V6zm4 2h2v4H5V8zm0 2h2v2H5v-2z" fill="#4CAF50" />
        </svg>
      </div>

      {/* 5. HERO RUNNING DINO & ROAD FLOOR */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '60px',
          backgroundColor: '#535353', // Ground base color
          borderTop: '6px solid var(--color-border)',
        }}
      >
        {/* Infinite scrolling dotted path at bottom */}
        <div
          className="floor-scroll"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(var(--color-border) 2px, transparent 2px)`,
            backgroundSize: '24px 24px',
            opacity: 0.15,
            animation: 'scrollFloor 12s linear infinite'
          }}
        />

        {/* CSS Sprite Pixel Dinosaur - Running in-place representation */}
        <div
          className="dino-run-motion"
          style={{
            position: 'absolute',
            bottom: '24px',
            left: 'calc(50% - 24px)',
            width: '48px',
            height: '48px',
            zIndex: 10
          }}
        >
          {/* Animated SVG Dino sprite */}
          <svg width="48" height="48" viewBox="0 0 16 16" style={{ shapeRendering: 'crispEdges' }}>
            {/* Dino Body */}
            <path 
              d="M7 0h7v1H7V0zm-1 1h8v1H6V1zm-1 2h9v1H5V3zm-1 1h10v1H4V4zm-1 1h7v1H3V5zm0 1h6v1H3V6zm0 1h8v1H3V7zm0 8H2V8h1v7zm2 0H4v-4h1v4zm2 0H6v-3h1v3zm7-8h1v1h-1V7zm0 2h1V8h-1v1z" 
              fill="#1A1A1A" 
            />
            {/* Dino eye */}
            <rect x="8" y="2" width="1" height="1" fill="#FFF" />
          </svg>
        </div>
      </div>

      {/* 6. CONTENT BOX (Interactive Hero UI) */}
      <div
        className="pixel-box animate-jump"
        style={{
          zIndex: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '40px 32px',
          textAlign: 'center',
          maxWidth: '560px',
          width: '100%',
        }}
      >
        <div 
          className="font-retro-label"
          style={{
            color: 'var(--color-highlight)',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '12px',
            letterSpacing: '1px'
          }}
        >
          STAGE 00: STARTING GROUND
        </div>
        
        <h1 
          style={{ 
            fontSize: '28px', 
            lineHeight: 1.4, 
            marginBottom: '16px',
            color: 'var(--color-text)'
          }}
        >
          {devName || 'NAPDOEE'}
        </h1>
        
        <p 
          style={{ 
            fontSize: '16px', 
            lineHeight: 1.6, 
            marginBottom: '32px',
            color: '#666',
            fontWeight: '500'
          }}
        >
          {tagline || 'Interactive Developer Portfolio styled with retro 8-bit aesthetics & pixel mechanics.'}
        </p>

        <PixelButton 
          variant="orange"
          onClick={onStartClick}
          ariaLabel="Start Game and view character stats"
          style={{ minWidth: '180px' }}
        >
          START GAME &rarr;
        </PixelButton>
      </div>

      <style>{`
        @keyframes scrollFloor {
          0% { background-position-x: 0px; }
          100% { background-position-x: -300px; }
        }
      `}</style>
    </section>
  );
};

export default ParallaxHero;
