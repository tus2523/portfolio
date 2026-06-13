import React, { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { ConfettiEffect } from '../ConfettiEffect';
import { defaultData } from '../../lib/store';

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

  return (
    <footer id="contact" className="bg-[#121212]/50 border-t border-white/5 py-16 px-5 sm:px-8 md:px-10 relative z-20">
      <div className="max-w-[900px] mx-auto flex flex-col gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-[#D7E2EA] mb-4">
            Let&apos;s Work Together
          </h2>
          <p className="text-sm sm:text-base font-light leading-relaxed text-[#D7E2EA]/60">
            {data.about?.bio}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          {contactLinks.map((s, idx) => {
            const isExternal = !s.url?.startsWith('mailto:') && !s.url?.startsWith('tel:');
            
            // If it's the email link, wrap it with confetti effect for fun interactive micro-experience!
            if (s.title === "Email Me") {
              return (
                <div 
                  key={idx}
                  className="relative"
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
      <div className="max-w-[900px] mx-auto border-t border-white/5 mt-16 pt-8 text-center text-xs text-[#D7E2EA]/30">
        &copy; {new Date().getFullYear()} Sahil Thorat. All rights reserved.
      </div>
    </footer>
  );
};
