import React, { useState } from 'react';
import { FadeIn } from '../FadeIn';
import { defaultData, updateSection, getData } from '../../lib/store';
import { Star } from 'lucide-react';
import { db } from '../../lib/firebase';
import { ref, set } from 'firebase/database';

interface ReviewsSectionProps {
  reviews: typeof defaultData.reviews;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const approvedReviews = (reviews || []).filter(r => r.status === 'approved');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newReview = {
      id: `rev_${Date.now()}`,
      clientName: name,
      logoUrl: '',
      rating,
      comment,
      status: 'pending', // Needs admin approval
      date: new Date().toISOString(),
    };

    // Use live reviews prop (not hardcoded defaultData)
    const updatedReviews = [newReview, ...(reviews || [])];

    // Save to localStorage cache
    updateSection('reviews', updatedReviews);

    // Sync to Firebase so admin sees it in the panel
    try {
      const portfolioRef = ref(db, 'portfolio_content');
      const current = getData();
      await set(portfolioRef, { ...current, reviews: updatedReviews });
    } catch (err) {
      console.error('Failed to sync review to Firebase:', err);
    }

    setSubmitted(true);
    setName('');
    setComment('');
  };

  return (
    <section id="reviews" className="bg-[#0C0C0C] text-[#D7E2EA] py-16 sm:py-20 md:py-24 px-0 w-full border-t border-white/5 relative z-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col items-center px-5 sm:px-8 md:px-10">
        <FadeIn delay={0} y={40} className="mb-12 text-center">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#D7E2EA]/40 mb-2">What they say</p>
          <h2 className="hero-heading font-black uppercase text-[clamp(2.5rem,7.5vw,110px)] leading-none tracking-wide text-[#D7E2EA]">
            Client Reviews
          </h2>
        </FadeIn>
      </div>

      {/* Reviews Marquee */}
      {approvedReviews.length > 0 && (
        <div className="relative flex overflow-x-hidden group mb-16 w-full">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#0C0C0C] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#0C0C0C] to-transparent z-10 pointer-events-none" />
          
          <div className="animate-marquee flex whitespace-nowrap group-hover:[animation-play-state:paused]">
            {[...approvedReviews, ...approvedReviews, ...approvedReviews].map((review, idx) => (
              <div key={`${review.id}-${idx}`} className="w-[300px] sm:w-[350px] mx-3 whitespace-normal flex-shrink-0 bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:bg-white/10 transition duration-300">
                <div>
                  <div className="flex gap-1 mb-4 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 2} />
                    ))}
                  </div>
                  <p className="text-sm text-[#D7E2EA]/80 font-light italic leading-relaxed mb-6 line-clamp-4">
                    "{review.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-black text-sm text-white overflow-hidden shrink-0">
                    {review.logoUrl ? (
                      <img src={review.logoUrl} className="w-full h-full object-cover" alt={review.clientName} />
                    ) : (
                      review.clientName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-sm text-white truncate">{review.clientName}</h4>
                    <span className="text-[10px] text-[#D7E2EA]/40 font-semibold uppercase tracking-wider">Client</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leave a Review Form - Compact & Right Aligned */}
      <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-8 md:px-10 flex justify-end">
        <FadeIn delay={0.2} y={30} className="w-full max-w-sm bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-800"></div>
          <h3 className="text-lg font-bold mb-5 text-center tracking-wide uppercase">Leave a Review</h3>
          
          {submitted ? (
             <div className="text-center py-6">
               <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">✓</div>
               <h4 className="font-bold text-base mb-1">Thank You!</h4>
               <p className="text-xs text-[#D7E2EA]/60">Your review is pending approval.</p>
               <button onClick={() => setSubmitted(false)} className="mt-4 text-[10px] text-[#D7E2EA]/40 uppercase tracking-wider hover:text-white transition">Write another</button>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-white/30 transition placeholder-white/20 text-white"
                  placeholder="Your Name"
                />
              </div>
              
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-semibold tracking-wider text-[#D7E2EA]/50 uppercase">Rating</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`transition ${star <= rating ? 'text-amber-400' : 'text-white/20 hover:text-white/40'}`}
                    >
                      <Star size={18} fill={star <= rating ? "currentColor" : "none"} strokeWidth={star <= rating ? 0 : 2} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <textarea 
                  required
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={3}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-white/30 transition placeholder-white/20 text-white resize-none"
                  placeholder="Working with Sahil was amazing because..."
                />
              </div>

              <button 
                type="submit"
                className="w-full mt-2 bg-white text-black font-bold uppercase tracking-widest text-[10px] py-3 rounded-lg hover:bg-zinc-200 transition"
              >
                Submit Review
              </button>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
};
