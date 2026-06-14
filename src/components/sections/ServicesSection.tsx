import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Film, Video, User, Briefcase, Globe, MessageSquare, ArrowRight } from 'lucide-react';
import { FadeIn } from '../FadeIn';
import { FloatingEmoji } from '../FloatingEmoji';
import { defaultData } from '../../lib/store';

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
    details: "End-to-end influencer marketing execution. We formulate tailored campaign strategies, scout matching content creators, coordinate briefs, manage deliveries, and track campaign ROI and conversion rates.",
  },
  {
    number: "02",
    name: "Video Production",
    description: "Coordinating events, shoot management, and editing celebrity BTS, music videos, reels, and high-energy brand content.",
    details: "High-end post-production, color grading, and creative editing. Experienced in directing shoots, managing video editing timelines, crafting celebrity BTS content, and editing high-engagement YouTube and Instagram Reels.",
  },
  {
    number: "03",
    name: "Artist Management",
    description: "Managing underground and commercial music creators, coordinating live stage schedules, and handling bookings.",
    details: "Empowering artists and content creators to focus on their art. We handle scheduling, stage coordination, commercial brand negotiations, performance bookings, and creator career strategy.",
  },
  {
    number: "04",
    name: "Brand Integration",
    description: "Formulating cohesive strategies that naturally bridge the creative flow of creators with the marketing guidelines of corporate clients.",
    details: "Building the strategic bridge between brand identity and creator authenticity. We design natural integrations that fit organic content while satisfying brand campaign guidelines.",
  },
  {
    number: "05",
    name: "Media Planning",
    description: "Setting up campaign structures, analyzing creator reach and reporting metrics, and developing conversion-focused brand briefs.",
    details: "Data-driven media campaigns. We analyze reach metrics, design detailed campaign briefs, establish key performance indicators, and present thorough analytical reports post-execution.",
  },
  {
    number: "06",
    name: "Website Development",
    description: "Designing and developing modern portfolio stores, beat-selling landing pages, and studio websites with responsive layouts.",
    details: "Interactive frontend experiences tailored for creative brands. Specializing in high-performance portfolios, beatstores, and recording studio landing pages built with clean code and premium animations.",
  },
];

export interface ServicesSectionProps {
  data: typeof defaultData;
  theme?: 'light' | 'dark';
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ data, theme = 'dark' }) => {
  const [activeService, setActiveService] = useState<typeof SERVICES[0] | null>(null);
  const isLight = theme === 'light';

  const getWhatsAppLink = (serviceName: string) => {
    const phone = data.settings?.whatsappPhone || '8082812805';
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const message = `Hi Sahil, I want to inquire about your "${serviceName}" service for my brand. Let's connect!`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className={`${isLight ? 'bg-white text-[#0C0C0C]' : 'bg-[#0C0C0C] text-[#D7E2EA]'} rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-16 sm:py-20 md:py-24 w-full relative z-20 shadow-2xl overflow-hidden bg-grid-pattern transition-colors duration-500`}>
      {/* Floating Decorative 3D Glass Assets */}
      <FloatingEmoji src={GLASS_CAMERA} alt="Camera" className="top-[25%] left-[2%] sm:left-[4%]" rotation={-15} delay={1.0} lightBg={isLight} />
      <FloatingEmoji src={GLASS_MEGAPHONE} alt="Megaphone" className="bottom-[25%] right-[2%] sm:right-[4%]" rotation={18} delay={1.2} lightBg={isLight} />

      <div className="max-w-[1400px] mx-auto flex flex-col items-center">
        <FadeIn delay={0} y={40} className="mb-8 text-center">
          <h2 className={`hero-heading font-black uppercase text-[clamp(2.5rem,7.5vw,110px)] leading-none tracking-wide ${isLight ? 'text-[#0C0C0C]' : ''} transition-colors duration-500`}>
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
              <Briefcase key="b" size={28} className="text-[#BBCCD7]" />,
              <Globe key="g" size={28} className="text-[#BBCCD7]" />
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
                  onClick={() => setActiveService(service)}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="bg-white/5 border border-white/5 hover:border-[#BBCCD7]/35 hover:bg-white/10 rounded-[24px] p-6 flex flex-col justify-between gap-4 group relative overflow-hidden hover-card-glow-dark cursor-pointer"
                  style={{ minHeight: '250px' }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#BBCCD7]/5 to-transparent rounded-bl-full pointer-events-none" />
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center w-full">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        {icon}
                      </div>
                      <span className="font-mono text-[10px] font-bold text-[#BBCCD7]/30 tracking-widest">
                        {service.number}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-bold uppercase text-white text-sm sm:text-base tracking-wide">
                        {service.name}
                      </h3>
                      <p className="font-light leading-relaxed text-[#D7E2EA]/70 text-xs sm:text-sm">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(getWhatsAppLink(service.name), '_blank', 'noopener,noreferrer');
                      }}
                      className="text-[10px] font-bold uppercase tracking-widest text-[#BBCCD7] hover:text-white flex items-center gap-1 transition"
                    >
                      Inquire <ArrowRight size={10} />
                    </button>
                    
                    <span className="text-[10px] font-medium text-[#D7E2EA]/30 group-hover:text-[#BBCCD7]/50 transition">
                      View details →
                    </span>
                  </div>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* Reusable Premium Popup Modal */}
      <AnimatePresence>
        {activeService && (
          <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setActiveService(null)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-full max-w-lg bg-[#121212] border border-white/10 rounded-[32px] p-6 sm:p-8 flex flex-col gap-6 relative shadow-2xl z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveService(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition text-[#D7E2EA]/60 hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  {SERVICES.findIndex(s => s.name === activeService.name) !== -1 ? [
                    <Sparkles key="s" size={24} className="text-[#BBCCD7]" />,
                    <Video key="v" size={24} className="text-[#BBCCD7]" />,
                    <User key="u" size={24} className="text-[#BBCCD7]" />,
                    <Film key="f" size={24} className="text-[#BBCCD7]" />,
                    <Briefcase key="b" size={24} className="text-[#BBCCD7]" />,
                    <Globe key="g" size={24} className="text-[#BBCCD7]" />
                  ][SERVICES.findIndex(s => s.name === activeService.name)] : null}
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-[#BBCCD7]/40 font-bold">Service {activeService.number}</span>
                  <h3 className="text-base sm:text-lg font-bold uppercase text-white tracking-wide">{activeService.name}</h3>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <p className="text-xs sm:text-sm font-light leading-relaxed text-[#D7E2EA]/85">
                  {activeService.details || activeService.description}
                </p>
              </div>



              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <a
                  href={getWhatsAppLink(activeService.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-500 border border-green-400/30 rounded-2xl text-xs font-bold uppercase tracking-wider text-white hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition flex items-center justify-center gap-2"
                >
                  <MessageSquare size={14} /> Inquire on WhatsApp
                </a>
                <button
                  onClick={() => setActiveService(null)}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-wider text-[#D7E2EA] hover:bg-white/10 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
