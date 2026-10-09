import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 850; // smooth and fast ~0.85s

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(currentProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 400);
        }, 150);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col justify-between p-8 sm:p-14 bg-[#ccd5ae] text-[#01472e] font-sans select-none overflow-hidden"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle SVG Noise */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Top Bar */}
          <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-[#01472e]/70 border-b border-[#01472e]/15 pb-4">
            <span>TUSHAR MARU STUDIO</span>
            <span>MUMBAI, MH</span>
          </div>

          {/* Center Brand Name in Anton */}
          <div className="my-auto text-center flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-display uppercase text-6xl sm:text-8xl md:text-9xl leading-[0.85] tracking-[-0.04em] text-[#01472e]"
            >
              TUSHAR MARU
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.3em] text-[#01472e]/70 mt-4"
            >
              FILMMAKER • VIDEOGRAPHER • VIDEO EDITOR
            </motion.p>
          </div>

          {/* Bottom Progress Bar */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#01472e]/80">
              <span>LOADING PRODUCTION ARCHIVE</span>
              <span>{progress}%</span>
            </div>

            <div className="w-full h-1 bg-[#01472e]/15 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#01472e] rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
