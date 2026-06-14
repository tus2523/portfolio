import React from 'react';
import { FadeIn } from '../FadeIn';
import { defaultData } from '../../lib/store';
import { Star } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: typeof defaultData.reviews;
  theme?: 'light' | 'dark';
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, theme = 'dark' }) => {
  const approvedReviews = (reviews || []).filter(r => r.status === 'approved');
  const isLight = theme === 'light';

  return (
    <section id="reviews" className={`${isLight ? 'bg-texture-paper text-[#0C0C0C]' : 'bg-texture-metal text-[#D7E2EA]'} py-16 sm:py-20 md:py-24 px-0 w-full border-t border-white/5 relative z-20 overflow-hidden transition-colors duration-500`}>
      <div className="max-w-[1400px] mx-auto w-full flex flex-col items-center px-5 sm:px-8 md:px-10">
        <FadeIn delay={0} y={40} className="mb-12 text-center">
          <p className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold ${isLight ? 'text-[#0C0C0C]/55' : 'text-[#D7E2EA]/40'} mb-2`}>What they say</p>
          <h2 className={`hero-heading font-black uppercase text-[clamp(2.5rem,7.5vw,110px)] leading-none tracking-wide ${isLight ? 'text-[#0C0C0C]' : 'text-[#D7E2EA]'} transition-colors duration-500`}>
            Client Reviews
          </h2>
        </FadeIn>
      </div>

      {/* Reviews Marquee */}
      {approvedReviews.length > 0 && (
        <div className="relative flex overflow-x-hidden group mb-4 w-full">
          <div className={`absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r ${isLight ? 'from-white' : 'from-[#0C0C0C]'} to-transparent z-10 pointer-events-none transition-colors duration-500`} />
          <div className={`absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l ${isLight ? 'from-white' : 'from-[#0C0C0C]'} to-transparent z-10 pointer-events-none transition-colors duration-500`} />
          
          <div className="animate-marquee flex whitespace-nowrap group-hover:[animation-play-state:paused]">
            {[...approvedReviews, ...approvedReviews, ...approvedReviews].map((review, idx) => (
              <div key={`${review.id}-${idx}`} className={`w-[300px] sm:w-[350px] mx-3 whitespace-normal flex-shrink-0 ${isLight ? 'bg-[#F4F3F6] border-[#0C0C0C]/5 hover:bg-[#EAE8ED]' : 'bg-white/5 border-white/10 hover:bg-white/10'} rounded-3xl p-6 shadow-xl flex flex-col justify-between transition duration-300`}>
                <div>
                  <div className="flex gap-1 mb-4 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 2} />
                    ))}
                  </div>
                  <p className={`text-sm ${isLight ? 'text-[#0C0C0C]/80' : 'text-[#D7E2EA]/80'} font-light italic leading-relaxed mb-6 line-clamp-4`}>
                    "{review.comment}"
                  </p>
                </div>
                <div className={`flex items-center gap-3 border-t ${isLight ? 'border-[#0C0C0C]/10' : 'border-white/5'} pt-4 mt-auto`}>
                  <div className={`w-10 h-10 rounded-full ${isLight ? 'bg-white border-[#0C0C0C]/10 text-[#0C0C0C]' : 'bg-zinc-800 border-white/10 text-white'} flex items-center justify-center font-black text-sm overflow-hidden shrink-0`}>
                    {review.logoUrl ? (
                      <img src={review.logoUrl} className="w-full h-full object-cover" alt={review.clientName} />
                    ) : (
                      review.clientName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="truncate">
                    <h4 className={`font-bold text-sm truncate ${isLight ? 'text-[#0C0C0C]' : 'text-white'}`}>{review.clientName}</h4>
                    <span className={`text-[10px] ${isLight ? 'text-[#0C0C0C]/40' : 'text-[#D7E2EA]/40'} font-semibold uppercase tracking-wider`}>Client</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
