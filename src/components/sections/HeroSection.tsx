import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { defaultData } from '../../lib/store';

interface HeroSectionProps {
  data: typeof defaultData;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll listener (speed factor 0.05)
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: "Films", href: "#projects" },
    { label: "Stills", href: "#photos" },
    { label: "Services", href: "#services" },
    { label: "Timeline", href: "#experience" },
    { label: "References", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ];

  const floatingImages = [
    {
      src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
      alt: "Cinema Lens & Camera Focus",
      className: "top-[18%] left-[3%] sm:left-[5%] w-32 sm:w-44 md:w-56 aspect-[4/5]",
      speed: 0.04,
      delay: "0s",
      initialRotate: -4,
    },
    {
      src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop",
      alt: "Motion Picture Film Aesthetic",
      className: "top-[20%] right-[3%] sm:right-[5%] w-32 sm:w-44 md:w-56 aspect-[4/5]",
      speed: -0.04,
      delay: "1.5s",
      initialRotate: 5,
    },
    {
      src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop",
      alt: "Director & Editing Console",
      className: "top-[52%] right-[8%] hidden xl:block w-44 aspect-[4/3]",
      speed: 0.05,
      delay: "2.5s",
      initialRotate: -3,
    },
  ];

  const line1 = "TUSHAR";
  const line2 = "MARU";

  return (
    <>
      {/* ── Fixed Top Navigation ── */}
      <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-6 sm:px-10 md:px-14 py-5 pointer-events-auto">
        {/* Left: Logo with hyphen prefix */}
        <a
          href="#"
          className="text-[#01472e] text-lg sm:text-xl font-bold uppercase tracking-[0.2em] font-sans hover:opacity-80 transition-opacity"
        >
          - TUSHAR MARU
        </a>

        {/* Center: Pill-shaped navigation bar */}
        <nav className="hidden md:flex items-center gap-7 px-8 py-2.5 rounded-full bg-white/20 backdrop-blur-[20px] border border-[#01472e]/15 shadow-sm">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#01472e] text-[10px] font-bold uppercase tracking-[0.25em] hover:text-[#01472e]/70 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Plus / Menu Toggle Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-full bg-[#fefae0] text-[#01472e] border border-[#01472e]/20 flex items-center justify-center hover:bg-[#01472e] hover:text-[#fefae0] transition-colors duration-300 shadow-sm"
            aria-label="Toggle Navigation"
          >
            {menuOpen ? <X size={18} /> : <Plus size={18} />}
          </button>
        </div>
      </header>

      {/* ── Slide-out Menu Overlay (Forest #01472e with Sage #ccd5ae text) ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#01472e] z-40 flex flex-col justify-between p-8 sm:p-14 text-[#ccd5ae] pt-28"
          >
            <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ccd5ae]/60">
                Index Navigation
              </span>
              <div className="flex flex-col gap-3">
                {navLinks.map((link, idx) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display uppercase text-5xl sm:text-7xl leading-none text-[#fefae0] hover:text-[#ccd5ae] transition-colors flex items-center justify-between border-b border-[#ccd5ae]/20 pb-3"
                  >
                    <span>{link.label}</span>
                    <span className="font-sans text-xs uppercase tracking-[0.3em] text-[#ccd5ae]/50">
                      0{idx + 1}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row justify-between text-[11px] font-bold uppercase tracking-[0.25em] text-[#ccd5ae]/60 border-t border-[#ccd5ae]/20 pt-6 gap-2">
              <span>MUMBAI, MH — 400011</span>
              <span>MARUTUSHAR387@GMAIL.COM</span>
              <span>+91 9324704934</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero Section (Background Dynamic Theme) ── */}
      <section className="min-h-screen w-full flex flex-col justify-between pt-28 pb-20 sm:pb-28 px-6 sm:px-10 md:px-14 bg-[var(--theme-hero-bg,#ccd5ae)] text-[var(--theme-text,#01472e)] font-sans relative overflow-hidden select-none transition-colors duration-500">
        {/* Floating Organic Cards (Parallax + @keyframes float) */}
        {floatingImages.map((img, i) => {
          const parallaxOffset = scrollY * img.speed;
          return (
            <div
              key={i}
              className={`absolute ${img.className} z-10 pointer-events-none hidden sm:block`}
              style={{
                transform: `translateY(${parallaxOffset}px)`,
                transition: 'transform 0.1s linear',
              }}
            >
              <div
                className="w-full h-full overflow-hidden rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(1,71,46,0.22)] border border-[#01472e]/10 animate-float"
                style={{
                  animationDelay: img.delay,
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover filter saturate-110"
                  loading="eager"
                />
              </div>
            </div>
          );
        })}

        {/* Top Status Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] opacity-75 border-b border-current/15 pb-4 w-full relative z-20 gap-2.5 sm:gap-0">
          <span>TUSHAR MARU STUDIO</span>
          <span>COMMERCIAL VIDEOGRAPHER &amp; EDITOR</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
            AVAILABLE FOR COMMISSIONS
          </span>
        </div>

        {/* Centerpiece: Massive 'Anton' text with Staggered Letter Reveal */}
        <div className="my-auto py-4 sm:py-8 text-center flex flex-col items-center justify-center relative z-20">
          <div className="flex flex-col items-center justify-center w-full gap-1 sm:gap-2">
            {/* Row 1: TUSHAR */}
            <div className="overflow-hidden">
              <h1
                className="font-display uppercase tracking-[-0.03em] leading-[0.9] text-[var(--theme-text,#01472e)] flex justify-center text-[clamp(3.2rem,14vw,190px)] select-none"
                aria-label="TUSHAR"
              >
                {line1.split("").map((char, cIdx) => (
                  <motion.span
                    key={`l1-${cIdx}`}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{
                      delay: cIdx * 0.05,
                      duration: 1.0,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>
            </div>

            {/* Row 2: MARU */}
            <div className="overflow-hidden">
              <h1
                className="font-display uppercase tracking-[-0.03em] leading-[0.9] text-[var(--theme-text,#01472e)] flex justify-center text-[clamp(3.2rem,14vw,190px)] select-none"
                aria-label="MARU"
              >
                {line2.split("").map((char, cIdx) => (
                  <motion.span
                    key={`l2-${cIdx}`}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{
                      delay: (line1.length + cIdx) * 0.05,
                      duration: 1.0,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>
            </div>
          </div>
        </div>

        {/* Bottom: Dual-column descriptive text and location/origin labels */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 border-t border-[#01472e]/15 w-full relative z-20 items-end">
          {/* Left Column (7 cols): Descriptive Text */}
          <div className="md:col-span-7">
            <p className="text-sm sm:text-base md:text-lg text-[#01472e] font-normal leading-relaxed max-w-xl">
              {data.about?.bio ||
                "Skilled freelance videographer and video editor specializing in high-energy commercial visuals, celebrity behind-the-scenes shoots, and precision narrative editing across Mumbai & worldwide."}
            </p>
          </div>

          {/* Right Column (5 cols): Location & Origin Labels */}
          <div className="md:col-span-5 flex flex-col sm:items-end gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#01472e]/80">
            <span>MUMBAI, MH — 18.9220° N, 72.8347° E</span>
            <span>{data.heroStats?.stat1Value || "85+"} {data.heroStats?.stat1Label || "PROJECTS DELIVERED"}</span>
            <span className="text-[#01472e]">ADOBE PREMIERE PRO • AFTER EFFECTS</span>
          </div>
        </div>
      </section>
    </>
  );
};
