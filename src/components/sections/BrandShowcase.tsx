import React from 'react';
import { defaultData } from '../../lib/store';
import { Star, Sparkles, Award } from 'lucide-react';

interface BrandShowcaseProps {
  data: typeof defaultData;
}

export const BrandShowcase: React.FC<BrandShowcaseProps> = ({ data }) => {
  const brands = data.brands || [
    'Zudio', 'Denver', 'Bewakoof', 'Maybelline', 'Godrej Fashion Week',
    'Chk Shoes', 'Wtflex', 'BharatMatrimony', 'Zee Cinema Awards 2025',
    'Off Campus', 'Newme', 'Khelo India'
  ];

  const celebrities = data.celebrities || [
    'Arijit Singh', 'Divine', 'Fukra Insaan', 'Palak Muchhal', 'Neha Bhasin', 'Monali Thakur'
  ];

  const marqueeBrands = [...brands, ...brands, ...brands, ...brands];
  const marqueeCelebs = [...celebrities, ...celebrities, ...celebrities, ...celebrities];

  return (
    <section className="py-20 sm:py-28 px-6 sm:px-10 md:px-14 bg-[#01472e] text-[#fefae0] font-sans relative z-20 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto mb-12 sm:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#ccd5ae]/20 pb-8 gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ccd5ae]/70 block mb-2">
              Industry Credits &amp; Collaborations
            </span>
            <h2 className="font-display uppercase text-4xl sm:text-6xl md:text-7xl leading-[0.9] tracking-[-0.03em] text-[#fefae0]">
              CLIENTS &amp; ARTISTS
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm text-[#ccd5ae]/80 font-normal leading-relaxed">
            Trusted by top retail brands, fashion weeks, national sports games, and leading Indian musical artists for high-impact videography and precision post-production.
          </p>
        </div>
      </div>

      {/* Marquee Row 1: Brand & Campaign Partners */}
      <div className="w-full overflow-hidden mb-6 group/btrack">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ccd5ae]/60 max-w-7xl mx-auto px-2 mb-3 flex items-center gap-2">
          <Award size={13} className="text-[#ccd5ae]" />
          <span>Commercial Brands &amp; Major Events</span>
        </div>
        <div
          className="flex gap-4 sm:gap-6 w-max animate-marquee group-hover/btrack:[animation-play-state:paused]"
          style={{ animationDuration: '32s' }}
        >
          {marqueeBrands.map((brand, idx) => (
            <div
              key={`brand-${idx}`}
              className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#fefae0]/10 border border-[#ccd5ae]/20 text-[#fefae0] hover:bg-[#fefae0] hover:text-[#01472e] transition-colors duration-300 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#ccd5ae]" />
              <span className="font-display uppercase tracking-wide text-sm sm:text-base whitespace-nowrap">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row 2: Celebrity & Artist Collaborations */}
      <div className="w-full overflow-hidden group/ctrack pt-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ccd5ae]/60 max-w-7xl mx-auto px-2 mb-3 flex items-center gap-2">
          <Sparkles size={13} className="text-[#ccd5ae]" />
          <span>Celebrity BTS &amp; Music Collaborations</span>
        </div>
        <div
          className="flex gap-4 sm:gap-6 w-max animate-marquee group-hover/ctrack:[animation-play-state:paused]"
          style={{ animationDuration: '28s', animationDirection: 'reverse' }}
        >
          {marqueeCelebs.map((celeb, idx) => (
            <div
              key={`celeb-${idx}`}
              className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#ccd5ae]/15 border border-[#ccd5ae]/30 text-[#ccd5ae] hover:bg-[#ccd5ae] hover:text-[#01472e] transition-colors duration-300 shadow-sm"
            >
              <Star size={13} className="text-[#fefae0] fill-[#fefae0]" />
              <span className="font-display uppercase tracking-wide text-sm sm:text-base whitespace-nowrap">
                {celeb}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
