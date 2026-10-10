import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, Play, ArrowUpRight } from 'lucide-react';
import { defaultData, getYoutubeThumbnail } from '../../lib/store';

export interface ProjectsSectionProps {
  videoProjects: typeof defaultData.videoProjects;
  onSelectVideo: (video: any) => void;
  theme?: 'light' | 'dark';
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ videoProjects, onSelectVideo }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Flatten videos with project metadata for horizontal scrolling showcase
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -460 : 460;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="projects"
      className="py-28 sm:py-36 px-6 sm:px-10 md:px-14 bg-[var(--theme-card-bg,#e9edc9)] text-[var(--theme-text,#01472e)] font-sans rounded-t-[5rem] relative z-20 shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 sm:mb-20 gap-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-70 block mb-4 sm:mb-6">
              Portfolio Catalog — 01
            </span>
            <h2 className="font-display uppercase text-[clamp(3.5rem,13vw,170px)] leading-[0.92] tracking-[-0.04em] text-[var(--theme-text,#01472e)]">
              WORKS
            </h2>
          </div>

          {/* Navigation Controls & Description */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 self-start lg:self-end">
            <p className="max-w-xs text-xs sm:text-sm opacity-80 leading-relaxed font-normal">
              Commercial promos, celebrity BTS shoots, viral comic reels, and rhythmic music cuts.
            </p>

            {/* Left & Right Arrow Scroll Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-14 h-14 rounded-full bg-[var(--theme-accent-bg,#fefae0)] text-[var(--theme-text,#01472e)] border border-current/20 flex items-center justify-center hover:bg-[var(--theme-dark-bg,#01472e)] hover:text-[var(--theme-accent-bg,#fefae0)] transition-colors duration-300 shadow-md"
                aria-label="Scroll Left"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-14 h-14 rounded-full bg-[var(--theme-dark-bg,#01472e)] text-[var(--theme-accent-bg,#fefae0)] flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-md"
                aria-label="Scroll Right"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Status Hint */}
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.25em] opacity-60 mb-6 border-b border-current/15 pb-3">
          <span>{allProjects.length} CURATED PROJECTS</span>
          <span className="hidden sm:inline-block">← SCROLL LEFT TO RIGHT →</span>
        </div>

        {/* ── Left-to-Right Horizontal Scrolling Showcase ── */}
        <div
          ref={scrollContainerRef}
          className="flex gap-8 sm:gap-10 overflow-x-auto pb-8 pt-2 scroll-smooth select-none snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
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
                className="w-[300px] sm:w-[360px] md:w-[400px] shrink-0 group cursor-pointer flex flex-col snap-start"
              >
                {/* 4/5 Aspect Ratio Image Card with 2.5rem radius */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] bg-current/10 border border-current/15 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]">
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
                      background: 'rgba(0, 0, 0, 0.4)',
                      backdropFilter: 'blur(2px)',
                    }}
                  >
                    <div className="w-full py-4 px-6 rounded-full bg-[var(--theme-accent-bg,#fefae0)] text-[var(--theme-text,#01472e)] flex items-center justify-center gap-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-xl">
                      <Play size={14} fill="currentColor" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
                        WATCH FILM
                      </span>
                    </div>
                  </div>

                  {/* Top-Right Direct Play Badge */}
                  <div className="absolute top-5 right-5 w-11 h-11 rounded-full bg-[var(--theme-accent-bg,#fefae0)] text-[var(--theme-text,#01472e)] flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                {/* Metadata Row below card */}
                <div className="mt-5 pt-3 border-t border-current/15 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[var(--theme-text,#01472e)] group-hover:opacity-80 transition-opacity line-clamp-1">
                      {item.displayTitle}
                    </h3>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-60 shrink-0 ml-2">
                      {item.year}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.25em] opacity-70">
                    <span>{item.category}</span>
                    <span className="opacity-50">[REEL CUT]</span>
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
