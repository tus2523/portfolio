import React from 'react';
import { getYoutubeThumbnail } from '../lib/store';
import { Play } from 'lucide-react';

interface AsymmetricalMarqueeProps {
  videos: any[];
  onSelectVideo: (video: any) => void;
}

export const AsymmetricalMarquee: React.FC<AsymmetricalMarqueeProps> = ({ videos, onSelectVideo }) => {
  if (!videos || videos.length === 0) return null;

  // Duplicate list to achieve continuous seamless loop
  const displayVideos = [...videos, ...videos, ...videos];

  const getBorderRadiusClass = (idx: number) => {
    const mod = idx % 3;
    if (mod === 0) return 'rounded-tl-[5rem] rounded-br-[2rem] rounded-tr-[2rem] rounded-bl-[2rem]';
    if (mod === 1) return 'rounded-tr-[5rem] rounded-bl-[3rem] rounded-tl-[2rem] rounded-br-[2rem]';
    return 'rounded-[2.5rem]';
  };

  return (
    <section className="w-full py-20 bg-[var(--theme-card-bg,#e9edc9)] text-[var(--theme-text,#01472e)] overflow-hidden select-none relative z-10 border-t border-current/10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-70">
            Archive Highlights
          </span>
          <h2 className="font-display uppercase text-3xl sm:text-4xl text-[var(--theme-text,#01472e)] tracking-tight mt-1">
            Continuous Motion Reel
          </h2>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-70">
          [Hover to pause • Click to play]
        </span>
      </div>

      <div className="w-full overflow-hidden group/marquee">
        <div
          className="flex gap-8 w-max animate-marquee group-hover/marquee:[animation-play-state:paused]"
          style={{ animationDuration: '30s' }}
        >
          {displayVideos.map((video, idx) => {
            const thumb =
              video.thumbnailUrl ||
              getYoutubeThumbnail(video.url) ||
              video.thumbnail ||
              "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop";
            const radiusClass = getBorderRadiusClass(idx);

            return (
              <div
                key={`${video.id}-${idx}`}
                onClick={() => onSelectVideo(video)}
                className={`w-[270px] sm:w-[310px] aspect-[5/7] flex-shrink-0 relative cursor-pointer overflow-hidden bg-[var(--theme-dark-bg,#01472e)]/20 border border-[var(--theme-dark-bg,#01472e)]/15 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25)] ${radiusClass} group transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2`}
              >
                <img
                  src={thumb}
                  alt={video.title || "Project Video"}
                  className="w-full h-full object-cover scale-100 group-hover:scale-108 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  loading="lazy"
                />

                {/* Organic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-dark-bg,#01472e)]/90 via-[var(--theme-dark-bg,#01472e)]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Card Meta Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-[var(--theme-accent-bg,#fefae0)] flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--theme-footer-text,#ccd5ae)]">
                    {video.projectTitle || "Cinematography"}
                  </span>
                  <h3 className="font-bold text-base sm:text-lg tracking-tight text-[var(--theme-accent-bg,#fefae0)] line-clamp-1">
                    {video.title || "Selected Motion Cut"}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--theme-footer-text,#ccd5ae)] mt-1">
                    <Play size={10} fill="currentColor" />
                    <span>Watch Cut</span>
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
