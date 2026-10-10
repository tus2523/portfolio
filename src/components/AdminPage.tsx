import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  getData,
  updateSection,
  resetData,
  login,
  logout,
  isLoggedIn,
  getYoutubeId,
  fetchYoutubeMetadata,
  defaultData,
  THEME_PRESETS,
  type StudioTheme,
} from '../lib/store';
import { ImageUpload } from './ImageUpload';
import { getCloudinaryConfig, saveCloudinaryConfig, testCloudinaryConnection } from '../lib/cloudinary';
import { 
  LogOut, CheckCircle2, AlertCircle, Plus, Trash2, Edit3, 
  ExternalLink, Sparkles, Award, RotateCcw, Loader2, Play,
  Palette, ShieldCheck, Lock, Key
} from 'lucide-react';

const uid = () => Math.random().toString(36).slice(2, 9);

const NAV = [
  { id: 'stats',        icon: '📊', label: 'Hero Stats'      },
  { id: 'about',        icon: '👤', label: 'Studio Profile'  },
  { id: 'videos',       icon: '🎬', label: 'Video Projects'  },
  { id: 'photos',       icon: '🖼️', label: 'Stills Folders'  },
  { id: 'brands',       icon: '🏷️', label: 'Brands & Celebs' },
  { id: 'services',     icon: '✨', label: 'Services & Scope'},
  { id: 'experience',   icon: '💼', label: 'Work Timeline'   },
  { id: 'skills',       icon: '🛠️', label: 'Technical Skills'},
  { id: 'reviews',      icon: '⭐', label: 'Endorsements'    },
  { id: 'settings',     icon: '🎨', label: 'Theme & Settings'},
  { id: 'seed',         icon: '🗄️', label: 'System Reset'    },
];

const SortableNavItem = ({ id, label, icon, active, onClick }: { id: string, label: string, icon: string, active: boolean, onClick: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.75 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center w-full relative group">
      <div 
        {...attributes} 
        {...listeners}
        className="absolute left-1 top-0 bottom-0 w-6 flex items-center justify-center cursor-grab active:cursor-grabbing text-[#ccd5ae]/20 hover:text-[#ccd5ae]/70 transition opacity-0 group-hover:opacity-100 md:opacity-60"
        title="Drag to reorder"
      >
        <span className="text-[10px]">⋮⋮</span>
      </div>

      <button
        onClick={onClick}
        className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 md:pl-7 rounded-xl text-xs font-medium transition-all text-left ${
          active 
            ? 'bg-[#01472e] text-[#fefae0] font-semibold shadow-md shadow-[#01472e]/30 border border-[#ccd5ae]/20' 
            : 'text-[#ccd5ae]/70 hover:bg-[#192b22] hover:text-[#fefae0] border border-transparent'
        }`}
      >
        <span>{icon}</span>
        <span className="truncate">{label}</span>
      </button>
    </div>
  );
};

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-red-400 bg-[#0d1410] min-h-screen font-sans flex flex-col justify-center items-center">
          <div className="max-w-md w-full bg-[#141f19] border border-red-900/40 p-6 rounded-2xl shadow-xl">
            <h1 className="text-xl font-bold mb-2">Error in Studio Admin Panel</h1>
            <p className="text-xs text-red-300/80 mb-4">Something went wrong while rendering the dashboard.</p>
            <pre className="text-[11px] whitespace-pre-wrap bg-black/40 p-3 rounded-lg overflow-x-auto text-red-300">
              {this.state.error?.stack}
            </pre>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 w-full py-2 bg-[#01472e] text-[#fefae0] rounded-lg text-xs font-bold uppercase tracking-wider"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AdminPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <AdminPageInner />
    </ErrorBoundary>
  );
};

const AdminPageInner: React.FC = () => {
  const [tab, setTab] = useState('stats');
  const [data, setData] = useState<typeof defaultData>(() => getData());
  const [saved, setSaved] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loginErr, setLoginErr] = useState('');
  const [loginForm, setLoginForm] = useState({ email: 'marutushar387@gmail.com', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const currentOrder = data.settings?.sectionOrder || ['about', 'videos', 'photos', 'brands', 'services', 'experience', 'skills', 'reviews'];

  useEffect(() => {
    setIsMounted(true);
    setAuthed(isLoggedIn());
    setData(getData());
  }, []);

  if (!isMounted) return <div style={{ minHeight: '100vh', background: '#0a120e' }} />;

  // ─── LOGIN SCREEN ───
  if (!authed) {
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const res = login(loginForm.email, loginForm.password);
      if (res.success) {
        setAuthed(true);
        setLoginErr('');
      } else {
        setLoginErr(res.error || 'Invalid credentials.');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#0a120e] text-[#ccd5ae] font-sans selection:bg-[#01472e] selection:text-[#fefae0]">
        <div className="w-full max-w-md bg-[#131f18] border border-[#01472e]/40 p-8 sm:p-10 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#01472e]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ccd5ae]/60 block mb-2">
              STUDIO PORTFOLIO CMS
            </span>
            <div className="text-3xl font-display uppercase tracking-tight text-[#fefae0]">
              TUSHAR MARU<span className="text-[#10b981]">.</span>
            </div>
            <p className="text-xs text-[#ccd5ae]/70 mt-1">Creative Director &amp; Video Editor Control Panel</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5 relative z-10">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ccd5ae]/60">Email / Username</label>
              <input
                type="text"
                className="w-full bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3.5 text-[#fefae0] text-sm focus:border-[#10b981] outline-none transition-colors"
                value={loginForm.email}
                onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                placeholder="marutushar387@gmail.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ccd5ae]/60">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="w-full bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3.5 text-[#fefae0] text-sm pr-14 focus:border-[#10b981] outline-none transition-colors"
                  value={loginForm.password}
                  onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-[#ccd5ae]/50 hover:text-[#fefae0] transition-colors"
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {loginErr && (
              <p className="text-red-300 text-xs bg-red-950/40 p-3 rounded-xl border border-red-900/50 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{loginErr}</span>
              </p>
            )}

            <button 
              type="submit" 
              className="w-full mt-2 bg-[#01472e] hover:bg-[#025c3c] text-[#fefae0] rounded-xl p-3.5 uppercase tracking-[0.25em] text-xs font-bold transition-all shadow-lg shadow-[#01472e]/30 hover:scale-[1.01]"
            >
              Sign In to Studio CMS
            </button>

            <div className="text-center mt-3">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); window.location.hash = ''; window.location.pathname = '/'; }}
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/50 hover:text-[#fefae0] transition-colors"
              >
                ← Back to Live Portfolio
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const flash = (msg = 'Changes saved!') => {
    setSaved(msg);
    setTimeout(() => setSaved(''), 2500);
  };

  const save = (section: string, val: any) => {
    const updated = updateSection(section, val);
    setData(updated);
    flash('Saved to portfolio store! ✨');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = currentOrder.indexOf(active.id as string);
      const newIndex = currentOrder.indexOf(over.id as string);
      const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
      
      const newSettings = { ...data.settings, sectionOrder: newOrder };
      setData({ ...data, settings: newSettings });
      save('settings', newSettings);
    }
  };

  const renderNavItem = (n: typeof NAV[0]) => {
    if (!n) return null;
    return (
      <button
        key={n.id}
        onClick={() => setTab(n.id)}
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
          tab === n.id 
            ? 'bg-[#01472e] text-[#fefae0] font-semibold shadow-md border border-[#ccd5ae]/20' 
            : 'text-[#ccd5ae]/70 hover:bg-[#192b22] hover:text-[#fefae0] border border-transparent'
        }`}
      >
        <span>{n.icon}</span>
        <span className="truncate">{n.label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a120e] text-[#ccd5ae] font-sans flex flex-col md:flex-row select-none">
      {/* ─── SIDEBAR NAVIGATION ─── */}
      <aside className="w-full md:w-64 bg-[#111c16] border-b md:border-b-0 md:border-r border-[#01472e]/30 flex flex-col justify-between shrink-0">
        <div className="p-4 md:p-6">
          {/* Logo & Header */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#ccd5ae]/50">
                STUDIO CONTROL
              </span>
              <div className="text-lg md:text-xl font-display uppercase tracking-wide text-[#fefae0]">
                TUSHAR MARU<span className="text-[#10b981]">.</span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); window.location.hash = ''; window.location.pathname = '/'; }}
                className="px-2.5 py-1 bg-[#192b22] text-[#ccd5ae] rounded-lg text-[10px] font-bold uppercase tracking-wider"
              >
                Live
              </a>
              <button
                onClick={() => { logout(); setAuthed(false); }}
                className="px-2.5 py-1 bg-red-950/30 text-red-400 border border-red-900/40 rounded-lg text-[10px] font-bold uppercase tracking-wider"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Quick View Website Button */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.location.hash = ''; window.location.pathname = '/'; }}
            className="hidden md:flex items-center justify-between gap-2 mt-4 px-3 py-2 rounded-xl bg-[#192b22] text-[#fefae0] text-xs font-semibold hover:bg-[#01472e] transition-colors border border-[#01472e]/40 shadow-sm"
          >
            <span className="flex items-center gap-1.5">
              <ExternalLink size={12} />
              <span>View Live Website</span>
            </span>
            <span className="text-[9px] text-[#ccd5ae]/60 uppercase tracking-widest">[OPEN]</span>
          </a>
          
          {/* Nav Items */}
          <nav className="flex flex-row md:flex-col gap-1.5 md:gap-1 mt-4 md:mt-6 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none whitespace-nowrap w-full">
            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#ccd5ae]/40 md:mb-1 md:ml-3 hidden md:block">
              Pinned Sections
            </div>
            {renderNavItem(NAV.find(n => n.id === 'stats')!)}
            {renderNavItem(NAV.find(n => n.id === 'about')!)}
            
            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#ccd5ae]/40 md:mt-4 md:mb-1 md:ml-3 hidden md:block">
              Media &amp; Portfolio
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={currentOrder} strategy={verticalListSortingStrategy}>
                {currentOrder.map(id => {
                  const n = NAV.find(item => item.id === id);
                  if (!n || n.id === 'stats' || n.id === 'about') return null;
                  return (
                    <SortableNavItem 
                      key={n.id} 
                      id={n.id} 
                      label={n.label} 
                      icon={n.icon} 
                      active={tab === n.id} 
                      onClick={() => setTab(n.id)} 
                    />
                  );
                })}
              </SortableContext>
            </DndContext>

            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#ccd5ae]/40 md:mt-4 md:mb-1 md:ml-3 hidden md:block">
              System Settings
            </div>
            {renderNavItem(NAV.find(n => n.id === 'settings')!)}
            {renderNavItem(NAV.find(n => n.id === 'seed')!)}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="hidden md:block p-4 border-t border-[#01472e]/30">
          <button
            onClick={() => { logout(); setAuthed(false); }}
            className="w-full p-2.5 bg-red-950/20 text-red-300 border border-red-900/40 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-red-950/40 transition flex items-center justify-center gap-2"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 p-6 sm:p-10 w-full max-w-[1400px] mx-auto overflow-y-auto overflow-x-hidden min-h-0">
        {saved && (
          <div className="fixed top-6 right-6 bg-[#01472e] text-[#fefae0] border border-[#10b981]/50 font-bold py-3 px-6 rounded-2xl shadow-2xl z-50 text-xs uppercase tracking-wider flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={16} className="text-[#10b981]" />
            <span>{saved}</span>
          </div>
        )}

        {tab === 'stats'        && <HeroStats        data={data} save={save} />}
        {tab === 'about'        && <About            data={data} save={save} />}
        {tab === 'videos'       && <VideoProjects    data={data} save={save} flash={flash} />}
        {tab === 'photos'       && <PhotosManagement data={data} save={save} />}
        {tab === 'brands'       && <BrandsManagement data={data} save={save} />}
        {tab === 'services'     && <ServicesManagement data={data} save={save} />}
        {tab === 'experience'   && <Experience       data={data} save={save} />}
        {tab === 'skills'       && <Skills           data={data} save={save} />}
        {tab === 'reviews'      && <ReviewsManagement data={data} save={save} />}
        {tab === 'settings'     && <Settings         data={data} save={save} />}
        {tab === 'seed'         && <SeedData         setData={setData} flash={flash} />}
      </main>
    </div>
  );
};

// ─── 1. HERO STATS SUBCOMPONENT ──────────────────────────────────────
const HeroStats: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [form, setForm] = useState({ ...(data.heroStats || {}) });

  useEffect(() => setForm({ ...(data.heroStats || {}) }), [data.heroStats]);

  const handleSave = () => save('heroStats', form);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-display uppercase tracking-tight text-[#fefae0]">Hero Stats &amp; Links</h2>
        <p className="text-xs text-[#ccd5ae]/70 mt-1">Numbers and social URLs showcased on the landing view.</p>
      </div>

      <div className="bg-[#111c16] border border-[#01472e]/30 p-6 sm:p-8 rounded-3xl flex flex-col gap-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Stat 1 Value</label>
            <input className="bg-[#0a120e] border border-[#01472e]/30 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" value={form.stat1Value || ''} onChange={e => setForm(p => ({ ...p, stat1Value: e.target.value }))} placeholder="85+" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Stat 1 Label</label>
            <input className="bg-[#0a120e] border border-[#01472e]/30 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" value={form.stat1Label || ''} onChange={e => setForm(p => ({ ...p, stat1Label: e.target.value }))} placeholder="PROJECTS DELIVERED" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Stat 2 Value</label>
            <input className="bg-[#0a120e] border border-[#01472e]/30 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" value={form.stat2Value || ''} onChange={e => setForm(p => ({ ...p, stat2Value: e.target.value }))} placeholder="25+" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Stat 2 Label</label>
            <input className="bg-[#0a120e] border border-[#01472e]/30 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" value={form.stat2Label || ''} onChange={e => setForm(p => ({ ...p, stat2Label: e.target.value }))} placeholder="BRAND COMMERCIALS" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Stat 3 Value</label>
            <input className="bg-[#0a120e] border border-[#01472e]/30 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" value={form.stat3Value || ''} onChange={e => setForm(p => ({ ...p, stat3Value: e.target.value }))} placeholder="15+" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Stat 3 Label</label>
            <input className="bg-[#0a120e] border border-[#01472e]/30 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" value={form.stat3Label || ''} onChange={e => setForm(p => ({ ...p, stat3Label: e.target.value }))} placeholder="CELEBRITIES BTS" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Stat 4 Value</label>
            <input className="bg-[#0a120e] border border-[#01472e]/30 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" value={form.stat4Value || ''} onChange={e => setForm(p => ({ ...p, stat4Value: e.target.value }))} placeholder="2+" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Stat 4 Label</label>
            <input className="bg-[#0a120e] border border-[#01472e]/30 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" value={form.stat4Label || ''} onChange={e => setForm(p => ({ ...p, stat4Label: e.target.value }))} placeholder="YEARS PRODUCTION EXP" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#01472e]/20 pt-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Instagram Profile URL</label>
            <input className="bg-[#0a120e] border border-[#01472e]/30 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" value={form.instagramUrl || ''} onChange={e => setForm(p => ({ ...p, instagramUrl: e.target.value }))} placeholder="https://instagram.com/tusharmaru" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">YouTube Channel URL</label>
            <input className="bg-[#0a120e] border border-[#01472e]/30 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" value={form.youtubeUrl || ''} onChange={e => setForm(p => ({ ...p, youtubeUrl: e.target.value }))} placeholder="https://youtube.com/@tusharmaru" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={handleSave} className="bg-[#01472e] hover:bg-[#025c3c] text-[#fefae0] px-6 py-3 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition shadow-lg shadow-[#01472e]/20">
            Save Hero Stats
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── 2. ABOUT PROFILE SUBCOMPONENT ──────────────────────────────────
const About: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [form, setForm] = useState({ ...(data.about || {}) });

  useEffect(() => setForm({ ...(data.about || {}) }), [data.about]);

  const handleSave = () => save('about', form);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-display uppercase tracking-tight text-[#fefae0]">Studio Profile &amp; Bio</h2>
        <p className="text-xs text-[#ccd5ae]/70 mt-1">Editorial statement, background description, and direct contact details.</p>
      </div>

      <div className="bg-[#111c16] border border-[#01472e]/30 p-6 sm:p-8 rounded-3xl flex flex-col gap-6 shadow-xl">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Editorial Statement / Bio</label>
          <textarea
            className="bg-[#0a120e] border border-[#01472e]/30 rounded-xl p-3.5 text-[#fefae0] text-sm h-32 leading-relaxed focus:border-[#10b981] outline-none"
            value={form.bio || ''}
            onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
            placeholder="Skilled freelance videographer and video editor specializing in commercial visuals..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Direct Email</label>
            <input className="bg-[#0a120e] border border-[#01472e]/30 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" value={form.email || ''} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="marutushar387@gmail.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Phone / WhatsApp</label>
            <input className="bg-[#0a120e] border border-[#01472e]/30 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" value={form.phone || ''} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="9324704934" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={handleSave} className="bg-[#01472e] hover:bg-[#025c3c] text-[#fefae0] px-6 py-3 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition shadow-lg shadow-[#01472e]/20">
            Save Studio Profile
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── 3. VIDEO PROJECTS SUBCOMPONENT ─────────────────────────────────
const VideoProjects: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void; flash: (m: string) => void }> = ({ data, save }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [modal, setModal] = useState<{ isProjectModal: boolean; projectId?: string; isEdit?: boolean } | null>(null);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', tags: '' });
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoThumbnailUrl, setNewVideoThumbnailUrl] = useState('');
  const [isFetchingTitle, setIsFetchingTitle] = useState(false);
  const [fetchNotice, setFetchNotice] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => setProjects(data.videoProjects || []), [data.videoProjects]);

  const persist = (updated: any) => {
    setProjects(updated);
    save('videoProjects', updated);
  };

  const openAddProject = () => {
    setProjectForm({ title: '', description: '', tags: '' });
    setModal({ isProjectModal: true, isEdit: false });
  };

  const openEditProject = (proj: any) => {
    setProjectForm({ title: proj.title, description: proj.description || '', tags: (proj.tags || []).join(', ') });
    setModal({ isProjectModal: true, projectId: proj.id, isEdit: true });
  };

  const saveProject = () => {
    const tagsArr = projectForm.tags.split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
    if (modal?.isEdit) {
      persist(projects.map(p => p.id === modal.projectId ? { ...p, ...projectForm, tags: tagsArr } : p));
    } else {
      persist([...projects, { id: uid(), ...projectForm, tags: tagsArr, videos: [] }]);
    }
    setModal(null);
  };

  const deleteProject = (id: string) => {
    if (!confirm('Delete video project group?')) return;
    persist(projects.filter(p => p.id !== id));
  };

  const autoFetchYoutubeDetails = async (url: string) => {
    const cleanUrl = url.trim();
    if (!cleanUrl) return;
    const ytId = getYoutubeId(cleanUrl);
    if (!ytId) return;

    // Immediately set thumbnail
    const defaultThumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    setNewVideoThumbnailUrl(prev => prev || defaultThumb);

    setIsFetchingTitle(true);
    setFetchNotice(null);
    try {
      const meta = await fetchYoutubeMetadata(cleanUrl);
      if (meta && meta.title) {
        setNewVideoTitle(meta.title);
        if (meta.thumbnail) setNewVideoThumbnailUrl(meta.thumbnail);
        setFetchNotice({ ok: true, msg: `Fetched: "${meta.title}"` });
      } else {
        setFetchNotice({ ok: false, msg: 'Could not fetch title automatically. You can type it below.' });
      }
    } catch {
      setFetchNotice({ ok: false, msg: 'Could not fetch title automatically. You can type it below.' });
    } finally {
      setIsFetchingTitle(false);
    }
  };

  const handleVideoUrlChange = (url: string) => {
    setNewVideoUrl(url);
    const ytId = getYoutubeId(url);
    if (ytId) {
      autoFetchYoutubeDetails(url);
    }
  };

  const openAddVideoModal = (projId: string) => {
    setNewVideoUrl('');
    setNewVideoTitle('');
    setNewVideoThumbnailUrl('');
    setFetchNotice(null);
    setIsFetchingTitle(false);
    setModal({ isProjectModal: false, projectId: projId });
  };

  const addVideoToProject = () => {
    if (!newVideoUrl.trim()) return;
    const ytId = getYoutubeId(newVideoUrl);
    const thumbnail = newVideoThumbnailUrl || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '');

    const updated = projects.map(p => {
      if (p.id === modal?.projectId) {
        const vList = p.videos || [];
        return {
          ...p,
          videos: [...vList, { id: uid(), title: newVideoTitle || 'Selected Cut', url: newVideoUrl.trim(), thumbnail }]
        };
      }
      return p;
    });
    persist(updated);
    setModal(null);
  };

  const deleteVideoFromProject = (projId: string, vidId: string) => {
    const updated = projects.map(p => {
      if (p.id === projId) {
        return { ...p, videos: (p.videos || []).filter((v: any) => v.id !== vidId) };
      }
      return p;
    });
    persist(updated);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display uppercase tracking-tight text-[#fefae0]">Video Projects &amp; Reels</h2>
          <p className="text-xs text-[#ccd5ae]/70 mt-1">Manage project groups, YouTube videos, and Instagram cuts.</p>
        </div>
        <button onClick={openAddProject} className="bg-[#01472e] hover:bg-[#025c3c] text-[#fefae0] font-bold py-2.5 px-5 rounded-xl uppercase tracking-[0.2em] text-xs transition shadow-lg shadow-[#01472e]/30 flex items-center gap-1.5 self-start">
          <Plus size={14} />
          <span>Add Project Group</span>
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {projects.map((proj: any) => (
          <div key={proj.id} className="bg-[#111c16] border border-[#01472e]/30 p-6 rounded-3xl flex flex-col gap-4 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-[#fefae0]">{proj.title}</h3>
                {proj.description && <p className="text-xs text-[#ccd5ae]/70 mt-1">{proj.description}</p>}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {(proj.tags || []).map((t: string, idx: number) => (
                    <span key={idx} className="bg-[#01472e]/40 text-[#ccd5ae] border border-[#01472e]/60 text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditProject(proj)} className="text-xs px-2.5 py-1 bg-[#192b22] text-[#ccd5ae] rounded-lg hover:text-[#fefae0] flex items-center gap-1">
                  <Edit3 size={11} /> Edit
                </button>
                <button onClick={() => deleteProject(proj.id)} className="text-xs px-2.5 py-1 bg-red-950/30 text-red-400 rounded-lg hover:bg-red-950/60 flex items-center gap-1">
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </div>

            {/* Video List inside project */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 border-t border-[#01472e]/20 pt-4">
              {(proj.videos || []).map((v: any) => (
                <div key={v.id} className="bg-[#0a120e] border border-[#01472e]/30 p-2.5 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 truncate">
                    {v.thumbnail ? (
                      <img src={v.thumbnail} className="w-14 h-9 object-cover rounded-lg shrink-0" alt="" />
                    ) : (
                      <div className="w-14 h-9 bg-[#111c16] rounded-lg flex items-center justify-center text-[10px] text-[#ccd5ae]/60 shrink-0">▶</div>
                    )}
                    <div className="truncate">
                      <p className="text-xs font-bold text-[#fefae0] truncate">{v.title}</p>
                      <p className="text-[10px] text-[#ccd5ae]/50 truncate">{v.url}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteVideoFromProject(proj.id, v.id)} className="text-red-400 hover:text-red-300 p-1 shrink-0" title="Delete Video">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => openAddVideoModal(proj.id)}
                className="border-2 border-dashed border-[#01472e]/40 hover:border-[#10b981] text-xs text-[#ccd5ae]/70 p-3 rounded-2xl flex items-center justify-center gap-1.5 transition hover:bg-[#192b22]/30"
              >
                <Plus size={13} />
                <span>Add Video Link</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Group Modal */}
      {modal?.isProjectModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#131f18] border border-[#01472e]/40 p-6 sm:p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-display uppercase tracking-tight text-[#fefae0] mb-4">
              {modal.isEdit ? 'Edit Project Group' : 'Add Project Group'}
            </h3>
            <div className="flex flex-col gap-3.5">
              <input className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" placeholder="Project Title (e.g. Zee Cinema Awards 2025)" value={projectForm.title} onChange={e => setProjectForm(p => ({ ...p, title: e.target.value }))} />
              <textarea className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] h-20 focus:border-[#10b981] outline-none" placeholder="Short description of the shoot / campaign..." value={projectForm.description} onChange={e => setProjectForm(p => ({ ...p, description: e.target.value }))} />
              <input className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" placeholder="Tags (comma separated, e.g. CELEBRITY BTS, BROADCAST)" value={projectForm.tags} onChange={e => setProjectForm(p => ({ ...p, tags: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-[#01472e]/40 rounded-xl text-xs font-bold uppercase tracking-wider text-[#ccd5ae]/70 hover:text-[#fefae0]">Cancel</button>
              <button onClick={saveProject} className="px-5 py-2.5 bg-[#01472e] hover:bg-[#025c3c] rounded-xl text-xs font-bold uppercase tracking-wider text-[#fefae0]">Save Group</button>
            </div>
          </div>
        </div>
      )}

      {/* Video Item Modal */}
      {modal && !modal.isProjectModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#131f18] border border-[#01472e]/40 p-6 sm:p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display uppercase tracking-tight text-[#fefae0]">Add Video Cut</h3>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#01472e]/40 border border-[#01472e]/60 text-[10px] font-bold text-[#10b981] uppercase tracking-wider">
                <Play size={10} fill="currentColor" />
                <span>Auto-Fetch Active</span>
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              {/* URL Input with Auto-Fetch Button */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">
                    Video URL (YouTube or Instagram)
                  </label>
                  {isFetchingTitle && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Loader2 size={11} className="animate-spin" /> Fetching title...
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none"
                    placeholder="https://www.youtube.com/watch?v=... or shorts/..."
                    value={newVideoUrl}
                    onChange={e => handleVideoUrlChange(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => autoFetchYoutubeDetails(newVideoUrl)}
                    disabled={isFetchingTitle || !newVideoUrl.trim()}
                    className="px-3.5 py-2 bg-[#01472e] hover:bg-[#025c3c] text-[#fefae0] rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-40 transition flex items-center gap-1 shrink-0"
                    title="Click to fetch title and thumbnail from YouTube"
                  >
                    <Sparkles size={13} className="text-[#10b981]" />
                    <span className="hidden sm:inline">Fetch Title</span>
                  </button>
                </div>
                {fetchNotice && (
                  <div className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center gap-2 ${
                    fetchNotice.ok 
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                      : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                  }`}>
                    {fetchNotice.ok ? <CheckCircle2 size={13} className="shrink-0" /> : <AlertCircle size={13} className="shrink-0" />}
                    <span className="truncate">{fetchNotice.msg}</span>
                  </div>
                )}
              </div>

              {/* Title Input (Auto-filled) */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">
                  Video Title (Auto-Fetched from YouTube)
                </label>
                <input
                  className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none"
                  placeholder="Video Title (Auto-populates on paste)"
                  value={newVideoTitle}
                  onChange={e => setNewVideoTitle(e.target.value)}
                />
              </div>

              {/* Live Preview Card */}
              {newVideoThumbnailUrl && (
                <div className="p-3 bg-[#0a120e] border border-[#01472e]/40 rounded-2xl flex items-center gap-3">
                  <img src={newVideoThumbnailUrl} alt="Thumbnail preview" className="w-16 h-10 object-cover rounded-lg shrink-0 border border-[#01472e]/50" />
                  <div className="truncate">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block">Thumbnail Ready</span>
                    <span className="text-xs text-[#fefae0] truncate font-semibold block">{newVideoTitle || 'Selected Cut'}</span>
                  </div>
                </div>
              )}

              {/* Custom Thumbnail Upload / Override via Cloudinary */}
              <ImageUpload
                value={newVideoThumbnailUrl}
                onChange={setNewVideoThumbnailUrl}
                folderPath="thumbnails"
                label="Custom Thumbnail Override (Optional)"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-[#01472e]/40 rounded-xl text-xs font-bold uppercase tracking-wider text-[#ccd5ae]/70 hover:text-[#fefae0]">Cancel</button>
              <button onClick={addVideoToProject} className="px-5 py-2.5 bg-[#01472e] hover:bg-[#025c3c] rounded-xl text-xs font-bold uppercase tracking-wider text-[#fefae0]">Add Video Cut</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── 4. PHOTO STILLS SUBCOMPONENT ───────────────────────────────────
const PhotosManagement: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<{ isEdit: boolean; id?: string } | null>(null);
  const [form, setForm] = useState({ title: '', category: 'Celebrity BTS', imageUrl: '', description: '', date: '2024' });

  useEffect(() => setItems(data.photos || []), [data.photos]);

  const persist = (updated: any) => {
    setItems(updated);
    save('photos', updated);
  };

  const openAdd = () => {
    setForm({ title: '', category: 'Celebrity BTS', imageUrl: '', description: '', date: new Date().getFullYear().toString() });
    setModal({ isEdit: false });
  };

  const openEdit = (item: any) => {
    setForm({ title: item.title, category: item.category || 'Celebrity BTS', imageUrl: item.imageUrl || '', description: item.description || '', date: item.date || '2024' });
    setModal({ isEdit: true, id: item.id });
  };

  const saveItem = () => {
    if (!form.imageUrl) {
      alert("Please upload an image or enter a photo URL!");
      return;
    }
    if (modal?.isEdit) {
      persist(items.map((i: any) => i.id === modal.id ? { ...i, ...form } : i));
    } else {
      persist([...items, { id: uid(), ...form }]);
    }
    setModal(null);
  };

  const folderCategories = [
    { label: 'Celebrity BTS', folder: 'BTS ARCHIVE' },
    { label: 'Commercial', folder: 'COMMERCIAL' },
    { label: 'Music & Live', folder: 'MUSIC & LIVE' },
    { label: 'Edit Suite', folder: 'EDIT SUITE' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display uppercase tracking-tight text-[#fefae0]">Photo Stills &amp; Classified Folders</h2>
          <p className="text-xs text-[#ccd5ae]/70 mt-1">Upload camera stills and organize into the 4 interactive production folders.</p>
        </div>
        <button onClick={openAdd} className="bg-[#01472e] hover:bg-[#025c3c] text-[#fefae0] font-bold py-2.5 px-5 rounded-xl uppercase tracking-[0.2em] text-xs transition shadow-lg shadow-[#01472e]/30 flex items-center gap-1.5 self-start">
          <Plus size={14} />
          <span>Add Photo Still</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="bg-[#111c16] border border-[#01472e]/30 p-4 rounded-3xl flex flex-col justify-between gap-3 shadow-xl">
            <div className="aspect-[4/3] bg-black/60 rounded-2xl overflow-hidden border border-[#01472e]/30 relative group">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <span className="absolute top-2.5 left-2.5 bg-[#01472e]/90 text-[#fefae0] text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm border border-[#ccd5ae]/20">
                {item.category}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-[#fefae0] text-sm truncate">{item.title}</h3>
              {item.description && <p className="text-xs text-[#ccd5ae]/60 line-clamp-2 mt-1">{item.description}</p>}
            </div>
            <div className="flex justify-between items-center border-t border-[#01472e]/20 pt-2.5">
              <span className="text-[10px] text-[#ccd5ae]/50 font-bold uppercase">{item.date || '2024'}</span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="text-xs px-2.5 py-1 bg-[#192b22] text-[#ccd5ae] rounded-lg hover:text-[#fefae0]">Edit</button>
                <button onClick={() => { if(confirm('Delete photo?')) persist(items.filter((i:any) => i.id !== item.id)); }} className="text-xs px-2.5 py-1 bg-red-950/30 text-red-400 rounded-lg hover:bg-red-950/60">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#131f18] border border-[#01472e]/40 p-6 sm:p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-display uppercase tracking-tight text-[#fefae0] mb-4">
              {modal.isEdit ? 'Edit Photo Still' : 'Add Photo Still'}
            </h3>
            <div className="flex flex-col gap-3.5 max-h-[65vh] overflow-y-auto pr-1">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Title</label>
                <input className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" placeholder="e.g. Celebrity BTS On-Set Focus" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Destination Folder</label>
                <div className="grid grid-cols-2 gap-2">
                  {folderCategories.map(cat => (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setForm(p => ({...p, category: cat.label}))}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        form.category === cat.label 
                          ? 'bg-[#01472e] border-[#10b981] text-[#fefae0]' 
                          : 'bg-[#0a120e] border-[#01472e]/40 text-[#ccd5ae]/70 hover:border-[#ccd5ae]/50'
                      }`}
                    >
                      <span className="text-[10px] font-bold block uppercase tracking-wider">{cat.folder}</span>
                      <span className="text-[9px] text-[#ccd5ae]/50 block">Tag: {cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <ImageUpload
                value={form.imageUrl}
                onChange={url => setForm(p => ({...p, imageUrl: url}))}
                folderPath="photos"
                label="Upload Stills via Cloudinary"
              />

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Description (Optional)</label>
                <textarea className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm h-16 text-[#fefae0] focus:border-[#10b981] outline-none" placeholder="Details about lighting setup or on-set shoot..." value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Year</label>
                <input className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" placeholder="2024" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-[#01472e]/40 rounded-xl text-xs font-bold uppercase tracking-wider text-[#ccd5ae]/70 hover:text-[#fefae0]">Cancel</button>
              <button onClick={saveItem} className="px-5 py-2.5 bg-[#01472e] hover:bg-[#025c3c] rounded-xl text-xs font-bold uppercase tracking-wider text-[#fefae0]">Save Photo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── 5. BRANDS & CELEBRITIES SUBCOMPONENT ───────────────────────────
const BrandsManagement: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [brands, setBrands] = useState<string[]>(data.brands || []);
  const [celebrities, setCelebrities] = useState<string[]>(data.celebrities || []);
  const [newBrand, setNewBrand] = useState('');
  const [newCeleb, setNewCeleb] = useState('');

  useEffect(() => {
    setBrands(data.brands || []);
    setCelebrities(data.celebrities || []);
  }, [data.brands, data.celebrities]);

  const addBrand = () => {
    if (!newBrand.trim()) return;
    const updated = [...brands, newBrand.trim()];
    setBrands(updated);
    save('brands', updated);
    setNewBrand('');
  };

  const removeBrand = (idx: number) => {
    const updated = brands.filter((_, i) => i !== idx);
    setBrands(updated);
    save('brands', updated);
  };

  const addCeleb = () => {
    if (!newCeleb.trim()) return;
    const updated = [...celebrities, newCeleb.trim()];
    setCelebrities(updated);
    save('celebrities', updated);
    setNewCeleb('');
  };

  const removeCeleb = (idx: number) => {
    const updated = celebrities.filter((_, i) => i !== idx);
    setCelebrities(updated);
    save('celebrities', updated);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-display uppercase tracking-tight text-[#fefae0]">Client Brands &amp; Celebrity Credits</h2>
        <p className="text-xs text-[#ccd5ae]/70 mt-1">Manage names displayed in the animated Marquee showcase and Footer tags.</p>
      </div>

      {/* Brands Card */}
      <div className="bg-[#111c16] border border-[#01472e]/30 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-[#10b981]" />
          <h3 className="text-lg font-bold text-[#fefae0]">Commercial Brands &amp; Campaigns ({brands.length})</h3>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none"
            placeholder="Add brand name (e.g. Nike, Red Bull, Puma)"
            value={newBrand}
            onChange={e => setNewBrand(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addBrand()}
          />
          <button onClick={addBrand} className="bg-[#01472e] hover:bg-[#025c3c] text-[#fefae0] px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-xs">
            + Add Brand
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {brands.map((b, idx) => (
            <div key={idx} className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a120e] border border-[#01472e]/40 text-xs font-semibold text-[#fefae0]">
              <span>{b}</span>
              <button onClick={() => removeBrand(idx)} className="text-[#ccd5ae]/40 hover:text-red-400">✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Celebrities Card */}
      <div className="bg-[#111c16] border border-[#01472e]/30 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#10b981]" />
          <h3 className="text-lg font-bold text-[#fefae0]">Celebrity BTS &amp; Artist Collaborations ({celebrities.length})</h3>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none"
            placeholder="Add artist name (e.g. Badshah, MC Stan, Karan Aujla)"
            value={newCeleb}
            onChange={e => setNewCeleb(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCeleb()}
          />
          <button onClick={addCeleb} className="bg-[#01472e] hover:bg-[#025c3c] text-[#fefae0] px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-xs">
            + Add Artist
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {celebrities.map((c, idx) => (
            <div key={idx} className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a120e] border border-[#01472e]/40 text-xs font-semibold text-[#10b981]">
              <span>★ {c}</span>
              <button onClick={() => removeCeleb(idx)} className="text-[#ccd5ae]/40 hover:text-red-400">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── 6. SERVICES SUBCOMPONENT ───────────────────────────────────────
const ServicesManagement: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<{ isEdit: boolean; id?: string } | null>(null);
  const [form, setForm] = useState({ name: '', icon: 'video', description: '', details: '' });

  useEffect(() => setItems((data as any).services || defaultData.services), [(data as any).services]);

  const persist = (updated: any) => {
    setItems(updated);
    save('services', updated);
  };

  const openAdd = () => {
    setForm({ name: '', icon: 'video', description: '', details: '' });
    setModal({ isEdit: false });
  };

  const openEdit = (item: any) => {
    setForm({ name: item.name, icon: item.icon || 'video', description: item.description || '', details: item.details || '' });
    setModal({ isEdit: true, id: item.id });
  };

  const saveItem = () => {
    if (modal?.isEdit) {
      persist(items.map((i: any) => i.id === modal.id ? { ...i, ...form } : i));
    } else {
      persist([...items, { id: uid(), ...form }]);
    }
    setModal(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display uppercase tracking-tight text-[#fefae0]">Services &amp; Capabilities</h2>
          <p className="text-xs text-[#ccd5ae]/70 mt-1">Capabilities cards with expandable production scope details.</p>
        </div>
        <button onClick={openAdd} className="bg-[#01472e] hover:bg-[#025c3c] text-[#fefae0] font-bold py-2.5 px-5 rounded-xl uppercase tracking-[0.2em] text-xs transition shadow-lg shadow-[#01472e]/30 flex items-center gap-1.5 self-start">
          <Plus size={14} />
          <span>Add Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="bg-[#111c16] border border-[#01472e]/30 p-6 rounded-3xl flex flex-col justify-between gap-4 shadow-xl">
            <div>
              <span className="font-bold text-[#fefae0] text-base block">{item.name}</span>
              <span className="text-xs text-[#ccd5ae]/80 block mt-1 leading-relaxed">{item.description}</span>
              {item.details && (
                <div className="mt-3 p-3 rounded-xl bg-[#0a120e] text-[11px] text-[#ccd5ae]/70 leading-relaxed border border-[#01472e]/20">
                  <span className="font-bold text-[#10b981] block text-[9px] uppercase tracking-wider mb-0.5">Scope:</span>
                  {item.details}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 border-t border-[#01472e]/20 pt-3">
              <button onClick={() => openEdit(item)} className="text-xs px-3 py-1 bg-[#192b22] text-[#ccd5ae] rounded-lg hover:text-[#fefae0]">Edit</button>
              <button onClick={() => { if(confirm('Delete service?')) persist(items.filter((i:any) => i.id !== item.id)); }} className="text-xs px-3 py-1 bg-red-950/30 text-red-400 rounded-lg hover:bg-red-950/60">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#131f18] border border-[#01472e]/40 p-6 sm:p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-display uppercase tracking-tight text-[#fefae0] mb-4">
              {modal.isEdit ? 'Edit Service' : 'Add Service'}
            </h3>
            <div className="flex flex-col gap-3.5">
              <input className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" placeholder="Service Name (e.g. Video Production)" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
              <textarea className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] h-16 focus:border-[#10b981] outline-none" placeholder="Short description..." value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
              <textarea className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] h-24 focus:border-[#10b981] outline-none" placeholder="Detailed workflow & scope description..." value={form.details} onChange={e => setForm(p => ({...p, details: e.target.value}))} />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-[#01472e]/40 rounded-xl text-xs font-bold uppercase tracking-wider text-[#ccd5ae]/70 hover:text-[#fefae0]">Cancel</button>
              <button onClick={saveItem} className="px-5 py-2.5 bg-[#01472e] hover:bg-[#025c3c] rounded-xl text-xs font-bold uppercase tracking-wider text-[#fefae0]">Save Service</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── 7. WORK TIMELINE SUBCOMPONENT ──────────────────────────────────
const Experience: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [items, setItems] = useState<typeof defaultData.experience>([]);
  const [modal, setModal] = useState<{ isEdit: boolean; id?: string } | null>(null);
  const [form, setForm] = useState({ year: '', role: '', company: '', description: '' });

  useEffect(() => setItems(data.experience || []), [data.experience]);

  const persist = (updated: typeof defaultData.experience) => {
    setItems(updated);
    save('experience', updated);
  };

  const openAdd = () => {
    setForm({ year: '', role: '', company: '', description: '' });
    setModal({ isEdit: false });
  };

  const openEdit = (item: any) => {
    setForm({ ...item });
    setModal({ isEdit: true, id: item.id });
  };

  const saveItem = () => {
    if (modal?.isEdit) {
      persist(items.map(i => i.id === modal.id ? { ...i, ...form } : i));
    } else {
      persist([...items, { id: uid(), ...form }]);
    }
    setModal(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display uppercase tracking-tight text-[#fefae0]">Work Experience &amp; Timeline</h2>
          <p className="text-xs text-[#ccd5ae]/70 mt-1">Production timeline nodes showcased on the Timeline section.</p>
        </div>
        <button onClick={openAdd} className="bg-[#01472e] hover:bg-[#025c3c] text-[#fefae0] font-bold py-2.5 px-5 rounded-xl uppercase tracking-[0.2em] text-xs transition shadow-lg shadow-[#01472e]/30 flex items-center gap-1.5 self-start">
          <Plus size={14} />
          <span>Add Timeline Node</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map(item => (
          <div key={item.id} className="bg-[#111c16] border border-[#01472e]/30 p-6 rounded-3xl flex flex-col gap-2 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#10b981] font-bold">{item.year}</span>
                <h3 className="font-bold text-[#fefae0] text-base mt-0.5">{item.role}</h3>
                <p className="text-xs text-[#ccd5ae]/70">{item.company}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="text-xs px-2.5 py-1 bg-[#192b22] text-[#ccd5ae] rounded-lg hover:text-[#fefae0]">Edit</button>
                <button onClick={() => { if(confirm('Delete?')) persist(items.filter(i => i.id !== item.id)); }} className="text-xs px-2.5 py-1 bg-red-950/30 text-red-400 rounded-lg hover:bg-red-950/60">Delete</button>
              </div>
            </div>
            {item.description && (
              <p className="text-xs text-[#ccd5ae]/70 border-t border-[#01472e]/20 pt-2.5 mt-1 leading-relaxed">{item.description}</p>
            )}
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#131f18] border border-[#01472e]/40 p-6 sm:p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-display uppercase tracking-tight text-[#fefae0] mb-4">
              {modal.isEdit ? 'Edit Timeline Entry' : 'Add Timeline Entry'}
            </h3>
            <div className="flex flex-col gap-3.5">
              <input className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" placeholder="Period (e.g. 2023 - 2024)" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} />
              <input className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" placeholder="Role (e.g. Freelance Videographer)" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
              <input className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" placeholder="Company / Studio" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
              <textarea className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] h-24 focus:border-[#10b981] outline-none" placeholder="Description of projects & responsibilities..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-[#01472e]/40 rounded-xl text-xs font-bold uppercase tracking-wider text-[#ccd5ae]/70 hover:text-[#fefae0]">Cancel</button>
              <button onClick={saveItem} className="px-5 py-2.5 bg-[#01472e] hover:bg-[#025c3c] rounded-xl text-xs font-bold uppercase tracking-wider text-[#fefae0]">Save Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── 8. SKILLS SUBCOMPONENT ─────────────────────────────────────────
const Skills: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [items, setItems] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => setItems(data.skills || []), [data.skills]);

  const persist = (updated: string[]) => {
    setItems(updated);
    save('skills', updated);
  };

  const handleAdd = () => {
    if (!newSkill.trim()) return;
    persist([...items, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemove = (idx: number) => {
    const updated = [...items];
    updated.splice(idx, 1);
    persist(updated);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-display uppercase tracking-tight text-[#fefae0]">Technical Skills &amp; Software</h2>
        <p className="text-xs text-[#ccd5ae]/70 mt-1">Tools and camera capabilities.</p>
      </div>

      <div className="bg-[#111c16] border border-[#01472e]/30 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            className="flex-1 bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none"
            placeholder="Add software / camera skill (e.g. DaVinci Resolve)"
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} className="bg-[#01472e] hover:bg-[#025c3c] text-[#fefae0] px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs">
            + Add
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2">
          {items.map((skill, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-[#0a120e] border border-[#01472e]/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#fefae0]">
              <span>{skill}</span>
              <button onClick={() => handleRemove(idx)} className="text-[#ccd5ae]/40 hover:text-red-400">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── 9. REVIEWS / ENDORSEMENTS SUBCOMPONENT ─────────────────────────
const ReviewsManagement: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<{ id?: string; isEdit?: boolean } | null>(null);
  const [form, setForm] = useState({ clientName: '', role: '', comment: '', rating: 5, logoUrl: '' });

  useEffect(() => setItems(data.reviews || []), [data.reviews]);

  const persist = (updated: any) => {
    setItems(updated);
    save('reviews', updated);
  };

  const openAdd = () => {
    setForm({ clientName: '', role: '', comment: '', rating: 5, logoUrl: '' });
    setModal({ isEdit: false });
  };

  const openEdit = (item: any) => {
    setForm({ clientName: item.clientName, role: item.role || '', comment: item.comment, rating: item.rating, logoUrl: item.logoUrl || '' });
    setModal({ id: item.id, isEdit: true });
  };

  const saveEdit = () => {
    if (modal?.isEdit) {
      persist(items.map((i: any) => i.id === modal.id ? { ...i, ...form } : i));
    } else {
      persist([...items, { id: uid(), ...form, status: 'approved', date: new Date().toISOString() }]);
    }
    setModal(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display uppercase tracking-tight text-[#fefae0]">Director &amp; Client Endorsements</h2>
          <p className="text-xs text-[#ccd5ae]/70 mt-1">Manage director testimonials and approve public submissions.</p>
        </div>
        <button onClick={openAdd} className="bg-[#01472e] hover:bg-[#025c3c] text-[#fefae0] font-bold py-2.5 px-5 rounded-xl uppercase tracking-[0.2em] text-xs transition shadow-lg shadow-[#01472e]/30 flex items-center gap-1.5 self-start">
          <Plus size={14} />
          <span>Add Endorsement</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="bg-[#111c16] border border-[#01472e]/30 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start gap-4 shadow-xl">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-[#fefae0]">{item.clientName}</span>
                {item.role && <span className="text-xs text-[#ccd5ae]/60">({item.role})</span>}
                <span className="text-amber-400 text-xs">★ {item.rating}/5</span>
              </div>
              <p className="text-xs sm:text-sm text-[#ccd5ae]/80 italic mt-1">&ldquo;{item.comment}&rdquo;</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(item)} className="text-xs px-3 py-1.5 bg-[#192b22] text-[#ccd5ae] rounded-xl hover:text-[#fefae0]">Edit</button>
              <button onClick={() => { if(confirm('Delete?')) persist(items.filter((i:any) => i.id !== item.id)); }} className="text-xs px-3 py-1.5 bg-red-950/30 text-red-400 rounded-xl hover:bg-red-950/60">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#131f18] border border-[#01472e]/40 p-6 sm:p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-display uppercase tracking-tight text-[#fefae0] mb-4">
              {modal.isEdit ? 'Edit Endorsement' : 'Add Endorsement'}
            </h3>
            <div className="flex flex-col gap-3.5">
              <input className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" placeholder="Director / Client Name" value={form.clientName} onChange={e => setForm(p => ({...p, clientName: e.target.value}))} />
              <input className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" placeholder="Role (e.g. Director & Choreographer)" value={form.role} onChange={e => setForm(p => ({...p, role: e.target.value}))} />
              <input type="number" min="1" max="5" className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none" placeholder="Rating (1-5)" value={form.rating} onChange={e => setForm(p => ({...p, rating: parseInt(e.target.value)}))} />
              <textarea className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] h-24 focus:border-[#10b981] outline-none" placeholder="Feedback comment..." value={form.comment} onChange={e => setForm(p => ({...p, comment: e.target.value}))} />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-[#01472e]/40 rounded-xl text-xs font-bold uppercase tracking-wider text-[#ccd5ae]/70 hover:text-[#fefae0]">Cancel</button>
              <button onClick={saveEdit} className="px-5 py-2.5 bg-[#01472e] hover:bg-[#025c3c] rounded-xl text-xs font-bold uppercase tracking-wider text-[#fefae0]">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── 10. CLOUDINARY & THEME SETTINGS SUBCOMPONENT ────────────────────
const Settings: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [form, setForm] = useState({ ...(data.settings || {}) });
  const [cConfig, setCConfig] = useState(getCloudinaryConfig());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [theme, setTheme] = useState<StudioTheme>(() => {
    return data.settings?.theme || THEME_PRESETS['earthy-sage'];
  });

  useEffect(() => {
    setForm({ ...(data.settings || {}) });
    if (data.settings?.theme) {
      setTheme(data.settings.theme);
    }
    if (data.settings?.cloudinaryCloudName || data.settings?.cloudinaryUploadPreset) {
      setCConfig({
        cloudName: data.settings.cloudinaryCloudName || '',
        uploadPreset: data.settings.cloudinaryUploadPreset || '',
      });
    }
  }, [data.settings]);

  const handleSelectPreset = (presetKey: string) => {
    const selected = THEME_PRESETS[presetKey];
    if (selected) {
      setTheme(selected);
    }
  };

  const handleColorChange = (key: keyof StudioTheme, val: string) => {
    setTheme(prev => ({
      ...prev,
      id: 'custom',
      name: '🎨 Custom Palette',
      [key]: val,
    }));
  };

  const handleTestConnection = async () => {
    if (!cConfig.cloudName.trim() || !cConfig.uploadPreset.trim()) {
      setTestResult({ ok: false, msg: 'Please enter both Cloud Name and Upload Preset to test.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      await testCloudinaryConnection(cConfig.cloudName, cConfig.uploadPreset);
      setTestResult({ ok: true, msg: '✅ Cloudinary is connected and ready to upload!' });
    } catch (err: any) {
      setTestResult({ ok: false, msg: `❌ Connection error: ${err.message}` });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    const updatedSettings = {
      ...form,
      cloudinaryCloudName: cConfig.cloudName.trim(),
      cloudinaryUploadPreset: cConfig.uploadPreset.trim(),
      theme,
    };
    save('settings', updatedSettings);
    saveCloudinaryConfig(cConfig.cloudName, cConfig.uploadPreset);
  };

  const colorFields: { key: keyof StudioTheme; label: string; desc: string }[] = [
    { key: 'heroBg', label: 'Main Background (Hero / Body)', desc: 'Landing hero, editorial statement, and career timeline' },
    { key: 'primaryText', label: 'Primary Typography', desc: 'Main display headlines, paragraph body, and section labels' },
    { key: 'cardBg', label: 'Card & Projects Background', desc: 'Featured films grid, capabilities cards, and review marquee' },
    { key: 'accentBg', label: 'Stills & Accent Background', desc: 'Photo classified archive container and modal lightbox' },
    { key: 'darkBg', label: 'Dark Marquee & Footer Background', desc: 'Celebrity brand strip and 12-column footer container' },
    { key: 'footerText', label: 'Footer Subtext & Links', desc: 'Footer directory links, input placeholders, and copyright' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-display uppercase tracking-tight text-[#fefae0]">Website Theme &amp; Studio Settings</h2>
        <p className="text-xs text-[#ccd5ae]/70 mt-1">
          Switch aesthetic color themes, customize background colors, route WhatsApp inquiries, and manage Cloudinary storage.
        </p>
      </div>

      {/* ── 1. Color Themes & Palette Picker ── */}
      <div className="bg-[#111c16] border border-[#01472e]/30 p-6 sm:p-8 rounded-3xl flex flex-col gap-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#01472e]/20 pb-5">
          <div>
            <h3 className="text-base font-bold text-[#fefae0] flex items-center gap-2">
              <Palette size={18} className="text-emerald-400" />
              <span>Website Color Theme &amp; Backgrounds</span>
            </h3>
            <p className="text-xs text-[#ccd5ae]/70 mt-0.5">
              Active: <span className="font-bold text-emerald-300">{theme.name}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setTheme(THEME_PRESETS['earthy-sage'])}
            className="px-3.5 py-2 bg-[#192b22] hover:bg-[#01472e] border border-[#01472e]/50 rounded-xl text-[10px] font-bold text-[#fefae0] uppercase tracking-wider transition self-start sm:self-auto"
          >
            ↺ Reset To Signature Earthy Sage
          </button>
        </div>

        {/* 5 One-Click Presets */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ccd5ae]/60 block mb-3">
            Select Curated Theme Preset
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(THEME_PRESETS).map(([key, preset]) => {
              const isSelected = theme.id === preset.id;
              return (
                <div
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-950/30 shadow-lg shadow-emerald-950/50'
                      : 'border-[#01472e]/30 bg-[#0a120e] hover:border-[#01472e]/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#fefae0] truncate">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Palette Dots */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <div
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: preset.heroBg }}
                      title={`Hero Bg: ${preset.heroBg}`}
                    />
                    <div
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: preset.cardBg }}
                      title={`Card Bg: ${preset.cardBg}`}
                    />
                    <div
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: preset.accentBg }}
                      title={`Accent Bg: ${preset.accentBg}`}
                    />
                    <div
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: preset.darkBg }}
                      title={`Dark Bg: ${preset.darkBg}`}
                    />
                    <div
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: preset.primaryText }}
                      title={`Primary Text: ${preset.primaryText}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Color Controls (Fine-Tuning) */}
        <div className="border-t border-[#01472e]/20 pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ccd5ae]/60 block">
              Custom Hex Color Palette &amp; Fine-Tuning
            </span>
            <span className="text-[10px] text-[#ccd5ae]/50">
              Click any color swatch or type a HEX code
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {colorFields.map(({ key, label, desc }) => {
              const currentColor = (theme[key] as string) || '#ffffff';
              return (
                <div key={key} className="bg-[#0a120e] border border-[#01472e]/30 p-3.5 rounded-2xl flex flex-col gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-[#fefae0] block leading-tight">
                      {label}
                    </label>
                    <span className="text-[10px] text-[#ccd5ae]/50 block mt-0.5 leading-snug">
                      {desc}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-auto pt-1">
                    {/* Visual Color Input Picker */}
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-inner cursor-pointer">
                      <input
                        type="color"
                        value={currentColor.startsWith('#') ? currentColor : '#000000'}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="absolute -top-3 -left-3 w-16 h-16 cursor-pointer border-none p-0"
                      />
                    </div>

                    {/* Hex Text Input */}
                    <input
                      type="text"
                      value={currentColor}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      placeholder="#000000"
                      className="w-full bg-[#111c16] border border-[#01472e]/40 rounded-xl px-3 py-2 text-xs font-mono text-[#fefae0] uppercase focus:border-emerald-400 outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Mini Preview Box */}
        <div className="border-t border-[#01472e]/20 pt-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ccd5ae]/60 block mb-3">
            Live Website Theme Preview
          </span>
          <div
            className="rounded-2xl p-6 sm:p-8 border shadow-lg transition-colors duration-300 flex flex-col gap-5 overflow-hidden"
            style={{
              backgroundColor: theme.heroBg,
              color: theme.primaryText,
              borderColor: `${theme.primaryText}20`,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: `${theme.primaryText}20` }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  Tushar Maru Studio • Live Preview
                </span>
                <h4 className="text-xl sm:text-2xl font-display uppercase tracking-tight mt-0.5" style={{ color: theme.primaryText }}>
                  Crafting High-Energy Visuals
                </h4>
              </div>

              <div
                className="px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 self-start sm:self-auto shadow-sm"
                style={{
                  backgroundColor: theme.darkBg,
                  color: theme.accentBg,
                }}
              >
                {theme.name}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card Container preview */}
              <div
                className="p-4 rounded-xl border shadow-sm flex flex-col justify-between gap-3"
                style={{
                  backgroundColor: theme.cardBg,
                  color: theme.primaryText,
                  borderColor: `${theme.primaryText}20`,
                }}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">
                  Project Card Sample
                </span>
                <p className="text-xs leading-relaxed opacity-85">
                  High-retention commercial video editing, DaVinci Resolve grading, and celebrity visuals.
                </p>
                <div
                  className="px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest w-fit"
                  style={{
                    backgroundColor: theme.accentBg,
                    color: theme.primaryText,
                  }}
                >
                  Featured Cut
                </div>
              </div>

              {/* Footer preview */}
              <div
                className="p-4 rounded-xl border shadow-sm flex flex-col justify-between gap-3"
                style={{
                  backgroundColor: theme.darkBg,
                  color: theme.footerText,
                  borderColor: `${theme.footerText}30`,
                }}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">
                  Dark Footer / Marquee Strip
                </span>
                <p className="text-xs leading-relaxed" style={{ color: theme.footerText }}>
                  marutushar387@gmail.com • Mumbai, Maharashtra
                </p>
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: theme.accentBg }}>
                  ★ Zudio • Denver • Maybelline
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. WhatsApp & Studio Inquiries ── */}
      <div className="bg-[#111c16] border border-[#01472e]/30 p-6 sm:p-8 rounded-3xl flex flex-col gap-6 shadow-xl">
        <div className="border-b border-[#01472e]/20 pb-4">
          <h3 className="text-base font-bold text-[#fefae0]">
            📱 Studio Inquiries &amp; Information
          </h3>
          <p className="text-xs text-[#ccd5ae]/60 mt-0.5">
            Direct routing for incoming client projects and footer statement text.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">WhatsApp Inquiry Number</label>
            <input
              className="bg-[#0a120e] border border-[#01472e]/30 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none"
              value={form.whatsappPhone || ''}
              onChange={e => setForm(p => ({ ...p, whatsappPhone: e.target.value }))}
              placeholder="9324704934"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Footer Subheading Statement</label>
            <input
              className="bg-[#0a120e] border border-[#01472e]/30 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none"
              value={form.footerHeading || ''}
              onChange={e => setForm(p => ({ ...p, footerHeading: e.target.value }))}
              placeholder="EARTHY EDITORIAL STUDIO AESTHETIC"
            />
          </div>
        </div>
      </div>

      {/* ── 3. Cloudinary Integration Settings ── */}
      <div className="bg-[#111c16] border border-[#01472e]/30 p-6 sm:p-8 rounded-3xl flex flex-col gap-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#01472e]/20 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#fefae0] flex items-center gap-2">
              <span>☁️ Active Cloudinary Pipeline</span>
            </h3>
            <p className="text-xs text-[#ccd5ae]/60 mt-0.5">
              Uploads high-resolution DSLR photos, stills, and video thumbnails directly to Cloudinary with automatic client-side compression.
            </p>
          </div>
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="px-4 py-2.5 bg-[#192b22] hover:bg-[#01472e] border border-[#01472e]/50 rounded-xl text-xs font-bold text-[#fefae0] uppercase tracking-wider transition shrink-0"
          >
            {testing ? 'Testing Connection...' : '⚡ Test Connection'}
          </button>
        </div>

        {testResult && (
          <div className={`p-3.5 rounded-xl text-xs font-semibold border ${testResult.ok ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-red-950/40 border-red-500/40 text-red-300'}`}>
            {testResult.msg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Cloud Name</label>
            <input
              className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none"
              placeholder="aksy1d98"
              value={cConfig.cloudName}
              onChange={e => setCConfig(p => ({ ...p, cloudName: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Upload Preset (Unsigned)</label>
            <input
              className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none"
              placeholder="tushar_portfolio"
              value={cConfig.uploadPreset}
              onChange={e => setCConfig(p => ({ ...p, uploadPreset: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-[#01472e]/20 pt-4">
          <button
            onClick={handleSave}
            className="bg-[#01472e] hover:bg-[#025c3c] text-[#fefae0] px-8 py-3.5 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition shadow-lg shadow-[#01472e]/30 flex items-center gap-2"
          >
            <Palette size={15} />
            <span>Save Theme &amp; Studio Settings</span>
          </button>
        </div>
      </div>

      {/* ── 4. Admin Security & Password Management ── */}
      <div className="bg-[#111c16] border border-[#01472e]/30 p-6 sm:p-8 rounded-3xl flex flex-col gap-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#01472e]/20 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#fefae0] flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>Admin Security &amp; Access Control</span>
            </h3>
            <p className="text-xs text-[#ccd5ae]/60 mt-0.5">
              Set a private admin password for your studio panel. Leave blank to keep default credentials.
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-lg shrink-0">
            Active Protection: 5-Attempt Lockout
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ccd5ae]/60">Custom Admin Password</label>
            <input
              type="password"
              className="bg-[#0a120e] border border-[#01472e]/40 rounded-xl p-3 text-sm text-[#fefae0] focus:border-[#10b981] outline-none"
              placeholder="Enter new custom password..."
              value={form.adminPassword || ''}
              onChange={e => setForm(p => ({ ...p, adminPassword: e.target.value }))}
            />
            <span className="text-[10px] text-[#ccd5ae]/50">
              {form.adminPassword ? '✓ Custom password will be saved.' : 'Currently using default password (tushar123)'}
            </span>
          </div>

          <div className="flex flex-col justify-center bg-[#0a120e]/60 border border-[#01472e]/20 p-4 rounded-xl text-xs text-[#ccd5ae]/80 gap-2">
            <div className="flex items-center gap-2 font-bold text-[#fefae0]">
              <Lock size={14} className="text-emerald-400" />
              <span>Active Security Measures:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-[#ccd5ae]/70">
              <li>Automatic 60s cooldown lockout after 5 failed attempts</li>
              <li>Session-scoped authentication (clears on tab close)</li>
              <li>Safe local storage persistence &amp; XSS link filtering</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end border-t border-[#01472e]/20 pt-4">
          <button
            onClick={handleSave}
            className="bg-[#01472e] hover:bg-[#025c3c] text-[#fefae0] px-8 py-3.5 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition shadow-lg shadow-[#01472e]/30 flex items-center gap-2"
          >
            <Key size={15} />
            <span>Update Security &amp; Password</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── 11. RESET / SEED DATA SUBCOMPONENT ─────────────────────────────
const SeedData: React.FC<{ setData: (d: any) => void; flash: (m: string) => void }> = ({ setData, flash }) => {
  const handleReset = () => {
    if (!confirm('Reset all website data back to Tushar Maru default portfolio content?')) return;
    resetData();
    setData(defaultData);
    flash('Reset to default data! ✨');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-display uppercase tracking-tight text-[#fefae0]">Database Reset</h2>
        <p className="text-xs text-[#ccd5ae]/70 mt-1">Restore default editorial catalog data.</p>
      </div>

      <div className="bg-[#111c16] border border-[#01472e]/30 p-6 sm:p-8 rounded-3xl shadow-xl">
        <p className="text-xs text-[#ccd5ae]/70 mb-6 leading-relaxed">
          This will restore all default projects, classified photos, 12 commercial brands, and 6 celebrity collaborations back to initial state.
        </p>
        <button onClick={handleReset} className="bg-red-950/30 text-red-400 border border-red-900/40 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-red-950/60 transition flex items-center gap-2">
          <RotateCcw size={14} />
          <span>Reset All Content</span>
        </button>
      </div>
    </div>
  );
};
