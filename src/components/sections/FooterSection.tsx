import React, { useState } from 'react';
import { Mail, Phone, Star } from 'lucide-react';
import { ConfettiEffect } from '../ConfettiEffect';
import { defaultData, updateSection } from '../../lib/store';
import { db } from '../../lib/firebase';
import { ref, set } from 'firebase/database';

const Instagram = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const Linkedin = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);
const Youtube = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
);
const WhatsApp = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
);

interface FooterSectionProps {
  data: typeof defaultData;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ data }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const cleanPhone = (data.settings?.whatsappPhone || '').replace(/\D/g, '');
  const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const whatsappUrl = waPhone ? `https://wa.me/${waPhone}` : null;

  const contactLinks = [
    { url: data.heroStats?.instagramUrl, icon: <Instagram size={18} />, title: "Instagram" },
    { url: data.heroStats?.linkedinUrl, icon: <Linkedin size={18} />, title: "LinkedIn" },
    { url: data.heroStats?.youtubeUrl, icon: <Youtube size={18} />, title: "YouTube" },
    { url: whatsappUrl, icon: <WhatsApp size={18} />, title: "WhatsApp" },
    { url: data.about?.email ? `mailto:${data.about.email}` : null, icon: <Mail size={18} />, title: "Email Me" },
    { url: data.about?.phone ? `tel:${data.about.phone}` : null, icon: <Phone size={18} />, title: "Call Me" },
  ].filter(link => link.url);

  const handleReviewSubmit = async (e: React.FormEvent) => {
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

    const updatedReviews = [newReview, ...(data.reviews || [])];
    updateSection('reviews', updatedReviews);

    try {
      const reviewsRef = ref(db, 'portfolio_content/reviews');
      await set(reviewsRef, updatedReviews);
    } catch (err) {
      console.error('Failed to sync review to Firebase:', err);
    }

    setSubmitted(true);
    setName('');
    setComment('');
  };

  return (
    <footer id="contact" className="bg-[#0C0C0C] border-t border-white/5 py-16 px-5 sm:px-8 md:px-10 relative z-20">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Contact Info Side */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-[#D7E2EA] mb-4">
              {data.settings?.footerHeading || "Let's Work Together"}
            </h2>
            <p className="text-sm sm:text-base font-light leading-relaxed text-[#D7E2EA]/60 max-w-md">
              {data.settings?.footerBio || "I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions."}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {contactLinks.map((s, idx) => {
              const isExternal = !s.url?.startsWith('mailto:') && !s.url?.startsWith('tel:');
              
              if (s.title === "Email Me") {
                return (
                  <div 
                    key={idx}
                    className="relative cursor-pointer"
                    onClick={() => { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 200); }}
                  >
                    <ConfettiEffect trigger={showConfetti} />
                    <a
                      href={s.url || undefined}
                      title={s.title}
                      className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-[#D7E2EA]/60 hover:text-white hover:border-[#BBCCD7]/40 hover:-translate-y-0.5 transition duration-300 bg-white/5 hover:bg-white/10"
                    >
                      {s.icon}
                    </a>
                  </div>
                );
              }

              return (
                <a
                  key={idx}
                  href={s.url || undefined}
                  title={s.title}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-[#D7E2EA]/60 hover:text-white hover:border-[#BBCCD7]/40 hover:-translate-y-0.5 transition duration-300 bg-white/5 hover:bg-white/10"
                >
                  {s.icon}
                </a>
              );
            })}
          </div>
        </div>

        {/* Leave a Review Form Side */}
        <div className="w-full max-w-sm ml-auto bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-800"></div>
          <h3 className="text-lg font-bold mb-5 text-center tracking-wide uppercase text-white">Leave a Review</h3>
          
          {submitted ? (
             <div className="text-center py-6">
               <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">✓</div>
               <h4 className="font-bold text-base mb-1 text-white">Thank You!</h4>
               <p className="text-xs text-[#D7E2EA]/60">Your review is pending approval.</p>
               <button onClick={() => setSubmitted(false)} className="mt-4 text-[10px] text-[#D7E2EA]/40 uppercase tracking-wider hover:text-white transition">Write another</button>
             </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
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
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto border-t border-white/5 mt-16 pt-8 text-center text-xs text-[#D7E2EA]/30">
        &copy; {new Date().getFullYear()} Sahil Thorat. All rights reserved.
      </div>
    </footer>
  );
};
