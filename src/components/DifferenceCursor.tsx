import React, { useEffect, useRef } from 'react';

export const DifferenceCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = -500;
    let mouseY = -500;
    let currentX = -500;
    let currentY = -500;
    let hasMoved = false;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        currentX = mouseX;
        currentY = mouseY;
      }
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        if (cursor) cursor.style.opacity = '1';
      }
    };

    const onMouseEnter = () => {
      if (hasMoved && mouseX >= 0) {
        isVisibleRef.current = true;
        if (cursor) cursor.style.opacity = '1';
      }
    };

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      if (cursor) cursor.style.opacity = '0';
    };

    let currentScale = 1;

    // Smooth lerp loop
    const render = () => {
      if (hasMoved) {
        currentX += (mouseX - currentX) * 0.18;
        currentY += (mouseY - currentY) * 0.18;
        const targetScale = isHoveredRef.current ? 2.4 : 1;
        currentScale += (targetScale - currentScale) * 0.2;

        if (cursor) {
          cursor.style.transform = `translate3d(${currentX - 16}px, ${currentY - 16}px, 0) scale(${currentScale.toFixed(3)})`;
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // Hover detection on interactive tags without triggering React re-renders
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('a') ||
          target.closest('button') ||
          target.closest('[role="button"]') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('.cursor-pointer'))
      ) {
        isHoveredRef.current = true;
      } else {
        isHoveredRef.current = false;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseenter', onMouseEnter, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="hidden md:block fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] opacity-0"
      style={{
        backgroundColor: '#FFFFFF',
        mixBlendMode: 'difference',
        willChange: 'transform',
        transform: 'translate3d(-500px, -500px, 0)',
        transition: 'opacity 0.25s ease',
      }}
    />
  );
};
