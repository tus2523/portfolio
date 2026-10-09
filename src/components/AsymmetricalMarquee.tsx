import React from 'react';
import { getYoutubeThumbnail } from '../lib/store';

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
    if (mod === 0) return 'rounded-tl-[100px] rounded-br-[16px] rounded-tr-[16px] rounded-bl-[16px]';
    if (mod === 1) return 'rounded-tr-[100px] rounded-bl-[40px] rounded-tl-[16px] rounded-br-[16px]';
    return 'rounded-[40px]';
  };

  return (
    <section className="w-full py-16 bg-[#FFFFFF] overflow-hidden border-y border-[#000000]/10 select-none">
      <div className="max-w-7xl mx-auto px-6 mb-8 flex justify-between items-end">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#737373]">Featured Reel Highlights</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000] mt-1">Continuous Motion Archive</h2>
        </div>
        <span className="hidden sm:inline-block font-mono text-xs text-[#737373] uppercase tracking-[0.1em]">Hover to pause / click to view</span>
      </div>

      <div className="w-full overflow-hidden group/marquee">
        <div
          className="flex gap-6 w-max animate-marquee group-hover/marquee:[animation-play-state:paused]"
          style={{ animationDuration: '30s' }}
        >
          {displayVideos.map((video, idx) => {
            const thumb = video.thumbnailUrl || getYoutubeThumbnail(video.url) || video.thumbnail || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop";
            const radiusClass = getBorderRadiusClass(idx);

            return (
              <div
                key={`${video.id}-${idx}`}
                onClick={() => onSelectVideo(video)}
                className={`w-[260px] sm:w-[290px] aspect-[5/7] flex-shrink-0 relative cursor-pointer overflow-hidden bg-neutral-900 border border-[#000000]/10 shadow-lg ${radiusClass} group transition-transform duration-500 hover:-translate-y-2`}
              >
                <img
                  src={thumb}
                  alt={video.title || "Project Video"}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  loading="lazy"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                {/* Card Meta Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/70">
                    {video.projectTitle || "Motion Work"}
                  </span>
                  <h3 className="text-base font-bold tracking-tight text-white line-clamp-1">
                    {video.title || "Cinematic Cut"}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/50 mt-1 uppercase tracking-wider">
                    <span>▶ Watch Reel</span>
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
