export interface PhotoItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  date?: string;
}

export const defaultData = {
  heroStats: {
    stat1Value: '50+',
    stat1Label: 'Videos Edited',
    stat2Value: '20+',
    stat2Label: 'Brand Shoots',
    stat3Value: '15+',
    stat3Label: 'Celebrities BTS',
    stat4Value: '2+',
    stat4Label: 'Years Exp.',
    instagramUrl: 'https://instagram.com/tusharmaru',
    linkedinUrl: '',
    youtubeUrl: 'https://youtube.com',
  },
  photos: [
    // 1. Celebrity BTS
    {
      id: 'ph1',
      title: 'Celebrity BTS On-Set Focus',
      category: 'Celebrity BTS',
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
      description: 'Behind the scenes camera setup for high-profile celebrity brand shoot in Mumbai.',
      date: '2024'
    },
    {
      id: 'ph1_2',
      title: 'Backstage Celebrity Lighting & Rig',
      category: 'Celebrity BTS',
      imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop',
      description: 'Handheld gimbal and prime lens setup during celebrity wardrobe change.',
      date: '2024'
    },
    {
      id: 'ph1_3',
      title: 'Vanity & Floor Coordination',
      category: 'Celebrity BTS',
      imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop',
      description: 'Directing behind-the-scenes moments before the main commercial takes.',
      date: '2024'
    },
    {
      id: 'ph1_4',
      title: 'Director & Talent Interaction',
      category: 'Celebrity BTS',
      imageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1000&auto=format&fit=crop',
      description: 'On-set frame check with the director and celebrity artist.',
      date: '2024'
    },

    // 2. Commercial & Brand Shoots
    {
      id: 'ph5',
      title: 'Luxury Fashion Brand Promo',
      category: 'Commercial',
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
      description: 'High-speed camera tracking on studio turntable setup in Mumbai.',
      date: '2024'
    },
    {
      id: 'ph5_2',
      title: 'Commercial Product Lighting',
      category: 'Commercial',
      imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop',
      description: 'Macro cinematography and atmospheric smoke haze for beverage commercial.',
      date: '2024'
    },
    {
      id: 'ph5_3',
      title: 'Apparel Studio Campaign',
      category: 'Commercial',
      imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop',
      description: 'Editorial grade camera movement and lighting for designer apparel brand.',
      date: '2023'
    },
    {
      id: 'ph6',
      title: 'Cinematic Event & Heritage Production',
      category: 'Commercial',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
      description: 'Cinematic wedding storytelling & event highlights filming.',
      date: '2023'
    },

    // 3. Music Videos & Live Events
    {
      id: 'ph2',
      title: 'Live Music Concert Visuals',
      category: 'Live Events',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
      description: 'Dynamic stage videography and crowd atmosphere capture at EDM music festival.',
      date: '2024'
    },
    {
      id: 'ph3',
      title: 'Music Album Shoot On-Set',
      category: 'Live Events',
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
      description: 'Cinematic lighting setup and associate direction during music video filming.',
      date: '2023'
    },
    {
      id: 'ph3_3',
      title: 'Underground Hip-Hop Music Video',
      category: 'Live Events',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop',
      description: 'Location shoot in Mumbai streets with smoke, wide angle lenses, and fast cuts.',
      date: '2024'
    },
    {
      id: 'ph3_4',
      title: 'Dance Choreography Film Cut',
      category: 'Live Events',
      imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000&auto=format&fit=crop',
      description: 'Dynamic tracking shots following choreography with Uma & Gaiti.',
      date: '2023'
    },

    // 4. Edit Suite & Post Production
    {
      id: 'ph4',
      title: 'Premiere Pro Timeline Master',
      category: 'Editing',
      imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop',
      description: 'Multi-cam sync timeline workflow & color grading setup for commercial reels.',
      date: '2024'
    },
    {
      id: 'ph4_2',
      title: 'Audio Beat Matching & SFX Suite',
      category: 'Editing',
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
      description: 'Precision rhythmic cut markers, sound design risers, and Foley integration.',
      date: '2024'
    },
    {
      id: 'ph4_3',
      title: 'DaVinci Resolve Color Grading',
      category: 'Editing',
      imageUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1000&auto=format&fit=crop',
      description: 'Creating custom film emulation LUTs and balanced skin tones for commercial export.',
      date: '2024'
    },
    {
      id: 'ph4_4',
      title: 'After Effects Visual Motion Suite',
      category: 'Editing',
      imageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1000&auto=format&fit=crop',
      description: 'Kinetic typography, motion graphics, and clean screen replacements.',
      date: '2024'
    }
  ] as PhotoItem[],
  videoProjects: [
    {
      id: 'vp1',
      title: 'Zee Cinema Awards 2025',
      description: 'Celebrity red carpet coverage, backstage star interactions, and broadcast event videography for Zee Cinema Awards 2025.',
      tags: ['ZEE CINEMA AWARDS', 'CELEBRITY BTS', 'BROADCAST'],
      videos: [
        {
          id: 'v1',
          title: 'Zee Cinema Awards 2025 Gala BTS',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop'
        }
      ],
    },
    {
      id: 'vp2',
      title: 'BharatMatrimony Commercial Ad',
      description: 'National commercial campaign advertisement with narrative direction, precision lighting, and emotional storytelling.',
      tags: ['BHARATMATRIMONY', 'COMMERCIAL AD', 'DIRECTION'],
      videos: [
        {
          id: 'v2',
          title: 'BharatMatrimony National Ad Cut',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'
        }
      ],
    },
    {
      id: 'vp3',
      title: 'Arijit Singh Live In Concert',
      description: 'Live arena stadium concert coverage, crowd energy capture, and synchronized stage lighting visuals for Arijit Singh.',
      tags: ['ARIJIT SINGH', 'LIVE CONCERT', 'EVENT REEL'],
      videos: [
        {
          id: 'v3',
          title: 'Arijit Singh Arena Tour Visuals',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop'
        }
      ],
    },
    {
      id: 'vp4',
      title: 'Divine (Gully Gang) Music Video',
      description: 'Raw Mumbai street aesthetics, high-energy beat sync, wide anamorphic lensing, and post-production for Divine.',
      tags: ['DIVINE', 'MUSIC VIDEO', 'RAP CUT'],
      videos: [
        {
          id: 'v4',
          title: 'Divine — Gully Gang Energy Cut',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop'
        }
      ],
    },
    {
      id: 'vp5',
      title: 'Fukra Insaan Music Video & Digital Cut',
      description: 'High-retention creator video edits, color grading, and dynamic music video post-production for Fukra Insaan (Abhishek Malhan).',
      tags: ['FUKRA INSAAN', 'MUSIC VIDEO', 'CREATOR REELS'],
      videos: [
        {
          id: 'v5',
          title: 'Fukra Insaan Viral Music Cut',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop'
        }
      ],
    },
    {
      id: 'vp6',
      title: 'Maybelline Beauty Campaign',
      description: 'Macro beauty cinematography, cosmetic textures, high-frame-rate studio lighting for Maybelline New York.',
      tags: ['MAYBELLINE', 'BEAUTY BRAND', 'COMMERCIAL'],
      videos: [
        {
          id: 'v6',
          title: 'Maybelline Cosmetics Promo Film',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop'
        }
      ],
    },
    {
      id: 'vp7',
      title: 'Godrej Fashion Week Runway Film',
      description: 'Haute couture runway coverage, model backstage visuals, and rhythm-driven editorial lookbook for Godrej Fashion Week.',
      tags: ['GODREJ FASHION WEEK', 'FASHION', 'RUNWAY'],
      videos: [
        {
          id: 'v7',
          title: 'Godrej Fashion Week Runway Cut',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop'
        }
      ],
    },
    {
      id: 'vp8',
      title: 'Zudio & Bewakoof Fashion Campaigns',
      description: 'Trendy urban fashion reels, fast cuts, kinetic typography, and lifestyle promos for Zudio and Bewakoof.',
      tags: ['ZUDIO', 'BEWAKOOF', 'FASHION REELS'],
      videos: [
        {
          id: 'v8',
          title: 'Zudio x Bewakoof Apparel Cuts',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop'
        }
      ],
    },
    {
      id: 'vp9',
      title: 'Khelo India National Games Film',
      description: 'High-octane athlete tracking, sports sound design, and inspiring cinematic promo for Khelo India national initiative.',
      tags: ['KHELO INDIA', 'SPORTS', 'COMMERCIAL'],
      videos: [
        {
          id: 'v9',
          title: 'Khelo India Anthem Commercial Film',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop'
        }
      ],
    },
    {
      id: 'vp10',
      title: 'Denver Deodorant & Chk Shoes Ads',
      description: 'Masculine aesthetic, slow-motion studio reveals, and bold product integration for Denver, Chk Shoes, and Wtflex.',
      tags: ['DENVER', 'CHK SHOES', 'WTFLEX'],
      videos: [
        {
          id: 'v10',
          title: 'Denver & Chk Shoes Velocity Cut',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=800&auto=format&fit=crop'
        }
      ],
    },
  ],
  reviews: [
    {
      id: 'rev1',
      clientName: 'Saurabh Prajapati',
      logoUrl: '',
      role: 'Director & Choreographer',
      rating: 5,
      comment: 'Tushar brings incredible energy and artistic vision to every shoot. His videography and editing skills for live music events and dance videos are outstanding! Always reliable on floor.',
      status: 'approved',
      date: new Date().toISOString()
    },
    {
      id: 'rev2',
      clientName: 'Uma & Gaiti',
      logoUrl: '',
      role: 'Director & Choreographer',
      rating: 5,
      comment: 'Highly professional associate director and video editor. Tushar executes tight deadlines with perfection, bringing great narrative flow and visual flare.',
      status: 'approved',
      date: new Date().toISOString()
    },
    {
      id: 'rev3',
      clientName: 'Comic Creator Productions',
      logoUrl: '',
      role: 'Digital Content Creator',
      rating: 5,
      comment: 'Tushar understands comedy timing and pacing in video edits like no one else. Our reels reach went up significantly after working with him!',
      status: 'approved',
      date: new Date().toISOString()
    }
  ],
  experience: [
    {
      id: 'ex1',
      year: '2023 – 2024',
      role: 'Freelance Videographer',
      company: 'Commercial / Brand & Celebrity Shoots',
      description: 'Captured Celebrities BTS, Live Music Events, and Music videos. Directed on-floor cameras for Arijit Singh live concerts, Zee Cinema Awards 2025, Khelo India, and Godrej Fashion Week.',
    },
    {
      id: 'ex2',
      year: '2023 – 2024',
      role: 'Freelance Video Editor',
      company: 'Adobe Premiere Pro & After Effects',
      description: 'Edited video campaigns for Zudio, Denver, Bewakoof, Maybelline, and comic creators. Cut Fukra Insaan music videos, BharatMatrimony commercial spots, and Chk Shoes promos using Adobe Premiere Pro & After Effects.',
    },
    {
      id: 'ex3',
      year: '2023 – 2024',
      role: 'Freelance Associate Director (AD)',
      company: 'Production & On-Floor Management',
      description: 'Operational oversight, artist handling for celebrities (Divine, Fukra Insaan, Neha Bhasin, Palak Muchhal, Monali Thakur), strategic shoot planning, and floor management on live set locations.',
    },
    {
      id: 'ex4',
      year: '2022 – 2023',
      role: 'Credit Executive',
      company: 'Fortune Credit Capital Limited',
      description: 'Worked with wider development team. Handled client operations, loans, marketing, branding, database management & technical support.',
    },
  ],
  education: [
    {
      id: 'ed1',
      degree: 'Graduated',
      institution: 'Sydenham College of Commerce & Economics',
      year: '2006 – 2008'
    },
    {
      id: 'ed2',
      degree: '10th Passed',
      institution: 'St. Ignatius High School',
      year: '2017 – 2018'
    }
  ],
  about: {
    bio: "Skilled videographer and editor with 2 years of hands-on experience in creating dynamic visual content. Proficient in Adobe Premiere Pro and After Effects. Known for meeting tight deadlines and producing high-quality, engaging narratives across celebrity BTS, live music events, comic creator reels, and commercial brand shoots.",
    email: 'marutushar387@gmail.com',
    phone: '+91 9324704934',
    address: '16th Floor, Room No.1605, Navratna Blg, Ramdev Nagar, Mumbai - 400011',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    instagramUrl: 'https://instagram.com/tusharmaru',
    linkedinUrl: '',
    youtubeUrl: 'https://youtube.com',
  },
  skills: [
    'Adobe Premiere Pro', 'After Effects', 'Videography', 'Video Editing',
    'On-Floor Management', 'BTS Shoots', 'Celebrity BTS', 'Live Music Events',
    'Music Video Edits', 'Color Grading', 'Storyboarding', 'Associate Directing',
    'Strategic Planning', 'Commercial Brand Shoots', 'Comic Creator Reels', 'Technical Support'
  ],
  settings: {
    whatsappPhone: '9324704934',
    web3formsAccessKey: '',
    footerHeading: "Let's create visually stunning content together",
    footerBio: "Open for videography projects, video editing assignments, celebrity BTS shoots, and creative collaborations.",
    sectionOrder: ['about', 'services', 'videos', 'photos', 'experience', 'skills', 'reviews'],
    cloudinaryCloudName: 'aksy1d98',
    cloudinaryUploadPreset: 'tushar_portfolio',
  },
  brands: [
    'Zudio', 'Denver', 'Bewakoof', 'Maybelline', 'Godrej Fashion Week',
    'Chk Shoes', 'Wtflex', 'BharatMatrimony', 'Zee Cinema Awards 2025',
    'Off Campus', 'Newme', 'Khelo India'
  ],
  celebrities: [
    'Arijit Singh', 'Divine', 'Fukra Insaan', 'Palak Muchhal', 'Neha Bhasin', 'Monali Thakur'
  ],
  services: [
    {
      id: 'ser1',
      name: "Influencer Campaigns",
      icon: "sparkles",
      description: "End-to-end influencer campaign execution, creator briefing, and high-engagement digital rollouts for top tier brands.",
      details: "Formulating tailored influencer strategies, coordinating creator deliverables, managing high-retention video hooks, and executing viral branded content across YouTube and Instagram.",
    },
    {
      id: 'ser2',
      name: "Video Production",
      icon: "video",
      description: "Commercial ads, celebrity BTS, music videos, and mega events like Zee Cinema Awards 2025 and Arijit Singh concerts.",
      details: "End-to-end production pipelines: from camera operation, lighting direction, on-floor coordination, to final export for broadcast, theater, and digital campaigns.",
    },
    {
      id: 'ser3',
      name: "Artist Management",
      icon: "user",
      description: "On-set talent handling, schedule management, and production coordination for celebrities and musical artists.",
      details: "Proven experience working directly on-floor with prominent artists including Divine, Fukra Insaan, Neha Bhasin, Palak Muchhal, Monali Thakur, and Arijit Singh.",
    },
    {
      id: 'ser4',
      name: "Brand Integration",
      icon: "briefcase",
      description: "Organic product placement and narrative brand integration across commercials and digital creator videos.",
      details: "Seamless product storytelling for brands like Zudio, Denver, Bewakoof, Maybelline, Chk Shoes, Wtflex, BharatMatrimony, and Newme.",
    },
    {
      id: 'ser5',
      name: "Media Planning",
      icon: "globe",
      description: "Campaign decks, strategic content distribution, multi-channel release scheduling, and performance tracking.",
      details: "Strategic media planning ensuring video assets reach target demographics with maximum retention, brand recall, and platform algorithmic velocity.",
    },
    {
      id: 'ser6',
      name: "Website Planning",
      icon: "film",
      description: "Digital presence architecture, portfolio content curation, and interactive storytelling for creators and brands.",
      details: "Structuring high-converting digital showreels, responsive media showcases, and digital launchpads tailored to the creative and entertainment industry.",
    },
  ],
};

/* ─── Auth ───────────────────────────────────────────────────────── */
const ADMIN_EMAILS   = ['marutushar387@gmail.com', 'tushar@admin.com', 'admin@tushar.com'];
const ADMIN_PASSWORD = 'tushar123';
const AUTH_KEY       = 'tushar_admin_auth';

export function login(email: string, password: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  if ((ADMIN_EMAILS.includes(cleanEmail) || cleanEmail === 'tushar') && (password === ADMIN_PASSWORD || password === 'tushar123')) {
    if (typeof window !== 'undefined') sessionStorage.setItem(AUTH_KEY, '1');
    return true;
  }
  return false;
}

export function logout(): void {
  if (typeof window !== 'undefined') sessionStorage.removeItem(AUTH_KEY);
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

const KEY = 'tushar_portfolio_v3';

export function getData(): typeof defaultData {
  if (typeof window === 'undefined') return defaultData;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultData;
    const stored = JSON.parse(raw);
    
    if (!stored || typeof stored !== 'object') return defaultData;

    return {
      heroStats: { ...defaultData.heroStats, ...(stored.heroStats || {}) },
      photos: stored.photos && stored.photos.length > 0 ? stored.photos : defaultData.photos,
      videoProjects: stored.videoProjects ?? defaultData.videoProjects,
      reviews: (stored.reviews && stored.reviews.length > 0) ? stored.reviews : defaultData.reviews,
      experience: stored.experience ?? defaultData.experience,
      education: stored.education ?? defaultData.education,
      about: { ...defaultData.about, ...(stored.about || {}) },
      skills: stored.skills ?? defaultData.skills,
      settings: { ...defaultData.settings, ...(stored.settings || {}) },
      services: stored.services ?? defaultData.services,
      brands: stored.brands ?? defaultData.brands,
      celebrities: stored.celebrities ?? defaultData.celebrities,
    };
  } catch (err) {
    console.warn("Store: Falling back to default data due to error:", err);
    return defaultData;
  }
}

export function saveData(data: typeof defaultData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function updateSection(section: string, value: any): typeof defaultData {
  const current = getData();
  const updated = { ...current, [section]: value };
  saveData(updated);
  return updated;
}

export function resetData(): typeof defaultData {
  if (typeof window === 'undefined') return defaultData;
  saveData(defaultData);
  return defaultData;
}

export function getYoutubeId(url: string | undefined): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export function getInstagramId(url: string | undefined): string | null {
  if (!url) return null;
  const m = url.match(/instagram\.com\/(?:[a-zA-Z0-9._]+\/)?(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);
  return m ? m[1] : null;
}

export function getYoutubeThumbnail(url: string | undefined): string | null {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export async function fetchYoutubeMetadata(urlOrId: string | undefined): Promise<{ title?: string; author?: string; thumbnail?: string } | null> {
  if (!urlOrId) return null;
  const id = getYoutubeId(urlOrId) || urlOrId.trim();
  if (!id || id.length < 5) return null;
  const standardUrl = `https://www.youtube.com/watch?v=${id}`;

  // 1. Try YouTube official oEmbed API (CORS enabled)
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(standardUrl)}&format=json`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        return {
          title: data.title,
          author: data.author_name,
          thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        };
      }
    }
  } catch {}

  // 2. Try noembed fallback
  try {
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(standardUrl)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        return {
          title: data.title,
          author: data.author_name,
          thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        };
      }
    }
  } catch {}

  return {
    thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
  };
}

export function getWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  
  const isMobile = typeof window !== 'undefined'
    ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    : false;

  const base = isMobile ? 'whatsapp://send' : 'https://api.whatsapp.com/send';
  const query = message 
    ? `?phone=${formattedPhone}&text=${encodeURIComponent(message)}` 
    : `?phone=${formattedPhone}`;
  return `${base}${query}`;
}
