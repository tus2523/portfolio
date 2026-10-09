import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Film, Video, User, Briefcase, Globe, MessageSquare, ArrowRight } from 'lucide-react';
import { FadeIn } from '../FadeIn';
import { FloatingEmoji } from '../FloatingEmoji';
import { defaultData, getWhatsAppLink } from '../../lib/store';

const getAssetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${cleanBase}${cleanPath}`;
};

const GLASS_CAMERA = getAssetUrl('glass_camera.png');
const GLASS_MEGAPHONE = getAssetUrl('glass_megaphone.png');

const IconMap: { [key: string]: React.ComponentType<any> } = {
  sparkles: Sparkles,
  video: Video,
  user: User,
  film: Film,
  briefcase: Briefcase,
  globe: Globe,
};

export interface ServicesSectionProps {
  data: typeof defaultData;
  theme?: 'light' | 'dark';
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ data, theme = 'dark' }) => {
  const servicesList = data.services || [];
  const [activeService, setActiveService] = useState<any | null>(null);

  useEffect(() => {
    if (activeService) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [activeService]);

  const isLight = theme === 'light';

  const getServiceWhatsAppLink = (serviceName: string) => {
    const message = `Hi Tushar, I want to inquire about your "${serviceName}" videography & editing services. Let's connect!`;
    const phone = data.settings?.whatsappPhone || data.about?.phone || '9324704934';
    return getWhatsAppLink(phone, message);
  };

  return (
    <section id="services" className={`${isLight ? 'bg-[#FAF9F6] text-[#0C0C0C]' : 'bg-[#0C0C0C] text-[#D7E2EA]'} rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-16 sm:py-20 md:py-24 w-full relative ${activeService ? 'z-[99999]' : 'z-20'} shadow-2xl overflow-hidden bg-grid-pattern transition-colors duration-500 font-sans`}>
      {/* Floating Decorative 3D Glass Assets */}
      <FloatingEmoji src={GLASS_CAMERA} alt="Camera" className="top-[25%] left-[2%] sm:left-[4%]" rotation={-15} delay={1.0} lightBg={isLight} />
      <FloatingEmoji src={GLASS_MEGAPHONE} alt="Megaphone" className="bottom-[25%] right-[2%] sm:right-[4%]" rotation={18} delay={1.2} lightBg={isLight} />

      <div className="max-w-[1400px] mx-auto flex flex-col items-center relative z-10">
        <FadeIn delay={0} y={40} className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#7621B0] mb-2">Capabilities &amp; Production</p>
          <h2 className="font-display font-extrabold uppercase text-[clamp(2.5rem,7.5vw,100px)] leading-none tracking-tight">
            Creative Services
          </h2>
          <p className="font-editorial italic text-lg sm:text-2xl text-[#D7E2EA]/80 mt-3 max-w-2xl mx-auto">
            High-Impact Videography, Precision Editing &amp; Set Management
          </p>
        </FadeIn>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6 max-w-5xl">
          {servicesList.map((service, idx) => {
            const IconComp = IconMap[service.icon] || Video;
            const icon = <IconComp size={28} className="text-[#7621B0]" />;
            const serviceNumber = String(idx + 1).padStart(2, '0');

            return (
              <FadeIn
                key={service.id || idx}
                delay={idx * 0.08}
                y={20}
                className="shadow-xl"
              >
                <motion.div
                  onClick={() => setActiveService(service)}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className={`border rounded-[24px] p-6 flex flex-col justify-between gap-4 group relative overflow-hidden cursor-pointer ${
                    isLight 
                      ? 'bg-black/5 border-black/5 hover:border-black/20 hover:bg-black/10' 
                      : 'bg-white/5 border-white/5 hover:border-[#7621B0]/50 hover:bg-white/10'
                  }`}
                  style={{ minHeight: '230px' }}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center w-full">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center border bg-[#7621B0]/15 border-[#7621B0]/30 shadow-md">
                        {icon}
                      </div>
                      <span className="font-mono text-xs text-[#D7E2EA]/40 font-semibold tracking-wider">
                        [{serviceNumber}]
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold font-display uppercase tracking-wide text-white group-hover:text-[#7621B0] transition">
                        {service.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-light leading-relaxed mt-2 text-[#D7E2EA]/70">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#7621B0] uppercase tracking-wider mt-4">
                    <span>Learn More &amp; Inquire</span>
                    <ArrowRight size={13} className="transform group-hover:translate-x-1 transition duration-200" />
                  </div>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* Modal Popup for Service Details */}
      <AnimatePresence>
        {activeService && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveService(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-[#121214] border border-[#7621B0]/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 flex flex-col gap-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#7621B0]/20 border border-[#7621B0]/40 text-[#7621B0]">
                    {React.createElement(IconMap[activeService.icon] || Video, { size: 24 })}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#7621B0] font-bold">Service Overview</span>
                    <h3 className="text-2xl font-bold font-display uppercase text-white tracking-wide">{activeService.name}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveService(null)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D7E2EA]/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="text-sm font-light leading-relaxed text-[#D7E2EA]/80 whitespace-pre-line border-t border-white/5 pt-4">
                {activeService.details || activeService.description}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={getServiceWhatsAppLink(activeService.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#7621B0] hover:bg-[#611a93] text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition shadow-lg shadow-purple-900/30"
                >
                  <MessageSquare size={16} /> Inquire via WhatsApp
                </a>
                <button
                  onClick={() => setActiveService(null)}
                  className="px-6 py-3 rounded-xl border border-white/10 text-xs uppercase tracking-wider text-[#D7E2EA]/60 hover:text-white hover:bg-white/5 transition"
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
