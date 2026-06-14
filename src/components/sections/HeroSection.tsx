import React from 'react';
import { FadeIn } from '../FadeIn';
import { FloatingParticles } from '../FloatingParticles';
import { ParallaxEmoji } from '../ParallaxEmoji';
import { CountUp } from '../CountUp';
import { ContactButton } from '../ContactButton';
import { defaultData } from '../../lib/store';

const getAssetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${cleanBase}${cleanPath}`;
};

const GLASS_CAMERA = getAssetUrl('glass_camera.png');
const GLASS_CLAPPERBOARD = getAssetUrl('glass_clapperboard.png');

interface HeroSectionProps {
  data: typeof defaultData;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  return (
    <section className="min-h-screen w-full flex flex-col justify-between relative overflow-hidden py-6 bg-[#0C0C0D]">
      {/* Dynamic Ambient Motion Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-gradient-to-br from-[#7621B0]/15 via-[#B600A8]/10 to-transparent blur-[80px] sm:blur-[140px] animate-blob-slow" />
        <div className="absolute bottom-[10%] right-[10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-gradient-to-br from-[#BE4C00]/10 via-[#7621B0]/15 to-transparent blur-[80px] sm:blur-[140px] animate-blob-reverse" />
        <div className="absolute top-[40%] right-[20%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full bg-gradient-to-br from-indigo-900/10 via-[#B600A8]/10 to-transparent blur-[80px] sm:blur-[140px] animate-blob-slow" style={{ animationDelay: '-7s' }} />
        {/* Subtle mesh background grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.25]" />
      </div>

      <FloatingParticles />
      {/* Parallax Floating 3D Glass Assets */}
      <ParallaxEmoji src={GLASS_CLAPPERBOARD} alt="Clapperboard" className="top-[25%] left-[2%] sm:left-[5%] md:left-[8%]" rotation={-12} delay={0} parallaxY={-90} />
      <ParallaxEmoji src={GLASS_CAMERA} alt="Camera" className="top-[45%] right-[2%] sm:right-[5%] md:right-[8%]" rotation={15} delay={1.5} parallaxY={-60} />

      {/* Navbar */}
      <FadeIn delay={0} y={-20} as="nav" className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 px-6 sm:px-12 md:px-16 lg:px-24 pt-4 w-full z-20">
        <div className="font-bold text-base sm:text-lg md:text-xl text-[#D7E2EA] whitespace-nowrap">
          SAHIL THORAT<span className="text-[#BBCCD7]">.</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-[10px] sm:text-sm font-semibold uppercase tracking-widest text-[#D7E2EA]/70">
          {["About", "Campaigns", "Projects", "Websites", "Reviews", "Contact"].map((item) => (
            <a
              key={item}
              href={item === "Campaigns" ? "#campaigns" : `#${item.toLowerCase()}`}
              className="hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>
      </FadeIn>

      {/* Hero Heading Container */}
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 px-6 mt-12 sm:mt-8">
        <FadeIn delay={0.15} y={40} as="div" className="w-full text-center">
          <h1 className="hero-heading font-black uppercase tracking-wide leading-[0.9] text-[clamp(2.5rem,11.5vw,180px)] whitespace-normal lg:whitespace-nowrap mt-2">
            Hi, i&apos;m sahil
          </h1>
        </FadeIn>

        {/* Stats Counter Row */}
        <div className="flex flex-wrap gap-6 sm:gap-10 md:gap-14 pt-6 border-t border-white/5 w-full max-w-6xl mt-10 justify-center px-4">
          {[1, 2, 3, 4].map(n => {
            const value = (data.heroStats as any)[`stat${n}Value`] || '';
            const label = (data.heroStats as any)[`stat${n}Label`] || '';
            if (!value && !label) return null;
            return (
              <div key={n} className="text-center min-w-[80px] sm:min-w-[110px]">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#D7E2EA] mb-0.5 tracking-normal">
                  <CountUp end={value} suffix="+" />
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/40 font-semibold">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-end px-6 sm:px-12 md:px-16 lg:px-24 pb-4 w-full z-20">
        <FadeIn delay={0.5} y={20} className="ml-auto">
          <a
            href={`https://wa.me/${(data.settings?.whatsappPhone || '8082812805').replace(/\D/g, '').length === 10 ? '91' + (data.settings?.whatsappPhone || '8082812805').replace(/\D/g, '') : (data.settings?.whatsappPhone || '8082812805').replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ContactButton />
          </a>
        </FadeIn>
      </div>
    </section>
  );
};
