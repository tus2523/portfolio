import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const InteractiveGlow: React.FC = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for delayed cursor-following ambient blob
  const springX = useSpring(mouseX, { stiffness: 25, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 25, damping: 20 });

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(isTouch);
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
      setOpacity(1);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* 1. Subtle cursor spotlight */}
      {!isMobile && (
        <div
          className="fixed inset-0 pointer-events-none z-[2] transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(550px circle at ${coords.x}px ${coords.y}px, rgba(20, 80, 255, 0.09), rgba(187, 204, 215, 0.03) 45%, transparent 80%)`,
          }}
        />
      )}
      
      {/* 2. Drifting ambient mesh glows */}
      <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden select-none opacity-40">
        {/* Blob 1: Violet/Indigo (Slow Drift) */}
        <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/10 blur-[130px] animate-blob-slow" />
        
        {/* Blob 2: Cyan (Slow Drift) */}
        <div className="absolute bottom-[-20%] right-[-20%] w-[65vw] h-[65vw] rounded-full bg-cyan-500/10 blur-[140px] animate-blob-reverse" />
        
        {/* Blob 3: Amber/Pink (Cursor Follower with Spring Lag) */}
        {!isMobile && (
          <motion.div
            className="absolute w-[45vw] h-[45vw] rounded-full bg-pink-500/5 blur-[120px]"
            style={{
              x: springX,
              y: springY,
              translateX: '-50%',
              translateY: '-50%',
            }}
          />
        )}
      </div>
    </>
  );
};
