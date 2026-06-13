import React from 'react';
import { FadeIn } from '../FadeIn';
import { FloatingEmoji } from '../FloatingEmoji';
import { FloatingParticles } from '../FloatingParticles';
import { defaultData } from '../../lib/store';

const getAssetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${cleanBase}${cleanPath}`;
};

const GLASS_SPARKLES = getAssetUrl('glass_sparkles.png');
const GLASS_HEART = getAssetUrl('glass_heart.png');

interface SkillsSectionProps {
  skills: typeof defaultData.skills;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  return (
    <section id="skills" className="bg-[#0C0C0C] text-[#D7E2EA] py-16 sm:py-20 md:py-24 px-5 sm:px-8 md:px-10 w-full border-t border-white/5 relative z-20 overflow-hidden bg-grid-pattern">
      <FloatingParticles />
      {/* Floating Decorative 3D Glass Assets */}
      <FloatingEmoji src={GLASS_SPARKLES} alt="Sparkles" className="top-[20%] left-[3%] sm:left-[6%]" rotation={-12} delay={2.6} />
      <FloatingEmoji src={GLASS_HEART} alt="Heart" className="bottom-[20%] right-[3%] sm:right-[6%]" rotation={15} delay={2.8} />

      <div className="flex flex-col items-center mb-10 text-center">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#D7E2EA]/40 mb-2">What I bring to the table</p>
        <h2 className="hero-heading font-black uppercase text-[clamp(2.5rem,7.5vw,110px)] leading-none tracking-wide">
          Skills & Expertise
        </h2>
      </div>
      {skills && skills.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 max-w-6xl mx-auto px-4">
          {skills.map((skill) => (
            <FadeIn 
              key={skill} 
              y={15}
              as="div"
              className="px-4 py-2.5 sm:px-6 sm:py-3.5 bg-white/5 border border-white/10 hover:border-[#BBCCD7]/40 hover:text-white rounded-full text-xs sm:text-sm font-semibold tracking-wide transition duration-300 select-none text-[#D7E2EA]/85 cursor-default flex items-center justify-center"
            >
              {skill}
            </FadeIn>
          ))}
        </div>
      ) : (
        <div className="text-center text-[#D7E2EA]/30 py-8 italic">No skills added.</div>
      )}
    </section>
  );
};
