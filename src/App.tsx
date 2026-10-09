import { useEffect, useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { db } from './lib/firebase';
import { ref, onValue } from 'firebase/database';
import { getData, saveData, getYoutubeId, getInstagramId, defaultData } from './lib/store';
import { AdminPage } from './components/AdminPage';
import { LoadingScreen } from './components/LoadingScreen';
import { DifferenceCursor } from './components/DifferenceCursor';

// Section Components matching the Bold Editorial Studio spec
import { HeroSection } from './components/sections/HeroSection';
import { AsymmetricalMarquee } from './components/AsymmetricalMarquee';
import { AboutSection } from './components/sections/AboutSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { PhotosSection } from './components/sections/PhotosSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { ReviewsSection } from './components/sections/ReviewsSection';
import { FooterSection } from './components/sections/FooterSection';

import './App.css';

function MainApp() {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState<typeof defaultData>(() => getData());
  const [lightbox, setLightbox] = useState<any>(null);

  const handleSelectVideo = (video: any) => {
    if (!video || !video.url) return;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const instaId = getInstagramId(video.url);
    if (isMobile && instaId) {
      const isReel = video.url.includes('/reel/') || video.url.includes('/reels/');
      const deepLink = `https://www.instagram.com/_n/${isReel ? 'reel' : 'p'}/${instaId}/`;
      
      const link = document.createElement('a');
      link.href = deepLink;
      link.target = '_self';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setLightbox(video);
    }
  };

  // Sync Database Content
  useEffect(() => {
    setData(getData());

    const portfolioRef = ref(db, 'tushar_portfolio_content');
    const unsubscribePort = onValue(portfolioRef, (snapshot) => {
      const fbData = snapshot.val();
      if (fbData) {
        setData(prev => {
          const merged = {
            ...prev,
            ...fbData,
            heroStats: { ...prev.heroStats, ...(fbData.heroStats || {}) },
            about: { ...prev.about, ...(fbData.about || {}) },
            photos: fbData.photos || prev.photos || defaultData.photos,
            videoProjects: fbData.videoProjects || prev.videoProjects,
            reviews: fbData.reviews || prev.reviews,
            experience: fbData.experience || prev.experience,
            education: fbData.education || prev.education,
            skills: fbData.skills || prev.skills,
            services: fbData.services || defaultData.services,
            settings: { ...prev.settings, ...(fbData.settings || {}) }
          };
          saveData(merged);
          return merged;
        });
      }
    }, (error) => {
      console.warn("Firebase connection notice:", error);
    });

    return () => {
      unsubscribePort();
    };
  }, []);

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

  // Flatten all videos for asymmetrical continuous marquee
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

  return (
    <div className="bg-[#FFFFFF] text-[#000000] font-sans overflow-x-clip min-h-screen w-full relative selection:bg-black selection:text-white">
      {/* ── Interactive Difference Cursor ── */}
      <DifferenceCursor />

      {/* ── Initial Loading Screen ── */}
      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      <div 
        className={`transition-opacity duration-500 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ visibility: loaded ? 'visible' : 'hidden' }}
      >
        {/* 1. Massive Display Hero */}
        <HeroSection data={data} />

        {/* 2. Infinite Project Marquee with Asymmetrical Cards */}
        {marqueeVideos.length > 0 && (
          <AsymmetricalMarquee
            videos={marqueeVideos}
            onSelectVideo={handleSelectVideo}
          />
        )}

        {/* 3. Centered Introductory Statement */}
        <AboutSection data={data} />

        {/* 4. Balanced Two-Column Project Grid */}
        <ProjectsSection
          videoProjects={data.videoProjects || []}
          onSelectVideo={handleSelectVideo}
        />

        {/* 5. Photo Stills & BTS Showcase */}
        {data.photos && data.photos.length > 0 && (
          <PhotosSection photos={data.photos} />
        )}

        {/* 6. Creative Capabilities & Services */}
        <ServicesSection data={data} />

        {/* 7. Production Timeline & Experience */}
        {data.experience && data.experience.length > 0 && (
          <ExperienceSection experience={data.experience} />
        )}

        {/* 8. Director Endorsements & References */}
        {data.reviews && data.reviews.length > 0 && (
          <ReviewsSection reviews={data.reviews} />
        )}

        {/* 9. High-Contrast Dark Footer */}
        <FooterSection data={data} />
      </div>

      {/* Video Lightbox Modal */}
      {lightbox && (() => {
        const ytId = getYoutubeId(lightbox.url);
        const instaId = getInstagramId(lightbox.url);
        const isInstagram = !!instaId;
        const isShort = !isInstagram && !!lightbox.url && lightbox.url.includes('/shorts/');

        return (
          <div 
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans"
          >
            <div 
              onClick={e => e.stopPropagation()} 
              className={`w-full ${isInstagram || isShort ? 'max-w-[400px]' : 'max-w-4xl'} relative`}
            >
              <div className="flex justify-between items-center mb-4 text-white">
                <span className="font-mono text-xs uppercase tracking-wider text-white/80 truncate max-w-[80%]">
                  {lightbox.title}
                </span>
                <button 
                  type="button"
                  onClick={() => setLightbox(null)} 
                  className="w-9 h-9 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition"
                >
                  ✕
                </button>
              </div>
              <div className={`relative w-full ${isInstagram || isShort ? 'aspect-[9/16] h-[75vh]' : 'aspect-video'} rounded-2xl overflow-hidden border border-white/10 bg-black`}>
                {isInstagram ? (
                  <iframe 
                    src={`https://www.instagram.com/reel/${instaId}/embed/`} 
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full border-none"
                    style={{ background: '#000' }}
                  />
                ) : (
                  <iframe 
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&modestbranding=1&rel=0`} 
                    allow="autoplay; encrypted-media" 
                    allowFullScreen 
                    className="absolute top-0 left-0 w-full h-full border-none"
                    style={{ background: '#000' }}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function App() {
  const [route, setRoute] = useState(window.location.hash || window.location.pathname);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || window.location.pathname);
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  if (route === '#admin' || route === '/admin') {
    return <AdminPage />;
  }
  return <MainApp />;
}

export default App;
