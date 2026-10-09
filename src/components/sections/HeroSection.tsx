import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ArrowUpRight } from 'lucide-react';
import { defaultData } from '../../lib/store';

interface HeroSectionProps {
  data: typeof defaultData;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const name = "TUSHAR MARU";

  const navLinks = [
    { label: "Projects", href: "#projects" },
    { label: "Gallery", href: "#photos" },
    { label: "Services", href: "#services" },
    { label: "Experience", href: "#experience" },
    { label: "References", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* ── Fixed Header with mix-blend-mode: difference ── */}
      <header
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 sm:px-12 md:px-16 py-6 pointer-events-auto"
        style={{ mixBlendMode: 'difference' }}
      >
        {/* Left side: Lowercase Studio Logo */}
        <a
          href="#"
          className="text-white text-2xl font-bold tracking-tighter uppercase font-sans hover:opacity-75 transition-opacity duration-300"
        >
          tm<span className="text-white/40">.</span>
        </a>

        {/* Center / Right Links on Desktop */}
        <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-[0.15em] text-white/80">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#admin"
            className="text-white font-bold border border-white/30 px-3 py-1 rounded hover:bg-white hover:text-black transition duration-300"
          >
            Admin
          </a>
        </div>

        {/* Right side: Plus Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition duration-300"
          aria-label="Toggle Navigation"
        >
          {menuOpen ? <X size={18} /> : <Plus size={18} />}
        </button>
      </header>

      {/* ── Slide-out Menu Overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#0A0A0A] z-40 flex flex-col justify-between p-8 sm:p-16 text-white pt-28"
          >
            <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
              <span className="font-mono text-xs text-[#737373] uppercase tracking-[0.2em]">Navigation Index</span>
              <div className="flex flex-col gap-4">
                {navLinks.map((link, idx) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-4xl sm:text-6xl font-bold tracking-tight hover:text-[#737373] transition-colors duration-300 flex items-center justify-between border-b border-white/10 pb-3"
                  >
                    <span>{link.label}</span>
                    <span className="font-mono text-sm text-[#737373]">0{idx + 1}</span>
                  </a>
                ))}
                <a
                  href="#admin"
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-mono uppercase tracking-wider text-white/60 hover:text-white pt-4 flex items-center gap-2"
                >
                  Admin Control Panel <ArrowUpRight size={18} />
                </a>
              </div>
            </div>

            <div className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row justify-between text-xs font-mono text-[#737373] border-t border-white/10 pt-6">
              <span>MUMBAI, INDIA — 400011</span>
              <span>MARUTUSHAR387@GMAIL.COM</span>
              <span>+91 9324704934</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero Section ── */}
      <section className="min-h-[85vh] w-full flex flex-col justify-between pt-32 pb-12 px-6 sm:px-12 md:px-16 bg-[#FFFFFF] text-[#000000] font-sans relative overflow-hidden">
        {/* Top Metadata Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs font-mono uppercase tracking-[0.1em] text-[#737373] border-b border-[#000000]/10 pb-4 w-full">
          <span>Tushar Maru Studio</span>
          <span>Videographer &amp; Video Editor</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
            Available For Commissions
          </span>
        </div>

        {/* Center Display Headline: Staggered Letter Reveal */}
        <div className="my-auto py-12 text-center flex flex-col items-center">
          <div className="overflow-hidden">
            <h1
              className="font-bold tracking-[-0.05em] leading-[0.88] select-none text-[#000000] flex flex-wrap justify-center text-[clamp(3.2rem,12vw,180px)]"
              aria-label={name}
            >
              {name.split(" ").map((word, wIdx) => (
                <span key={wIdx} className="inline-flex whitespace-nowrap mx-[0.15em]">
                  {word.split("").map((char, cIdx) => (
                    <motion.span
                      key={cIdx}
                      initial={{ y: "110%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{
                        delay: (wIdx * 6 + cIdx) * 0.04,
                        duration: 1.0,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>
          </div>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-2xl md:text-[24px] text-[#525252] max-w-3xl mx-auto mt-8 font-normal tracking-[-0.02em] leading-snug px-4"
          >
            Specializing in high-energy video editing, celebrity behind-the-scenes shoots, commercial brand promos, and narrative post-production.
          </motion.p>
        </div>

        {/* Bottom Hero Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[#000000]/10 w-full text-left">
          {[
            { val: data.heroStats?.stat1Value || "50+", label: data.heroStats?.stat1Label || "Videos Edited" },
            { val: data.heroStats?.stat2Value || "20+", label: data.heroStats?.stat2Label || "Brand Shoots" },
            { val: data.heroStats?.stat3Value || "15+", label: data.heroStats?.stat3Label || "Celebrities BTS" },
            { val: data.heroStats?.stat4Value || "2+", label: data.heroStats?.stat4Label || "Years Exp." },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="font-bold text-2xl sm:text-3xl text-[#000000] tracking-[-0.04em]">
                {item.val}
              </span>
              <span className="text-[11px] sm:text-[13px] font-mono uppercase tracking-[0.1em] text-[#737373] mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
