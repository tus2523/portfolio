import React from 'react';
import { motion } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: string;
  className?: string;
  style?: React.CSSProperties;
}

const motionComponents: Record<string, any> = {
  div: motion.div,
  nav: motion.nav,
  p: motion.p,
  section: motion.section,
  span: motion.span,
};

const VIEWPORT_CONFIG = { once: true, margin: "50px", amount: 0 };
const WHILE_IN_VIEW_CONFIG = { opacity: 1, x: 0, y: 0 };

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className = '',
  style
}) => {
  const Component = motionComponents[as] || motion.div;

  return (
    <Component
      initial={{ opacity: 0, x, y }}
      whileInView={WHILE_IN_VIEW_CONFIG}
      viewport={VIEWPORT_CONFIG}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
};
