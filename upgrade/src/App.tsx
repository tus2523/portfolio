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
        
        // Dispatch WhatsApp deletion alert
        const localSettings = getData().settings || {};
        const phone = localSettings.whatsappPhone || '8082812805';
        const apikey = localSettings.whatsappApiKey;
        if (apikey && !sessionStorage.getItem('db_deletion_notified')) {
          sessionStorage.setItem('db_deletion_notified', 'true');
          const message = `🚨 EMERGENCY: Your portfolio database content ('portfolio_content') has been deleted or is missing from Firebase Realtime Database! Please check your admin console immediately.`;
          const encoded = encodeURIComponent(message);
          const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apikey}`;
          fetch(url, { mode: 'no-cors' }).catch(console.error);
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
            experience: fbData.experience || [],
            skills: fbData.skills || [],
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
  }, []);

  // Geolocation Visitor Tracking & WhatsApp Notification
  useEffect(() => {
    const phone = data.settings?.whatsappPhone || '8082812805';
    const apikey = data.settings?.whatsappApiKey;

    if (!apikey || sessionStorage.getItem('portfolio_visit_notified')) return;

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

        // Parse custom referrer name/tag from URL (e.g. ?ref=John_Doe or ?name=Jio_HR)
        const params = new URLSearchParams(window.location.search);
        const refName = params.get('ref') || params.get('name') || params.get('refName') || '';
        const displayName = refName ? decodeURIComponent(refName).replace(/_/g, ' ') : 'General Visitor';

        const message = `🚀 New Visitor Alert!\n👤 Ref/Name: ${displayName}\n📍 Location: ${geo.city || 'Unknown'}, ${geo.region || ''}, ${geo.country_name || 'Unknown'}\n🌐 IP: ${geo.ip || 'Unknown'}\n📱 Device: ${device}\n🏢 ISP: ${geo.org || 'Unknown'}`;

        const encoded = encodeURIComponent(message);
        const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apikey}`;
        await fetch(url, { mode: 'no-cors' });
      } catch (err) {
        console.error("Visitor tracking alert error:", err);
      }
    };

    // Delay slightly to let page load first
    const timer = setTimeout(trackVisitor, 1500);
    return () => clearTimeout(timer);
  }, [data.settings]);

  // Global click ripple effect
  useEffect(() => {
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

      <AboutSection data={data} />
      <ServicesSection />
      <CampaignsSection campaigns={campaigns} />
      <ProjectsSection videoProjects={data.videoProjects || []} onSelectVideo={(video) => setLightbox(video)} />
      <ExperienceSection experience={data.experience || []} />
      <SkillsSection skills={data.skills || []} />
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
