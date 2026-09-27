import React from 'react';

export const InteractiveGlow: React.FC = () => {
  return (
    <>
      {/* Static ambient mesh background glows */}
      <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden select-none opacity-30">
        {/* Blob 1: Violet/Indigo (Slow Drift) */}
        <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/10 blur-[130px] animate-blob-slow" />
        
        {/* Blob 2: Cyan (Slow Drift) */}
        <div className="absolute bottom-[-20%] right-[-20%] w-[65vw] h-[65vw] rounded-full bg-cyan-500/10 blur-[140px] animate-blob-reverse" />
      </div>
    </>
  );
};
