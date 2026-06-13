import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxEmojiProps {
  src: string;
  alt: string;
  className: string;
  delay?: number;
  rotation?: number;
  parallaxY?: number;
}

export const ParallaxEmoji: React.FC<ParallaxEmojiProps> = ({
  src,
  alt,
  className,
  delay = 0,
  rotation = 0,
  parallaxY = -80
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, parallaxY]);

  return (
    <motion.div
      drag
      dragSnapToOrigin={true}
      dragElastic={0.6}
      dragTransition={{ bounceStiffness: 250, bounceDamping: 20 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay }}
      className={`absolute select-none z-10 w-[50px] md:w-[120px] lg:w-[160px] aspect-square cursor-grab active:cursor-grabbing touch-none ${className}`}
      style={{ y, mixBlendMode: 'screen' }}
    >
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [rotation - 4, rotation + 4, rotation - 4] }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay },
          rotate: { duration: 8, repeat: Infinity, ease: 'easeInOut', delay },
        }}
        className="w-full h-full pointer-events-none"
      >
        <img src={src} alt={alt} className="w-full h-full object-contain pointer-events-none" loading="lazy" />
      </motion.div>
    </motion.div>
  );
};
