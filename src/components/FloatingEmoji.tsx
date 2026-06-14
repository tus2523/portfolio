import React from 'react';
import { motion } from 'framer-motion';

interface FloatingEmojiProps {
  src: string;
  alt: string;
  className: string;
  delay?: number;
  rotation?: number;
  lightBg?: boolean;
}

export const FloatingEmoji: React.FC<FloatingEmojiProps> = ({
  src,
  alt,
  className,
  delay = 0,
  rotation = 0,
  lightBg = false
}) => {
  return (
    <motion.div
      drag
      dragSnapToOrigin={true}
      dragElastic={0.6}
      dragTransition={{ bounceStiffness: 250, bounceDamping: 20 }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay }}
      className={`hidden sm:block absolute select-none z-10 w-[50px] md:w-[120px] lg:w-[160px] aspect-square cursor-grab active:cursor-grabbing touch-none ${className}`}
      style={{
        mixBlendMode: lightBg ? 'multiply' : 'screen',
        filter: lightBg ? 'invert(1)' : 'none',
      }}
    >
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [rotation - 4, rotation + 4, rotation - 4]
        }}
        transition={{
          y: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay
          },
          rotate: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay
          }
        }}
        className="w-full h-full pointer-events-none"
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-contain pointer-events-none" 
          loading="lazy"
        />
      </motion.div>
    </motion.div>
  );
};
