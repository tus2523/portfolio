/**
 * InteractiveFolder Component
 * A premium, interactive folder UI element that opens on click
 * to reveal contents with a "drifting" animation effect.
 * Adapted for Tushar Maru's Earthy Editorial Studio portfolio.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface FolderProps {
  /** Main color of the folder flap */
  color?: string;
  /** Scale factor for the folder */
  size?: number;
  /** Array of React elements to display as "papers" inside the folder */
  items?: React.ReactNode[];
  /** Optional CSS class for the wrapper */
  className?: string;
  /** Title or label to display on the folder */
  label?: string;
  /** Click handler for when user clicks folder */
  onClick?: () => void;
  /** Count of photos inside */
  count?: number;
}

const darkenColor = (hex: string, percent: number): string => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
    return hex || 'var(--theme-dark-bg, #01472e)';
  }
  let color = hex.slice(1);
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  if (color.length !== 6) return hex;
  const num = parseInt(color, 16);
  if (isNaN(num)) return hex;
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

export function InteractiveFolder({ 
  color = 'var(--theme-dark-bg, #01472e)', 
  size = 1, 
  items = [], 
  className = '',
  label,
  onClick,
  count
}: FolderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const maxVisibleItems = 3;
  const displayItems = items.slice(0, maxVisibleItems);
  while (displayItems.length < maxVisibleItems) {
    displayItems.push(null);
  }

  const folderBackColor = darkenColor(color, 0.18);
  const paperColors = [
    'var(--theme-accent-bg, #fefae0)',
    'var(--theme-card-bg, #f7f3d5)',
    '#ffffff'
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (onClick) onClick();
  };

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    if (!isOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
    setMousePos({ x, y });
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setHoveredIndex(null);
  };

  const getPaperTransform = (index: number) => {
    if (!isOpen) return { x: '-50%', y: '10%', rotate: 0 };
    
    const baseTransforms = [
      { x: '-120%', y: '-75%', rotate: -15 },
      { x: '10%', y: '-75%', rotate: 15 },
      { x: '-50%', y: '-105%', rotate: 5 }
    ];

    const base = baseTransforms[index] || { x: '-50%', y: '-50%', rotate: 0 };
    
    if (hoveredIndex === index) {
      return {
        x: `calc(${base.x} + ${mousePos.x}px)`,
        y: `calc(${base.y} + ${mousePos.y}px)`,
        rotate: base.rotate,
        scale: 1.15,
      };
    }
    
    return base;
  };

  return (
    <div 
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ transform: `scale(${size})`, width: 170, height: 125 }}
    >
      <div
        className="relative cursor-pointer group"
        onClick={handleToggle}
      >
        {/* Folder Back Container */}
        <div
          className="relative w-[150px] h-[105px] transition-all duration-500 rounded-tr-[18px] rounded-br-[18px] rounded-bl-[18px]"
          style={{ 
            backgroundColor: folderBackColor,
            boxShadow: isOpen 
              ? '0 16px 36px -8px rgba(0, 0, 0, 0.35)' 
              : '0 6px 18px -3px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Tab on top left */}
          <div
            className="absolute bottom-full left-0 w-[55px] h-[16px] rounded-t-[10px] flex items-center px-2"
            style={{ backgroundColor: folderBackColor }}
          >
            {count !== undefined && (
              <span className="text-[8px] font-bold text-[var(--theme-accent-bg,#fefae0)]/80 uppercase tracking-widest">
                {count} RAW
              </span>
            )}
          </div>

          {/* Papers / Stills inside */}
          {displayItems.map((item, i) => (
            <motion.div
              key={i}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={handleMouseLeave}
              animate={getPaperTransform(i)}
              transition={{ 
                type: 'spring', 
                stiffness: 260, 
                damping: 20,
                mass: 1 
              }}
              className="absolute left-1/2 flex items-center justify-center overflow-hidden"
              style={{
                zIndex: 20,
                backgroundColor: paperColors[i],
                borderRadius: '10px',
                width: i === 0 ? '100px' : i === 1 ? '112px' : '125px',
                height: i === 0 ? '82px' : i === 1 ? '90px' : '98px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(0, 0, 0, 0.12)'
              }}
            >
              {item || (
                <div className="w-full h-full p-2 flex flex-col justify-center items-center bg-[var(--theme-accent-bg,#fefae0)]">
                  <span className="text-[8px] font-bold uppercase tracking-wider opacity-60">
                    STILL {i + 1}
                  </span>
                </div>
              )}
            </motion.div>
          ))}

          {/* Folder Front Flap - Left Side */}
          <motion.div
            animate={{
              skewX: isOpen ? 15 : 0,
              scaleY: isOpen ? 0.6 : 1,
              translateY: isOpen ? 4 : 0
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute inset-0 z-30 origin-bottom"
            style={{
              backgroundColor: color,
              borderRadius: '8px 18px 18px 18px',
              clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
            }}
          />

          {/* Folder Front Flap - Right Side */}
          <motion.div
            animate={{
              skewX: isOpen ? -15 : 0,
              scaleY: isOpen ? 0.6 : 1,
              translateY: isOpen ? 4 : 0
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute inset-0 z-30 origin-bottom"
            style={{
              backgroundColor: color,
              borderRadius: '8px 18px 18px 18px',
              clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)'
            }}
          />

          {/* ── Prominent Folder Front Label (Fully unclipped & crisp!) ── */}
          {label && (
            <motion.div
              animate={{
                opacity: isOpen ? 0 : 1,
                scale: isOpen ? 0.8 : 1,
                translateY: isOpen ? -8 : 0,
              }}
              transition={{ duration: 0.25 }}
              className="absolute inset-x-2 bottom-3.5 z-40 flex items-center justify-center pointer-events-none"
            >
              <div className="px-3 py-1.5 rounded-lg bg-[var(--theme-dark-bg,#01472e)] border border-current/20 text-[var(--theme-accent-bg,#fefae0)] text-[10px] font-bold tracking-[0.2em] uppercase text-center shadow-lg font-sans w-full max-w-[130px] truncate">
                {label}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InteractiveFolder;
