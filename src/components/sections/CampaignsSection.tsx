import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn } from '../FadeIn';
import { FloatingEmoji } from '../FloatingEmoji';

const getAssetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${cleanBase}${cleanPath}`;
};

const GLASS_MEGAPHONE = getAssetUrl('glass_megaphone.png');
const GLASS_HEART = getAssetUrl('glass_heart.png');

const getBrandLogo = (brandName: string, logos: { name: string; logoUrl: string }[]) => {
  // Try to find a matching logo from admin-managed brand logos
  const match = logos.find(
    (l) => l.name && brandName && l.name.toLowerCase().includes(brandName.toLowerCase().split(' ')[0])
  );
  if (match?.logoUrl) {
    return (
      <img
        src={match.logoUrl}
        alt={match.name}
        className="w-5 h-5 rounded object-contain mr-2 flex-shrink-0 bg-white/5"
        onError={(e) => (e.currentTarget.style.display = 'none')}
      />
    );
  }
  // Fallback: coloured dot
  return <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40 mr-2 flex-shrink-0" />;
};

interface Creator {
  creator: string;
  profile: string;
  liveLink: string;
}

interface GroupedCampaigns {
  [brand: string]: {
    [campaign: string]: Creator[];
  };
}

interface CampaignsData {
  grouped: GroupedCampaigns;
  brands: string[];
  lastSync?: number;
}

interface BrandLogo {
  id: string;
  name: string;
  logoUrl: string;
}

interface CampaignsSectionProps {
  campaigns: CampaignsData;
  brandLogos?: BrandLogo[];
  theme?: 'light' | 'dark';
}

function extractInstagramHandle(url: string | undefined): string {
  if (!url) return '';
  const m = url.match(/instagram\.com\/([^/?#]+)/);
  return m ? '@' + m[1] : '';
}

export const CampaignsSection: React.FC<CampaignsSectionProps> = ({ campaigns, brandLogos = [], theme = 'light' }) => {
  const [activeBrandState, setActiveBrandState] = useState<string>('');
  const [openCampaignIdx, setOpenCampaignIdx] = useState<number | null>(null);
  
  const isLight = theme === 'light';

  // Derive activeBrand dynamically to avoid cascading useEffect state updates
  const activeBrand = activeBrandState && campaigns.brands.includes(activeBrandState)
    ? activeBrandState
    : (campaigns.brands[0] || '');

  const selectBrand = (brand: string) => {
    setActiveBrandState(brand);
    setOpenCampaignIdx(null);
  };


  return (
    <section id="campaigns" className={`${isLight ? 'bg-[#F4F3F6] text-[#0C0C0C] border-[#0C0C0C]/5' : 'bg-[#0C0C0C] text-[#D7E2EA] border-white/5'} rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-16 sm:py-20 md:py-24 w-full relative z-20 border-t shadow-inner -mt-10 overflow-hidden transition-colors duration-500`}>
      {/* Floating Decorative 3D Glass Assets */}
      <FloatingEmoji src={GLASS_MEGAPHONE} alt="Megaphone" className="top-[35%] left-[2%] sm:left-[4%]" rotation={-10} delay={1.4} lightBg={isLight} />
      <FloatingEmoji src={GLASS_HEART} alt="Heart" className="top-[50%] right-[2%] sm:right-[4%]" rotation={8} delay={1.6} lightBg={isLight} />

      <div className="max-w-[1400px] mx-auto flex flex-col items-center">
        <FadeIn delay={0} y={40} className="mb-10 text-center">
          <p className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold ${isLight ? 'text-[#0C0C0C]/55' : 'text-[#D7E2EA]/40'} mb-2`}>Influencer Marketing</p>
          <h2 className={`font-black uppercase ${isLight ? 'text-[#0C0C0C]' : 'text-[#D7E2EA]'} text-[clamp(2.5rem,7.5vw,110px)] leading-none tracking-wide transition-colors duration-500`}>
            Campaigns
          </h2>
        </FadeIn>
        {/* Brand Logos Marquee */}
        {brandLogos && brandLogos.length > 0 && (
          <div className="w-full overflow-hidden mb-12 relative group">
            <div className={`absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r ${isLight ? 'from-[#F4F3F6]' : 'from-[#0C0C0C]'} to-transparent z-10 pointer-events-none transition-colors duration-500`} />
            <div className={`absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l ${isLight ? 'from-[#F4F3F6]' : 'from-[#0C0C0C]'} to-transparent z-10 pointer-events-none transition-colors duration-500`} />
            
            <div className="animate-marquee flex whitespace-nowrap group-hover:[animation-play-state:paused] items-center gap-12 sm:gap-20 opacity-60 hover:opacity-100 transition-opacity duration-300 py-4">
              {[...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos].map((brand, idx) => (
                <div key={`${brand.id}-${idx}`} className="flex-shrink-0 flex items-center justify-center grayscale hover:grayscale-0 transition duration-300">
                  {brand.logoUrl ? (
                    <img src={brand.logoUrl} alt={brand.name} className="h-10 sm:h-14 object-contain max-w-[140px]" />
                  ) : (
                    <span className={`text-xl sm:text-2xl font-bold ${isLight ? 'text-[#0C0C0C]/50' : 'text-[#D7E2EA]/50'}`}>{brand.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {campaigns.brands && campaigns.brands.length > 0 ? (
          <div className="w-full flex flex-col items-center">
            {/* Brand Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center max-w-5xl">
              {campaigns.brands.map(brand => {
                const logo = getBrandLogo(brand, brandLogos);
                return (
                  <button
                    type="button"
                    key={brand}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      selectBrand(brand);
                    }}
                    className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 border flex items-center justify-center ${
                      activeBrand === brand 
                        ? 'bg-[#0C0C0C] text-white border-[#0C0C0C] shadow-lg shadow-black/10' 
                        : 'bg-white/70 text-[#0C0C0C]/60 border-[#0C0C0C]/10 hover:border-[#0C0C0C]/35 hover:text-[#0C0C0C] shadow-sm'
                    }`}
                  >
                    {logo}
                    <span>{brand}</span>
                  </button>
                );
              })}
            </div>

            {/* Accordion campaigns */}
            <div className="w-full border border-white/80 rounded-[32px] overflow-hidden bg-white/40 backdrop-blur-md shadow-2xl max-h-[65vh] overflow-y-auto scrollbar-thin">
              {Object.keys((campaigns && campaigns.grouped && activeBrand && campaigns.grouped[activeBrand]) || {}).map((campaignName, idx) => {
                const creators = (campaigns && campaigns.grouped && activeBrand && campaigns.grouped[activeBrand][campaignName]) || [];
                const isOpen = openCampaignIdx === idx;
                return (
                  <div key={idx} className="border-b border-[#0C0C0C]/10 last:border-b-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenCampaignIdx(isOpen ? null : idx);
                      }}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-white/30 transition duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs text-[#0C0C0C]/55 transition-transform duration-300 ${isOpen ? 'rotate-90 text-[#0C0C0C]' : ''}`}>
                          ▶
                        </span>
                        <span className="font-bold text-sm sm:text-base text-[#0C0C0C]">{campaignName}</span>
                      </div>
                      <span className="text-xs text-[#0C0C0C]/50 font-medium">
                        {creators.length} creator{creators.length !== 1 ? 's' : ''}
                      </span>
                    </button>
                    
                    {isOpen && (
                      <div className="bg-white/30 border-t border-[#0C0C0C]/5 p-5 max-h-[400px] overflow-y-auto scrollbar-thin">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {creators.map((c: any, cidx: number) => {
                            const handle = extractInstagramHandle(c.profile);
                            return (
                              <div key={cidx} className="bg-white/80 border border-white/90 rounded-2xl p-4 flex flex-col justify-between gap-3 premium-shadow-sm hover-card-glow hover:bg-white transition duration-200 group/creator">
                                <div>
                                  <div className="font-bold text-sm text-[#0C0C0C]">{c.creator}</div>
                                  {handle && (
                                    <a 
                                      href={c.profile} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs text-[#0C0C0C]/65 hover:text-[#0C0C0C] underline mt-0.5 inline-block font-semibold"
                                    >
                                      {handle}
                                    </a>
                                  )}
                                </div>
                                {c.liveLink && (
                                  <a 
                                    href={c.liveLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-full py-2 bg-[#0C0C0C] text-white hover:bg-black/90 rounded-xl text-[10px] font-bold uppercase tracking-wider transition duration-200 flex items-center justify-center gap-1"
                                  >
                                    View Post <ArrowUpRight size={10} />
                                  </a>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center text-[#0C0C0C]/40 py-8 font-medium">No campaigns loaded. Connect a campaign Google Sheet in the admin panel.</div>
        )}
      </div>
    </section>
  );
};
