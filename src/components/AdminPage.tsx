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
import { db } from '../lib/firebase';
import { ref, set, onValue } from 'firebase/database';
import {
  getData,
  saveData,
  resetData,
  login,
  logout,
  isLoggedIn,
  getYoutubeId,
  defaultData
} from '../lib/store';
import { ImageUpload } from './ImageUpload';
import { getCloudinaryConfig, saveCloudinaryConfig, testCloudinaryConnection } from '../lib/cloudinary';

const uid = () => Math.random().toString(36).slice(2, 9);

const NAV = [
  { id: 'stats',        icon: '📊', label: 'Hero Stats'     },
  { id: 'about',        icon: '👤', label: 'About'          },
  { id: 'services',     icon: '✨', label: 'Services'       },
  { id: 'videos',       icon: '🎬', label: 'Video Projects' },
  { id: 'photos',       icon: '🖼️', label: 'Photo Gallery'  },
  { id: 'experience',   icon: '💼', label: 'Experience'     },
  { id: 'skills',       icon: '🛠️', label: 'Skills'         },
  { id: 'reviews',      icon: '⭐', label: 'Reviews'        },
  { id: 'settings',     icon: '⚙️', label: 'Settings'       },
  { id: 'seed',         icon: '🗄️', label: 'Seed Data'      },
];

const SortableNavItem = ({ id, label, icon, active, onClick }: { id: string, label: string, icon: string, active: boolean, onClick: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center w-full relative group">
      <div 
        {...attributes} 
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing text-[#D7E2EA]/20 hover:text-[#D7E2EA]/60 transition opacity-0 group-hover:opacity-100 md:opacity-100"
      >
        <span className="text-[10px]">⋮⋮</span>
      </div>

      <button
        onClick={onClick}
        className={`flex-1 flex items-center gap-2 md:gap-3 px-3 py-2 md:p-3 md:pl-8 rounded-lg md:rounded-l-none md:rounded-r-lg text-xs md:text-sm transition text-left border-b-2 md:border-b-0 md:border-l-2 shrink-0 ${active ? 'bg-[#7621B0]/15 text-white font-semibold border-[#7621B0]' : 'text-[#D7E2EA]/60 hover:bg-[#181818] border-transparent'}`}
      >
        <span>{icon}</span>
        {label}
      </button>
    </div>
  );
};

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return <div className="p-10 text-red-500 bg-black min-h-screen"><h1 className="text-2xl font-bold">Error in AdminPage</h1><pre className="mt-4 text-xs whitespace-pre-wrap">{this.state.error?.stack}</pre></div>;
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

  const currentOrder = data.settings?.sectionOrder || ['about', 'services', 'videos', 'photos', 'experience', 'skills', 'reviews'];

  useEffect(() => {
    setIsMounted(true);
    setAuthed(isLoggedIn());

    const portfolioRef = ref(db, 'tushar_portfolio_content');
    const unsubscribe = onValue(portfolioRef, (snapshot) => {
      const fbData = snapshot.val();
      if (fbData) {
        setData(fbData);
        saveData(fbData);
      } else {
        setData(getData());
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isMounted) return <div style={{ minHeight: '100vh', background: '#0C0C0C' }} />;

  if (!authed) {
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (login(loginForm.email, loginForm.password)) {
        setAuthed(true);
        setLoginErr('');
      } else {
        setLoginErr('Invalid email or password. Hint: marutushar387@gmail.com / tushar123');
      }
    };
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#0C0C0C] font-kanit">
        <div className="w-full max-w-md bg-[#121212] border border-[#222] p-6 sm:p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-3xl font-black tracking-tight text-[#D7E2EA]">
              TUSHAR MARU<span className="text-[#7621B0]">.</span> ADMIN
            </div>
            <p className="text-xs text-[#D7E2EA]/50 mt-1 uppercase tracking-wider">Portfolio Management System</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/50 font-medium">Email / Username</label>
              <input
                type="text"
                className="w-full bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm focus:border-[#7621B0] outline-none"
                value={loginForm.email}
                onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/50 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="w-full bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm pr-12 focus:border-[#7621B0] outline-none"
                  value={loginForm.password}
                  onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="tushar123"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-wider text-[#D7E2EA]/40 hover:text-[#D7E2EA]"
                >{showPass ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            {loginErr && <p className="text-red-400 text-xs bg-red-950/30 p-2.5 rounded-lg border border-red-900/40">{loginErr}</p>}
            <button type="submit" className="w-full bg-[#7621B0] text-white rounded-lg p-3 uppercase tracking-widest font-semibold hover:bg-[#611a93] transition shadow-lg shadow-purple-900/20">
              Sign In to Control Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const flash = (msg = 'Changes saved!') => {
    setSaved(msg);
    setTimeout(() => setSaved(''), 2500);
  };

  const save = async (section: string, val: any) => {
    const updated = { ...data, [section]: val };
    setData(updated);
    
    try {
      const sectionRef = ref(db, `tushar_portfolio_content/${section}`);
      await set(sectionRef, val);
      flash('Synced live to database & local store! ✨');
    } catch (err) {
      console.warn("Saved to local storage:", err);
      flash('Saved to local storage! ✨');
    }
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
        className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:p-3 rounded-lg text-xs md:text-sm transition text-left border-b-2 md:border-b-0 md:border-l-2 shrink-0 ${tab === n.id ? 'bg-[#7621B0]/15 text-white font-semibold border-[#7621B0]' : 'text-[#D7E2EA]/60 hover:bg-[#181818] border-transparent'}`}
      >
        <span>{n.icon}</span>
        {n.label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-kanit flex flex-col md:flex-row select-none">
      <aside className="w-full md:w-64 bg-[#121212] border-b md:border-b-0 md:border-r border-[#222] flex flex-col justify-between shrink-0">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between md:justify-start gap-3">
            <div className="text-lg md:text-xl font-bold uppercase tracking-wider text-[#D7E2EA]">
              TUSHAR MARU<span className="text-[#7621B0]">.</span> ADMIN
            </div>
            <button
              onClick={() => { logout(); setAuthed(false); }}
              className="md:hidden px-3 py-1.5 bg-red-950/20 text-red-400 border border-red-900/40 rounded-lg text-[10px] uppercase tracking-wider font-semibold"
            >
              Logout
            </button>
          </div>
          
          <nav className="flex flex-row md:flex-col gap-1.5 md:gap-1 mt-4 md:mt-8 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none whitespace-nowrap w-full">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/30 md:mb-1 md:ml-3 hidden md:block">Pinned</div>
            {renderNavItem(NAV.find(n => n.id === 'stats')!)}
            
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/30 md:mt-4 md:mb-1 md:ml-3 hidden md:block">Website Sections</div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={currentOrder} strategy={verticalListSortingStrategy}>
                {currentOrder.map(id => {
                  const n = NAV.find(item => item.id === id);
                  if (!n) return null;
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

            <div className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/30 md:mt-4 md:mb-1 md:ml-3 hidden md:block">System</div>
            {renderNavItem(NAV.find(n => n.id === 'settings')!)}
            {renderNavItem(NAV.find(n => n.id === 'seed')!)}
          </nav>
        </div>
        <div className="hidden md:block p-6 border-t border-[#222]">
          <button
            onClick={() => { logout(); setAuthed(false); }}
            className="w-full p-3 bg-red-950/20 text-red-400 border border-red-900/40 rounded-lg text-xs uppercase tracking-widest font-semibold hover:bg-red-950/40 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 sm:p-10 w-full max-w-[1400px] mx-auto overflow-y-auto overflow-x-hidden min-h-0">
        {saved && (
          <div className="fixed top-6 right-6 bg-[#7621B0] text-white font-semibold py-2.5 px-6 rounded-lg shadow-xl z-50 text-sm animate-in fade-in">
            {saved}
          </div>
        )}

        {tab === 'stats'        && <HeroStats      data={data} save={save} />}
        {tab === 'videos'       && <VideoProjects  data={data} save={save} flash={flash} />}
        {tab === 'photos'       && <PhotosManagement data={data} save={save} />}
        {tab === 'experience'   && <Experience     data={data} save={save} />}
        {tab === 'skills'       && <Skills         data={data} save={save} />}
        {tab === 'reviews'      && <ReviewsManagement  data={data} save={save} />}
        {tab === 'about'        && <About          data={data} save={save} />}
        {tab === 'services'     && <ServicesManagement data={data} save={save} />}
        {tab === 'settings'     && <Settings       data={data} save={save} />}
        {tab === 'seed'         && <SeedData       setData={setData} flash={flash} />}
      </main>
    </div>
  );
};

// ─── HERO STATS SUBCOMPONENT ────────────────────────────────────────
const HeroStats: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [form, setForm] = useState({ ...(data.heroStats || {}) });

  useEffect(() => setForm({ ...(data.heroStats || {}) }), [data.heroStats]);

  const handleSave = () => save('heroStats', form);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Hero Stats &amp; Links</h2>
      <div className="bg-[#121212] border border-[#222] p-6 rounded-xl flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Stat 1 Value</label>
            <input className="bg-[#0C0C0C] border border-[#222] rounded p-3 text-sm text-[#D7E2EA]" value={form.stat1Value || ''} onChange={e => setForm(p => ({ ...p, stat1Value: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Stat 1 Label</label>
            <input className="bg-[#0C0C0C] border border-[#222] rounded p-3 text-sm text-[#D7E2EA]" value={form.stat1Label || ''} onChange={e => setForm(p => ({ ...p, stat1Label: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Stat 2 Value</label>
            <input className="bg-[#0C0C0C] border border-[#222] rounded p-3 text-sm text-[#D7E2EA]" value={form.stat2Value || ''} onChange={e => setForm(p => ({ ...p, stat2Value: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Stat 2 Label</label>
            <input className="bg-[#0C0C0C] border border-[#222] rounded p-3 text-sm text-[#D7E2EA]" value={form.stat2Label || ''} onChange={e => setForm(p => ({ ...p, stat2Label: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Stat 3 Value</label>
            <input className="bg-[#0C0C0C] border border-[#222] rounded p-3 text-sm text-[#D7E2EA]" value={form.stat3Value || ''} onChange={e => setForm(p => ({ ...p, stat3Value: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Stat 3 Label</label>
            <input className="bg-[#0C0C0C] border border-[#222] rounded p-3 text-sm text-[#D7E2EA]" value={form.stat3Label || ''} onChange={e => setForm(p => ({ ...p, stat3Label: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Stat 4 Value</label>
            <input className="bg-[#0C0C0C] border border-[#222] rounded p-3 text-sm text-[#D7E2EA]" value={form.stat4Value || ''} onChange={e => setForm(p => ({ ...p, stat4Value: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Stat 4 Label</label>
            <input className="bg-[#0C0C0C] border border-[#222] rounded p-3 text-sm text-[#D7E2EA]" value={form.stat4Label || ''} onChange={e => setForm(p => ({ ...p, stat4Label: e.target.value }))} />
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={handleSave} className="bg-[#7621B0] px-6 py-2.5 rounded-lg font-semibold uppercase tracking-wider text-xs hover:bg-[#611a93]">
            Save Hero Stats
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── VIDEO PROJECTS SUBCOMPONENT ────────────────────────────────────
const VideoProjects: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void; flash: (m: string) => void }> = ({ data, save }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [modal, setModal] = useState<{ isProjectModal: boolean; projectId?: string; isEdit?: boolean } | null>(null);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', tags: '' });
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoThumbnailUrl, setNewVideoThumbnailUrl] = useState('');

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

  const openAddVideoModal = (projId: string) => {
    setNewVideoUrl('');
    setNewVideoTitle('');
    setNewVideoThumbnailUrl('');
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
          videos: [...vList, { id: uid(), title: newVideoTitle || 'Video Link', url: newVideoUrl.trim(), thumbnail }]
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">YouTube &amp; Video Projects</h2>
          <p className="text-xs text-[#D7E2EA]/50 mt-1">Organize YouTube video links by categories &amp; project themes.</p>
        </div>
        <button onClick={openAddProject} className="bg-[#7621B0] text-white font-semibold py-2 px-4 rounded-lg uppercase tracking-wider text-xs hover:bg-[#611a93]">
          + Add Project Group
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {projects.map((proj: any) => (
          <div key={proj.id} className="bg-[#121212] border border-[#222] p-5 rounded-xl flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white">{proj.title}</h3>
                {proj.description && <p className="text-xs text-[#D7E2EA]/60 mt-0.5">{proj.description}</p>}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(proj.tags || []).map((t: string, idx: number) => (
                    <span key={idx} className="bg-[#7621B0]/20 text-[#a855f7] border border-[#7621B0]/30 text-[10px] px-2 py-0.5 rounded font-bold">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditProject(proj)} className="text-xs text-[#D7E2EA]/60 hover:text-white">Edit</button>
                <button onClick={() => deleteProject(proj.id)} className="text-xs text-red-500 hover:text-red-400">Delete</button>
              </div>
            </div>

            {/* Video List inside project */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border-t border-[#222] pt-4">
              {(proj.videos || []).map((v: any) => (
                <div key={v.id} className="bg-[#0C0C0C] border border-[#222] p-2.5 rounded-lg flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    {v.thumbnail ? (
                      <img src={v.thumbnail} className="w-12 h-8 object-cover rounded" alt="" />
                    ) : (
                      <div className="w-12 h-8 bg-[#222] rounded flex items-center justify-center text-[10px]">▶</div>
                    )}
                    <div className="truncate">
                      <p className="text-xs font-semibold text-white truncate">{v.title}</p>
                      <p className="text-[10px] text-[#D7E2EA]/40 truncate">{v.url}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteVideoFromProject(proj.id, v.id)} className="text-xs text-red-500 hover:text-red-400 p-1">🗑</button>
                </div>
              ))}
              <button
                onClick={() => openAddVideoModal(proj.id)}
                className="border-2 border-dashed border-[#222] hover:border-[#7621B0]/60 text-xs text-[#D7E2EA]/60 p-3 rounded-lg flex items-center justify-center gap-1 transition"
              >
                + Add YouTube Link
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal?.isProjectModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] border border-[#222] p-6 rounded-2xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">{modal.isEdit ? 'Edit Project Group' : 'Add Project Group'}</h3>
            <div className="flex flex-col gap-3">
              <input className="bg-[#0C0C0C] border border-[#222] rounded p-2.5 text-sm text-[#D7E2EA]" placeholder="Group Title (e.g. Celebrity BTS & Shoots)" value={projectForm.title} onChange={e => setProjectForm(p => ({ ...p, title: e.target.value }))} />
              <textarea className="bg-[#0C0C0C] border border-[#222] rounded p-2.5 text-sm text-[#D7E2EA] h-20" placeholder="Description..." value={projectForm.description} onChange={e => setProjectForm(p => ({ ...p, description: e.target.value }))} />
              <input className="bg-[#0C0C0C] border border-[#222] rounded p-2.5 text-sm text-[#D7E2EA]" placeholder="Tags (comma separated, e.g. CELEBRITY, BTS, SHOOT)" value={projectForm.tags} onChange={e => setProjectForm(p => ({ ...p, tags: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-[#333] rounded text-xs">Cancel</button>
              <button onClick={saveProject} className="px-4 py-2 bg-[#7621B0] rounded text-xs font-bold hover:bg-[#611a93]">Save</button>
            </div>
          </div>
        </div>
      )}

      {modal && !modal.isProjectModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] border border-[#222] p-6 rounded-2xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Add YouTube Video</h3>
            <div className="flex flex-col gap-3">
              <input className="bg-[#0C0C0C] border border-[#222] rounded p-2.5 text-sm text-[#D7E2EA]" placeholder="YouTube / Video Link URL" value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} />
              <input className="bg-[#0C0C0C] border border-[#222] rounded p-2.5 text-sm text-[#D7E2EA]" placeholder="Video Title" value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} />
              <ImageUpload value={newVideoThumbnailUrl} onChange={setNewVideoThumbnailUrl} folderPath="thumbnails" label="Custom Thumbnail (Optional)" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-[#333] rounded text-xs">Cancel</button>
              <button onClick={addVideoToProject} className="px-4 py-2 bg-[#7621B0] rounded text-xs font-bold hover:bg-[#611a93]">Add Video</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── PHOTO GALLERY SUBCOMPONENT ────────────────────────────────────
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
      alert("Please upload or paste an image URL!");
      return;
    }
    if (modal?.isEdit) {
      persist(items.map((i: any) => i.id === modal.id ? { ...i, ...form } : i));
    } else {
      persist([...items, { id: uid(), ...form }]);
    }
    setModal(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Photo Showcase &amp; Stills</h2>
          <p className="text-xs text-[#D7E2EA]/50 mt-1">Upload photos, behind-the-scenes camera stills, and portfolio gallery images.</p>
        </div>
        <button onClick={openAdd} className="bg-[#7621B0] text-white font-semibold py-2 px-4 rounded-lg uppercase tracking-wider text-xs hover:bg-[#611a93]">
          + Add Photo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="bg-[#121212] border border-[#222] p-4 rounded-xl flex flex-col justify-between gap-3">
            <div className="aspect-[4/3] bg-black rounded-lg overflow-hidden border border-[#222] relative">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-black/80 text-[#7621B0] text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                {item.category}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-[#D7E2EA] text-sm truncate">{item.title}</h3>
              {item.description && <p className="text-xs text-[#D7E2EA]/50 line-clamp-2 mt-1">{item.description}</p>}
            </div>
            <div className="flex justify-end gap-3 border-t border-[#222] pt-2">
              <button onClick={() => openEdit(item)} className="text-xs text-[#D7E2EA]/50 hover:text-[#D7E2EA]">Edit</button>
              <button onClick={() => { if(confirm('Delete photo?')) persist(items.filter((i:any) => i.id !== item.id)); }} className="text-xs text-red-500 hover:text-red-400">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] border border-[#222] p-6 rounded-2xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">{modal.isEdit ? 'Edit Photo' : 'Add Photo'}</h3>
            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/40">Title</label>
                <input className="bg-[#0C0C0C] border border-[#222] rounded p-2 text-sm text-[#D7E2EA]" placeholder="e.g. Celebrity BTS Shoot" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/40">Folder / Category</label>
                <div className="flex flex-wrap gap-2 mb-1.5">
                  {['Celebrity BTS', 'Commercial', 'Live Events', 'Editing'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm(p => ({...p, category: cat}))}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition ${
                        form.category === cat ? 'bg-[#7621B0] text-white' : 'bg-[#1a1a1a] text-[#888] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <input className="bg-[#0C0C0C] border border-[#222] rounded p-2 text-sm text-[#D7E2EA]" placeholder="e.g. Celebrity BTS, Commercial, Live Events, Editing" value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))} />
              </div>
              <ImageUpload
                value={form.imageUrl}
                onChange={url => setForm(p => ({...p, imageUrl: url}))}
                folderPath="photos"
                label="Upload Photo File"
              />
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/40">Description (Optional)</label>
                <textarea className="bg-[#0C0C0C] border border-[#222] rounded p-2 text-sm h-16 text-[#D7E2EA]" placeholder="Short description..." value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/40">Year / Date</label>
                <input className="bg-[#0C0C0C] border border-[#222] rounded p-2 text-sm text-[#D7E2EA]" placeholder="2024" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-[#333] rounded text-xs">Cancel</button>
              <button onClick={saveItem} className="px-4 py-2 bg-[#7621B0] rounded text-xs font-bold hover:bg-[#611a93]">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── EXPERIENCE SUBCOMPONENT ────────────────────────────────────────
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

  const deleteItem = (id: string) => {
    if (!confirm('Delete entry?')) return;
    persist(items.filter(i => i.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Work Experience</h2>
        <button onClick={openAdd} className="bg-[#7621B0] text-white font-semibold py-2 px-4 rounded-lg uppercase tracking-wider text-xs hover:bg-[#611a93]">
          + Add Entry
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        {items.map(item => (
          <div key={item.id} className="bg-[#121212] border border-[#222] p-4 rounded-xl flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/40 font-semibold">{item.year}</span>
                <h3 className="font-bold text-[#D7E2EA] text-base mt-0.5">{item.role}</h3>
                <p className="text-xs text-[#D7E2EA]/60">{item.company}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button onClick={() => openEdit(item)} className="text-xs text-[#D7E2EA]/50 hover:text-[#D7E2EA]">Edit</button>
                <button onClick={() => deleteItem(item.id)} className="text-xs text-red-500 hover:text-red-400">Delete</button>
              </div>
            </div>
            {item.description && (
              <p className="text-xs text-[#D7E2EA]/50 border-t border-[#222] pt-2 mt-1 leading-relaxed">{item.description}</p>
            )}
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] border border-[#222] p-6 rounded-2xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-6">{modal.isEdit ? 'Edit Entry' : 'Add Entry'}</h3>
            <div className="flex flex-col gap-4">
              <input className="bg-[#0C0C0C] border border-[#222] rounded p-2.5 text-sm text-[#D7E2EA]" placeholder="Period (e.g. 2023 - 2024)" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} />
              <input className="bg-[#0C0C0C] border border-[#222] rounded p-2.5 text-sm text-[#D7E2EA]" placeholder="Role (e.g. Freelance Videographer)" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
              <input className="bg-[#0C0C0C] border border-[#222] rounded p-2.5 text-sm text-[#D7E2EA]" placeholder="Company / Project" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
              <textarea className="bg-[#0C0C0C] border border-[#222] rounded p-2.5 text-sm text-[#D7E2EA] h-24" placeholder="Description..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg border border-[#333] uppercase text-xs tracking-wider">Cancel</button>
              <button onClick={saveItem} className="px-5 py-2.5 rounded-lg bg-[#7621B0] uppercase text-xs tracking-wider font-semibold hover:bg-[#611a93]">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SKILLS SUBCOMPONENT ────────────────────────────────────────────
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
      <h2 className="text-2xl font-bold mb-6">Skills &amp; Expertise</h2>
      <div className="bg-[#121212] border border-[#222] p-6 rounded-xl mb-6">
        <div className="flex gap-3 mb-6">
          <input
            className="flex-1 bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm"
            placeholder="Add a new skill (e.g. Adobe Premiere Pro)"
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} className="bg-[#7621B0] px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-xs hover:bg-[#611a93]">
            + Add
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {items.map((skill, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-[#0C0C0C] border border-[#333] px-3 py-1.5 rounded-full">
              <span className="text-sm text-[#D7E2EA]">{skill}</span>
              <button onClick={() => handleRemove(idx)} className="text-[#D7E2EA]/40 hover:text-red-400 transition ml-1">
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── ABOUT SUBCOMPONENT ─────────────────────────────────────────────
const About: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [form, setForm] = useState({ ...(data.about || {}) });

  useEffect(() => setForm({ ...(data.about || {}) }), [data.about]);

  const handleSave = () => save('about', form);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">About Me Profile</h2>
      <div className="bg-[#121212] border border-[#222] p-6 rounded-xl flex flex-col gap-6">
        <ImageUpload
          value={form.photoUrl || ''}
          onChange={url => setForm(p => ({ ...p, photoUrl: url }))}
          folderPath="about"
          label="Profile Photo"
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Bio / Statement</label>
          <textarea
            className="bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm h-32 leading-relaxed"
            value={form.bio || ''}
            onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Email</label>
            <input className="bg-[#0C0C0C] border border-[#222] rounded p-3 text-sm text-[#D7E2EA]" value={form.email || ''} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Phone / WhatsApp</label>
            <input className="bg-[#0C0C0C] border border-[#222] rounded p-3 text-sm text-[#D7E2EA]" value={form.phone || ''} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Instagram URL</label>
            <input className="bg-[#0C0C0C] border border-[#222] rounded p-3 text-sm text-[#D7E2EA]" value={form.instagramUrl || ''} onChange={e => setForm(p => ({ ...p, instagramUrl: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">YouTube Channel URL</label>
            <input className="bg-[#0C0C0C] border border-[#222] rounded p-3 text-sm text-[#D7E2EA]" value={form.youtubeUrl || ''} onChange={e => setForm(p => ({ ...p, youtubeUrl: e.target.value }))} />
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={handleSave} className="bg-[#7621B0] px-6 py-2.5 rounded-lg font-semibold uppercase tracking-wider text-xs hover:bg-[#611a93]">
            Save About Profile
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── REVIEWS SUBCOMPONENT ─────────────────────────────────────────────
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Testimonials &amp; Reviews</h2>
        <button onClick={openAdd} className="bg-[#7621B0] text-white font-semibold py-2 px-4 rounded-lg uppercase tracking-wider text-xs hover:bg-[#611a93]">
          + Add Review
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="bg-[#121212] border border-[#222] p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-[#D7E2EA]">{item.clientName}</span>
                {item.role && <span className="text-xs text-[#D7E2EA]/50">({item.role})</span>}
                <span className="text-amber-400 text-xs">★ {item.rating}/5</span>
              </div>
              <p className="text-sm text-[#D7E2EA]/60 italic">"{item.comment}"</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(item)} className="text-xs px-3 py-1.5 bg-[#181818] border border-[#333] rounded hover:bg-[#222]">Edit</button>
              <button onClick={() => { if(confirm('Delete?')) persist(items.filter((i:any) => i.id !== item.id)); }} className="text-xs px-3 py-1.5 bg-red-950/20 text-red-400 rounded hover:bg-red-950/40">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] border border-[#222] p-6 rounded-2xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">{modal.isEdit ? 'Edit Review' : 'Add Review'}</h3>
            <div className="flex flex-col gap-3">
              <input className="bg-[#0C0C0C] border border-[#222] rounded p-2.5 text-sm text-[#D7E2EA]" placeholder="Director / Client Name" value={form.clientName} onChange={e => setForm(p => ({...p, clientName: e.target.value}))} />
              <input className="bg-[#0C0C0C] border border-[#222] rounded p-2.5 text-sm text-[#D7E2EA]" placeholder="Title / Role (e.g. Director & Choreographer)" value={form.role} onChange={e => setForm(p => ({...p, role: e.target.value}))} />
              <input type="number" min="1" max="5" className="bg-[#0C0C0C] border border-[#222] rounded p-2.5 text-sm text-[#D7E2EA]" placeholder="Rating (1-5)" value={form.rating} onChange={e => setForm(p => ({...p, rating: parseInt(e.target.value)}))} />
              <textarea className="bg-[#0C0C0C] border border-[#222] rounded p-2.5 text-sm text-[#D7E2EA] h-24" placeholder="Feedback comment..." value={form.comment} onChange={e => setForm(p => ({...p, comment: e.target.value}))} />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-[#333] rounded text-xs">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 bg-[#7621B0] rounded text-xs font-bold hover:bg-[#611a93]">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SERVICES SUBCOMPONENT ──────────────────────────────────────────
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Services</h2>
        <button onClick={openAdd} className="bg-[#7621B0] text-white font-semibold py-2 px-4 rounded-lg uppercase tracking-wider text-xs hover:bg-[#611a93]">
          + Add Service
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item: any) => (
          <div key={item.id} className="bg-[#121212] border border-[#222] p-4 rounded-xl flex justify-between items-center gap-4">
            <div>
              <span className="font-semibold text-[#D7E2EA] block">{item.name}</span>
              <span className="text-xs text-[#D7E2EA]/50 block">{item.description}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => openEdit(item)} className="text-xs text-[#D7E2EA]/50 hover:text-[#D7E2EA]">Edit</button>
              <button onClick={() => { if(confirm('Delete?')) persist(items.filter((i:any) => i.id !== item.id)); }} className="text-xs text-red-500 hover:text-red-400">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] border border-[#222] p-6 rounded-2xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">{modal.isEdit ? 'Edit Service' : 'Add Service'}</h3>
            <div className="flex flex-col gap-3">
              <input className="bg-[#0C0C0C] border border-[#222] rounded p-2.5 text-sm text-[#D7E2EA]" placeholder="Service Name" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
              <textarea className="bg-[#0C0C0C] border border-[#222] rounded p-2.5 text-sm text-[#D7E2EA] h-16" placeholder="Short description..." value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
              <textarea className="bg-[#0C0C0C] border border-[#222] rounded p-2.5 text-sm text-[#D7E2EA] h-24" placeholder="Detailed description..." value={form.details} onChange={e => setForm(p => ({...p, details: e.target.value}))} />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-[#333] rounded text-xs">Cancel</button>
              <button onClick={saveItem} className="px-4 py-2 bg-[#7621B0] rounded text-xs font-bold hover:bg-[#611a93]">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SETTINGS SUBCOMPONENT ──────────────────────────────────────────
const Settings: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [form, setForm] = useState({ ...(data.settings || {}) });
  const [cConfig, setCConfig] = useState(getCloudinaryConfig());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    setForm({ ...(data.settings || {}) });
    if (data.settings?.cloudinaryCloudName || data.settings?.cloudinaryUploadPreset) {
      setCConfig({
        cloudName: data.settings.cloudinaryCloudName || '',
        uploadPreset: data.settings.cloudinaryUploadPreset || '',
      });
    }
  }, [data.settings]);

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
    };
    save('settings', updatedSettings);
    saveCloudinaryConfig(cConfig.cloudName, cConfig.uploadPreset);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Website &amp; Cloudinary Settings</h2>
      <div className="bg-[#121212] border border-[#222] p-6 rounded-xl flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">WhatsApp Contact Number</label>
            <input className="bg-[#0C0C0C] border border-[#222] rounded p-3 text-sm text-[#D7E2EA]" value={form.whatsappPhone || ''} onChange={e => setForm(p => ({ ...p, whatsappPhone: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Footer Heading</label>
            <input className="bg-[#0C0C0C] border border-[#222] rounded p-3 text-sm text-[#D7E2EA]" value={form.footerHeading || ''} onChange={e => setForm(p => ({ ...p, footerHeading: e.target.value }))} />
          </div>
        </div>

        {/* Cloudinary Integration Settings */}
        <div className="border-t border-[#222] pt-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                ☁️ Cloudinary Image Storage
              </h3>
              <p className="text-xs text-[#D7E2EA]/60 mt-0.5">
                Upload production photos, BTS shots, and thumbnails directly to your personal Cloudinary cloud.
              </p>
            </div>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="px-4 py-2 bg-[#222] hover:bg-[#333] border border-[#444] rounded text-xs font-semibold text-white uppercase tracking-wider transition shrink-0"
            >
              {testing ? 'Testing...' : '⚡ Test Connection'}
            </button>
          </div>

          {testResult && (
            <div className={`p-3 rounded text-xs font-medium border ${testResult.ok ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-red-950/40 border-red-500/40 text-red-300'}`}>
              {testResult.msg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Cloud Name</label>
              <input
                className="bg-[#0C0C0C] border border-[#222] rounded p-3 text-sm text-[#D7E2EA] focus:border-[#7621B0] outline-none"
                placeholder="e.g. tusharmaru"
                value={cConfig.cloudName}
                onChange={e => setCConfig(p => ({ ...p, cloudName: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Upload Preset (Unsigned)</label>
              <input
                className="bg-[#0C0C0C] border border-[#222] rounded p-3 text-sm text-[#D7E2EA] focus:border-[#7621B0] outline-none"
                placeholder="e.g. tushar_portfolio"
                value={cConfig.uploadPreset}
                onChange={e => setCConfig(p => ({ ...p, uploadPreset: e.target.value }))}
              />
            </div>
          </div>

          <div className="bg-[#0C0C0C] border border-[#222] p-4 rounded-lg text-xs text-[#D7E2EA]/60 flex flex-col gap-1.5">
            <span className="font-bold text-white uppercase tracking-wider text-[10px]">Quick Setup Guide:</span>
            <span>1. Create a free account at <a href="https://cloudinary.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">cloudinary.com</a>.</span>
            <span>2. Copy your <strong>Cloud Name</strong> from the Cloudinary dashboard and paste it above.</span>
            <span>3. Go to <strong>Settings (Gear icon) → Upload → Upload presets → Add upload preset</strong>.</span>
            <span>4. Set <strong>Signing Mode</strong> to <strong>Unsigned</strong>, click Save, and paste the preset name above.</span>
          </div>
        </div>

        <div className="flex justify-end border-t border-[#222] pt-4">
          <button onClick={handleSave} className="bg-[#7621B0] px-6 py-2.5 rounded-lg font-semibold uppercase tracking-wider text-xs hover:bg-[#611a93]">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── SEED DATA SUBCOMPONENT ─────────────────────────────────────────
const SeedData: React.FC<{ setData: (d: any) => void; flash: (m: string) => void }> = ({ setData, flash }) => {
  const handleReset = () => {
    if (!confirm('Reset all website data back to Tushar Maru default portfolio content?')) return;
    resetData();
    setData(defaultData);
    flash('Reset to default data! ✨');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Database Reset</h2>
      <div className="bg-[#121212] border border-[#222] p-6 rounded-xl">
        <p className="text-xs text-[#D7E2EA]/60 mb-6">Reset website content back to Tushar Maru default template data.</p>
        <button onClick={handleReset} className="bg-red-950/30 text-red-400 border border-red-900/40 px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-xs hover:bg-red-950/60">
          ⚠️ Reset All Content
        </button>
      </div>
    </div>
  );
};
