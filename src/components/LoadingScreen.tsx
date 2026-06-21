import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

// Rapid-fire words like Marvel comic frames
const FLASH_FRAMES = [
  'EDIT', 'CREATE', 'PRODUCE', 'MANAGE',
  'FILM', 'BRAND', 'CONTENT', 'INFLUENCE',
];

const NAME = 'SAHIL THORAT';

type Phase = 'frames' | 'assemble' | 'hold' | 'done';

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<Phase>('frames');
  const [frameIdx, setFrameIdx] = useState(0);
  const [bg, setBg] = useState('#0C0C0C');
  const [visible, setVisible] = useState(true);
  const [flash, setFlash] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;

    // ── Phase 1: Rapid frame flash (Marvel-style) ──────────────────
    let idx = 0;
    const bgColors = ['#0C0C0C', '#0a0a12', '#111', '#0C0C0C', '#0a0814', '#111', '#0C0C0C', '#080808'];

    const frameInterval = setInterval(() => {
      if (idx >= FLASH_FRAMES.length - 1) {
        clearInterval(frameInterval);

        // Short blank between phases
        setTimeout(() => {
          // ── Phase 2: Name assembly ──────────────────────────────
          setPhase('assemble');

          // ── Phase 3: Hold + white flash ────────────────────────
          setTimeout(() => {
            setPhase('hold');
            setTimeout(() => {
              setFlash(true);
              setTimeout(() => {
                doneRef.current = true;
                setVisible(false);
                setTimeout(onComplete, 400); // Matches the 0.4s exit transition duration
              }, 150); // Wait for the white flash to fully cover the screen (150ms)
            }, 900);
          }, NAME.length * 45 + 300);
        }, 80);
      } else {
        idx++;
        setFrameIdx(idx);
        setBg(bgColors[idx % bgColors.length]);
      }
    }, 110); // 110ms per frame — ultra fast

    return () => clearInterval(frameInterval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden select-none"
          style={{ background: bg, transition: 'background 0.05s' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* ── White flash overlay ── */}
          {flash && (
            <motion.div
              className="absolute inset-0 bg-white z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
          )}

          {/* ── Scanlines (cinematic TV effect) ── */}
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-[0.04]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.6) 3px, rgba(255,255,255,0.6) 4px)',
            }}
          />

          {/* ── Phase 1: Rapid word frames ── */}
          {phase === 'frames' && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              {/* Comic-style horizontal bar */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[38vh] bg-white/[0.03] pointer-events-none" />

              <span
                className="font-black uppercase text-white/95 z-10 tracking-tighter text-center leading-none select-none"
                style={{
                  fontFamily: 'Kanit, sans-serif',
                  fontSize: 'clamp(4rem, 18vw, 180px)',
                  textShadow: '0 0 60px rgba(255,255,255,0.15)',
                }}
              >
                {FLASH_FRAMES[frameIdx] ?? ''}
              </span>

              {/* Frame number (bottom right — film feel) */}
              <span
                className="absolute bottom-8 right-8 text-white/20 font-mono text-xs tracking-widest"
              >
                {String(frameIdx + 1).padStart(2, '0')} / {String(FLASH_FRAMES.length).padStart(2, '0')}
              </span>
            </div>
          )}

          {/* ── Phase 2 & 3: Name assembly ── */}
          {(phase === 'assemble' || phase === 'hold') && (
            <div className="flex flex-col items-center gap-5 z-20">
              {/* Letters slamming in */}
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
                              className="inline-block font-black text-white uppercase"
                              style={{
                                fontFamily: 'Kanit, sans-serif',
                                fontSize: 'clamp(2.2rem, 7.5vw, 90px)',
                                letterSpacing: '-0.01em',
                                textShadow: '0 0 40px rgba(187,204,215,0.3)',
                              }}
                            >
                              {letter}
                            </motion.span>
                          );
                        })}
                      </span>
                    );
                    // Add 1 to globalIdx to account for the space between words
                    globalIdx++;
                    return wordEl;
                  });
                })()}
              </div>

              {/* Tagline slides up after letters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAME.length * 0.04 + 0.1, duration: 0.5 }}
                className="flex items-center gap-3 px-4 justify-center"
              >
                <div className="hidden sm:block h-[1px] w-10 bg-[#BBCCD7]/40 shrink-0" />
                <span
                  className="text-[#BBCCD7]/60 text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.4em] font-semibold text-center whitespace-nowrap"
                  style={{ fontFamily: 'Kanit, sans-serif' }}
                >
                  Content Producer · Influencer Marketer
                </span>
                <div className="hidden sm:block h-[1px] w-10 bg-[#BBCCD7]/40 shrink-0" />
              </motion.div>
            </div>
          )}

          {/* ── Ambient corner glows ── */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-700/8 blur-[80px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#BBCCD7]/5 blur-[80px] pointer-events-none rounded-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
