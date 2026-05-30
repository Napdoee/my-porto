import React from 'react';

const PixelButton = ({
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'primary', // 'primary' | 'orange' | 'gray'
  type = 'button',
  ariaLabel,
}) => {
  let btnClass = 'btn-pixel';
  if (variant === 'orange') {
    btnClass += ' btn-pixel-orange';
  } else if (variant === 'gray') {
    btnClass += ' btn-pixel-gray';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${btnClass} ${className} will-change-scroll`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default PixelButton;
