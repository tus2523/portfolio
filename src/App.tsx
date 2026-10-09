import { useEffect, useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { db } from './lib/firebase';
import { ref, onValue } from 'firebase/database';
import { getData, saveData, getYoutubeId, getInstagramId, defaultData } from './lib/store';
import { AdminPage } from './components/AdminPage';
import { LoadingScreen } from './components/LoadingScreen';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { InteractiveGlow } from './components/InteractiveGlow';

// Section Components
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { PhotosSection } from './components/sections/PhotosSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { FooterSection } from './components/sections/FooterSection';
import { ReviewsSection } from './components/sections/ReviewsSection';

import { MarqueeRow } from './components/MarqueeRow';
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
      console.warn("Firebase connection notice (using offline local store):", error);
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

  // Flatten all videos across projects for top marquee
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

  return (
    <div className="bg-[#0C0C0C] text-[#D7E2EA] font-kanit overflow-x-clip min-h-screen w-full relative select-none">
      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      <div 
        className={`transition-opacity duration-500 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ visibility: loaded ? 'visible' : 'hidden' }}
      >
        <ScrollProgressBar />
        <div className="film-grain" aria-hidden="true" />
        <InteractiveGlow />

        <HeroSection data={data} />
        
        {/* Reel Previews Marquee Transition */}
        {marqueeVideos.length > 0 && (
          <section className="bg-[#0C0C0C] py-6 border-b border-white/5 overflow-hidden w-full flex flex-col gap-4 relative z-20">
            <div className="flex flex-col gap-4 w-full">
              <MarqueeRow videos={row1Videos} direction="left" onSelectVideo={handleSelectVideo} />
              <MarqueeRow videos={row2Videos} direction="right" onSelectVideo={handleSelectVideo} />
            </div>
          </section>
        )}

        {(() => {
          const order = data.settings?.sectionOrder || ['about', 'services', 'videos', 'photos', 'experience', 'skills', 'reviews'];
          let visibleIndex = 0;

          return order.map((sectionId) => {
            let hasContent = true;
            let content = null;

            switch (sectionId) {
              case 'about':
                hasContent = !!(data.about?.bio || data.about?.photoUrl);
                content = hasContent ? <AboutSection key="about" data={data} theme={visibleIndex % 2 === 0 ? 'dark' : 'light'} /> : null;
                break;
              case 'services':
                hasContent = true;
                content = <ServicesSection key="services" data={data} theme={visibleIndex % 2 === 0 ? 'dark' : 'light'} />;
                break;
              case 'videos':
                hasContent = data.videoProjects && data.videoProjects.length > 0;
                content = hasContent ? <ProjectsSection key="videos" videoProjects={data.videoProjects || []} onSelectVideo={handleSelectVideo} theme={visibleIndex % 2 === 0 ? 'dark' : 'light'} /> : null;
                break;
              case 'photos':
                hasContent = data.photos && data.photos.length > 0;
                content = hasContent ? <PhotosSection key="photos" photos={data.photos || []} /> : null;
                break;
              case 'experience':
                hasContent = data.experience && data.experience.length > 0;
                content = hasContent ? <ExperienceSection key="experience" experience={data.experience || []} theme={visibleIndex % 2 === 0 ? 'dark' : 'light'} /> : null;
                break;
              case 'skills':
                hasContent = data.skills && data.skills.length > 0;
                content = hasContent ? <SkillsSection key="skills" skills={data.skills || []} theme={visibleIndex % 2 === 0 ? 'dark' : 'light'} /> : null;
                break;
              case 'reviews':
                const approvedReviews = (data.reviews || []).filter(r => r.status === 'approved');
                hasContent = approvedReviews.length > 0;
                content = hasContent ? <ReviewsSection key="reviews" reviews={data.reviews || []} theme={visibleIndex % 2 === 0 ? 'dark' : 'light'} /> : null;
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
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          >
            <div 
              onClick={e => e.stopPropagation()} 
              className={`w-full ${isInstagram || isShort ? 'max-w-[400px]' : 'max-w-4xl'} relative`}
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
              <div className={`relative w-full ${isInstagram || isShort ? 'aspect-[9/16] h-[75vh]' : 'aspect-video'} rounded-3xl overflow-hidden border border-white/10 bg-black`}>
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
