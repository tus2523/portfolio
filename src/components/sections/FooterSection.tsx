import React, { useState } from 'react';
import { Mail, Phone, Star } from 'lucide-react';
import { ConfettiEffect } from '../ConfettiEffect';
import { defaultData, updateSection, getWhatsAppLink } from '../../lib/store';
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

import { FloatingEmoji } from '../FloatingEmoji';

const getAssetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${cleanBase}${cleanPath}`;
};

const GLASS_SPARKLES = getAssetUrl('glass_sparkles.png');
const GLASS_HEART = getAssetUrl('glass_heart.png');

interface FooterSectionProps {
  data: typeof defaultData;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ data }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const whatsappPhone = data.settings?.whatsappPhone || data.about?.phone || '9324704934';
  const whatsappUrl = getWhatsAppLink(whatsappPhone);

  const contactLinks = [
    { url: data.heroStats?.instagramUrl || data.about?.instagramUrl, icon: <Instagram size={18} />, title: "Instagram" },
    { url: data.heroStats?.linkedinUrl || data.about?.linkedinUrl, icon: <Linkedin size={18} />, title: "LinkedIn" },
    { url: data.heroStats?.youtubeUrl || data.about?.youtubeUrl, icon: <Youtube size={18} />, title: "YouTube" },
    { url: whatsappUrl, icon: <WhatsApp size={18} />, title: "WhatsApp" },
    { url: data.about?.email ? `mailto:${data.about.email}` : 'mailto:marutushar387@gmail.com', icon: <Mail size={18} />, title: "Email Me" },
    { url: data.about?.phone ? `tel:${data.about.phone}` : 'tel:+919324704934', icon: <Phone size={18} />, title: "Call Me" },
  ].filter(link => link.url);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newReview = {
      id: `rev_${Date.now()}`,
      clientName: name,
      role: 'Client / Collaborator',
      logoUrl: '',
      rating,
      comment,
      status: 'pending',
      date: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...(data.reviews || [])];
    updateSection('reviews', updatedReviews);

    try {
      const reviewsRef = ref(db, 'tushar_portfolio_content/reviews');
      await set(reviewsRef, updatedReviews);
    } catch (err) {
      console.warn('Saved review locally:', err);
    }

    setSubmitted(true);
    setName('');
    setComment('');
  };

  return (
    <footer id="contact" className="bg-[#08080A] border-t border-white/5 py-16 px-5 sm:px-8 md:px-10 relative z-20 overflow-hidden font-sans">
      <FloatingEmoji src={GLASS_SPARKLES} alt="Sparkles" className="top-[10%] left-[2%] sm:left-[4%]" rotation={-15} delay={1.0} lightBg={false} />
      <FloatingEmoji src={GLASS_HEART} alt="Heart" className="bottom-[15%] right-[2%] sm:right-[4%]" rotation={12} delay={1.2} lightBg={false} />
      
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative z-10">
        {/* Contact Info Side */}
        <div className="flex flex-col gap-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#7621B0] mb-2 block">Connect &amp; Collaborate</span>
            <h2 className="text-2xl md:text-4xl font-display font-extrabold uppercase tracking-tight text-[#D7E2EA] mb-4">
              {data.settings?.footerHeading || "Let's Create Visually Stunning Content Together"}
            </h2>
            <p className="text-sm sm:text-base font-light leading-relaxed text-[#D7E2EA]/60 max-w-md">
              {data.settings?.footerBio || "Open for videography projects, video editing assignments, celebrity BTS shoots, and creative collaborations in Mumbai and worldwide."}
            </p>
          </div>

          <div className="flex flex-col gap-2 text-xs text-[#D7E2EA]/70">
            <p><strong className="text-white">Email:</strong> {data.about?.email || 'marutushar387@gmail.com'}</p>
            <p><strong className="text-white">Phone:</strong> {data.about?.phone || '+91 9324704934'}</p>
            <p><strong className="text-white">Location:</strong> Mumbai, Maharashtra, India</p>
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
                      className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-[#D7E2EA]/60 hover:text-white hover:border-[#7621B0]/50 hover:-translate-y-0.5 transition duration-300 bg-white/5 hover:bg-[#7621B0]/20"
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
                  className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-[#D7E2EA]/60 hover:text-white hover:border-[#7621B0]/50 hover:-translate-y-0.5 transition duration-300 bg-white/5 hover:bg-[#7621B0]/20"
                >
                  {s.icon}
                </a>
              );
            })}
          </div>
        </div>

        {/* Leave a Review Form Side */}
        <div className="w-full max-w-sm ml-auto bg-[#121214] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7621B0] via-purple-400 to-[#7621B0]"></div>
          <h3 className="text-lg font-bold mb-5 text-center tracking-wide uppercase text-white font-display">Leave a Review</h3>
          
          {submitted ? (
             <div className="text-center py-6">
               <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">✓</div>
               <h4 className="font-bold text-base mb-1 text-white">Thank You!</h4>
               <p className="text-xs text-[#D7E2EA]/60">Your review has been submitted for approval.</p>
               <button onClick={() => setSubmitted(false)} className="mt-4 text-[10px] text-[#7621B0] uppercase tracking-wider hover:underline transition">Write another</button>
             </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
              <div>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#7621B0] transition placeholder-white/20 text-white"
                  placeholder="Your Name &amp; Company"
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
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#7621B0] transition placeholder-white/20 text-white resize-none"
                  placeholder="Working with Tushar on our shoot / video edit was exceptional because..."
                />
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 bg-[#7621B0] text-white font-bold uppercase tracking-widest text-[10px] py-3 rounded-lg hover:bg-[#611a93] transition shadow-lg shadow-purple-900/30"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto border-t border-white/5 mt-16 pt-8 text-center text-xs text-[#D7E2EA]/40">
        &copy; {new Date().getFullYear()} Tushar Maru · Videographer &amp; Video Editor. All rights reserved.
      </div>
    </footer>
  );
};
