import React from 'react';
import { FadeIn } from '../FadeIn';
import { FloatingEmoji } from '../FloatingEmoji';
import { VideoProjectRow } from '../VideoProjectRow';
import { defaultData } from '../../lib/store';

const getAssetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${cleanBase}${cleanPath}`;
};

const GLASS_CLAPPERBOARD = getAssetUrl('glass_clapperboard.png');
const GLASS_SPARKLES = getAssetUrl('glass_sparkles.png');

export interface ProjectsSectionProps {
  videoProjects: typeof defaultData.videoProjects;
  onSelectVideo: (video: any) => void;
  theme?: 'light' | 'dark';
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ videoProjects, onSelectVideo, theme = 'dark' }) => {
  const isLight = theme === 'light';

  return (
    <section
      id="videos"
      className={`${isLight ? 'bg-[#FAF9F6] text-[#0C0C0C]' : 'bg-[#0C0C0C] text-[#D7E2EA]'} rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 z-20 px-5 sm:px-8 md:px-10 py-16 sm:py-20 md:py-24 flex flex-col relative overflow-hidden transition-colors duration-500 font-sans`}
    >
      {/* Floating Decorative 3D Glass Assets */}
      <FloatingEmoji src={GLASS_CLAPPERBOARD} alt="Clapperboard" className="top-[20%] left-[2%] sm:left-[4%]" rotation={15} delay={1.8} lightBg={isLight} />
      <FloatingEmoji src={GLASS_SPARKLES} alt="Sparkles" className="bottom-[20%] right-[2%] sm:right-[4%]" rotation={-12} delay={2.0} lightBg={isLight} />

      <div className="max-w-[1400px] mx-auto w-full flex flex-col items-center mb-12 relative z-10 text-center">
        <FadeIn delay={0} y={40}>
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#7621B0] mb-2">Director&apos;s Cut &amp; Post-Production</p>
          <h2 className="font-display font-extrabold uppercase text-[clamp(2.5rem,7.5vw,100px)] leading-none tracking-tight">
            Video Projects
          </h2>
          <p className="font-editorial italic text-lg sm:text-2xl text-[#D7E2EA]/80 mt-3 max-w-2xl mx-auto">
            Celebrity Behind-the-Scenes, High-Energy Music Videos &amp; Viral Cuts
          </p>
        </FadeIn>
      </div>

      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-10 relative z-10">
        {videoProjects && videoProjects.length > 0 ? (
          videoProjects.map((project) => (
            <VideoProjectRow
              key={project.id}
              project={project}
              onSelectVideo={onSelectVideo}
              theme={theme}
            />
          ))
        ) : (
          <div className="text-center text-[#D7E2EA]/30 py-20 italic">No video projects added yet. Add them in the admin dashboard.</div>
        )}
      </div>
    </section>
  );
};
