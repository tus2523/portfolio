import React from 'react';
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
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  return (
    <section id="experience" className="bg-[#F8F9FA] text-[#0C0C0C] py-16 sm:py-20 md:py-24 px-5 sm:px-8 md:px-10 w-full relative z-20 border-t border-[#0C0C0C]/5 shadow-inner overflow-hidden">
      {/* Floating Decorative 3D Glass Assets */}
      <FloatingEmoji src={GLASS_CAMERA} alt="Camera" className="top-[30%] left-[2%] sm:left-[4%]" rotation={-8} delay={2.2} lightBg={true} />
      <FloatingEmoji src={GLASS_MEGAPHONE} alt="Megaphone" className="bottom-[30%] right-[2%] sm:right-[4%]" rotation={12} delay={2.4} lightBg={true} />

      <div className="max-w-5xl mx-auto flex flex-col items-center mb-12 text-center">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#0C0C0C]/50 mb-2">My Career Journey</p>
        <h2 className="font-black uppercase text-[#0C0C0C] text-[clamp(2.5rem,7.5vw,110px)] leading-none tracking-wide">
          Experience
        </h2>
      </div>
      
      {experience && experience.length > 0 ? (
        <div className="max-w-5xl mx-auto relative pl-4 sm:pl-8">
          {/* Vertical Timeline Axis Line */}
          <div className="absolute left-[20px] sm:left-[28px] top-2 bottom-2 w-[1px] bg-[#0C0C0C]/15" />
          
          <div className="flex flex-col gap-8">
            {experience.map((ex) => (
              <div key={ex.id} className="relative pl-8 sm:pl-12 group">
                {/* Timeline Node Bullet */}
                <div className="absolute left-[15px] sm:left-[23px] top-[26px] w-[11px] h-[11px] bg-[#0C0C0C] rounded-full border border-white shadow-[0_0_8px_rgba(12,12,12,0.25)] z-10 group-hover:scale-125 group-hover:bg-[#BBCCD7] transition duration-300" />
                
                {/* Timeline Card */}
                <div className="bg-white/85 border border-white/90 rounded-[22px] p-6 premium-shadow-sm hover-card-glow hover:bg-white hover:-translate-y-0.5 transition duration-300">
                  <span className="text-xs font-bold text-[#0C0C0C]/55 tracking-wider uppercase block mb-1">
                    {ex.year}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#0C0C0C] uppercase leading-tight tracking-wide mb-0.5">
                    {ex.role}
                  </h3>
                  <span className="text-xs uppercase font-semibold text-[#0C0C0C]/40 block mb-3">
                    {ex.company}
                  </span>
                  <p className="text-xs sm:text-sm font-light leading-relaxed text-[#0C0C0C]/75 max-w-3xl">
                    {ex.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-[#0C0C0C]/45 py-8 italic">No experience records set.</div>
      )}
    </section>
  );
};
