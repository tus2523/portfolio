import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Film, Video, User, Briefcase } from 'lucide-react';
import { FadeIn } from '../FadeIn';
import { FloatingEmoji } from '../FloatingEmoji';

const getAssetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${cleanBase}${cleanPath}`;
};

const GLASS_CAMERA = getAssetUrl('glass_camera.png');
const GLASS_MEGAPHONE = getAssetUrl('glass_megaphone.png');

const SERVICES = [
  {
    number: "01",
    name: "Influencer Campaigns",
    description: "Executing and managing campaign briefs for major brands like ICICI Bank, My11Circle, Flipkart, Sony SAB, and Tata Motors.",
  },
  {
    number: "02",
    name: "Video Production",
    description: "Coordinating events, shoot management, and editing celebrity BTS, music videos, reels, and high-energy brand content.",
  },
  {
    number: "03",
    name: "Artist Management",
    description: "Managing underground and commercial music creators, coordinating live stage schedules, and handling bookings.",
  },
  {
    number: "04",
    name: "Brand Integration",
    description: "Formulating cohesive strategies that naturally bridge the creative flow of creators with the marketing guidelines of corporate clients.",
  },
  {
    number: "05",
    name: "Media Planning",
    description: "Setting up campaign structures, analyzing creator reach and reporting metrics, and developing conversion-focused brand briefs.",
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section className="bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-16 sm:py-20 md:py-24 w-full relative z-20 shadow-2xl overflow-hidden bg-grid-pattern">
      {/* Floating Decorative 3D Glass Assets */}
      <FloatingEmoji src={GLASS_CAMERA} alt="Camera" className="top-[25%] left-[2%] sm:left-[4%]" rotation={-15} delay={1.0} />
      <FloatingEmoji src={GLASS_MEGAPHONE} alt="Megaphone" className="bottom-[25%] right-[2%] sm:right-[4%]" rotation={18} delay={1.2} />

      <div className="max-w-[1400px] mx-auto flex flex-col items-center">
        <FadeIn delay={0} y={40} className="mb-8 text-center">
          <h2 className="hero-heading font-black uppercase text-[clamp(2.5rem,7.5vw,110px)] leading-none tracking-wide">
            Services
          </h2>
        </FadeIn>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {SERVICES.map((service, idx) => {
            const icons = [
              <Sparkles key="s" size={28} className="text-[#BBCCD7]" />,
              <Video key="v" size={28} className="text-[#BBCCD7]" />,
              <User key="u" size={28} className="text-[#BBCCD7]" />,
              <Film key="f" size={28} className="text-[#BBCCD7]" />,
              <Briefcase key="b" size={28} className="text-[#BBCCD7]" />
            ];
            const icon = icons[idx] || icons[0];

            return (
              <FadeIn
                key={service.number}
                delay={idx * 0.06}
                y={20}
                className="shadow-xl"
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="bg-white/5 border border-white/5 hover:border-[#BBCCD7]/35 hover:bg-white/10 rounded-[24px] p-6 flex flex-col gap-4 group relative overflow-hidden hover-card-glow-dark cursor-default"
                  style={{ minHeight: '220px' }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#BBCCD7]/5 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex justify-between items-center w-full">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      {icon}
                    </div>
                    <span className="font-mono text-[10px] font-bold text-[#BBCCD7]/30 tracking-widest">
                      {service.number}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <h3 className="font-bold uppercase text-white text-sm sm:text-base tracking-wide">
                      {service.name}
                    </h3>
                    <p className="font-light leading-relaxed text-[#D7E2EA]/70 text-xs sm:text-sm">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};
