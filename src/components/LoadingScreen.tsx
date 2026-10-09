import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

// Rapid-fire words for videographer & cinematic editor
const FLASH_FRAMES = [
  'SHOOT', 'DIRECT', 'CAPTURE', 'EDIT',
  'CUT', 'COLOR', 'PREMIERE', 'CINEMA',
];

const NAME = 'TUSHAR MARU';

type Phase = 'frames' | 'assemble' | 'hold' | 'done';

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<Phase>('frames');
  const [frameIdx, setFrameIdx] = useState(0);
  const [bg, setBg] = useState('#08080A');
  const [visible, setVisible] = useState(true);
  const [flash, setFlash] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;

    let idx = 0;
    const bgColors = ['#08080A', '#0b0914', '#0d0d12', '#08080A', '#100a1c', '#0d0d12', '#08080A', '#060608'];

    const frameInterval = setInterval(() => {
      if (idx >= FLASH_FRAMES.length - 1) {
        clearInterval(frameInterval);

        setTimeout(() => {
          setPhase('assemble');

          setTimeout(() => {
            setPhase('hold');
            setTimeout(() => {
              setFlash(true);
              setTimeout(() => {
                doneRef.current = true;
                setVisible(false);
                setTimeout(onComplete, 400);
              }, 150);
            }, 900);
          }, NAME.length * 45 + 300);
        }, 80);
      } else {
        idx++;
        setFrameIdx(idx);
        setBg(bgColors[idx % bgColors.length]);
      }
    }, 110);

    return () => clearInterval(frameInterval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden select-none font-sans"
          style={{ background: bg, transition: 'background 0.05s' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        >
          {flash && (
            <motion.div
              className="absolute inset-0 bg-white z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
          )}

          {/* Film scanlines */}
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-[0.04]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.6) 3px, rgba(255,255,255,0.6) 4px)',
            }}
          />

          {/* Phase 1: Rapid word frames */}
          {phase === 'frames' && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[38vh] bg-white/[0.02] pointer-events-none" />

              <span
                className="font-display font-black uppercase text-white/95 z-10 tracking-tighter text-center leading-none select-none"
                style={{
                  fontSize: 'clamp(4rem, 18vw, 180px)',
                  textShadow: '0 0 60px rgba(118,33,176,0.3)',
                }}
              >
                {FLASH_FRAMES[frameIdx] ?? ''}
              </span>

              {/* Timecode counter */}
              <span className="absolute bottom-8 right-8 text-[#7621B0]/60 font-mono text-xs tracking-widest">
                REC ● 00:0{frameIdx}:1{frameIdx} / 24FPS
              </span>
            </div>
          )}

          {/* Phase 2 & 3: Name assembly */}
          {(phase === 'assemble' || phase === 'hold') && (
            <div className="flex flex-col items-center gap-5 z-20">
              <div 
                className="flex flex-wrap justify-center leading-none gap-x-[0.35em] md:gap-x-[0.4em]" 
                aria-label={NAME}
              >
                {(() => {
                  let globalIdx = 0;
                  return NAME.split(' ').map((word, wordIdx) => {
                    const letters = word.split('');
                    const wordEl = (
                      <span key={wordIdx} className="inline-flex whitespace-nowrap">
                        {letters.map((letter) => {
                          const currentIdx = globalIdx;
                          globalIdx++;
                          return (
                            <motion.span
                              key={currentIdx}
                              initial={{ opacity: 0, y: -80, rotateX: -90 }}
                              animate={{ opacity: 1, y: 0, rotateX: 0 }}
                              transition={{
                                delay: currentIdx * 0.04,
                                duration: 0.35,
                                type: 'spring',
                                stiffness: 280,
                                damping: 22,
                              }}
                              className="inline-block font-display font-extrabold text-white uppercase tracking-tight"
                              style={{
                                fontSize: 'clamp(2.5rem, 8vw, 95px)',
                                textShadow: '0 0 40px rgba(118,33,176,0.4)',
                              }}
                            >
                              {letter}
                            </motion.span>
                          );
                        })}
                      </span>
                    );
                    globalIdx++;
                    return wordEl;
                  });
                })()}
              </div>

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAME.length * 0.04 + 0.1, duration: 0.5 }}
                className="flex items-center gap-3 px-4 justify-center"
              >
                <div className="hidden sm:block h-[1px] w-10 bg-[#7621B0]/40 shrink-0" />
                <span className="text-[#D7E2EA]/70 text-[9px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.4em] font-semibold text-center whitespace-nowrap">
                  Videographer · Video Editor · Associate Director
                </span>
                <div className="hidden sm:block h-[1px] w-10 bg-[#7621B0]/40 shrink-0" />
              </motion.div>
            </div>
          )}

          {/* Ambient corner glows */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#7621B0]/10 blur-[80px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-900/10 blur-[80px] pointer-events-none rounded-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
