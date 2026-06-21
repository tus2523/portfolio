import { useEffect, useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { db } from './lib/firebase';
import { ref, onValue } from 'firebase/database';
import { getData, saveData, getYoutubeId, defaultData } from './lib/store';
import { AdminPage } from './components/AdminPage';
import { LoadingScreen } from './components/LoadingScreen';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { InteractiveGlow } from './components/InteractiveGlow';

// Section Components
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { CampaignsSection } from './components/sections/CampaignsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { FooterSection } from './components/sections/FooterSection';
import { WebsitesSection } from './components/sections/WebsitesSection';
import { ReviewsSection } from './components/sections/ReviewsSection';

import { MarqueeRow } from './components/MarqueeRow';
import './App.css';

function MainApp() {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState<typeof defaultData>(() => getData());
  const [campaigns, setCampaigns] = useState<{ grouped: any; brands: string[] }>({ grouped: {}, brands: [] });
  const [lightbox, setLightbox] = useState<any>(null);
  const [dbError, setDbError] = useState(false);
  const [dbDeleted, setDbDeleted] = useState(false);

  // Sync Database Content
  useEffect(() => {
    setData(getData());

    const portfolioRef = ref(db, 'portfolio_content');
    const unsubscribePort = onValue(portfolioRef, (snapshot) => {
      const fbData = snapshot.val();
      if (!snapshot.exists() || !fbData) {
        setDbDeleted(true);
        
        const localSettings = getData().settings || {} as any;
        const accessKey = localSettings.web3formsAccessKey;
        if (accessKey && !sessionStorage.getItem('db_deletion_notified')) {
          sessionStorage.setItem('db_deletion_notified', 'true');
          const messageHtml = `
            <h2>🚨 EMERGENCY DATABASE ALERT!</h2>
            <p>Your portfolio database content (<code>portfolio_content</code>) has been deleted or is missing from Firebase Realtime Database!</p>
            <p>Please check your Firebase console immediately.</p>
          `;
          
          fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_key: accessKey,
              subject: `🚨 EMERGENCY: Database Deleted!`,
              from_name: 'Portfolio Tracker',
              message: messageHtml,
            }),
          }).catch(console.error);
        }
      } else {
        setDbDeleted(false);
        setDbError(false);
        setData(prev => {
          const merged = {
            ...prev,
            ...fbData,
            heroStats: { ...prev.heroStats, ...(fbData.heroStats || {}) },
            about: { ...prev.about, ...(fbData.about || {}) },
            videoProjects: fbData.videoProjects || [],
            websites: fbData.websites || [],
            reviews: fbData.reviews || [],
            experience: fbData.experience || [],
            skills: fbData.skills || [],
            brandLogos: fbData.brandLogos || [],
            services: fbData.services || defaultData.services,
            settings: { ...prev.settings, ...(fbData.settings || {}) }
          };
          saveData(merged); // Cache locally to prevent flash glitch on page refresh
          return merged;
        });
      }
    }, (error) => {
      console.error("Firebase connection error:", error);
      setDbError(true);
    });

    const campaignsRef = ref(db, 'campaigns_data');
    const unsubscribeCamp = onValue(campaignsRef, (snapshot) => {
      const fbData = snapshot.val();
      if (fbData && fbData.grouped && fbData.brands) {
        setCampaigns({
          grouped: fbData.grouped,
          brands: fbData.brands
        });
      }
    });

    return () => {
      unsubscribePort();
      unsubscribeCamp();
    };
  }, []);  // Geolocation Visitor Tracking & Email Notification
  useEffect(() => {
    const accessKey = data.settings?.web3formsAccessKey;

    if (!accessKey || sessionStorage.getItem('portfolio_visit_notified')) return;

    const trackVisitor = async () => {
      try {
        sessionStorage.setItem('portfolio_visit_notified', 'true');
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('Failed to fetch geo details');
        const geo = await res.json();

        // Capture device details
        const ua = navigator.userAgent;
        let device = 'Unknown Device';
        if (/android/i.test(ua)) device = 'Android Device';
        else if (/iphone|ipad/i.test(ua)) device = 'iOS Device';
        else if (/windows/i.test(ua)) device = 'Windows PC';
        else if (/macintosh/i.test(ua)) device = 'Mac';
        else if (/linux/i.test(ua)) device = 'Linux PC';

        // Parse custom referrer, name, and ID/handle from URL
        const params = new URLSearchParams(window.location.search);
        
        // 1. Detect platform/referrer source
        let source = 'Direct/Unknown';
        const refUrl = document.referrer.toLowerCase();
        
        if (refUrl.includes('instagram.com')) {
          source = 'Instagram';
        } else if (refUrl.includes('youtube.com')) {
          source = 'YouTube';
        } else if (refUrl.includes('linkedin.com')) {
          source = 'LinkedIn';
        } else if (refUrl.includes('t.co') || refUrl.includes('twitter.com') || refUrl.includes('x.com')) {
          source = 'Twitter/X';
        } else if (refUrl.includes('wa.me') || refUrl.includes('whatsapp.com')) {
          source = 'WhatsApp';
        }

        // 2. Extract visitor Name
        let visitorName = params.get('name') || params.get('fullName') || params.get('fullname') || params.get('refName') || '';
        if (visitorName) {
          visitorName = decodeURIComponent(visitorName).replace(/_/g, ' ');
        }

        // 3. Extract visitor ID/Handle
        let visitorId = params.get('id') || params.get('username') || params.get('handle') || params.get('userId') || '';
        if (visitorId) {
          visitorId = decodeURIComponent(visitorId);
        }

        const messageHtml = `
          <h2>🚀 New Visitor Alert!</h2>
          <p><strong>📱 Platform:</strong> ${source}</p>
          <p><strong>👤 Name:</strong> ${visitorName || 'Unknown Visitor'}</p>
          <p><strong>🆔 ID/Handle:</strong> ${visitorId ? (visitorId.startsWith('@') ? visitorId : '@' + visitorId) : 'Not Available'}</p>
          <p><strong>📍 Location:</strong> ${geo.city || 'Unknown'}, ${geo.region || ''}, ${geo.country_name || 'Unknown'}</p>
          <p><strong>🌐 IP:</strong> ${geo.ip || 'Unknown'}</p>
          <p><strong>📱 Device:</strong> ${device}</p>
          <p><strong>🏢 ISP:</strong> ${geo.org || 'Unknown'}</p>
        `;

        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `New Portfolio Visitor from ${geo.city || 'Unknown'}`,
            from_name: 'Portfolio Tracker',
            message: messageHtml,
          }),
        });
      } catch (err) {
        console.error("Visitor tracking alert error:", err);
      }
    };

    // Delay slightly to let page load first
    const timer = setTimeout(trackVisitor, 1500);
    return () => clearTimeout(timer);
  }, [data.settings]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightbox) {
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
  }, [lightbox]);

  // Global click ripple effect — desktop only
  useEffect(() => {
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isMobile) return; // Skip on mobile — not worth the DOM cost

    const handleClick = (e: MouseEvent) => {
      const el = document.createElement('span');
      el.className = 'global-click-ripple';
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 700);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Content Protection: Disable Right-click, Copy Shortcuts, Save, Dragging & Inspect Element
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Copy: Cmd+C or Ctrl+C
      if (cmdOrCtrl && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
      }
      // Cut: Cmd+X or Ctrl+X
      if (cmdOrCtrl && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
      }
      // View Source: Cmd+U or Ctrl+U
      if (cmdOrCtrl && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
      }
      // Save Page: Cmd+S or Ctrl+S
      if (cmdOrCtrl && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
      }
      // Inspect: F12, Ctrl+Shift+I, Ctrl+Shift+J
      if (
        e.key === 'F12' ||
        (cmdOrCtrl && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J'))
      ) {
        e.preventDefault();
      }
    };

    const handleDragStart = (e: DragEvent) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('dragstart', handleDragStart);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  // Flatten all videos across projects for the top marquee transition
  const marqueeVideos = useMemo(() => {
    if (!data.videoProjects) return [];
    return data.videoProjects.flatMap((project: any) => {
      if (!project) return [];
      return (project.videos || []).map((video: any) => ({
        ...video,
        projectTitle: project.title || '',
        tags: project.tags || [],
      }));
    });
  }, [data.videoProjects]);

  const row1Videos = marqueeVideos;
  const row2Videos = useMemo(() => [...marqueeVideos].reverse(), [marqueeVideos]);

  if (dbError || dbDeleted) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-kanit flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-950/20 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-900/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="film-grain" aria-hidden="true" />
        
        <div className="max-w-md w-full bg-[#121212] border border-red-950/60 p-8 rounded-3xl flex flex-col items-center gap-6 relative z-10 shadow-2xl">
          <span className="text-5xl">🚨</span>
          <h1 className="text-2xl font-black uppercase tracking-wider text-red-500">
            {dbDeleted ? 'Error 404' : 'Connection Error'}
          </h1>
          <p className="text-sm text-[#D7E2EA]/60 leading-relaxed">
            {dbDeleted 
              ? 'The requested portfolio content was not found or has been deleted.' 
              : 'Unable to connect to the database. Please check your internet connection or refresh.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full mt-2 bg-red-950/20 text-red-400 border border-red-900/40 rounded-xl py-3 text-xs uppercase tracking-widest font-semibold hover:bg-red-950/40 transition duration-200"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0C0C0C] text-[#D7E2EA] font-kanit overflow-x-clip min-h-screen w-full relative select-none">
      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      <ScrollProgressBar />
      <div className="film-grain" aria-hidden="true" />
      <InteractiveGlow />

      <HeroSection data={data} />
      
      {/* Reel Previews Marquee Transition */}
      <section className="bg-[#0C0C0C] py-6 border-b border-white/5 overflow-hidden w-full flex flex-col gap-4 relative z-20">
        <div className="flex flex-col gap-4 w-full">
          <MarqueeRow videos={row1Videos} direction="left" onSelectVideo={(video) => setLightbox(video)} />
          <MarqueeRow videos={row2Videos} direction="right" onSelectVideo={(video) => setLightbox(video)} />
        </div>
      </section>

      {(() => {
        const order = data.settings?.sectionOrder || ['about', 'services', 'campaigns', 'videos', 'websites', 'experience', 'skills', 'reviews'];
        let visibleIndex = 0; // To alternate themes

        return order.map((sectionId) => {
          let hasContent = true;
          let content = null;

          switch (sectionId) {
            case 'about':
              hasContent = !!(data.about?.bio || data.about?.photoUrl);
              content = hasContent ? <AboutSection key="about" data={data} theme={visibleIndex % 2 === 0 ? 'light' : 'dark'} /> : null;
              break;
            case 'services':
              hasContent = true; // Services are static
              content = <ServicesSection key="services" data={data} theme={visibleIndex % 2 === 0 ? 'light' : 'dark'} />;
              break;
            case 'campaigns':
              hasContent = campaigns.brands && campaigns.brands.length > 0;
              content = hasContent ? <CampaignsSection key="campaigns" campaigns={campaigns} brandLogos={(data as any).brandLogos || []} theme={visibleIndex % 2 === 0 ? 'light' : 'dark'} /> : null;
              break;
            case 'videos':
              hasContent = data.videoProjects && data.videoProjects.length > 0;
              content = hasContent ? <ProjectsSection key="videos" videoProjects={data.videoProjects || []} onSelectVideo={(video) => setLightbox(video)} theme={visibleIndex % 2 === 0 ? 'light' : 'dark'} /> : null;
              break;
            case 'websites':
              hasContent = data.websites && data.websites.length > 0;
              content = hasContent ? <WebsitesSection key="websites" websites={data.websites || []} theme={visibleIndex % 2 === 0 ? 'light' : 'dark'} /> : null;
              break;
            case 'experience':
              hasContent = data.experience && data.experience.length > 0;
              content = hasContent ? <ExperienceSection key="experience" experience={data.experience || []} theme={visibleIndex % 2 === 0 ? 'light' : 'dark'} /> : null;
              break;
            case 'skills':
              hasContent = data.skills && data.skills.length > 0;
              content = hasContent ? <SkillsSection key="skills" skills={data.skills || []} theme={visibleIndex % 2 === 0 ? 'light' : 'dark'} /> : null;
              break;
            case 'reviews':
              const approvedReviews = (data.reviews || []).filter(r => r.status === 'approved');
              hasContent = approvedReviews.length > 0;
              content = hasContent ? <ReviewsSection key="reviews" reviews={data.reviews || []} theme={visibleIndex % 2 === 0 ? 'light' : 'dark'} /> : null;
              break;
            default:
              return null;
          }

          if (hasContent && content) {
            visibleIndex++;
            return content;
          }
          return null;
        });
      })()}

      <FooterSection data={data} />

      {/* Video Lightbox */}
      {lightbox && (
        <div 
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={e => e.stopPropagation()} 
            className="w-full max-w-4xl relative"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold tracking-wider text-[#D7E2EA]/70 truncate max-w-[80%]">{lightbox.title}</span>
              <button 
                type="button"
                onClick={() => setLightbox(null)} 
                className="bg-white/5 border border-white/10 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black">
              <iframe 
                src={`https://www.youtube.com/embed/${getYoutubeId(lightbox.url)}?autoplay=1`} 
                allow="autoplay; encrypted-media" 
                allowFullScreen 
                className="absolute top-0 left-0 w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  if (window.location.pathname === '/admin') {
    return <AdminPage />;
  }
  return <MainApp />;
}

export default App;
