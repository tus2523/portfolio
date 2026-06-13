import React from 'react';
import { FadeIn } from '../FadeIn';
import { AnimatedText } from '../AnimatedText';
import { ContactButton } from '../ContactButton';
import { FloatingEmoji } from '../FloatingEmoji';
import { defaultData } from '../../lib/store';

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
}

export const AboutSection: React.FC<AboutSectionProps> = ({ data }) => {
  return (
    <section id="about" className="bg-white text-[#0C0C0C] py-16 sm:py-20 md:py-24 px-5 sm:px-8 md:px-10 w-full relative z-20 flex flex-col items-center justify-center gap-10 overflow-hidden shadow-inner">
      {/* Floating Decorative 3D Glass Assets */}
      <FloatingEmoji src={GLASS_MEGAPHONE} alt="Megaphone" className="top-[5%] md:top-[8%] left-[2%] sm:left-[4%] md:left-[6%]" rotation={-8} delay={0.2} lightBg={true} />
      <FloatingEmoji src={GLASS_SPARKLES} alt="Sparkles" className="top-[5%] md:top-[8%] right-[2%] sm:right-[4%] md:right-[6%]" rotation={12} delay={0.4} lightBg={true} />
      <FloatingEmoji src={GLASS_CLAPPERBOARD} alt="Clapperboard" className="bottom-[12%] left-[4%] sm:left-[8%] md:left-[10%]" rotation={-15} delay={0.6} lightBg={true} />
      <FloatingEmoji src={GLASS_HEART} alt="Heart" className="bottom-[12%] right-[4%] sm:right-[8%] md:right-[10%]" rotation={10} delay={0.8} lightBg={true} />

      <div className="flex flex-col items-center gap-8 max-w-7xl z-20 text-center w-full">
        {/* Profile Photo */}
        {data.about?.photoUrl && (
          <FadeIn delay={0} y={30}>
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto">
              {/* Rotating gradient ring */}
              <div className="absolute inset-0 rounded-full p-[3px] bg-gradient-to-br from-indigo-400 via-[#BBCCD7] to-purple-500 animate-blob-slow">
                <div className="w-full h-full rounded-full bg-white" />
              </div>
              <img
                src={data.about.photoUrl}
                alt="Sahil Thorat"
                className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] object-cover rounded-full z-10 shadow-2xl"
              />
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-indigo-400/10 blur-xl scale-110 pointer-events-none" />
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0} y={40}>
          <h2 className="font-black uppercase leading-none tracking-wide text-[#0C0C0C] text-[clamp(2.5rem,7.5vw,110px)]">
            About me
          </h2>
        </FadeIn>
        <AnimatedText 
          text={data.about?.bio || "I'm Sahil Thorat, a Content Producer and Influencer Marketer who spent more time in the editing room than in my MCA classes (but hey, I still graduated!). I bridge the gap between brands and creators with the precision of a keyframe and the wit of a viral caption."} 
          textColor="text-[#0C0C0C]" 
          className="tracking-wide"
        />
      </div>

      <FadeIn delay={0} y={30} className="z-20">
        <a href={`mailto:${data.about?.email || 'thoratsahil90@gmail.com'}`}>
          <ContactButton />
        </a>
      </FadeIn>
    </section>
  );
};
