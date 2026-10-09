import React from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { defaultData, getYoutubeThumbnail } from '../../lib/store';

export interface ProjectsSectionProps {
  videoProjects: typeof defaultData.videoProjects;
  onSelectVideo: (video: any) => void;
  theme?: 'light' | 'dark';
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ videoProjects, onSelectVideo }) => {
  // Flatten videos with project metadata for 3-column feature grid
  const allProjects = (videoProjects || []).flatMap((proj, pIdx) => {
    return (proj.videos || []).map((vid, vIdx) => ({
      ...vid,
      projectId: proj.id,
      category: (proj.tags && proj.tags[0]) || "COMMERCIAL / REEL",
      year: "2024",
      description: proj.description,
      displayTitle: vid.title || proj.title,
      idx: `${pIdx + 1}.${vIdx + 1}`,
    }));
  });

  return (
    <section
      id="projects"
      className="py-24 sm:py-32 px-6 sm:px-10 md:px-14 bg-[#e9edc9] text-[#01472e] font-sans rounded-t-[5rem] -mt-16 sm:-mt-20 relative z-20 shadow-[0_-25px_50px_-12px_rgba(1,71,46,0.15)] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header: Massive Anton display text (15vw) paired with circular CTA */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 sm:mb-24 gap-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#01472e]/70 block mb-2">
              Portfolio Catalog — 01
            </span>
            <h2 className="font-display uppercase text-[15vw] leading-[0.8] tracking-[-0.05em] text-[#01472e]">
              WORKS
            </h2>
          </div>

          {/* Large Circular CTA Button */}
          <div className="flex items-center gap-6 self-start lg:self-end">
            <p className="max-w-xs text-xs sm:text-sm text-[#01472e]/80 leading-relaxed font-normal">
              Commercial promos, celebrity behind-the-scenes shoots, and rhythm-synced post-production reels.
            </p>
            <a
              href="#contact"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#01472e] text-[#fefae0] flex flex-col items-center justify-center p-2 text-center shadow-[0_20px_35px_-10px_rgba(1,71,46,0.35)] hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 group"
            >
              <ArrowUpRight size={22} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] mt-1">
                INQUIRE
              </span>
            </a>
          </div>
        </div>

        {/* 3-Column Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {allProjects.map((item, idx) => {
            const thumb =
              (item as any).thumbnailUrl ||
              item.thumbnail ||
              getYoutubeThumbnail(item.url) ||
              "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop";

            return (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => onSelectVideo(item)}
                className="group cursor-pointer flex flex-col"
              >
                {/* 4/5 Aspect Ratio Image Card with 2.5rem radius */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] bg-[#01472e]/10 border border-[#01472e]/15 shadow-[0_25px_50px_-12px_rgba(1,71,46,0.18)]">
                  <img
                    src={thumb}
                    alt={item.displayTitle}
                    className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    loading="lazy"
                  />

                  {/* Blur-Reveal Button & Overlay */}
                  <div
                    className="absolute inset-0 flex items-end justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      background: 'rgba(1, 71, 46, 0.3)',
                      backdropFilter: 'blur(2px)',
                    }}
                  >
                    <div className="w-full py-4 px-6 rounded-full bg-[#fefae0] text-[#01472e] flex items-center justify-center gap-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-xl">
                      <Play size={14} fill="#01472e" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
                        WATCH FILM
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metadata Row below card */}
                <div className="mt-5 pt-3 border-t border-[#01472e]/15 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#01472e] group-hover:opacity-80 transition-opacity">
                      {item.displayTitle}
                    </h3>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#01472e]/60">
                      {item.year}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.25em] text-[#01472e]/70">
                    <span>{item.category}</span>
                    <span className="text-[#01472e]/40">[REEL ARCHIVE]</span>
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
