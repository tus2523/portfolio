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
  theme?: 'light' | 'dark';
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, theme = 'dark' }) => {
  const isLight = theme === 'light';

  return (
    <section id="skills" className={`${isLight ? 'bg-[#FAF9F6] text-[#0C0C0C]' : 'bg-[#08080A] text-[#D7E2EA]'} py-16 sm:py-20 md:py-24 px-5 sm:px-8 md:px-10 w-full border-t border-white/5 relative z-20 overflow-hidden bg-grid-pattern transition-colors duration-500 font-sans`}>
      <FloatingParticles />
      <FloatingEmoji src={GLASS_SPARKLES} alt="Sparkles" className="top-[20%] left-[3%] sm:left-[6%]" rotation={-12} delay={2.6} lightBg={isLight} />
      <FloatingEmoji src={GLASS_HEART} alt="Heart" className="bottom-[20%] right-[3%] sm:right-[6%]" rotation={15} delay={2.8} lightBg={isLight} />

      <div className="flex flex-col items-center mb-12 text-center relative z-10">
        <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#7621B0] mb-2">Technical Toolkit &amp; Workflow</p>
        <h2 className="font-display font-extrabold uppercase text-[clamp(2.5rem,7.5vw,100px)] leading-none tracking-tight">
          Tools &amp; Expertise
        </h2>
        <p className="font-editorial italic text-lg sm:text-2xl text-[#D7E2EA]/80 mt-3 max-w-2xl mx-auto">
          Post-Production Suites, Camera Operation &amp; Creative Direction
        </p>
      </div>

      {skills && skills.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5 max-w-5xl mx-auto px-4 relative z-10">
          {skills.map((skill) => (
            <FadeIn 
              key={skill} 
              y={15}
              as="div"
              className="px-5 py-3 border bg-[#121214] border-white/10 hover:border-[#7621B0]/60 hover:bg-[#7621B0]/10 text-white rounded-2xl text-xs sm:text-sm font-medium tracking-wide transition duration-300 select-none cursor-default shadow-md"
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
