import React, { useRef, useEffect } from 'react';

interface InfiniteMarqueeProps {
  children: React.ReactNode[];
  direction?: 'left' | 'right';
  speed?: number; // px per frame at 60fps, default 0.8 (fast)
  pauseOnHover?: boolean;
  className?: string;
  itemClassName?: string;
  gap?: string;
}

export const InfiniteMarquee: React.FC<InfiniteMarqueeProps> = ({
  children,
  direction = 'left',
  speed = 0.8,
  pauseOnHover = true,
  className = '',
  gap = 'gap-5',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const dragDistance = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const scrollX = useRef(0);

  const autoScrollSpeed = direction === 'left' ? speed : -speed;

  // Triple items to ensure seamless infinite loop
  const items = React.Children.toArray(children);
  const tripled = [...items, ...items, ...items];

  const childrenKey = items.length;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let hasInit = false;
    let lastFrameTime = performance.now();

    const loop = (now: number) => {
      if (!el) return;
      const deltaTime = Math.min(now - lastFrameTime, 50);
      lastFrameTime = now;

      const singleWidth = el.scrollWidth / 3;
      if (singleWidth <= 0) {
        animationFrameId.current = requestAnimationFrame(loop);
        return;
      }

      if (!hasInit) {
        scrollX.current = singleWidth;
        el.scrollLeft = Math.round(scrollX.current);
        hasInit = true;
      }

      if (isDragging.current) {
        scrollX.current = el.scrollLeft;
      }

      // Seamless wrap-around
      if (scrollX.current >= singleWidth * 2) {
        scrollX.current -= singleWidth;
        el.scrollLeft = Math.round(scrollX.current);
      } else if (scrollX.current <= singleWidth - 100) {
        scrollX.current += singleWidth;
        el.scrollLeft = Math.round(scrollX.current);
      }

      if (!isDragging.current) {
        if (Math.abs(velocity.current) > 0.05) {
          scrollX.current += velocity.current;
          el.scrollLeft = Math.round(scrollX.current);
          velocity.current *= 0.93;
        } else {
          velocity.current = 0;
          if (!isHovered.current || !pauseOnHover) {
            const spd = autoScrollSpeed * (deltaTime / 16.666);
            scrollX.current += spd;
            el.scrollLeft = Math.round(scrollX.current);
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [autoScrollSpeed, pauseOnHover, childrenKey]);

  const handleStart = (clientX: number) => {
    isDragging.current = true;
    velocity.current = 0;
    startX.current = clientX;
    dragDistance.current = 0;
    if (scrollRef.current) {
      startScrollLeft.current = scrollRef.current.scrollLeft;
      scrollX.current = scrollRef.current.scrollLeft;
    }
    lastX.current = clientX;
    lastTime.current = performance.now();
  };

  const handleMove = (clientX: number) => {
    if (!isDragging.current || !scrollRef.current) return;
    const now = performance.now();
    const dt = now - lastTime.current;
    const dx = clientX - startX.current;
    dragDistance.current = Math.abs(dx);
    scrollX.current = startScrollLeft.current - dx;
    scrollRef.current.scrollLeft = Math.round(scrollX.current);
    if (dt > 0) {
      const inst = -(clientX - lastX.current) / dt * 16.666;
      velocity.current = velocity.current * 0.4 + inst * 0.6;
    }
    lastX.current = clientX;
    lastTime.current = now;
  };

  const handleEnd = () => { isDragging.current = false; };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    handleStart(e.clientX);
    const onMove = (ev: MouseEvent) => handleMove(ev.clientX);
    const onUp = () => {
      handleEnd();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  const onTouchEnd = () => handleEnd();

  return (
    <div
      className={`flex w-full overflow-hidden relative select-none cursor-grab active:cursor-grabbing ${className}`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
    >
      <div
        ref={scrollRef}
        className={`flex whitespace-nowrap overflow-x-hidden scrollbar-none ${gap}`}
        style={{ scrollbarWidth: 'none' }}
      >
        {tripled.map((child, idx) => (
          <div key={idx} className="flex-shrink-0 whitespace-normal">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};
