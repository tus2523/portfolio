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
    {
      id: 'ph1',
      title: 'Celebrity BTS Shoot',
      category: 'Celebrity BTS',
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
      description: 'Behind the scenes camera setup for high-profile celebrity brand shoot in Mumbai.',
      date: '2024'
    },
    {
      id: 'ph2',
      title: 'Live Music Concert Coverage',
      category: 'Live Events',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
      description: 'Dynamic stage videography and crowd atmosphere capture.',
      date: '2024'
    },
    {
      id: 'ph3',
      title: 'Music Album Shoot On-Set',
      category: 'Music Videos',
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
      description: 'Cinematic lighting setup and associate direction during music video filming.',
      date: '2023'
    },
    {
      id: 'ph4',
      title: 'Premiere Pro Editing Suite',
      category: 'Editing',
      imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop',
      description: 'Timeline workflow & color grading setup for commercial reels.',
      date: '2024'
    },
    {
      id: 'ph5',
      title: 'Commercial Brand Shoot',
      category: 'Commercial',
      imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop',
      description: 'On-floor management and videography for fashion brand promo.',
      date: '2023'
    },
    {
      id: 'ph6',
      title: 'Wedding Highlights Production',
      category: 'Wedding',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
      description: 'Cinematic wedding storytelling & event highlights filming.',
      date: '2023'
    }
  ] as PhotoItem[],
  videoProjects: [
    {
      id: 'vp1',
      title: 'Celebrity BTS & Commercial Shoots',
      description: 'High-energy behind-the-scenes videography and commercial shoot direction with top creators and celebrities.',
      tags: ['CELEBRITY BTS', 'VIDEOGRAPHY', 'COMMERCIAL'],
      videos: [
        {
          id: 'v1',
          title: 'Celebrity BTS Edit Showcase',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop'
        }
      ],
    },
    {
      id: 'vp2',
      title: 'Music Video & Album Post-Production',
      description: 'Complete video editing, beat sync, visual effects, and color grading for music albums and dance videos.',
      tags: ['MUSIC ALBUM', 'EDITING', 'COLOR GRADING'],
      videos: [
        {
          id: 'v2',
          title: 'Music Video Cut Showcase',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop'
        }
      ],
    },
    {
      id: 'vp3',
      title: 'Comic Creators & Viral Reels',
      description: 'Fast-paced, high-engagement video edits crafted specifically for digital comedy creators, YouTube Shorts & Reels.',
      tags: ['REELS', 'COMIC CREATORS', 'PREMIERE PRO'],
      videos: [
        {
          id: 'v3',
          title: 'Comic Creator Reel Edit',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop'
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
      description: 'Captured Celebrities BTS, Live Music Events, and Music albums. Handled concept development, client communication, marketing, and video promos.',
    },
    {
      id: 'ex2',
      year: '2023 – 2024',
      role: 'Freelance Video Editor',
      company: 'Adobe Premiere Pro & After Effects',
      description: 'Edited videos for comic creators, brands, BTS edits, music albums, and wedding highlight videos with high retention cuts.',
    },
    {
      id: 'ex3',
      year: '2023 – 2024',
      role: 'Freelance Associate Director (AD)',
      company: 'Production & On-Floor Management',
      description: 'Operational oversight, team management, strategic planning, emergency response, and project management on live set locations.',
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
  },
  services: [
    {
      id: 'ser1',
      name: "Videography & On-Set Shoots",
      icon: "video",
      description: "Shooting celebrity behind-the-scenes (BTS), commercial brand shoots, live music events, and music albums.",
      details: "High-quality video capture on location. Expert handling of camera gear, lighting setups, live stage recording, celebrity BTS moments, and commercial brand promotion.",
    },
    {
      id: 'ser2',
      name: "Video Editing & Post-Production",
      icon: "film",
      description: "Professional editing using Adobe Premiere Pro & After Effects, visual pacing, color grading, and sound sync.",
      details: "Seamless story-driven post-production. Specializing in high-retention cuts, dynamic sound design, visual effects, color correction, and polished video delivery.",
    },
    {
      id: 'ser3',
      name: "Associate Directing & Floor Management",
      icon: "user",
      description: "Managing operational shoot logistics, directing crew members on-floor, and strategic shoot planning.",
      details: "Full operational oversight on set. Managing talent logistics, timing, emergency response, shoot schedules, and ensuring smooth collaboration between directorship and crew.",
    },
    {
      id: 'ser4',
      name: "Comic Creator & Viral Reels Edits",
      icon: "sparkles",
      description: "Tailored short-form video editing for comedy content creators, YouTube Shorts, and Instagram Reels.",
      details: "Optimized for social media algorithm engagement. Crafting punchy comedy cuts, engaging captions, sound effects, and fast-paced visual hooks.",
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

const KEY = 'tushar_portfolio_v1';

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
