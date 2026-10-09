import React from 'react';
import { defaultData, getWhatsAppLink } from '../../lib/store';
import { ArrowUpRight } from 'lucide-react';

interface AboutSectionProps {
  data: typeof defaultData;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ data }) => {
  return (
    <section id="about" className="py-28 px-6 sm:px-12 md:px-16 bg-[#FFFFFF] text-[#000000] font-sans border-b border-[#000000]/10">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Label */}
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#737373] mb-6 block">
          Studio Statement
        </span>

        {/* Centered Large Typography Statement */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-[-0.04em] leading-[1.2] text-[#000000] max-w-4xl">
          {data.about?.bio ||
            "Skilled videographer and editor with 2 years of experience in creating dynamic visual content. Proficient in Adobe Premiere Pro and After Effects. Known for meeting tight deadlines and producing high-quality, engaging narratives."}
        </h2>

        {/* Clean Metadata 3-Column Studio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-20 pt-12 border-t border-[#000000]/10 text-left">
          {/* Column 1 */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#737373]">[01 / DISCIPLINE]</span>
            <h3 className="font-bold text-lg text-[#000000]">Videography &amp; Direction</h3>
            <p className="text-sm text-[#525252] leading-relaxed">
              Celebrity behind-the-scenes shoots, commercial brand videos, live music events, and on-floor operational management.
            </p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#737373]">[02 / POST-PRODUCTION]</span>
            <h3 className="font-bold text-lg text-[#000000]">Editorial Suite</h3>
            <p className="text-sm text-[#525252] leading-relaxed">
              Adobe Premiere Pro &amp; After Effects. High-retention cuts, comedy pacing for creators, color grading, and beat sync.
            </p>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#737373]">[03 / CREDENTIALS]</span>
            <h3 className="font-bold text-lg text-[#000000]">Industry Endorsements</h3>
            <p className="text-sm text-[#525252] leading-relaxed">
              Sydenham College graduate. Direct references from Saurabh Prajapati and Uma &amp; Gaiti (Directors &amp; Choreographers).
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-14 flex items-center gap-4">
          <a
            href={getWhatsAppLink(data.settings?.whatsappPhone || data.about?.phone || "9324704934")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#000000] text-[#FFFFFF] font-mono text-xs uppercase tracking-[0.1em] hover:bg-[#333333] transition-colors duration-300"
          >
            <span>Initiate Project Inquiry</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};
