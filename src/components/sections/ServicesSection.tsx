import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Film, Video, User, Briefcase, Globe, MessageSquare, ArrowRight, ChevronUp } from 'lucide-react';
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleService = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

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
        {/* Section Header with generous, safe spacing */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 sm:mb-20 border-b border-[#01472e]/15 pb-8 gap-6 sm:gap-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#01472e]/70 block mb-4 sm:mb-6">
              Capabilities — 04
            </span>
            <h2 className="font-display uppercase text-[clamp(3.5rem,13vw,170px)] leading-[0.92] tracking-[-0.04em] text-[#01472e]">
              SERVICES
            </h2>
          </div>

          <p className="max-w-xs text-xs sm:text-sm text-[#01472e]/80 leading-relaxed font-normal self-start lg:self-end">
            Complete production pipeline from camera operation to rhythm-synced final export.
          </p>
        </div>

        {/* 2-Column Services Grid with Smooth Inline Expansion (No Blocking Modals) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full items-start">
          {servicesList.map((service, idx) => {
            const IconComp = IconMap[service.icon] || Video;
            const serviceNumber = String(idx + 1).padStart(2, '0');
            const isExpanded = expandedId === service.id;

            return (
              <motion.div
                layout
                key={service.id || idx}
                onClick={() => toggleService(service.id)}
                className={`bg-[#fefae0] border ${
                  isExpanded ? 'border-[#01472e]/50 ring-2 ring-[#01472e]/20' : 'border-[#01472e]/15 hover:border-[#01472e]/35'
                } p-8 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(1,71,46,0.12)] flex flex-col justify-between gap-6 cursor-pointer transition-colors duration-300`}
              >
                <div className="flex flex-col gap-4">
                  {/* Top Bar: Icon + Number */}
                  <div className="flex justify-between items-center w-full">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#01472e] text-[#fefae0] shadow-md">
                      <IconComp size={22} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#01472e]/50">
                      [{serviceNumber}]
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <div>
                    <h3 className="font-display uppercase text-2xl text-[#01472e] tracking-tight">
                      {service.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-normal leading-relaxed mt-2 text-[#01472e]/80">
                      {service.description}
                    </p>
                  </div>

                  {/* Inline Expanded Details (Smooth reveal right in the card, never locks the page!) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden flex flex-col gap-4 pt-3 border-t border-[#01472e]/15"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="text-xs sm:text-sm text-[#01472e]/85 leading-relaxed font-normal whitespace-pre-line bg-[#01472e]/5 p-4 rounded-2xl border border-[#01472e]/10">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#01472e]/60 block mb-1">
                            PRODUCTION SCOPE &amp; WORKFLOW
                          </span>
                          {service.details || service.description}
                        </div>

                        <a
                          href={getServiceWhatsAppLink(service.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#01472e] hover:bg-[#023321] text-[#fefae0] font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.25em] shadow-[0_12px_24px_-6px_rgba(1,71,46,0.3)] transition-all duration-300"
                        >
                          <MessageSquare size={14} />
                          <span>INQUIRE ON WHATSAPP</span>
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Toggle Button */}
                <div className="flex items-center justify-between text-[10px] font-bold text-[#01472e] uppercase tracking-[0.25em] pt-4 border-t border-[#01472e]/10">
                  <span>{isExpanded ? 'COLLAPSE DETAILS' : 'DISCOVER DETAILS'}</span>
                  {isExpanded ? (
                    <ChevronUp size={15} className="text-[#01472e]" />
                  ) : (
                    <ArrowRight size={15} className="text-[#01472e] transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
