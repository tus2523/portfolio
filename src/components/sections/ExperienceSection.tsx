import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import { defaultData } from '../../lib/store';

interface ExperienceSectionProps {
  experience: typeof defaultData.experience;
  theme?: 'light' | 'dark';
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  const [activeExp, setActiveExp] = useState<any | null>(null);

  useEffect(() => {
    if (activeExp) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [activeExp]);

  return (
    <section
      id="experience"
      className="py-24 sm:py-32 px-6 sm:px-10 md:px-14 bg-[#ccd5ae] text-[#01472e] font-sans rounded-t-[5rem] relative z-20 shadow-[0_-25px_50px_-12px_rgba(1,71,46,0.15)] overflow-hidden"
    >
      <div className="max-w-5xl mx-auto flex flex-col">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 sm:mb-20 border-b border-[#01472e]/15 pb-8 gap-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#01472e]/70 block mb-2">
              Career Trajectory — 05
            </span>
            <h2 className="font-display uppercase text-[15vw] leading-[0.8] tracking-[-0.05em] text-[#01472e]">
              TIMELINE
            </h2>
          </div>

          <p className="max-w-xs text-xs sm:text-sm text-[#01472e]/80 leading-relaxed font-normal self-start lg:self-end">
            Track record across camera direction, celebrity BTS projects, and high-retention video editing.
          </p>
        </div>

        {experience && experience.length > 0 ? (
          <div className="max-w-4xl mx-auto w-full relative pl-4 sm:pl-8">
            {/* Vertical timeline axis */}
            <div className="absolute left-[20px] sm:left-[28px] top-3 bottom-3 w-[2px] bg-[#01472e]/20" />

            <div className="flex flex-col gap-8">
              {experience.map((ex) => (
                <div key={ex.id} className="relative pl-8 sm:pl-12 group">
                  {/* Timeline node */}
                  <div className="absolute left-[-2px] sm:left-[6px] top-2 w-6 h-6 rounded-full bg-[#fefae0] border-2 border-[#01472e] flex items-center justify-center shadow-md group-hover:scale-125 transition-transform duration-300">
                    <div className="w-2 h-2 rounded-full bg-[#01472e]" />
                  </div>

                  <div
                    onClick={() => setActiveExp(ex)}
                    className="bg-[#fefae0] border border-[#01472e]/15 hover:border-[#01472e]/40 p-8 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(1,71,46,0.12)] transition-all duration-500 cursor-pointer hover:-translate-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#01472e] flex items-center gap-2">
                        <Calendar size={13} /> {ex.year}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#01472e]/50">
                        CLICK FOR DETAILS →
                      </span>
                    </div>

                    <h3 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-[#01472e] group-hover:opacity-85 transition-opacity">
                      {ex.role}
                    </h3>

                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#01472e]/70 mt-1 flex items-center gap-2">
                      <Briefcase size={13} />
                      {ex.company}
                    </p>

                    <p className="text-xs sm:text-sm text-[#01472e]/80 mt-4 font-normal leading-relaxed">
                      {ex.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-[#01472e]/40 py-12 uppercase tracking-widest text-xs">
            No experience listed.
          </div>
        )}
      </div>

      {/* Experience Details Modal (PORTALED to document.body) */}
      <AnimatePresence>
        {activeExp && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveExp(null)}
              className="absolute inset-0 bg-[#01472e]/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl bg-[#fefae0] border border-[#01472e]/20 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] z-10 flex flex-col gap-6 text-[#01472e]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#01472e]/60">
                    {activeExp.year} • {activeExp.company}
                  </span>
                  <h3 className="font-display uppercase text-3xl text-[#01472e] tracking-tight mt-1">
                    {activeExp.role}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveExp(null)}
                  className="w-10 h-10 rounded-full bg-[#01472e]/10 hover:bg-[#01472e] text-[#01472e] hover:text-[#fefae0] flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="text-sm font-normal leading-relaxed text-[#01472e]/85 whitespace-pre-line border-t border-[#01472e]/15 pt-5">
                {activeExp.description}
              </div>

              <button
                onClick={() => setActiveExp(null)}
                className="w-full mt-2 py-4 rounded-full bg-[#01472e] text-[#fefae0] text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[#023321] transition"
              >
                CLOSE
              </button>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </section>
  );
};
