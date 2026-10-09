import React from 'react';
import { defaultData, getWhatsAppLink } from '../../lib/store';
import { ArrowUpRight } from 'lucide-react';

interface AboutSectionProps {
  data: typeof defaultData;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ data }) => {
  return (
    <section
      id="about"
      className="py-24 sm:py-32 px-6 sm:px-10 md:px-14 bg-[#ccd5ae] text-[#01472e] font-sans rounded-t-[5rem] relative z-20 shadow-[0_-25px_50px_-12px_rgba(1,71,46,0.15)] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Label */}
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#01472e]/70 mb-6 block">
          Editorial Statement — Index 03
        </span>

        {/* Centered Large Headline / Statement */}
        <h2 className="font-display uppercase text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.03em] text-[#01472e] max-w-5xl">
          CRAFTING HIGH-ENERGY VISUALS &amp; CINEMATIC NARRATIVES
        </h2>

        <p className="text-base sm:text-xl text-[#01472e]/85 max-w-3xl mx-auto mt-8 font-normal leading-relaxed">
          {data.about?.bio ||
            "Skilled freelance videographer and video editor with 2 years of extensive production experience. Specializing in high-energy commercial visuals, celebrity BTS shoots, brand campaigns, and post-production in Adobe Premiere Pro and After Effects."}
        </p>

        {/* 3-Column Metadata Cards with 2.5rem radius */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-20 pt-12 border-t border-[#01472e]/20 text-left">
          {/* Card 1 */}
          <div className="bg-[#fefae0]/70 p-8 rounded-[2.5rem] border border-[#01472e]/15 shadow-[0_20px_40px_-15px_rgba(1,71,46,0.15)] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#01472e]/60 block mb-2">
                [01 / PRODUCTION]
              </span>
              <h3 className="font-display uppercase text-2xl text-[#01472e] tracking-tight mb-3">
                Videography &amp; Sets
              </h3>
              <p className="text-xs sm:text-sm text-[#01472e]/80 leading-relaxed font-normal">
                Directing and operating commercial shoots, celebrity behind-the-scenes visuals, brand reels, and on-floor camera management.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#fefae0]/70 p-8 rounded-[2.5rem] border border-[#01472e]/15 shadow-[0_20px_40px_-15px_rgba(1,71,46,0.15)] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#01472e]/60 block mb-2">
                [02 / EDITORIAL]
              </span>
              <h3 className="font-display uppercase text-2xl text-[#01472e] tracking-tight mb-3">
                Post-Production Suite
              </h3>
              <p className="text-xs sm:text-sm text-[#01472e]/80 leading-relaxed font-normal">
                Mastery in Adobe Premiere Pro and After Effects. High-retention pacing, rhythm matching, comedy timing, and color science.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#fefae0]/70 p-8 rounded-[2.5rem] border border-[#01472e]/15 shadow-[0_20px_40px_-15px_rgba(1,71,46,0.15)] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#01472e]/60 block mb-2">
                [03 / CREDENTIALS]
              </span>
              <h3 className="font-display uppercase text-2xl text-[#01472e] tracking-tight mb-3">
                Industry Endorsements
              </h3>
              <p className="text-xs sm:text-sm text-[#01472e]/80 leading-relaxed font-normal">
                Sydenham College graduate. Direct references from Saurabh Prajapati and Uma &amp; Gaiti. On-set collaborations with Divine, Fukra Insaan, Neha Bhasin, Palak Muchhal, Monali Thakur, and Arijit Singh.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 flex items-center gap-4">
          <a
            href={getWhatsAppLink(data.settings?.whatsappPhone || data.about?.phone || "9324704934")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#01472e] text-[#fefae0] text-[11px] font-bold uppercase tracking-[0.25em] shadow-[0_15px_30px_-8px_rgba(1,71,46,0.35)] hover:scale-105 transition-all duration-300"
          >
            <span>START A CONVERSATION</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};
