import React from 'react';

interface OSLogoProps {
  className?: string;
}

const OSLogo: React.FC<OSLogoProps> = ({ className }) => {
  return (
    <div className={`w-[60px] h-[60px] ${className}`}>
      <svg viewBox="0 0 132 125" className="w-full h-full drop-shadow-[0_4px_8px_rgba(59,130,246,0.5)]">
        {/* The colors are hardcoded to match v-accent and v-primary from tailwind config */}
        <path fill="#8b5cf6" d="M65.9 0l8.2 46.4 38-28.2-28.2 38 46.4 8.2-46.4 8.2 28.2 38-38-28.2-8.2 46.4-8.2-46.4-38 28.2 28.2-38-46.4-8.2 46.4-8.2-28.2-38 38 28.2z"/>
        <path fill="#3b82f6" d="M65.9 0L57.7 46.4 20 18.2l28.1 38-46.3 8.2L48 70.8l-28.2 38 38-28.2L66 125V0z"/>
      </svg>
    </div>
  );
};

export default OSLogo;
