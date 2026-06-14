import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
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

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience, theme = 'light' }) => {
  const [activeExp, setActiveExp] = useState<any | null>(null);
  const isLight = theme === 'light';

  return (
    <section id="experience" className={`${isLight ? 'bg-texture-paper text-[#0C0C0C] border-[#0C0C0C]/5' : 'bg-texture-metal text-[#D7E2EA] border-white/5'} py-16 sm:py-20 md:py-24 px-5 sm:px-8 md:px-10 w-full relative z-20 border-t shadow-inner overflow-hidden transition-colors duration-500`}>
      {/* Floating Decorative 3D Glass Assets */}
      <FloatingEmoji src={GLASS_CAMERA} alt="Camera" className="top-[30%] left-[2%] sm:left-[4%]" rotation={-8} delay={2.2} lightBg={isLight} />
      <FloatingEmoji src={GLASS_MEGAPHONE} alt="Megaphone" className="bottom-[30%] right-[2%] sm:right-[4%]" rotation={12} delay={2.4} lightBg={isLight} />

      <div className="max-w-5xl mx-auto flex flex-col items-center mb-12 text-center">
        <p className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold ${isLight ? 'text-[#0C0C0C]/50' : 'text-[#D7E2EA]/40'} mb-2`}>My Career Journey</p>
        <h2 className={`font-black uppercase ${isLight ? 'text-[#0C0C0C]' : 'text-[#D7E2EA]'} text-[clamp(2.5rem,7.5vw,110px)] leading-none tracking-wide transition-colors duration-500`}>
          Experience
        </h2>
      </div>
      
      {experience && experience.length > 0 ? (
        <div className="max-w-5xl mx-auto relative pl-4 sm:pl-8">
          {/* Vertical Timeline Axis Line */}
          <div className={`absolute left-[20px] sm:left-[28px] top-2 bottom-2 w-[1px] ${isLight ? 'bg-[#0C0C0C]/15' : 'bg-white/15'}`} />
          
          <div className="flex flex-col gap-8">
            {experience.map((ex) => (
              <div key={ex.id} className="relative pl-8 sm:pl-12 group">
                {/* Timeline Node Bullet */}
                <div className={`absolute left-[15px] sm:left-[23px] top-[26px] w-[11px] h-[11px] rounded-full border z-10 group-hover:scale-125 transition duration-300 ${
                  isLight 
                    ? 'bg-[#0C0C0C] border-white shadow-[0_0_8px_rgba(12,12,12,0.25)] group-hover:bg-[#BBCCD7]' 
                    : 'bg-[#D7E2EA] border-[#0C0C0C] shadow-[0_0_8px_rgba(255,255,255,0.15)] group-hover:bg-white'
                }`} />
                
                {/* Timeline Card */}
                <motion.div
                  onClick={() => setActiveExp(ex)}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="bg-white/85 border border-white/90 rounded-[22px] p-6 premium-shadow-sm hover-card-glow hover:bg-white cursor-pointer transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-[#0C0C0C]/55 tracking-wider uppercase block">
                      {ex.year}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#0C0C0C]/30 group-hover:text-[#0C0C0C]/55 transition">
                      View details →
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#0C0C0C] uppercase leading-tight tracking-wide mb-0.5">
                    {ex.role}
                  </h3>
                  <span className="text-xs uppercase font-semibold text-[#0C0C0C]/40 block mb-3">
                    {ex.company}
                  </span>
                  <p className="text-xs sm:text-sm font-light leading-relaxed text-[#0C0C0C]/75 max-w-3xl line-clamp-2">
                    {ex.description}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-[#0C0C0C]/45 py-8 italic">No experience records set.</div>
      )}

      {/* Experience detail modal popup */}
      <AnimatePresence>
        {activeExp && (
          <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setActiveExp(null)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-full max-w-lg bg-[#121212] border border-white/10 rounded-[32px] p-6 sm:p-8 flex flex-col gap-6 relative shadow-2xl z-10 text-[#D7E2EA]"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveExp(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition text-[#D7E2EA]/60 hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Briefcase size={22} className="text-[#BBCCD7]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-[#BBCCD7]/40 font-bold">Role & Company</span>
                  <h3 className="text-base sm:text-lg font-bold uppercase text-white tracking-wide">{activeExp.role}</h3>
                  <span className="text-xs font-semibold text-[#BBCCD7]/60">{activeExp.company}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-[#D7E2EA]/60 border-t border-b border-white/5 py-4">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#BBCCD7]" /> {activeExp.year}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#BBCCD7]" /> Mumbai, India
                </span>
              </div>

              <p className="text-xs sm:text-sm font-light leading-relaxed text-[#D7E2EA]/85">
                {activeExp.description}
              </p>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setActiveExp(null)}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-wider text-[#D7E2EA] hover:bg-white/10 transition"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
