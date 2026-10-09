import React, { useState } from 'react';
import { defaultData, getWhatsAppLink, updateSection } from '../../lib/store';
import { db } from '../../lib/firebase';
import { ref, set } from 'firebase/database';
import { Star, ArrowUpRight } from 'lucide-react';

interface FooterSectionProps {
  data: typeof defaultData;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ data }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const whatsappPhone = data.settings?.whatsappPhone || data.about?.phone || '9324704934';
  const whatsappUrl = getWhatsAppLink(whatsappPhone);

  const socials = [
    { label: "YouTube", url: data.heroStats?.youtubeUrl || data.about?.youtubeUrl || "https://youtube.com" },
    { label: "Instagram", url: data.heroStats?.instagramUrl || data.about?.instagramUrl || "https://instagram.com/tusharmaru" },
    { label: "WhatsApp", url: whatsappUrl },
  ];

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newReview = {
      id: `rev_${Date.now()}`,
      clientName: name,
      role: 'Director / Client',
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
    <footer id="contact" className="bg-[#0A0A0A] text-[#FFFFFF] font-sans pt-24 pb-12 px-6 sm:px-12 md:px-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Four-Column Desktop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 pb-20">
          {/* Column 1-2: Large Brand Name and Short Bio */}
          <div className="md:col-span-2 flex flex-col justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#737373] block mb-3">
                Studio Directory — Index 03
              </span>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.05em] leading-[0.9] text-white">
                TUSHAR MARU
              </h2>
              <p className="text-base text-[#737373] max-w-md mt-6 leading-relaxed font-normal tracking-[-0.01em]">
                Videographer and video editor based in Mumbai. Specializing in high-energy video cuts, celebrity BTS shoots, commercial brand promos, and editorial storytelling.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="font-mono text-xs uppercase tracking-[0.1em] text-white/60 hover:text-white underline underline-offset-4 transition-colors"
              >
                + Leave a Director / Client Review
              </button>
            </div>
          </div>

          {/* Column 3: Socials List */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#737373] border-b border-white/10 pb-2">
              Socials
            </span>
            <ul className="flex flex-col gap-3 font-mono text-xs uppercase tracking-[0.1em]">
              {socials.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white flex items-center justify-between group transition-colors duration-200"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact List */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#737373] border-b border-white/10 pb-2">
              Contact
            </span>
            <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-[0.1em] text-white/80">
              <a
                href={`mailto:${data.about?.email || 'marutushar387@gmail.com'}`}
                className="hover:text-white truncate transition-colors"
              >
                {data.about?.email || 'marutushar387@gmail.com'}
              </a>
              <a
                href={`tel:${data.about?.phone || '+919324704934'}`}
                className="hover:text-white transition-colors"
              >
                {data.about?.phone || '+91 9324704934'}
              </a>
              <span className="text-[#737373]">
                Mumbai, Maharashtra, India
              </span>
              <a
                href="#admin"
                className="text-[#737373] hover:text-white pt-2 border-t border-white/5 flex items-center justify-between"
              >
                <span>Admin Login</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Thin border-top (white at 10% opacity) with 14px text */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[14px] text-[#737373] font-mono tracking-tight">
          <span>&copy; {new Date().getFullYear()} Tushar Maru. All rights reserved.</span>
          <span className="text-white/40">Editorial Creative Studio Aesthetic</span>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setShowReviewModal(false)}
        >
          <div
            className="relative max-w-lg w-full bg-[#121214] border border-white/10 rounded-2xl p-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
              <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-white">Client / Director Endorsement</h3>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <span className="text-3xl block mb-2">✓</span>
                <p className="text-sm font-bold">Endorsement Received</p>
                <p className="text-xs text-[#737373] mt-1">Pending approval in studio dashboard.</p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setShowReviewModal(false); }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="font-mono text-[10px] uppercase text-[#737373] block mb-1">Your Name &amp; Role</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Saurabh Prajapati — Director"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase text-[#737373] block mb-1">Rating</label>
                  <div className="flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={s <= rating ? 'text-amber-400' : 'text-white/20'}
                      >
                        <Star size={18} fill={s <= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase text-[#737373] block mb-1">Feedback Statement</label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Statement on working with Tushar on production / video edit..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/40 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-full bg-white text-black font-mono text-xs uppercase tracking-[0.1em] font-bold hover:bg-neutral-200 transition"
                >
                  Submit Endorsement
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
