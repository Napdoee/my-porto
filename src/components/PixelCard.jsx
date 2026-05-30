import React from 'react';

const PixelCard = ({
  children,
  title,
  stageLabel,
  className = '',
  interactive = false,
  onClick,
}) => {
  const cardClass = interactive 
    ? 'pixel-box pixel-box-interactive' 
    : 'pixel-box';

  return (
    <div 
      className={`${cardClass} ${className} will-change-scroll`}
      onClick={onClick}
      style={{ padding: '24px', position: 'relative' }}
    >
      {stageLabel && (
        <span 
          className="font-retro-label"
          style={{
            position: 'absolute',
            top: '-14px',
            left: '16px',
            backgroundColor: 'var(--color-highlight)',
            color: '#FFF',
            border: '2px solid var(--color-border)',
            padding: '2px 8px',
            fontSize: '11px',
            letterSpacing: '1px',
            zIndex: 5
          }}
        >
          {stageLabel}
        </span>
      )}
      
      {title && (
        <h3 
          className="font-retro-game"
          style={{
            fontSize: '14px',
            marginBottom: '16px',
            borderBottom: '2px solid var(--color-border)',
            paddingBottom: '8px',
            color: 'var(--color-text)'
          }}
        >
          {title}
        </h3>
      )}
      
      <div>{children}</div>
    </div>
  );
};

export default PixelCard;
