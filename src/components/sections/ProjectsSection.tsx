import React from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { defaultData, getYoutubeThumbnail } from '../../lib/store';

export interface ProjectsSectionProps {
  videoProjects: typeof defaultData.videoProjects;
  onSelectVideo: (video: any) => void;
  theme?: 'light' | 'dark';
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ videoProjects, onSelectVideo }) => {
  // Flatten videos with project metadata for 2-column editorial grid
  const allProjects = (videoProjects || []).flatMap((proj, pIdx) => {
    return (proj.videos || []).map((vid, vIdx) => ({
      ...vid,
      projectId: proj.id,
      category: (proj.tags && proj.tags[0]) || "COMMERCIAL / BTS",
      year: "2024",
      description: proj.description,
      displayTitle: vid.title || proj.title,
      idx: `${pIdx + 1}.${vIdx + 1}`,
    }));
  });

  return (
    <section id="projects" className="py-24 px-6 sm:px-12 md:px-16 bg-[#FFFFFF] text-[#000000] font-sans border-b border-[#000000]/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#000000]/10 pb-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#737373]">Index — 01</span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.05em] leading-[0.9] text-[#000000] mt-2">
              Selected Works
            </h2>
          </div>
          <p className="font-mono text-xs text-[#525252] uppercase tracking-[0.1em] mt-4 md:mt-0">
            [Featured Reel Cuts &amp; Commercial Shoots]
          </p>
        </div>

        {/* Two-Column Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
          {allProjects.map((item, idx) => {
            const thumb = (item as any).thumbnailUrl || item.thumbnail || getYoutubeThumbnail(item.url) || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop";

            return (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => onSelectVideo(item)}
                className="group cursor-pointer flex flex-col"
              >
                {/* 1. 4:3 Aspect Ratio Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-900 border border-[#000000]/10">
                  <img
                    src={thumb}
                    alt={item.displayTitle}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    loading="lazy"
                  />

                  {/* 2. Hover-triggered Overlay (Black at 10% opacity) */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />

                  {/* 3. Top-Right Arrow-Up-Right Icon appearing on hover */}
                  <div className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-xl">
                    <ArrowUpRight size={20} />
                  </div>

                  {/* Center Play badge on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="px-4 py-2 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                      <Play size={12} fill="white" /> Watch Video
                    </span>
                  </div>
                </div>

                {/* 4. Bottom Metadata Row separated by 1px border-top */}
                <div className="mt-5 pt-4 border-t border-[#000000]/10 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl sm:text-[24px] font-bold tracking-[-0.04em] leading-snug text-[#000000] group-hover:text-[#525252] transition-colors duration-300">
                      {item.displayTitle}
                    </h3>
                    <span className="font-mono text-xs sm:text-[14px] uppercase tracking-[0.1em] text-[#737373]">
                      {item.year}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.1em] text-[#737373]">
                    <span>{item.category}</span>
                    <span className="text-[#000000]/40">[REEL CUT]</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
