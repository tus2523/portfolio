import React from 'react';
import { defaultData } from '../../lib/store';
import { Star } from 'lucide-react';
import { InfiniteMarquee } from '../InfiniteMarquee';

interface ReviewsSectionProps {
  reviews: typeof defaultData.reviews;
  theme?: 'light' | 'dark';
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  const approvedReviews = (reviews || []).filter(r => r.status === 'approved');

  const ReviewCard = ({ review }: { review: typeof approvedReviews[0] }) => (
    <div
      className="w-[300px] sm:w-[360px] mx-4 flex-shrink-0 bg-[var(--theme-accent-bg,#fefae0)] border border-current/15 hover:border-current/35 rounded-[2.5rem] p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 font-sans"
    >
      <div>
        <div className="flex gap-1 mb-4 text-[var(--theme-text,#01472e)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={15}
              fill={i < review.rating ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={i < review.rating ? 0 : 2}
            />
          ))}
        </div>
        <p className="text-xs sm:text-sm opacity-85 font-normal italic leading-relaxed mb-6 line-clamp-4">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>

      <div className="flex items-center gap-3 border-t border-current/10 pt-4 mt-auto">
        <div className="w-10 h-10 rounded-full bg-[var(--theme-dark-bg,#01472e)] text-[var(--theme-accent-bg,#fefae0)] flex items-center justify-center font-bold text-xs uppercase overflow-hidden shrink-0 shadow-sm">
          {review.logoUrl ? (
            <img src={review.logoUrl} className="w-full h-full object-cover" alt={review.clientName} />
          ) : (
            review.clientName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="truncate">
          <h3 className="font-bold text-sm truncate text-[var(--theme-text,#01472e)] uppercase tracking-tight">
            {review.clientName}
          </h3>
          <span className="text-[10px] opacity-60 font-bold uppercase tracking-[0.2em] block truncate">
            {review.role || 'Industry Director'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="reviews"
      className="py-24 sm:py-32 px-0 bg-[var(--theme-card-bg,#e9edc9)] text-[var(--theme-text,#01472e)] font-sans rounded-t-[5rem] relative z-20 shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto flex flex-col px-6 sm:px-10 md:px-14 mb-16 sm:mb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-current/15 pb-8 gap-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-70 block mb-4 sm:mb-6">
              Industry References — 06
            </span>
            <h2 className="font-display uppercase text-[clamp(3.5rem,13vw,170px)] leading-[0.92] tracking-[-0.04em] text-[var(--theme-text,#01472e)]">
              REVIEWS
            </h2>
          </div>

          <p className="max-w-xs text-xs sm:text-sm opacity-80 leading-relaxed font-normal self-start lg:self-end">
            Direct testimonials from directors, choreographers, and creative producers.
          </p>
        </div>
      </div>

      {approvedReviews.length > 0 ? (
        <div className="relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-r from-[var(--theme-card-bg,#e9edc9)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-l from-[var(--theme-card-bg,#e9edc9)] to-transparent z-10 pointer-events-none" />
          <InfiniteMarquee direction="left" speed={0.9} gap="gap-0">
            {approvedReviews.map((review, idx) => (
              <ReviewCard key={`r-${review.id}-${idx}`} review={review} />
            ))}
          </InfiniteMarquee>
        </div>
      ) : (
        <div className="text-center opacity-40 py-12 uppercase tracking-widest text-xs">
          No reviews available.
        </div>
      )}
    </section>
  );
};
