import React from 'react';
import { FadeIn } from '../FadeIn';
import { AnimatedText } from '../AnimatedText';
import { ContactButton } from '../ContactButton';
import { FloatingEmoji } from '../FloatingEmoji';
import { defaultData, getWhatsAppLink } from '../../lib/store';
import { Mail, GraduationCap, Award } from 'lucide-react';

const getAssetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${cleanBase}${cleanPath}`;
};

const GLASS_CLAPPERBOARD = getAssetUrl('glass_clapperboard.png');
const GLASS_MEGAPHONE = getAssetUrl('glass_megaphone.png');
const GLASS_SPARKLES = getAssetUrl('glass_sparkles.png');
const GLASS_HEART = getAssetUrl('glass_heart.png');

interface AboutSectionProps {
  data: typeof defaultData;
  theme?: 'light' | 'dark';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ data, theme = 'dark' }) => {
  const isLight = theme === 'light';

  return (
    <section id="about" className={`${isLight ? 'bg-[#FAF9F6] text-[#0C0C0C]' : 'bg-[#0C0C0C] text-[#D7E2EA]'} py-16 sm:py-20 md:py-24 px-5 sm:px-8 md:px-10 w-full relative z-20 flex flex-col items-center justify-center gap-10 overflow-hidden shadow-inner transition-colors duration-500`}>
      {/* Floating Decorative 3D Glass Assets */}
      <FloatingEmoji src={GLASS_MEGAPHONE} alt="Megaphone" className="top-[5%] md:top-[8%] left-[2%] sm:left-[4%] md:left-[6%]" rotation={-8} delay={0.2} lightBg={isLight} />
      <FloatingEmoji src={GLASS_SPARKLES} alt="Sparkles" className="top-[5%] md:top-[8%] right-[2%] sm:right-[4%] md:right-[6%]" rotation={12} delay={0.4} lightBg={isLight} />
      <FloatingEmoji src={GLASS_CLAPPERBOARD} alt="Clapperboard" className="bottom-[12%] left-[4%] sm:left-[8%] md:left-[10%]" rotation={-15} delay={0.6} lightBg={isLight} />
      <FloatingEmoji src={GLASS_HEART} alt="Heart" className="bottom-[12%] right-[4%] sm:right-[8%] md:right-[10%]" rotation={10} delay={0.8} lightBg={isLight} />

      <div className="flex flex-col items-center gap-8 max-w-6xl relative z-10 text-center w-full">
        {/* Profile Photo */}
        {data.about?.photoUrl && (
          <FadeIn delay={0} y={30}>
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto">
              <div className="absolute inset-0 rounded-full p-[3px] bg-gradient-to-br from-[#7621B0] via-purple-400 to-indigo-500 animate-blob-slow">
                <div className={`w-full h-full rounded-full ${isLight ? 'bg-white' : 'bg-[#0C0C0C]'}`} />
              </div>
              <img
                src={data.about.photoUrl}
                alt="Tushar Maru"
                className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] object-cover rounded-full z-10 shadow-2xl"
              />
              <div className="absolute inset-0 rounded-full bg-[#7621B0]/20 blur-xl scale-110 pointer-events-none" />
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0} y={40}>
          <h2 className={`font-black uppercase leading-none tracking-wide ${isLight ? 'text-[#0C0C0C]' : 'text-[#D7E2EA]'} text-[clamp(2.5rem,7.5vw,100px)] transition-colors duration-500`}>
            About Tushar
          </h2>
        </FadeIn>

        <AnimatedText 
          text={data.about?.bio || "Skilled videographer and editor with 2 years of experience in creating dynamic visual content. Proficient in Adobe Premiere Pro and After Effects."} 
          textColor={isLight ? "text-[#0C0C0C]" : "text-[#D7E2EA]"} 
          className="tracking-wide text-center"
        />

        {/* Contact & Education Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-6 text-left">
          {/* Contact info card */}
          <div className="bg-[#141414] p-5 rounded-2xl border border-[#D7E2EA]/10 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#7621B0] font-bold text-sm">
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </div>
            <div className="text-xs text-[#D7E2EA]/80 space-y-1">
              <p><strong className="text-white">Email:</strong> {data.about?.email || 'marutushar387@gmail.com'}</p>
              <p><strong className="text-white">Phone:</strong> {data.about?.phone || '+91 9324704934'}</p>
              <p><strong className="text-white">Location:</strong> Mumbai, India</p>
            </div>
          </div>

          {/* Education card */}
          <div className="bg-[#141414] p-5 rounded-2xl border border-[#D7E2EA]/10 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#7621B0] font-bold text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>Education</span>
            </div>
            <div className="text-xs text-[#D7E2EA]/80 space-y-2">
              <div>
                <p className="font-semibold text-white">Sydenham College of Commerce &amp; Economics</p>
                <p className="text-[11px] text-[#D7E2EA]/60">Graduated (2006 – 2008)</p>
              </div>
              <div>
                <p className="font-semibold text-white">St. Ignatius High School</p>
                <p className="text-[11px] text-[#D7E2EA]/60">10th Passed (2017 – 2018)</p>
              </div>
            </div>
          </div>

          {/* References card */}
          <div className="bg-[#141414] p-5 rounded-2xl border border-[#D7E2EA]/10 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#7621B0] font-bold text-sm">
              <Award className="w-4 h-4" />
              <span>References</span>
            </div>
            <div className="text-xs text-[#D7E2EA]/80 space-y-2">
              <div>
                <p className="font-semibold text-white">Saurabh Prajapati</p>
                <p className="text-[11px] text-[#D7E2EA]/60">Director &amp; Choreographer</p>
              </div>
              <div>
                <p className="font-semibold text-white">Uma &amp; Gaiti</p>
                <p className="text-[11px] text-[#D7E2EA]/60">Director &amp; Choreographer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FadeIn delay={0} y={30} className="relative z-10 mt-4">
        <a
          href={getWhatsAppLink(data.settings?.whatsappPhone || '9324704934')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ContactButton />
        </a>
      </FadeIn>
    </section>
  );
};
