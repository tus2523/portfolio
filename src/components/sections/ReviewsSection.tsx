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
    <section id="reviews" className="bg-[#0C0C0C] text-[#D7E2EA] py-16 sm:py-20 md:py-24 px-5 sm:px-8 md:px-10 w-full border-t border-white/5 relative z-20">
      <div className="max-w-[1000px] mx-auto w-full flex flex-col items-center">
        <FadeIn delay={0} y={40} className="mb-12 text-center">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#D7E2EA]/40 mb-2">What they say</p>
          <h2 className="hero-heading font-black uppercase text-[clamp(2.5rem,7.5vw,110px)] leading-none tracking-wide text-[#D7E2EA]">
            Client Reviews
          </h2>
        </FadeIn>

        {/* Reviews Grid */}
        {approvedReviews.length > 0 && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {approvedReviews.map(review => (
              <FadeIn key={review.id} y={20} className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 2} />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-[#D7E2EA]/80 font-light italic leading-relaxed mb-6">
                    "{review.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-black text-lg text-white overflow-hidden shrink-0">
                    {review.logoUrl ? (
                      <img src={review.logoUrl} className="w-full h-full object-cover" alt={review.clientName} />
                    ) : (
                      review.clientName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{review.clientName}</h4>
                    <span className="text-[10px] text-[#D7E2EA]/40 font-semibold uppercase tracking-wider">Client</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {/* Leave a Review Form */}
        <FadeIn delay={0.2} y={30} className="w-full max-w-xl bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-800"></div>
          <h3 className="text-xl font-bold mb-6 text-center tracking-wide uppercase">Leave a Review</h3>
          
          {submitted ? (
             <div className="text-center py-8">
               <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
               <h4 className="font-bold text-lg mb-2">Thank You!</h4>
               <p className="text-sm text-[#D7E2EA]/60">Your review has been submitted and is pending approval.</p>
               <button onClick={() => setSubmitted(false)} className="mt-6 text-xs text-[#D7E2EA]/40 underline">Write another</button>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-wider text-[#D7E2EA]/50 uppercase mb-1.5 ml-1">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition placeholder-white/20 text-white"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold tracking-wider text-[#D7E2EA]/50 uppercase mb-1.5 ml-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`transition ${star <= rating ? 'text-amber-400' : 'text-white/20 hover:text-white/40'}`}
                    >
                      <Star size={28} fill={star <= rating ? "currentColor" : "none"} strokeWidth={star <= rating ? 0 : 2} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-[#D7E2EA]/50 uppercase mb-1.5 ml-1">Your Review</label>
                <textarea 
                  required
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={4}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition placeholder-white/20 text-white resize-none"
                  placeholder="Working with Sahil was amazing because..."
                />
              </div>

              <button 
                type="submit"
                className="w-full mt-4 bg-white text-black font-bold uppercase tracking-widest text-xs py-3.5 rounded-xl hover:bg-zinc-200 transition"
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
