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

const getBrandLogo = (brandName: string) => {
  const name = brandName.toLowerCase();
  if (name.includes('flipkart')) {
    return (
      <svg className="w-4 h-4 mr-1.5 flex-shrink-0 text-amber-500 fill-amber-500" viewBox="0 0 24 24">
        <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z"/>
      </svg>
    );
  }
  if (name.includes('tata')) {
    return (
      <svg className="w-4 h-4 mr-1.5 flex-shrink-0 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 9 L12 13 L16 9 M12 13 L12 17" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name.includes('icici')) {
    return (
      <svg className="w-4 h-4 mr-1.5 flex-shrink-0 text-orange-500 fill-current" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M9 7h6v2H9V7zm2 4h2v6h-2v-6z" fill="#f59e0b" />
      </svg>
    );
  }
  if (name.includes('sab') || name.includes('sony')) {
    return (
      <svg className="w-4 h-4 mr-1.5 flex-shrink-0 text-red-600 fill-current" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }
  if (name.includes('my11') || name.includes('circle')) {
    return (
      <svg className="w-4 h-4 mr-1.5 flex-shrink-0 text-red-700 fill-current" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8l1.2 2.4 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4L12 8z" fill="#ffffff" />
      </svg>
    );
  }
  return null;
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

interface CampaignsSectionProps {
  campaigns: CampaignsData;
}

function extractInstagramHandle(url: string | undefined): string {
  if (!url) return '';
  const m = url.match(/instagram\.com\/([^/?#]+)/);
  return m ? '@' + m[1] : '';
}

export const CampaignsSection: React.FC<CampaignsSectionProps> = ({ campaigns }) => {
  const [activeBrandState, setActiveBrandState] = useState<string>('');
  const [openCampaignIdx, setOpenCampaignIdx] = useState<number | null>(null);

  // Derive activeBrand dynamically to avoid cascading useEffect state updates
  const activeBrand = activeBrandState && campaigns.brands.includes(activeBrandState)
    ? activeBrandState
    : (campaigns.brands[0] || '');

  const selectBrand = (brand: string) => {
    setActiveBrandState(brand);
    setOpenCampaignIdx(null);
  };


  return (
    <section id="campaigns" className="bg-[#F4F3F6] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-16 sm:py-20 md:py-24 w-full relative z-20 border-t border-[#0C0C0C]/5 shadow-inner -mt-10 overflow-hidden">
      {/* Floating Decorative 3D Glass Assets */}
      <FloatingEmoji src={GLASS_MEGAPHONE} alt="Megaphone" className="top-[35%] left-[2%] sm:left-[4%]" rotation={-10} delay={1.4} lightBg={true} />
      <FloatingEmoji src={GLASS_HEART} alt="Heart" className="top-[50%] right-[2%] sm:right-[4%]" rotation={8} delay={1.6} lightBg={true} />

      <div className="max-w-[1400px] mx-auto flex flex-col items-center">
        <FadeIn delay={0} y={40} className="mb-10 text-center">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#0C0C0C]/55 mb-2">Influencer Marketing</p>
          <h2 className="font-black uppercase text-[#0C0C0C] text-[clamp(2.5rem,7.5vw,110px)] leading-none tracking-wide">
            Campaigns
          </h2>
        </FadeIn>
        
        {campaigns.brands && campaigns.brands.length > 0 ? (
          <div className="w-full flex flex-col items-center">
            {/* Brand Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center max-w-5xl">
              {campaigns.brands.map(brand => {
                const logo = getBrandLogo(brand);
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
            <div className="w-full border border-white/80 rounded-[32px] overflow-hidden bg-white/40 backdrop-blur-md shadow-2xl">
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
                      <div className="bg-white/30 border-t border-[#0C0C0C]/5 p-5">
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
