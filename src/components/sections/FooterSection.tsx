import React, { useState } from 'react';
import { defaultData, getWhatsAppLink, updateSection } from '../../lib/store';
import { db } from '../../lib/firebase';
import { ref, set } from 'firebase/database';
import { Star, ArrowUpRight, ArrowRight } from 'lucide-react';

interface FooterSectionProps {
  data: typeof defaultData;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ data }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  // Review form states
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const whatsappPhone = data.settings?.whatsappPhone || data.about?.phone || '9324704934';
  const whatsappUrl = getWhatsAppLink(whatsappPhone);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryEmail.trim()) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setInquiryEmail('');
    }, 4000);
  };

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
    <footer
      id="contact"
      className="bg-[#01472e] text-[#ccd5ae] font-sans pt-28 pb-14 px-6 sm:px-10 md:px-14 rounded-t-[5rem] -mt-16 sm:-mt-20 relative z-30 shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.3)] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-20 border-b border-[#ccd5ae]/15">
          {/* Left 6 Columns: Large Newsletter / Project Inquiry */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ccd5ae]/60 block mb-3">
                Studio Directory — Index 07
              </span>
              <h2 className="font-display uppercase text-5xl sm:text-7xl lg:text-8xl leading-[0.85] tracking-[-0.04em] text-[#fefae0]">
                TUSHAR MARU
              </h2>
              <p className="text-sm sm:text-base text-[#ccd5ae]/80 max-w-md mt-6 leading-relaxed font-normal">
                Videographer and video editor based in Mumbai. Available for commercial brand campaigns, celebrity BTS productions, music videos, and creative post-production.
              </p>
            </div>

            {/* Newsletter / Project Inquiry: Uppercase Underline-only Input Field */}
            <div className="mt-4 max-w-lg">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ccd5ae]/70 block mb-2">
                INITIATE PROJECT INQUIRY
              </span>
              <form onSubmit={handleInquirySubmit} className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL ADDRESS"
                  className="w-full bg-transparent border-b border-[#ccd5ae]/40 text-[#fefae0] placeholder-[#ccd5ae]/40 text-xs sm:text-sm font-sans uppercase tracking-[0.2em] py-3 pr-12 focus:outline-none focus:border-[#fefae0] transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#fefae0] hover:text-[#ccd5ae] p-2 transition-colors"
                  aria-label="Submit Email"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
              {inquirySent && (
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fefae0] mt-2 block animate-fade-in">
                  ✓ INQUIRY RECEIVED. WE WILL CONNECT SHORTLY.
                </span>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#fefae0] hover:underline underline-offset-4 transition-colors"
              >
                + LEAVE A DIRECTOR / CLIENT ENDORSEMENT
              </button>
            </div>
          </div>

          {/* Right 6 Columns: Two columns of links using bold, tracked-out 11px uppercase text */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-10">
            {/* Column 1: Directory Links */}
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ccd5ae]/50 border-b border-[#ccd5ae]/15 pb-2">
                DIRECTORY
              </span>
              <ul className="flex flex-col gap-3.5 text-[11px] font-bold uppercase tracking-[0.25em]">
                <li>
                  <a href="#projects" className="text-[#fefae0] hover:text-[#ccd5ae] transition-colors">
                    01 • FEATURED FILMS
                  </a>
                </li>
                <li>
                  <a href="#photos" className="text-[#fefae0] hover:text-[#ccd5ae] transition-colors">
                    02 • PHOTO STILLS &amp; BTS
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-[#fefae0] hover:text-[#ccd5ae] transition-colors">
                    03 • STUDIO STATEMENT
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-[#fefae0] hover:text-[#ccd5ae] transition-colors">
                    04 • CAPABILITIES
                  </a>
                </li>
                <li>
                  <a href="#experience" className="text-[#fefae0] hover:text-[#ccd5ae] transition-colors">
                    05 • TIMELINE
                  </a>
                </li>
                <li>
                  <a href="#reviews" className="text-[#fefae0] hover:text-[#ccd5ae] transition-colors">
                    06 • ENDORSEMENTS
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Connect & Contact */}
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ccd5ae]/50 border-b border-[#ccd5ae]/15 pb-2">
                CONNECT
              </span>
              <ul className="flex flex-col gap-3.5 text-[11px] font-bold uppercase tracking-[0.25em]">
                <li>
                  <a
                    href={data.heroStats?.youtubeUrl || data.about?.youtubeUrl || "https://youtube.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#fefae0] hover:text-[#ccd5ae] flex items-center justify-between group transition-colors"
                  >
                    <span>YOUTUBE</span>
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a
                    href={data.heroStats?.instagramUrl || data.about?.instagramUrl || "https://instagram.com/tusharmaru"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#fefae0] hover:text-[#ccd5ae] flex items-center justify-between group transition-colors"
                  >
                    <span>INSTAGRAM</span>
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#fefae0] hover:text-[#ccd5ae] flex items-center justify-between group transition-colors"
                  >
                    <span>WHATSAPP</span>
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${data.about?.email || 'marutushar387@gmail.com'}`}
                    className="text-[#fefae0] hover:text-[#ccd5ae] truncate block transition-colors"
                  >
                    {data.about?.email || 'MARUTUSHAR387@GMAIL.COM'}
                  </a>
                </li>
                <li>
                  <span className="text-[#ccd5ae]/70 block">
                    MUMBAI, MAHARASHTRA
                  </span>
                </li>
                <li className="pt-2 border-t border-[#ccd5ae]/10">
                  <a
                    href="#admin"
                    className="text-[#ccd5ae] hover:text-[#fefae0] flex items-center justify-between"
                  >
                    <span>ADMIN PORTAL</span>
                    <span>→</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Legal links with 30% opacity */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#ccd5ae]/30 font-sans uppercase tracking-[0.2em]">
          <span>&copy; {new Date().getFullYear()} TUSHAR MARU. ALL RIGHTS RESERVED.</span>
          <span>EARTHY EDITORIAL STUDIO AESTHETIC</span>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div
          className="fixed inset-0 z-50 bg-[#01472e]/90 backdrop-blur-md flex items-center justify-center p-6 text-[#01472e]"
          onClick={() => setShowReviewModal(false)}
        >
          <div
            className="relative max-w-lg w-full bg-[#fefae0] border border-[#01472e]/20 rounded-[2.5rem] p-8 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 border-b border-[#01472e]/15 pb-4">
              <h3 className="font-display uppercase text-2xl text-[#01472e]">
                DIRECTOR / CLIENT ENDORSEMENT
              </h3>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="w-9 h-9 rounded-full bg-[#01472e]/10 hover:bg-[#01472e] text-[#01472e] hover:text-[#fefae0] flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <span className="text-4xl block mb-3 text-[#01472e]">✓</span>
                <p className="font-display uppercase text-2xl text-[#01472e]">ENDORSEMENT RECEIVED</p>
                <p className="text-xs text-[#01472e]/70 mt-1 uppercase tracking-wider">
                  Pending review approval in studio dashboard.
                </p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setShowReviewModal(false); }}
                  className="mt-6 px-8 py-3 rounded-full bg-[#01472e] text-[#fefae0] text-[10px] font-bold uppercase tracking-[0.25em]"
                >
                  CLOSE
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#01472e]/70 block mb-1">
                    YOUR NAME &amp; ROLE
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Saurabh Prajapati — Director"
                    className="w-full bg-[#01472e]/5 border border-[#01472e]/15 rounded-xl px-4 py-3 text-xs text-[#01472e] focus:outline-none focus:border-[#01472e]/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#01472e]/70 block mb-1">
                    RATING
                  </label>
                  <div className="flex gap-1.5 text-[#01472e]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={s <= rating ? 'text-[#01472e]' : 'text-[#01472e]/20'}
                      >
                        <Star size={20} fill={s <= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#01472e]/70 block mb-1">
                    TESTIMONIAL STATEMENT
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Statement on working with Tushar on production / video edit..."
                    className="w-full bg-[#01472e]/5 border border-[#01472e]/15 rounded-xl px-4 py-3 text-xs text-[#01472e] focus:outline-none focus:border-[#01472e]/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-4 rounded-full bg-[#01472e] text-[#fefae0] text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[#023321] transition shadow-lg"
                >
                  SUBMIT ENDORSEMENT
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
