import { useEffect, useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getData, getYoutubeId, getInstagramId, defaultData } from './lib/store';
import { AdminPage } from './components/AdminPage';
import { LoadingScreen } from './components/LoadingScreen';
import { DifferenceCursor } from './components/DifferenceCursor';

// Section Components matching Earthy Editorial + Video Portfolio spec
import { HeroSection } from './components/sections/HeroSection';
import { BrandShowcase } from './components/sections/BrandShowcase';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { AsymmetricalMarquee } from './components/AsymmetricalMarquee';
import { PhotosSection } from './components/sections/PhotosSection';
import { AboutSection } from './components/sections/AboutSection';
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

  // Sync Portfolio Data
  useEffect(() => {
    setData(getData());

    const handleStorageChange = () => {
      setData(getData());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Lock body scroll only when lightbox is open
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  // Flatten all videos for continuous marquee
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
    <div className="bg-[#ccd5ae] text-[#01472e] font-sans overflow-x-clip min-h-screen w-full relative selection:bg-[#01472e] selection:text-[#fefae0]">
      {/* ── Fixed SVG Fractal Noise Overlay (0.04 Opacity) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* ── Interactive Custom Cursor ── */}
      <DifferenceCursor />

      {/* ── Initial Loading Screen ── */}
      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      <div 
        className={`transition-opacity duration-500 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ visibility: loaded ? 'visible' : 'hidden' }}
      >
        {/* 1. Massive Display Hero (Background: Sage #ccd5ae) */}
        <HeroSection data={data} />

        {/* 1.5. Client Brands & Celebrity Collaborations Showcase */}
        <BrandShowcase data={data} />

        {/* 2. Feature / Project Grid (Background: Olive #e9edc9, rounded-t-[5rem]) */}
        <ProjectsSection
          videoProjects={data.videoProjects || []}
          onSelectVideo={handleSelectVideo}
        />

        {/* 3. Continuous Motion Archive with Asymmetrical Cards */}
        {marqueeVideos.length > 0 && (
          <AsymmetricalMarquee
            videos={marqueeVideos}
            onSelectVideo={handleSelectVideo}
          />
        )}

        {/* 4. Photo Stills & BTS Showcase (Background: Cream #fefae0, rounded-t-[5rem]) */}
        {data.photos && data.photos.length > 0 && (
          <PhotosSection photos={data.photos} />
        )}

        {/* 5. Editorial Statement (Background: Sage #ccd5ae, rounded-t-[5rem]) */}
        <AboutSection data={data} />

        {/* 6. Creative Capabilities & Services (Background: Olive #e9edc9, rounded-t-[5rem]) */}
        <ServicesSection data={data} />

        {/* 7. Production Timeline & Experience (Background: Sage #ccd5ae, rounded-t-[5rem]) */}
        {data.experience && data.experience.length > 0 && (
          <ExperienceSection experience={data.experience} />
        )}

        {/* 8. Director Endorsements & References (Background: Olive #e9edc9, rounded-t-[5rem]) */}
        {data.reviews && data.reviews.length > 0 && (
          <ReviewsSection reviews={data.reviews} />
        )}

        {/* 9. Earthy 12-Column Footer (Background: Forest #01472e, Text: Sage #ccd5ae, rounded-t-[5rem]) */}
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
            className="fixed inset-0 z-[9999] bg-[#01472e]/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans"
          >
            <div 
              onClick={e => e.stopPropagation()} 
              className={`w-full ${isInstagram || isShort ? 'max-w-[420px]' : 'max-w-4xl'} relative bg-[#fefae0] rounded-[2.5rem] p-6 sm:p-8 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] border border-[#01472e]/20 text-[#01472e]`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#01472e] truncate max-w-[80%]">
                  {lightbox.title || "Selected Motion Cut"}
                </span>
                <button 
                  type="button"
                  onClick={() => setLightbox(null)} 
                  className="w-10 h-10 rounded-full bg-[#01472e] text-[#fefae0] flex items-center justify-center hover:scale-110 transition-transform"
                >
                  ✕
                </button>
              </div>

              <div className={`relative w-full ${isInstagram || isShort ? 'aspect-[9/16] h-[70vh]' : 'aspect-video'} rounded-2xl overflow-hidden border border-[#01472e]/15 bg-black`}>
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
