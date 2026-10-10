import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { defaultData, getWhatsAppLink, updateSection, sanitizeUrl } from '../../lib/store';
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
    setSubmitted(true);
    setName('');
    setComment('');
  };

  return (
    <footer
      id="contact"
      className="bg-[var(--theme-dark-bg,#01472e)] text-[var(--theme-footer-text,#ccd5ae)] font-sans pt-28 pb-14 px-6 sm:px-10 md:px-14 rounded-t-[5rem] relative z-30 shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.3)] overflow-hidden transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto">
        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-20 border-b border-current/15">
          {/* Left 6 Columns: Large Newsletter / Project Inquiry */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-60 block mb-3">
                Studio Directory — Index 07
              </span>
              <h2 className="font-display uppercase text-5xl sm:text-7xl lg:text-8xl leading-[0.85] tracking-[-0.04em] text-[var(--theme-accent-bg,#fefae0)]">
                TUSHAR MARU
              </h2>
              <p className="text-sm sm:text-base opacity-80 max-w-md mt-6 leading-relaxed font-normal">
                Videographer and video editor based in Mumbai. Available for commercial brand campaigns, celebrity BTS productions, music videos, and creative post-production.
              </p>
            </div>

            {/* Newsletter / Project Inquiry: Uppercase Underline-only Input Field */}
            <div className="mt-4 max-w-lg">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-70 block mb-2">
                INITIATE PROJECT INQUIRY
              </span>
              <form onSubmit={handleInquirySubmit} className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL ADDRESS"
                  className="w-full bg-transparent border-b border-current/40 text-[var(--theme-accent-bg,#fefae0)] placeholder-current/40 text-xs sm:text-sm font-sans uppercase tracking-[0.2em] py-3 pr-12 focus:outline-none focus:border-[var(--theme-accent-bg,#fefae0)] transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--theme-accent-bg,#fefae0)] hover:text-current p-2 transition-colors"
                  aria-label="Submit Email"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
              {inquirySent && (
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-accent-bg,#fefae0)] mt-2 block animate-fade-in">
                  ✓ INQUIRY RECEIVED. WE WILL CONNECT SHORTLY.
                </span>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--theme-accent-bg,#fefae0)] hover:underline underline-offset-4 transition-colors"
              >
                + LEAVE A DIRECTOR / CLIENT ENDORSEMENT
              </button>
            </div>
          </div>

          {/* Right 6 Columns: Two columns of links using bold, tracked-out 11px uppercase text */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-10">
            {/* Column 1: Directory Links */}
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-50 border-b border-current/15 pb-2">
                DIRECTORY
              </span>
              <ul className="flex flex-col gap-3.5 text-[11px] font-bold uppercase tracking-[0.25em]">
                <li>
                  <a href="#projects" className="text-[var(--theme-accent-bg,#fefae0)] hover:text-current transition-colors">
                    01 • FEATURED FILMS
                  </a>
                </li>
                <li>
                  <a href="#photos" className="text-[var(--theme-accent-bg,#fefae0)] hover:text-current transition-colors">
                    02 • PHOTO STILLS &amp; BTS
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-[var(--theme-accent-bg,#fefae0)] hover:text-current transition-colors">
                    03 • STUDIO STATEMENT
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-[var(--theme-accent-bg,#fefae0)] hover:text-current transition-colors">
                    04 • CAPABILITIES
                  </a>
                </li>
                <li>
                  <a href="#experience" className="text-[var(--theme-accent-bg,#fefae0)] hover:text-current transition-colors">
                    05 • TIMELINE
                  </a>
                </li>
                <li>
                  <a href="#reviews" className="text-[var(--theme-accent-bg,#fefae0)] hover:text-current transition-colors">
                    06 • ENDORSEMENTS
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Connect & Contact */}
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-50 border-b border-current/15 pb-2">
                CONNECT
              </span>
              <ul className="flex flex-col gap-3.5 text-[11px] font-bold uppercase tracking-[0.25em]">
                <li>
                  <a
                    href={sanitizeUrl(data.heroStats?.youtubeUrl || data.about?.youtubeUrl, "https://youtube.com")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--theme-accent-bg,#fefae0)] hover:text-current flex items-center justify-between group transition-colors"
                  >
                    <span>YOUTUBE</span>
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a
                    href={sanitizeUrl(data.heroStats?.instagramUrl || data.about?.instagramUrl, "https://instagram.com/tusharmaru")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--theme-accent-bg,#fefae0)] hover:text-current flex items-center justify-between group transition-colors"
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
                    className="text-[var(--theme-accent-bg,#fefae0)] hover:text-current flex items-center justify-between group transition-colors"
                  >
                    <span>WHATSAPP</span>
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${data.about?.email || 'marutushar387@gmail.com'}`}
                    className="text-[var(--theme-accent-bg,#fefae0)] hover:text-current truncate block transition-colors"
                  >
                    {data.about?.email || 'MARUTUSHAR387@GMAIL.COM'}
                  </a>
                </li>
                <li>
                  <span className="opacity-70 block">
                    MUMBAI, MAHARASHTRA
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Brand Credits & Celebrity Collaborations Showcase ── */}
        <div className="py-12 border-b border-current/15 flex flex-col gap-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 block mb-4">
              CLIENTS, CAMPAIGNS &amp; PRODUCTIONS
            </span>
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {(data.brands || [
                'Zudio', 'Denver', 'Bewakoof', 'Maybelline', 'Godrej Fashion Week',
                'Chk Shoes', 'Wtflex', 'BharatMatrimony', 'Zee Cinema Awards 2025',
                'Off Campus', 'Newme', 'Khelo India'
              ]).map((brand: string, bIdx: number) => (
                <span
                  key={bIdx}
                  className="px-4 py-2 rounded-full bg-[var(--theme-accent-bg,#fefae0)]/10 border border-current/20 text-[var(--theme-accent-bg,#fefae0)] text-[11px] font-bold uppercase tracking-[0.2em]"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 block mb-4">
              CELEBRITY &amp; ARTIST BTS COLLABORATIONS
            </span>
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {(data.celebrities || [
                'Arijit Singh', 'Divine', 'Fukra Insaan', 'Palak Muchhal', 'Neha Bhasin', 'Monali Thakur'
              ]).map((celeb: string, cIdx: number) => (
                <span
                  key={cIdx}
                  className="px-4 py-2 rounded-full bg-current/15 border border-current/30 text-current text-[11px] font-bold uppercase tracking-[0.2em]"
                >
                  ★ {celeb}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Legal links with 30% opacity */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] opacity-40 font-sans uppercase tracking-[0.2em]">
          <span>&copy; {new Date().getFullYear()} TUSHAR MARU. ALL RIGHTS RESERVED.</span>
          <span>{data.settings?.footerHeading || 'EARTHY EDITORIAL STUDIO AESTHETIC'}</span>
        </div>
      </div>

      {/* Review Modal (PORTALED to document.body) */}
      {showReviewModal && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 text-[var(--theme-text,#01472e)]"
          onClick={() => setShowReviewModal(false)}
        >
          <div
            className="relative max-w-lg w-full bg-[var(--theme-accent-bg,#fefae0)] border border-[var(--theme-text,#01472e)]/20 rounded-[2.5rem] p-8 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 border-b border-current/15 pb-4">
              <h3 className="font-display uppercase text-2xl text-[var(--theme-text,#01472e)]">
                DIRECTOR / CLIENT ENDORSEMENT
              </h3>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="w-9 h-9 rounded-full bg-[var(--theme-text,#01472e)]/10 hover:bg-[var(--theme-dark-bg,#01472e)] text-[var(--theme-text,#01472e)] hover:text-[var(--theme-accent-bg,#fefae0)] flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <span className="text-4xl block mb-3 text-[var(--theme-text,#01472e)]">✓</span>
                <p className="font-display uppercase text-2xl text-[var(--theme-text,#01472e)]">ENDORSEMENT RECEIVED</p>
                <p className="text-xs opacity-70 mt-1 uppercase tracking-wider">
                  Pending review approval in studio dashboard.
                </p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setShowReviewModal(false); }}
                  className="mt-6 px-8 py-3 rounded-full bg-[var(--theme-dark-bg,#01472e)] text-[var(--theme-accent-bg,#fefae0)] text-[10px] font-bold uppercase tracking-[0.25em]"
                >
                  CLOSE
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 block mb-1">
                    YOUR NAME &amp; ROLE
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Saurabh Prajapati — Director"
                    className="w-full bg-current/5 border border-current/15 rounded-xl px-4 py-3 text-xs text-current focus:outline-none focus:border-current/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 block mb-1">
                    RATING
                  </label>
                  <div className="flex gap-1.5 text-[var(--theme-text,#01472e)]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={s <= rating ? 'text-current' : 'opacity-20'}
                      >
                        <Star size={20} fill={s <= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 block mb-1">
                    TESTIMONIAL STATEMENT
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Statement on working with Tushar on production / video edit..."
                    className="w-full bg-current/5 border border-current/15 rounded-xl px-4 py-3 text-xs text-current focus:outline-none focus:border-current/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-4 rounded-full bg-[var(--theme-dark-bg,#01472e)] text-[var(--theme-accent-bg,#fefae0)] text-[10px] font-bold uppercase tracking-[0.25em] hover:opacity-90 transition shadow-lg"
                >
                  SUBMIT ENDORSEMENT
                </button>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </footer>
  );
};
