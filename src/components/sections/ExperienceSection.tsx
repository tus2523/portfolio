import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import { FloatingEmoji } from '../FloatingEmoji';
import { defaultData } from '../../lib/store';

const getAssetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${cleanBase}${cleanPath}`;
};

const GLASS_CAMERA = getAssetUrl('glass_camera.png');
const GLASS_MEGAPHONE = getAssetUrl('glass_megaphone.png');

interface ExperienceSectionProps {
  experience: typeof defaultData.experience;
  theme?: 'light' | 'dark';
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience, theme = 'dark' }) => {
  const [activeExp, setActiveExp] = useState<any | null>(null);
  const isLight = theme === 'light';

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
    <section id="experience" className={`${isLight ? 'bg-[#FAF9F6] text-[#0C0C0C] border-[#0C0C0C]/5' : 'bg-[#08080A] text-[#D7E2EA] border-white/5'} py-16 sm:py-20 md:py-24 px-5 sm:px-8 md:px-10 w-full relative ${activeExp ? 'z-[99999]' : 'z-20'} border-t shadow-inner overflow-hidden transition-colors duration-500 font-sans`}>
      <FloatingEmoji src={GLASS_CAMERA} alt="Camera" className="top-[30%] left-[2%] sm:left-[4%]" rotation={-8} delay={2.2} lightBg={isLight} />
      <FloatingEmoji src={GLASS_MEGAPHONE} alt="Megaphone" className="bottom-[30%] right-[2%] sm:right-[4%]" rotation={12} delay={2.4} lightBg={isLight} />

      <div className="max-w-5xl mx-auto flex flex-col items-center mb-12 text-center relative z-10">
        <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#7621B0] mb-2">Production Timeline</p>
        <h2 className="font-display font-extrabold uppercase text-[clamp(2.5rem,7.5vw,100px)] leading-none tracking-tight">
          Work Experience
        </h2>
        <p className="font-editorial italic text-lg sm:text-2xl text-[#D7E2EA]/80 mt-3 max-w-2xl mx-auto">
          On-Set Shoots, Film Post-Production &amp; Operational Direction
        </p>
      </div>
      
      {experience && experience.length > 0 ? (
        <div className="max-w-4xl mx-auto relative pl-4 sm:pl-8 z-10">
          {/* Vertical timeline filmstrip axis */}
          <div className="absolute left-[20px] sm:left-[28px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#7621B0] via-purple-500/40 to-transparent" />
          
          <div className="flex flex-col gap-8">
            {experience.map((ex) => (
              <div key={ex.id} className="relative pl-8 sm:pl-12 group">
                {/* Timeline node */}
                <div className="absolute left-[-2px] sm:left-[6px] top-1.5 w-6 h-6 rounded-full bg-[#121214] border-2 border-[#7621B0] flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform duration-300">
                  <div className="w-2 h-2 rounded-full bg-[#7621B0]" />
                </div>

                <div 
                  onClick={() => setActiveExp(ex)}
                  className="bg-[#121214] border border-white/5 hover:border-[#7621B0]/50 p-6 rounded-2xl transition duration-300 shadow-xl cursor-pointer hover:-translate-y-1"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-[#7621B0] uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar size={13} /> {ex.year}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#D7E2EA]/40">
                      Click for details →
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-display uppercase tracking-wide text-white group-hover:text-[#7621B0] transition">
                    {ex.role}
                  </h3>

                  <p className="text-xs text-[#D7E2EA]/60 font-medium mt-0.5 flex items-center gap-1.5">
                    <Briefcase size={12} className="text-[#7621B0]" />
                    {ex.company}
                  </p>

                  <p className="text-xs sm:text-sm text-[#D7E2EA]/70 mt-3 font-light leading-relaxed">
                    {ex.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-[#D7E2EA]/30 py-12 italic">No experience added yet.</div>
      )}

      {/* Experience Detail Modal */}
      <AnimatePresence>
        {activeExp && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveExp(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#121214] border border-[#7621B0]/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 flex flex-col gap-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono font-bold text-[#7621B0] uppercase">{activeExp.year}</span>
                  <h3 className="text-2xl font-bold font-display uppercase text-white tracking-wide mt-1">{activeExp.role}</h3>
                  <p className="text-xs text-[#D7E2EA]/60 font-medium">{activeExp.company}</p>
                </div>
                <button
                  onClick={() => setActiveExp(null)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D7E2EA]/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="text-sm font-light leading-relaxed text-[#D7E2EA]/80 whitespace-pre-line border-t border-white/5 pt-4">
                {activeExp.description}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveExp(null)}
                  className="w-full bg-[#7621B0] hover:bg-[#611a93] text-white font-semibold py-2.5 rounded-xl text-xs uppercase tracking-wider transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
