import React from 'react';
import { FadeIn } from '../FadeIn';
import { defaultData } from '../../lib/store';
import { Star } from 'lucide-react';
import { InfiniteMarquee } from '../InfiniteMarquee';

interface ReviewsSectionProps {
  reviews: typeof defaultData.reviews;
  theme?: 'light' | 'dark';
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, theme = 'dark' }) => {
  const approvedReviews = (reviews || []).filter(r => r.status === 'approved');
  const isLight = theme === 'light';

  const ReviewCard = ({ review }: { review: typeof approvedReviews[0] }) => (
    <div
      className={`w-[290px] sm:w-[340px] mx-3 flex-shrink-0 ${
        isLight
          ? 'bg-[#F4F3F6] border-[#0C0C0C]/5 hover:bg-[#EAE8ED]'
          : 'bg-[#121214] border-white/10 hover:border-[#7621B0]/50'
      } rounded-3xl p-6 shadow-xl flex flex-col justify-between transition duration-300 border cursor-default font-sans`}
    >
      <div>
        <div className="flex gap-1 mb-4 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} strokeWidth={i < review.rating ? 0 : 2} />
          ))}
        </div>
        <p className="text-xs sm:text-sm text-[#D7E2EA]/80 font-light italic leading-relaxed mb-6 line-clamp-4">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>
      <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-auto">
        <div className="w-10 h-10 rounded-full bg-[#7621B0]/20 border border-[#7621B0]/40 text-[#7621B0] flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
          {review.logoUrl ? (
            <img src={review.logoUrl} className="w-full h-full object-cover" alt={review.clientName} />
          ) : (
            review.clientName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="truncate">
          <h3 className="font-bold text-sm truncate text-white">{review.clientName}</h3>
          <span className="text-[10px] text-[#7621B0] font-semibold uppercase tracking-wider block truncate">
            {review.role || 'Industry Director'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section id="reviews" className={`${isLight ? 'bg-[#FAF9F6] text-[#0C0C0C]' : 'bg-[#08080A] text-[#D7E2EA]'} py-16 sm:py-20 md:py-24 px-0 w-full border-t border-white/5 relative z-20 overflow-hidden transition-colors duration-500 font-sans`}>
      <div className="max-w-[1400px] mx-auto w-full flex flex-col items-center px-5 sm:px-8 md:px-10 mb-12 text-center">
        <FadeIn delay={0} y={40}>
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#7621B0] mb-2">Industry Recommendations</p>
          <h2 className="font-display font-extrabold uppercase text-[clamp(2.5rem,7.5vw,100px)] leading-none tracking-tight">
            Director References
          </h2>
          <p className="font-editorial italic text-lg sm:text-2xl text-[#D7E2EA]/80 mt-3 max-w-2xl mx-auto">
            Endorsements from Prominent Directors &amp; Choreographers
          </p>
        </FadeIn>
      </div>

      {approvedReviews.length > 0 && (
        <div className="relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#08080A] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#08080A] to-transparent z-10 pointer-events-none" />
          <InfiniteMarquee direction="left" speed={0.9} gap="gap-0">
            {approvedReviews.map((review, idx) => <ReviewCard key={`r-${review.id}-${idx}`} review={review} />)}
          </InfiniteMarquee>
        </div>
      )}
    </section>
  );
};
