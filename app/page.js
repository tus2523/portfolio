'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Instagram, Linkedin, Youtube, MapPin, Mail, Phone
} from 'lucide-react';
import { getData, getYoutubeId, getYoutubeThumbnail } from './lib/store';
import Papa from 'papaparse';
import { db } from './lib/firebase';
import { ref, onValue } from 'firebase/database';

// ── COMPONENTS ─────────────────────────────────────────────────────

const CountUp = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const target = parseInt(end);
    if (isNaN(target)) return;
    const duration = 1500;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <>{count}{suffix}</>;
};

const TypingText = ({ text, delay = 0 }) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const timer = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(timer);
      }, 50);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);
  return <>{displayed}</>;
};

/* ─── Scroll-reveal hook ────────────────────────────────────────── */
function useReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } }),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, deps);
}

export default function Home() {
  const [data, setData]               = useState(() => getData());
  const [grouped, setGrouped]         = useState({});
  const [brands, setBrands]           = useState([]);
  const [activeBrand, setActiveBrand] = useState(null);
  const [openCard, setOpenCard]       = useState(null);
  const [lightbox, setLightbox]       = useState(null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [hasInitialData, setHasInitialData] = useState(false);
  const scrollRefs = useRef({});

  const SHEET_ID = "1fGEspsH5giDymSErmF1ZjGAkUZEQcdEB2eCqh2SaT6Y";

  const scrollGallery = (id, dir) => {
    const el = scrollRefs.current[id];
    if (el) el.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
  };

  useReveal([data, brands]);


  useEffect(() => {
    // 1. Load Local Fallback
    setData(getData());
    
    // 2. Firebase REAL-TIME Listener for ALL Content
    const portfolioRef = ref(db, 'portfolio_content');
    const unsubscribePort = onValue(portfolioRef, (snapshot) => {
      const fbData = snapshot.val();
      if (fbData) {
        console.log("Global Sync: Portfolio Updated!");
        // Merge with defaultData to ensure all keys exist
        setData(prev => {
          const base = prev || getData();
          return {
            ...base,
            ...fbData,
            heroStats: { ...base.heroStats, ...fbData.heroStats },
            about: { ...base.about, ...fbData.about },
            campaigns: { ...base.campaigns, ...fbData.campaigns }
          };
        });
      }
    });

    // 3. Firebase REAL-TIME Listener for Campaigns
    const campaignsRef = ref(db, 'campaigns_data');
    const unsubscribeCamp = onValue(campaignsRef, (snapshot) => {
      const fbData = snapshot.val();
      if (fbData && fbData.grouped && fbData.brands) {
        // Deep equality check using JSON stringify to avoid flickering if data is same
        const currentDataStr = localStorage.getItem('sahil_campaigns_cache');
        const newDataStr = JSON.stringify(fbData);
        
        if (currentDataStr !== newDataStr || !hasInitialData) {
          console.log("Firebase Sync: Data Updated Live!");
          setGrouped(fbData.grouped);
          setBrands(fbData.brands);
          localStorage.setItem('sahil_campaigns_cache', newDataStr);
          setActiveBrand(prev => (prev && fbData.brands.includes(prev) ? prev : fbData.brands[0]));
          setHasInitialData(true);
        }
      }
    });

    return () => {
      unsubscribePort();
      unsubscribeCamp();
    };
  }, []);


  if (!data) return null;

  const { 
    heroStats = {}, 
    videoProjects = [], 
    experience = [], 
    about = {}, 
    skills = [] 
  } = data;

  const activeCampaigns = activeBrand ? (grouped[activeBrand] || {}) : {};
  const campaignNames   = Object.keys(activeCampaigns);

  function extractHandle(url) {
    if (!url) return '';
    const m = url.match(/instagram\.com\/([^/?#]+)/);
    return m ? '@' + m[1] : '';
  }

  return (
    <>
      {/* ── NAV ──────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(8,8,8,0.7)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '1rem 0',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.04em' }}>
            <span style={{ color: 'var(--gold)' }}>ST</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.88rem', fontWeight: 500 }}>
            {['Work', 'Video', 'Experience', 'About'].map(label => (
              <a key={label} href={`#${label.toLowerCase()}`}
                style={{ color: 'var(--muted)', transition: 'color .2s' }}
                onMouseOver={e => e.target.style.color = '#fff'}
                onMouseOut={e => e.target.style.color = 'var(--muted)'}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section style={{ padding: '12rem 0 8rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <p className="stagger-item" style={{ 
            fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', 
            textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1.5rem',
            '--stagger-i': 1 
          }}>
            Available for Projects
          </p>
          
          <h1 className="stagger-item" style={{ 
            marginBottom: '1.5rem',
            maxWidth: '900px',
            textTransform: 'uppercase',
            '--stagger-i': 2
          }}>
            SAHIL THORAT
          </h1>

          <div className="stagger-item" style={{ 
            fontSize: '1.25rem', color: 'var(--muted)', marginBottom: '4rem', maxWidth: '600px',
            '--stagger-i': 3
          }}>
            Influencer Marketer, Video Producer, and Content Creator based in Mumbai.
          </div>

          {/* Social buttons — Button Hierarchy (Impeccable) */}
          <div className="stagger-item" style={{ 
            display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '6rem',
            '--stagger-i': 4
          }}>
            {/* Primary Action */}
            {about.email && (
              <a href={`mailto:${about.email}`} className="btn btn-gold" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
                <Mail size={18} /> Let's Talk
              </a>
            )}
            {/* Secondary Actions (Ghost) */}
            {[
              { url: heroStats.instagramUrl, label: 'Instagram', icon: <Instagram size={18} /> },
              { url: heroStats.linkedinUrl,  label: 'LinkedIn',  icon: <Linkedin size={18} /> },
              { url: heroStats.youtubeUrl,   label: 'YouTube',   icon: <Youtube size={18} /> },
            ].filter(s => s.url).map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.8rem', borderRadius: '50%' }}>
                {s.icon}
              </a>
            ))}
          </div>

          {/* Stats — Minimal Grid */}
          <div className="stagger-item" style={{ 
            display: 'flex', gap: '4rem', flexWrap: 'wrap',
            paddingTop: '3rem', borderTop: '1px solid var(--border)', width: '100%',
            '--stagger-i': 5
          }}>
            {[1,2,3,4].map(n => (
              <div key={n} style={{ minWidth: '100px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--fg)', marginBottom: '0.25rem', letterSpacing: '-0.03em' }}>
                  <CountUp end={heroStats[`stat${n}Value`] || 0} suffix="+" />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--muted)' }}>
                  {heroStats[`stat${n}Label`] || `Stat ${n}`}
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: 0 }} />

        {/* ── CAMPAIGN WORK ─────────────────────────────────────────── */}
        <section id="work" style={{ padding: '6rem 0', textAlign: 'center' }}>
          <p className="reveal" style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.75rem' }}>
            INFLUENCER MARKETING
          </p>
          <h2 className="reveal reveal-delay-1" style={{ fontSize: '3rem' }}>Campaign Work</h2>
          <div className="reveal reveal-delay-2 gold-line" style={{ margin: '1.5rem auto 3rem' }} />

          {!hasInitialData && loadingCampaigns && <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Loading campaigns…</p>}

          {hasInitialData && (
            <div style={{ textAlign: 'left' }}> {/* Keep campaign content left-aligned for readability */}
              {/* Brand Tabs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center' }}>
                {brands.map(brand => (
                  <button key={brand}
                    onClick={() => { setActiveBrand(brand); setOpenCard(null); }}
                    style={{
                      padding: '0.6rem 1.5rem', border: '1px solid',
                      borderColor: activeBrand === brand ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                      borderRadius: 999,
                      background: activeBrand === brand ? 'var(--gold)' : 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(8px)',
                      color: activeBrand === brand ? '#000' : 'var(--muted)',
                      fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all .25s',
                    }}>
                    {brand}
                  </button>
                ))}
              </div>

              {/* Campaign Accordion List */}
              <div 
                className="glass" 
                style={{ overflow: 'hidden' }}
              >
                {campaignNames.map((name, i) => {
                  const creators = activeCampaigns[name];
                  const isOpen   = openCard === i;
                  return (
                    <div key={i} style={{ borderBottom: i < campaignNames.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                      <button
                        onClick={() => setOpenCard(isOpen ? null : i)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '1.25rem 1.5rem', background: 'none', border: 'none',
                          color: 'var(--fg)', cursor: 'pointer', transition: 'background .3s ease', textAlign: 'left',
                        }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                        onMouseOut={e => e.currentTarget.style.background = 'none'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ 
                            color: isOpen ? 'var(--gold)' : 'var(--muted)', 
                            fontSize: '0.85rem', 
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                            display: 'inline-block', 
                            transform: isOpen ? 'rotate(90deg)' : 'none' 
                          }}>›</span>
                          <span style={{ fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.01em' }}>{name}</span>
                        </div>
                        <span style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap', opacity: 0.8 }}>
                          {creators.length} creator{creators.length !== 1 ? 's' : ''}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="animate-fade-in" style={{ 
                          borderTop: '1px solid rgba(255,255,255,0.06)', 
                          background: 'rgba(0,0,0,0.3)', 
                          backdropFilter: 'blur(10px)',
                        }}>
                          {creators.map((c, ci) => {
                            const handle = extractHandle(c.profile);
                            return (
                              <div key={ci} className="campaign-creator-item" style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '1rem 1.5rem',
                                borderBottom: ci < creators.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                flexWrap: 'wrap', gap: '0.75rem',
                                animation: 'slideUp 0.6s var(--ease-drawer) both',
                                animationDelay: `${ci * 0.06}s`,
                                transition: 'background 0.3s var(--ease-out)',
                              }}
                              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                  <div style={{ fontWeight: 600, fontSize: '0.95rem', transition: 'color 0.2s', letterSpacing: '-0.01em' }}>{c.creator}</div>
                                  {handle && (
                                    <a href={c.profile} target="_blank" rel="noopener noreferrer"
                                      style={{ color: 'var(--gold)', fontSize: '0.82rem', display: 'inline-block', marginTop: '0.2rem', opacity: 0.9, transition: 'all 0.2s var(--ease-out)' }}
                                      onMouseOver={e => { e.target.style.opacity = 1; e.target.style.transform = 'translateX(2px)'; }}
                                      onMouseOut={e => { e.target.style.opacity = 0.9; e.target.style.transform = 'translateX(0)'; }}
                                    >
                                      {handle}
                                    </a>
                                  )}
                                </div>
                                {c.liveLink && (
                                  <a href={c.liveLink} target="_blank" rel="noopener noreferrer"
                                    className="btn btn-outline btn-sm"
                                    style={{ borderRadius: 999, padding: '0.4rem 1.1rem' }}
                                  >
                                    View Live Post ↗
                                  </a>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="reveal" style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                <span style={{ color: 'var(--gold)' }}>✓</span> Data synced live from Google Sheets
              </p>
            </div>
          )}
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: 0 }} />

        {/* ── VIDEO GALLERY ─────────────────────────────────────────── */}
        <section id="video" style={{ padding: '5rem 0' }}>
          <p className="reveal" style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem' }}>
            EDITING WORK
          </p>
          <h2 className="reveal reveal-delay-1">Video Gallery</h2>
          <div className="reveal reveal-delay-2 gold-line" style={{ marginTop: '0.75rem' }} />

          {(videoProjects || []).map((project, pi) => (
            <div key={project.id} className="reveal" style={{ marginBottom: '4rem', animationDelay: `${pi * 0.1}s` }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                    {(project.tags || []).map(t => <span key={t} className="tag" style={{ fontSize: '0.65rem' }}>{t}</span>)}
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>{project.title}</h3>
                  <p style={{ fontSize: '0.88rem', marginTop: '0.3rem', marginBottom: 0, opacity: 0.8 }}>{project.description}</p>
                </div>
                <span style={{ color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  {(project.videos || []).length} project{(project.videos || []).length !== 1 ? 's' : ''}
                </span>
              </div>

              {(!project.videos || project.videos.length === 0) ? (
                <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem' }}>
                  No videos added to this project yet.
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  {/* Scroll Buttons */}
                  <button onClick={() => scrollGallery(project.id, 'left')} className="scroll-btn" style={{ left: '-1rem' }}>‹</button>
                  <button onClick={() => scrollGallery(project.id, 'right')} className="scroll-btn" style={{ right: '-1rem' }}>›</button>

                  <div 
                    ref={el => scrollRefs.current[project.id] = el}
                    className="video-scroll-container" 
                    style={{ 
                      display: 'flex', gap: '1.25rem', overflowX: 'auto', 
                      padding: '0.5rem 0 1.5rem', scrollSnapType: 'x mandatory',
                      scrollbarWidth: 'none', msOverflowStyle: 'none'
                    }}
                  >
                  {(project.videos || []).map((vid, vi) => {
                    const thumb = getYoutubeThumbnail(vid.url);
                    return (
                      <div 
                        key={vid.id} 
                        onClick={() => setLightbox(vid)}
                        className="glass-card"
                        style={{ 
                          flex: '0 0 360px', cursor: 'pointer', overflow: 'hidden', 
                          scrollSnapAlign: 'start', animation: 'fadeIn 0.5s ease both',
                          animationDelay: `${vi * 0.1}s`
                        }}
                      >
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: 'var(--bg3)' }}>
                          {thumb ? (
                            <img src={thumb} alt={vid.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#222', fontSize: '2rem' }}>▶</div>
                          )}
                          <div style={{ 
                            position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                            display: 'flex', alignItems: 'flex-end', padding: '0.75rem'
                          }}>
                            <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                              WATCH NOW
                            </div>
                          </div>
                        </div>
                        <div style={{ padding: '1rem 1.1rem' }}>
                          <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--fg)', lineHeight: 1.4 }}>{vid.title}</div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: 0 }} />

        {/* ── EXPERIENCE ────────────────────────────────────────────── */}
        <section id="experience" style={{ padding: '5rem 0' }}>
          <h2 className="reveal">Experience</h2>
          <div className="reveal reveal-delay-1 gold-line" style={{ marginTop: '0.75rem' }} />
          <div className="reveal reveal-delay-2" style={{ position: 'relative' }}>
            {/* Vertical line accent */}
          <div className="exp-line" style={{ position: 'absolute', left: '138px', top: '10px', bottom: '10px', width: '1px', background: 'rgba(255,255,255,0.06)' }} />
            
            {(experience || []).map((ex, i) => (
              <div key={ex.id} className="exp-grid" style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '2.5rem', padding: '2.5rem 0', position: 'relative' }}>
                <div className="exp-year" style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.05em', paddingTop: '0.2rem' }}>
                  {ex.year}
                </div>
                {/* Dot indicator */}
                <div className="exp-dot" style={{ 
                  position: 'absolute', left: '134px', top: '2.8rem', 
                  width: '9px', height: '9px', background: 'var(--gold)', 
                  borderRadius: '50%', boxShadow: '0 0 10px var(--gold)',
                  zIndex: 1
                }} />
                
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>{ex.role}</div>
                  <div style={{ color: 'var(--fg)', fontSize: '0.92rem', fontWeight: 600, marginBottom: '0.75rem', opacity: 0.9 }}>{ex.company}</div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7 }}>{ex.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: 0 }} />

        {/* ── SKILLS ────────────────────────────────────────────────── */}
        <section style={{ padding: '5rem 0' }}>
          <h2 className="reveal" style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Skills &amp; Expertise</h2>
          <div className="reveal reveal-delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {(skills || []).map((s, si) => (
              <span key={s}
                className="glass"
                style={{ 
                  padding: '0.5rem 1.25rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, 
                  fontSize: '0.88rem', fontWeight: 500, color: 'var(--muted)', transition: 'all 0.3s ease', cursor: 'default',
                  animation: 'fadeIn 0.5s ease both', animationDelay: `${si * 0.05}s`
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(245,197,24,0.4)'; e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>

      </div>

      {/* ── FOOTER / ABOUT ────────────────────────────────────────── */}
      <footer id="about" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '5rem 0 3rem', background: 'rgba(255,255,255,0.01)', backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>
          <h2 className="reveal" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.03em' }}>Let's Work Together</h2>
          <p className="reveal reveal-delay-1" style={{ fontSize: '1rem', maxWidth: 560, lineHeight: 1.7, marginBottom: '2.5rem' }}>{about.bio}</p>
          
          <div className="reveal reveal-delay-2" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {about.email && (
              <a href={`mailto:${about.email}`} className="btn btn-outline">
                <Mail size={18} style={{ color: 'var(--gold)' }} />
                {about.email}
              </a>
            )}
            {about.phone && (
              <a href={`tel:${about.phone}`} className="btn btn-outline">
                <Phone size={18} style={{ color: 'var(--gold)' }} />
                {about.phone}
              </a>
            )}
          </div>

          <div className="reveal reveal-delay-3" style={{ display: 'flex', gap: '1.5rem', marginBottom: '4rem' }}>
            {[
              { url: heroStats.instagramUrl, icon: <Instagram size={20} />, label: 'Instagram' },
              { url: heroStats.linkedinUrl,  icon: <Linkedin size={20} />,  label: 'LinkedIn' },
              { url: heroStats.youtubeUrl,   icon: <Youtube size={20} />,   label: 'YouTube' },
            ].filter(s => s.url).map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" 
                style={{ color: 'var(--muted)', transition: 'all 0.3s ease' }}
                onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseOut={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                title={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>

          <p style={{ fontSize: '0.8rem', color: '#333' }}>© 2026 Sahil Thorat. All rights reserved.</p>
        </div>
      </footer>

      {/* ── VIDEO LIGHTBOX ────────────────────────────────────────── */}
      {lightbox && (
        <div onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', animation: 'fadeIn 0.2s ease' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 'min(760px, 100%)', animation: 'slideUp 0.25s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
              <button onClick={() => setLightbox(null)} style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, color: 'var(--muted)', width: 36, height: 36, cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <iframe src={`https://www.youtube.com/embed/${getYoutubeId(lightbox.url)}?autoplay=1`} allow="autoplay; encrypted-media" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
