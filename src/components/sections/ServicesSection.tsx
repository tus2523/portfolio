import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Film, Video, User, Briefcase, Globe, MessageSquare, ArrowRight } from 'lucide-react';
import { defaultData, getWhatsAppLink } from '../../lib/store';

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

export const ServicesSection: React.FC<ServicesSectionProps> = ({ data }) => {
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

  const getServiceWhatsAppLink = (serviceName: string) => {
    const message = `Hi Tushar, I want to inquire about your "${serviceName}" videography & editing services. Let's connect!`;
    const phone = data.settings?.whatsappPhone || data.about?.phone || '9324704934';
    return getWhatsAppLink(phone, message);
  };

  return (
    <section
      id="services"
      className="py-24 sm:py-32 px-6 sm:px-10 md:px-14 bg-[#e9edc9] text-[#01472e] font-sans rounded-t-[5rem] relative z-20 shadow-[0_-25px_50px_-12px_rgba(1,71,46,0.15)] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 sm:mb-20 border-b border-[#01472e]/15 pb-8 gap-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#01472e]/70 block mb-2">
              Capabilities — 04
            </span>
            <h2 className="font-display uppercase text-[15vw] leading-[0.8] tracking-[-0.05em] text-[#01472e]">
              SERVICES
            </h2>
          </div>

          <p className="max-w-xs text-xs sm:text-sm text-[#01472e]/80 leading-relaxed font-normal self-start lg:self-end">
            Complete production pipeline from camera operation to rhythm-synced final export.
          </p>
        </div>

        {/* 2-Column or 3-Column Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
          {servicesList.map((service, idx) => {
            const IconComp = IconMap[service.icon] || Video;
            const serviceNumber = String(idx + 1).padStart(2, '0');

            return (
              <div
                key={service.id || idx}
                onClick={() => setActiveService(service)}
                className="bg-[#fefae0] border border-[#01472e]/15 hover:border-[#01472e]/40 p-8 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(1,71,46,0.12)] flex flex-col justify-between gap-6 group cursor-pointer transition-all duration-500 hover:-translate-y-2"
                style={{ minHeight: '260px' }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center w-full">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#01472e] text-[#fefae0] shadow-md">
                      <IconComp size={22} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#01472e]/50">
                      [{serviceNumber}]
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display uppercase text-2xl text-[#01472e] tracking-tight group-hover:opacity-85 transition-opacity">
                      {service.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-normal leading-relaxed mt-2 text-[#01472e]/80">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-[#01472e] uppercase tracking-[0.25em] pt-4 border-t border-[#01472e]/10">
                  <span>DISCOVER DETAILS</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Details Modal (PORTALED to document.body to prevent clipping!) */}
      <AnimatePresence>
        {activeService && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveService(null)}
              className="absolute inset-0 bg-[#01472e]/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl bg-[#fefae0] border border-[#01472e]/20 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] z-10 flex flex-col gap-6 text-[#01472e]"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#01472e] text-[#fefae0] shadow-lg">
                    {React.createElement(IconMap[activeService.icon] || Video, { size: 26 })}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#01472e]/60">
                      Production Offering
                    </span>
                    <h3 className="font-display uppercase text-3xl text-[#01472e] tracking-tight">
                      {activeService.name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveService(null)}
                  className="w-10 h-10 rounded-full bg-[#01472e]/10 hover:bg-[#01472e] text-[#01472e] hover:text-[#fefae0] flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="text-sm font-normal leading-relaxed text-[#01472e]/85 whitespace-pre-line border-t border-[#01472e]/15 pt-5">
                {activeService.details || activeService.description}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <a
                  href={getServiceWhatsAppLink(activeService.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#01472e] hover:bg-[#023321] text-[#fefae0] font-bold py-4 px-6 rounded-full flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.25em] shadow-[0_15px_30px_-8px_rgba(1,71,46,0.35)] transition"
                >
                  <MessageSquare size={14} /> INQUIRE ON WHATSAPP
                </a>
                <button
                  onClick={() => setActiveService(null)}
                  className="px-6 py-4 rounded-full border border-[#01472e]/20 text-[10px] font-bold uppercase tracking-[0.25em] text-[#01472e] hover:bg-[#01472e]/10 transition"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </section>
  );
};
