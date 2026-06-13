import React, { useState } from 'react';
import { Instagram, Linkedin, Youtube, Mail, Phone } from 'lucide-react';
import { ConfettiEffect } from '../ConfettiEffect';
import { defaultData } from '../../lib/store';

interface FooterSectionProps {
  data: typeof defaultData;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ data }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  return (
    <footer id="contact" className="bg-[#121212]/50 border-t border-white/5 py-12 px-5 sm:px-8 md:px-10 relative z-20">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between gap-10">
        <div className="max-w-xl">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-[#D7E2EA] mb-3">
            Let&apos;s Work Together
          </h2>
          <p className="text-sm sm:text-base font-light leading-relaxed text-[#D7E2EA]/60 mb-5">
            {data.about?.bio}
          </p>
          <div className="flex gap-4">
            {[
              { url: data.heroStats?.instagramUrl, icon: <Instagram size={20} /> },
              { url: data.heroStats?.linkedinUrl, icon: <Linkedin size={20} /> },
              { url: data.heroStats?.youtubeUrl, icon: <Youtube size={20} /> },
            ].filter(s => s.url).map((s, idx) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#D7E2EA]/60 hover:text-white hover:border-[#BBCCD7]/40 hover:-translate-y-0.5 transition duration-300"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-3 justify-end min-w-[240px]">
          {data.about?.email && (
            <div
              className="relative"
              onClick={() => { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 150); }}
            >
              <ConfettiEffect trigger={showConfetti} />
              <a
                href={`mailto:${data.about.email}`}
                className="flex items-center gap-4 px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-[#BBCCD7]/35 transition"
              >
                <Mail size={18} className="text-[#BBCCD7]" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-[#D7E2EA]/40 font-semibold">Email Me</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#D7E2EA]">{data.about.email}</span>
                </div>
              </a>
            </div>
          )}
          {data.about?.phone && (
            <a
              href={`tel:${data.about.phone}`}
              className="flex items-center gap-4 px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-[#BBCCD7]/35 transition"
            >
              <Phone size={18} className="text-[#BBCCD7]" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-widest text-[#D7E2EA]/40 font-semibold">Call Me</span>
                <span className="text-xs sm:text-sm font-semibold text-[#D7E2EA]">{data.about.phone}</span>
              </div>
            </a>
          )}
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto border-t border-white/5 mt-12 pt-6 text-center text-xs text-[#D7E2EA]/30">
        &copy; {new Date().getFullYear()} Sahil Thorat. All rights reserved.
      </div>
    </footer>
  );
};
