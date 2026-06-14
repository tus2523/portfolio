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
  parseCampaignCsv,
  getYoutubeId,
  defaultData
} from '../lib/store';
import { ImageUpload } from './ImageUpload';
import { deleteImageByUrl } from '../lib/storage';


const uid = () => Math.random().toString(36).slice(2, 9);

const NAV = [
  { id: 'stats',        icon: '📊', label: 'Hero Stats'     },
  { id: 'about',       icon: '👤', label: 'About'          },
  { id: 'campaigns',   icon: '📋', label: 'Campaigns'      },
  { id: 'brand-logos', icon: '🏷️', label: 'Brand Logos'    },
  { id: 'videos',      icon: '🎬', label: 'Video Projects' },
  { id: 'websites',    icon: '🌐', label: 'Websites Built' },
  { id: 'experience',  icon: '💼', label: 'Experience'     },
  { id: 'skills',      icon: '🛠️', label: 'Skills'         },
  { id: 'reviews',     icon: '⭐', label: 'Reviews'        },
  { id: 'settings',    icon: '⚙️', label: 'Settings'       },
  { id: 'seed',        icon: '🗄️', label: 'Seed Data'      },
];

export const AdminPage: React.FC = () => {
  const [tab, setTab] = useState('stats');
  const [data, setData] = useState<typeof defaultData>(() => getData());
  const [saved, setSaved] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loginErr, setLoginErr] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setAuthed(isLoggedIn());

    const portfolioRef = ref(db, 'portfolio_content');
    const unsubscribe = onValue(portfolioRef, (snapshot) => {
      const fbData = snapshot.val();
      if (fbData) {
        setData(fbData);
        saveData(fbData); // Update local cache to prevent page refresh flash glitch
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
        setLoginErr('Invalid email or password.');
      }
    };
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#0C0C0C]">
        <div className="w-full max-w-md bg-[#121212] border border-[#222] p-5 sm:p-8 rounded-2xl">
          <div className="text-center mb-8">
            <div className="text-3xl font-black tracking-tight text-[#D7E2EA]">
              SAHIL<span className="text-[#BBCCD7]">.</span> ADMIN
            </div>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/50 font-medium">Email</label>
              <input
                type="email"
                className="w-full bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA]"
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
                  className="w-full bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] pr-12"
                  value={loginForm.password}
                  onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-wider text-[#D7E2EA]/40 hover:text-[#D7E2EA]"
                >{showPass ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            {loginErr && <p className="text-red-500 text-xs">{loginErr}</p>}
            <button type="submit" className="w-full bg-[#7621B0] text-white rounded-lg p-3 uppercase tracking-widest font-semibold hover:bg-[#611a93] transition shadow-lg shadow-purple-900/20">
              Sign In
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
      const portfolioRef = ref(db, 'portfolio_content');
      await set(portfolioRef, updated);
      flash('Synced live to Firebase! ✨');
    } catch (err) {
      console.error(err);
      flash('Local save only - Firebase error');
    }
  };

  const saveCampaigns = async (sheetUrl: string) => {
    try {
      await save('campaigns', { sheetUrl });
      let finalUrl = sheetUrl;
      if (finalUrl.includes('docs.google.com/spreadsheets') && !finalUrl.includes('export?format=csv')) {
        finalUrl = finalUrl.split('/edit')[0].split('/pub')[0] + '/export?format=csv';
      }
      const res = await fetch(finalUrl);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const csvText = await res.text();
      const { grouped, brands } = parseCampaignCsv(csvText);

      if (brands.length === 0) throw new Error("No data found in sheet.");

      const campaignsRef = ref(db, 'campaigns_data');
      await set(campaignsRef, { grouped, brands, lastSync: Date.now() });
      flash('Campaign data synced live! 🚀');
    } catch (err: any) {
      console.error("Sync error:", err);
      flash(`Sync Error: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-[#0C0C0C] text-[#D7E2EA] font-sans overflow-hidden">
      <aside className="w-full md:w-64 bg-[#121212] border-b md:border-b-0 md:border-r border-[#222] flex flex-col justify-between h-auto md:h-full z-30 shrink-0">
        <div className="p-4 md:p-6 flex flex-col gap-3 md:gap-0">
          <div className="flex justify-between items-center">
            <div className="text-lg md:text-xl font-bold uppercase tracking-wider text-[#D7E2EA]">
              SAHIL<span className="text-[#BBCCD7]">.</span> ADMIN
            </div>
            {/* Logout button on mobile header */}
            <button
              onClick={() => { logout(); setAuthed(false); }}
              className="md:hidden px-3 py-1.5 bg-red-950/20 text-red-400 border border-red-900/40 rounded-lg text-[10px] uppercase tracking-wider font-semibold hover:bg-red-950/40 transition"
            >
              Logout
            </button>
          </div>
          <nav className="flex flex-row md:flex-col gap-1.5 md:gap-1 mt-2 md:mt-8 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none whitespace-nowrap w-full">
            {NAV.map(n => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:p-3 rounded-lg md:rounded-l-none md:rounded-r-lg text-xs md:text-sm transition text-left border-b-2 md:border-b-0 md:border-l-2 shrink-0 ${tab === n.id ? 'bg-[#7621B0]/15 text-white font-semibold border-[#7621B0]' : 'text-[#D7E2EA]/60 hover:bg-[#181818] border-transparent'}`}
              >
                <span>{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>
        </div>
        {/* Logout button on desktop footer */}
        <div className="hidden md:block p-6 border-t border-[#222]">
          <button
            onClick={() => { logout(); setAuthed(false); }}
            className="w-full p-3 bg-red-950/20 text-red-400 border border-red-900/40 rounded-lg text-xs uppercase tracking-widest font-semibold hover:bg-red-950/40 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 sm:p-10 w-full max-w-[1400px] mx-auto overflow-y-auto overflow-x-hidden min-h-0 scrollbar-thin">
        {saved && (
          <div className="fixed top-6 right-6 bg-[#7621B0] text-white font-semibold py-2.5 px-6 rounded-lg shadow-xl z-50 text-sm">
            {saved}
          </div>
        )}

        {tab === 'stats'        && <HeroStats      data={data} save={save} />}
        {tab === 'campaigns'    && <Campaigns      data={data} saveCampaigns={saveCampaigns} />}
        {tab === 'videos'       && <VideoProjects  data={data} save={save} flash={flash} />}
        {tab === 'websites'     && <WebsitesManagement data={data} save={save} />}
        {tab === 'brand-logos'  && <BrandLogosManagement data={data} save={save} />}
        {tab === 'reviews'      && <ReviewsManagement  data={data} save={save} />}
        {tab === 'experience'   && <Experience     data={data} save={save} />}
        {tab === 'skills'       && <Skills         data={data} save={save} />}
        {tab === 'about'        && <About          data={data} save={save} />}
        {tab === 'settings'     && <Settings       data={data} save={save} />}
        {tab === 'seed'         && <SeedData       setData={setData} flash={flash} />}
      </main>
    </div>
  );
};

// ─── HERO STATS SUBCOMPONENT ────────────────────────────────────────

const HeroStats: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [form, setForm] = useState({ ...(data.heroStats || {}) });

  useEffect(() => {
    setForm({ ...(data.heroStats || {}) });
  }, [data.heroStats]);

  const setVal = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Hero Stats</h2>
      <div className="flex flex-col md:grid md:grid-cols-2 gap-5 mb-8">
        {[1,2,3,4].map(n => (
          <div key={n} className="flex flex-col md:flex-row gap-3 bg-[#121212] border border-[#222] p-4 rounded-xl">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/40">Value {n}</label>
              <input
                className="bg-[#0C0C0C] border border-[#222] rounded-lg p-2 text-sm text-[#D7E2EA] w-full"
                value={(form as any)[`stat${n}Value`]}
                onChange={e => setVal(`stat${n}Value`, e.target.value)}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/40">Label {n}</label>
              <input
                className="bg-[#0C0C0C] border border-[#222] rounded-lg p-2 text-sm text-[#D7E2EA] w-full"
                value={(form as any)[`stat${n}Label`]}
                onChange={e => setVal(`stat${n}Label`, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 bg-[#121212] border border-[#222] p-6 rounded-xl mb-8">
        {['instagramUrl', 'linkedinUrl', 'youtubeUrl'].map(key => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">{key.replace('Url', '')} URL</label>
            <input
              className="bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-sm text-[#D7E2EA]"
              value={(form as any)[key] || ''}
              onChange={e => setVal(key, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button onClick={() => save('heroStats', form)} className="bg-[#7621B0] px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-xs hover:bg-[#611a93] transition shadow-lg shadow-purple-900/20">
        Save Stats
      </button>
    </div>
  );
};

// ─── CAMPAIGNS SUBCOMPONENT ─────────────────────────────────────────

const Campaigns: React.FC<{ data: typeof defaultData; saveCampaigns: (s: string) => void }> = ({ data, saveCampaigns }) => {
  const [url, setUrl] = useState((data.campaigns || {}).sheetUrl || '');

  useEffect(() => {
    setUrl((data.campaigns || {}).sheetUrl || '');
  }, [data.campaigns]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Campaigns</h2>
      <div className="bg-[#121212] border border-[#222] p-6 rounded-xl mb-6">
        <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40 block mb-2">Google Sheet CSV URL</label>
        <input
          className="w-full bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm mb-4"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button onClick={() => saveCampaigns(url)} className="bg-[#7621B0] px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-xs hover:bg-[#611a93] transition shadow-lg shadow-purple-900/20">
          Save &amp; Sync Data
        </button>
      </div>
    </div>
  );
};

// ─── DND SORTABLE PROJECT COMPONENT ─────────────────────────────────

const SortableProject: React.FC<{
  p: typeof defaultData.videoProjects[0];
  openManage: (p: any) => void;
  openEdit: (p: any) => void;
  deleteProject: (id: string) => void;
}> = ({ p, openManage, openEdit, deleteProject }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: p.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-[#121212] border border-[#222] p-5 rounded-xl flex flex-col gap-4 mb-4">
      <div className="flex items-start gap-4">
        <div {...attributes} {...listeners} className="cursor-grab text-[#D7E2EA]/40 hover:text-[#D7E2EA] text-lg select-none">
          ☰
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {(p.tags || []).map(t => <span key={t} className="text-[10px] bg-[#18011F] text-[#D7E2EA] border border-[#7621B0]/30 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">{t}</span>)}
          </div>
          <h3 className="font-bold text-lg text-[#D7E2EA]">{p.title}</h3>
          <p className="text-xs text-[#D7E2EA]/60 mt-1">{p.description}</p>
          <span className="text-[10px] text-[#BBCCD7] uppercase tracking-widest font-semibold mt-2 block">{(p.videos || []).length} video(s)</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-[#222] pt-4">
        <button onClick={() => openManage(p)} className="bg-[#181818] border border-[#222] px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-[#222] transition">Manage Videos</button>
        <button onClick={() => openEdit(p)} className="bg-[#181818] border border-[#222] px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-[#222] transition">Edit Details</button>
        <button onClick={() => deleteProject(p.id)} className="bg-red-950/20 border border-red-900/30 text-red-400 px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-red-950/40 transition">Delete</button>
      </div>
    </div>
  );
};

// ─── VIDEO PROJECTS SUBCOMPONENT ───────────────────────────────────

const VideoProjects: React.FC<{
  data: typeof defaultData;
  save: (s: string, v: any) => void;
  flash: (m?: string) => void;
}> = ({ data, save, flash }) => {
  const [projects, setProjects] = useState<typeof defaultData.videoProjects>([]);
  const [modal, setModal] = useState<{ type: 'project' | 'videos'; isEdit?: boolean; id?: string } | null>(null);
  const [form, setForm] = useState({ title: '', description: '', tags: '' });
  const [manageProject, setManageProject] = useState<any>(null);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoThumbnailUrl, setNewVideoThumbnailUrl] = useState('');
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editVideoTitle, setEditVideoTitle] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [editVideoThumbnailUrl, setEditVideoThumbnailUrl] = useState('');
  const [fetchingTitles, setFetchingTitles] = useState(false);

  useEffect(() => {
    const list = data.videoProjects || [];
    setProjects(list);
    if (manageProject) {
      const fresh = list.find(p => p.id === manageProject.id);
      if (fresh) setManageProject(fresh);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.videoProjects]);

  // Auto fetch title for new video input
  useEffect(() => {
    const ytid = getYoutubeId(newVideoUrl);
    if (ytid) {
      const fetchTitle = async () => {
        try {
          const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(newVideoUrl)}&format=json`;
          const res = await fetch(oembedUrl);
          if (res.ok) {
            const data = await res.json();
            if (data.title && !newVideoTitle) {
              setNewVideoTitle(data.title);
            }
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchTitle();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newVideoUrl]);

  // Auto fetch title for edit input
  useEffect(() => {
    const ytid = getYoutubeId(editVideoUrl);
    if (ytid && editingVideoId) {
      const fetchTitle = async () => {
        try {
          const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(editVideoUrl)}&format=json`;
          const res = await fetch(oembedUrl);
          if (res.ok) {
            const data = await res.json();
            if (data.title) {
              setEditVideoTitle(data.title);
            }
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchTitle();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editVideoUrl]);

  const persist = (updated: typeof defaultData.videoProjects) => {
    setProjects(updated);
    save('videoProjects', updated);
  };

  const openAdd = () => {
    setForm({ title: '', description: '', tags: '' });
    setModal({ type: 'project', isEdit: false });
  };

  const openEdit = (p: any) => {
    setForm({ title: p.title, description: p.description, tags: (p.tags || []).join(', ') });
    setModal({ type: 'project', isEdit: true, id: p.id });
  };

  const saveProject = () => {
    const tagsArr = (form.tags || '').split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
    if (modal?.isEdit) {
      persist(projects.map(p => p.id === modal.id ? { ...p, title: form.title, description: form.description, tags: tagsArr } : p));
    } else {
      persist([...projects, { id: uid(), title: form.title, description: form.description, tags: tagsArr, videos: [] }]);
    }
    setModal(null);
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete project?')) return;
    
    // Find project and delete all its video thumbnails from Storage
    const projectToDelete = projects.find(p => p.id === id);
    if (projectToDelete && projectToDelete.videos) {
      for (const v of projectToDelete.videos as any[]) {
        if (v.thumbnailUrl) {
          try {
            await deleteImageByUrl(v.thumbnailUrl);
          } catch (err) {
            console.warn("Failed to delete video thumbnail from storage on project delete:", err);
          }
        }
      }
    }

    persist(projects.filter(p => p.id !== id));
  };

  const openManage = (p: any) => {
    setManageProject({ ...p });
    setModal({ type: 'videos' });
    setNewVideoUrl('');
    setNewVideoTitle('');
    setNewVideoThumbnailUrl('');
    setEditingVideoId(null);
  };

  const addVideo = () => {
    if (!newVideoUrl) return;
    const vid = { 
      id: uid(), 
      url: newVideoUrl.trim(), 
      title: newVideoTitle.trim() || 'Untitled',
      thumbnailUrl: newVideoThumbnailUrl.trim()
    };
    const updated = { ...manageProject, videos: [...(manageProject.videos || []), vid] };
    setManageProject(updated);
    persist(projects.map(p => p.id === updated.id ? updated : p));
    setNewVideoUrl('');
    setNewVideoTitle('');
    setNewVideoThumbnailUrl('');
  };

  const startVideoEdit = (v: any) => {
    setEditingVideoId(v.id);
    setEditVideoTitle(v.title);
    setEditVideoUrl(v.url);
    setEditVideoThumbnailUrl(v.thumbnailUrl || '');
  };

  const cancelVideoEdit = () => {
    setEditingVideoId(null);
    setEditVideoThumbnailUrl('');
  };

  const saveVideoEdit = (vidId: string) => {
    if (!editVideoUrl) return;
    const updated = (manageProject.videos || []).map((v: any) =>
      v.id === vidId ? { ...v, title: editVideoTitle, url: editVideoUrl, thumbnailUrl: editVideoThumbnailUrl } : v
    );
    const updatedProj = { ...manageProject, videos: updated };
    setManageProject(updatedProj);
    persist(projects.map(p => p.id === updatedProj.id ? updatedProj : p));
    cancelVideoEdit();
  };

  const deleteVideo = async (vidId: string) => {
    const videoToDelete = (manageProject.videos || []).find((v: any) => v.id === vidId);
    if (videoToDelete?.thumbnailUrl) {
      try {
        await deleteImageByUrl(videoToDelete.thumbnailUrl);
      } catch (err) {
        console.warn("Failed to delete video thumbnail from storage on delete:", err);
      }
    }

    const updated = (manageProject.videos || []).filter((v: any) => v.id !== vidId);
    const updatedProj = { ...manageProject, videos: updated };
    setManageProject(updatedProj);
    persist(projects.map(p => p.id === updatedProj.id ? updatedProj : p));
  };


  const fetchAllTitles = async () => {
    if (!manageProject.videos || manageProject.videos.length === 0) return;
    setFetchingTitles(true);
    try {
      const updated = await Promise.all(
        manageProject.videos.map(async (v: any) => {
          const ytid = getYoutubeId(v.url);
          if (ytid) {
            try {
              const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(v.url)}&format=json`;
              const res = await fetch(oembedUrl);
              if (res.ok) {
                const json = await res.json();
                if (json.title) return { ...v, title: json.title };
              }
            } catch (e) {
              console.error(e);
            }
          }
          return v;
        })
      );
      const updatedProj = { ...manageProject, videos: updated };
      setManageProject(updatedProj);
      persist(projects.map(p => p.id === updatedProj.id ? updatedProj : p));
      flash('Titles successfully updated! 🚀');
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingTitles(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = projects.findIndex(p => p.id === active.id);
      const newIdx = projects.findIndex(p => p.id === over.id);
      persist(arrayMove(projects, oldIdx, newIdx));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Video Projects</h2>
        <button onClick={openAdd} className="bg-[#7621B0] text-white font-semibold py-2 px-4 rounded-lg uppercase tracking-wider text-xs hover:bg-[#611a93] transition shadow-lg shadow-purple-900/20">
          + Add Project
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
          {projects.map(p => (
            <SortableProject key={p.id} p={p} openManage={openManage} openEdit={openEdit} deleteProject={deleteProject} />
          ))}
        </SortableContext>
      </DndContext>

      {/* PROJECT DETAILS MODAL */}
      {modal?.type === 'project' && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 sm:p-6 z-50">
          <div className="bg-[#121212] border border-[#222] p-5 sm:p-8 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">{modal.isEdit ? 'Edit Project' : 'Add Project'}</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Title</label>
                <input
                  className="bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Description</label>
                <input
                  className="bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm"
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Tags (comma separated)</label>
                <input
                  className="bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm"
                  value={form.tags}
                  onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg border border-[#333] uppercase text-xs tracking-wider">Cancel</button>
              <button onClick={saveProject} className="px-5 py-2.5 rounded-lg bg-[#7621B0] uppercase text-xs tracking-wider font-semibold hover:bg-[#611a93]">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEOS LIST MODAL */}
      {modal?.type === 'videos' && manageProject && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 sm:p-6 z-50">
          <div className="bg-[#121212] border border-[#222] p-5 sm:p-8 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Manage Videos — {manageProject.title}</h3>
            
            {manageProject.videos && manageProject.videos.length > 0 && (
              <button
                disabled={fetchingTitles}
                onClick={fetchAllTitles}
                className="w-full bg-[#181818] border border-[#222] text-[#D7E2EA] p-3 text-xs uppercase tracking-widest font-semibold rounded-lg mb-6 hover:bg-[#222] transition"
              >
                {fetchingTitles ? 'Fetching titles...' : 'Fetch All YouTube Titles'}
              </button>
            )}

            <div className="flex flex-col gap-3 max-h-[45vh] overflow-y-auto mb-6">
              {(manageProject.videos || []).map((v: any) => {
                const isEditing = editingVideoId === v.id;
                const ytid = getYoutubeId(v.url);

                if (isEditing) {
                  return (
                    <div key={v.id} className="flex flex-col gap-4 bg-[#0C0C0C] border border-[#222] p-4 rounded-lg">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1 flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/40">Title</label>
                          <input
                            className="w-full bg-[#121212] border border-[#222] rounded p-2 text-xs text-[#D7E2EA]"
                            value={editVideoTitle}
                            onChange={e => setEditVideoTitle(e.target.value)}
                          />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/40">URL</label>
                          <input
                            className="w-full bg-[#121212] border border-[#222] rounded p-2 text-xs text-[#D7E2EA]"
                            value={editVideoUrl}
                            onChange={e => setEditVideoUrl(e.target.value)}
                          />
                        </div>
                      </div>
                      <ImageUpload
                        value={editVideoThumbnailUrl}
                        onChange={setEditVideoThumbnailUrl}
                        folderPath="thumbnails"
                        label="Custom Thumbnail Override (Optional)"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => saveVideoEdit(v.id)} className="bg-[#7621B0] px-3 py-1.5 text-xs rounded hover:bg-[#611a93] font-semibold uppercase tracking-wider flex items-center gap-1">💾 Save Edit</button>
                        <button onClick={cancelVideoEdit} className="bg-neutral-800 px-3 py-1.5 text-xs rounded hover:bg-neutral-700 font-semibold uppercase tracking-wider">Cancel</button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={v.id} className="flex items-center gap-3 bg-[#0C0C0C] border border-[#222] p-3 rounded-lg">
                    {v.thumbnailUrl ? (
                      <img src={v.thumbnailUrl} className="w-12 h-8 object-cover rounded" alt="" />
                    ) : ytid ? (
                      <img src={`https://img.youtube.com/vi/${ytid}/default.jpg`} className="w-12 h-8 object-cover rounded" alt="" />
                    ) : (
                      <div className="w-12 h-8 bg-[#222] rounded" />
                    )}
                    <span className="flex-1 text-sm font-medium truncate">{v.title}</span>
                    <button onClick={() => startVideoEdit(v)} className="text-[#D7E2EA]/50 hover:text-[#D7E2EA]">✏️</button>
                    <button onClick={() => deleteVideo(v.id)} className="text-red-500 hover:text-red-400">🗑</button>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[#222] pt-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Add New Video</h4>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Video URL</label>
                  <input
                    className="bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm"
                    value={newVideoUrl}
                    onChange={e => setNewVideoUrl(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Title</label>
                  <input
                    className="bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm"
                    value={newVideoTitle}
                    onChange={e => setNewVideoTitle(e.target.value)}
                  />
                </div>
                <ImageUpload
                  value={newVideoThumbnailUrl}
                  onChange={setNewVideoThumbnailUrl}
                  folderPath="thumbnails"
                  label="Custom Thumbnail Override (Optional)"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg border border-[#333] uppercase text-xs tracking-wider">Close</button>
                <button onClick={addVideo} className="px-5 py-2.5 rounded-lg bg-[#7621B0] uppercase text-xs tracking-wider font-semibold hover:bg-[#611a93]">Add Video</button>
              </div>
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

  useEffect(() => {
    setItems(data.experience || []);
  }, [data.experience]);

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
        <h2 className="text-2xl font-bold">Experience</h2>
        <button onClick={openAdd} className="bg-[#7621B0] text-white font-semibold py-2 px-4 rounded-lg uppercase tracking-wider text-xs hover:bg-[#611a93] transition shadow-lg shadow-purple-900/20">
          + Add Entry
        </button>
      </div>

      {/* Mobile Card List */}
      <div className="sm:hidden flex flex-col gap-3 mb-8">
        {items.map(item => (
          <div key={item.id} className="bg-[#121212] border border-[#222] p-4 rounded-xl flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/40 font-semibold">{item.year}</span>
                <h3 className="font-bold text-[#D7E2EA] text-base mt-0.5">{item.role}</h3>
                <p className="text-xs text-[#D7E2EA]/60">{item.company}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button onClick={() => openEdit(item)} className="text-xs text-[#D7E2EA]/50 hover:text-[#D7E2EA] font-semibold">Edit</button>
                <button onClick={() => deleteItem(item.id)} className="text-xs text-red-500 hover:text-red-400 font-semibold">Delete</button>
              </div>
            </div>
            {item.description && (
              <p className="text-xs text-[#D7E2EA]/50 border-t border-[#222] pt-2 mt-1 leading-relaxed">{item.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Desktop/Tablet Table */}
      <div className="hidden sm:block bg-[#121212] border border-[#222] rounded-xl overflow-hidden mb-8 w-full overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-sm min-w-[500px]">
          <thead>
            <tr className="border-b border-[#222] bg-[#181818] text-[#D7E2EA]/40 text-xs uppercase tracking-wider">
              <th className="p-4">Period</th>
              <th className="p-4">Role</th>
              <th className="p-4">Company</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-[#222] hover:bg-[#151515] transition">
                <td className="p-4 text-[#D7E2EA]/60">{item.year}</td>
                <td className="p-4 font-semibold">{item.role}</td>
                <td className="p-4 text-[#D7E2EA]/60">{item.company}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="text-xs text-[#D7E2EA]/50 hover:text-[#D7E2EA] font-semibold">Edit</button>
                    <button onClick={() => deleteItem(item.id)} className="text-xs text-red-500 hover:text-red-400 font-semibold">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 sm:p-6 z-50">
          <div className="bg-[#121212] border border-[#222] p-5 sm:p-8 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">{modal.isEdit ? 'Edit Entry' : 'Add Entry'}</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Year / Period</label>
                <input
                  className="bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm"
                  value={form.year}
                  onChange={e => setForm(p => ({ ...p, year: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Role</label>
                <input
                  className="bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm"
                  value={form.role}
                  onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Company</label>
                <input
                  className="bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm"
                  value={form.company}
                  onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Description</label>
                <textarea
                  className="bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm h-24"
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                />
              </div>
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
            placeholder="Add a new skill (e.g. Premiere Pro)"
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} className="bg-[#7621B0] px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-xs hover:bg-[#611a93] transition shadow-lg shadow-purple-900/20 whitespace-nowrap">
            + Add
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {items.map((skill, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-[#0C0C0C] border border-[#333] px-3 py-1.5 rounded-full group">
              <span className="text-sm text-[#D7E2EA]">{skill}</span>
              <button onClick={() => handleRemove(idx)} className="text-[#D7E2EA]/40 hover:text-red-400 transition ml-1">
                ✕
              </button>
            </div>
          ))}
          {items.length === 0 && <span className="text-sm text-[#D7E2EA]/30 italic">No skills added yet.</span>}
        </div>
      </div>
    </div>
  );
};

// ─── ABOUT SUBCOMPONENT ─────────────────────────────────────────────

const About: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [form, setForm] = useState({ ...(data.about || {}) });

  useEffect(() => {
    setForm({ ...(data.about || {}) });
  }, [data.about]);

  const setVal = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">About</h2>
      <div className="flex flex-col gap-5 bg-[#121212] border border-[#222] p-6 rounded-xl mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">Bio Description</label>
          <textarea
            className="bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm h-28"
            value={form.bio}
            onChange={e => setVal('bio', e.target.value)}
          />
        </div>
        {['email', 'phone', 'instagramUrl', 'linkedinUrl', 'youtubeUrl'].map(key => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">
              {key.replace('Url', '')}
            </label>
            <input
              className="bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm"
              value={(form as any)[key] || ''}
              onChange={e => setVal(key, e.target.value)}
            />
          </div>
        ))}
        <ImageUpload
          value={form.photoUrl || ''}
          onChange={url => setVal('photoUrl', url)}
          folderPath="profile"
          label="📸 Profile Photo"
        />
        <button onClick={() => save('about', form)} className="bg-[#7621B0] px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-xs hover:bg-[#611a93] transition w-fit mt-2 shadow-lg shadow-purple-900/20">
          Save About Details
        </button>
      </div>
    </div>
  );
};

// ─── SETTINGS SUBCOMPONENT ──────────────────────────────────────────

const Settings: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [form, setForm] = useState({ 
    whatsappPhone: (data.settings as any)?.whatsappPhone || '8082812805', 
    whatsappApiKey: (data.settings as any)?.whatsappApiKey || '' 
  });

  useEffect(() => {
    setForm({ 
      whatsappPhone: (data.settings as any)?.whatsappPhone || '8082812805', 
      whatsappApiKey: (data.settings as any)?.whatsappApiKey || '' 
    });
  }, [data.settings]);

  const setVal = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">WhatsApp Alert Settings</h2>
      <div className="flex flex-col gap-5 bg-[#121212] border border-[#222] p-6 rounded-xl mb-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">WhatsApp Phone Number</label>
          <input
            className="bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm"
            value={form.whatsappPhone}
            onChange={e => setVal('whatsappPhone', e.target.value)}
            placeholder="e.g. 8082812805"
          />
          <p className="text-[10px] text-[#D7E2EA]/40 mt-0.5">Enter your WhatsApp number (without country code if using CallMeBot default, or with country code if registered, e.g. 918082812805).</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40">CallMeBot API Key</label>
          <input
            type="password"
            className="bg-[#0C0C0C] border border-[#222] rounded-lg p-3 text-[#D7E2EA] text-sm"
            value={form.whatsappApiKey}
            onChange={e => setVal('whatsappApiKey', e.target.value)}
            placeholder="e.g. 123456"
          />
          <p className="text-[10px] text-[#D7E2EA]/40 mt-0.5 font-sans leading-relaxed">
            To get your free key: Add <strong>+34 644 66 32 62</strong> to WhatsApp contacts and send <strong>I allow callmebot to send me messages</strong>. Copy the API key you receive here.
          </p>
        </div>

        <button onClick={() => save('settings', form)} className="bg-[#7621B0] px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-xs hover:bg-[#611a93] transition w-fit mt-2 shadow-lg shadow-purple-900/20">
          Save Settings
        </button>
      </div>
    </div>
  );
};

// ─── SEED DATA SUBCOMPONENT ─────────────────────────────────────────

const SeedData: React.FC<{
  setData: (d: typeof defaultData) => void;
  flash: (m?: string) => void;
}> = ({ setData, flash }) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleReset = async () => {
    if (!confirmed) { setConfirmed(true); return; }
    const fresh = resetData();
    try {
      const portfolioRef = ref(db, 'portfolio_content');
      await set(portfolioRef, fresh);
      setData(fresh);
      setConfirmed(false);
      flash('Synced default seed database live to Firebase! ✨');
    } catch (err) {
      console.error(err);
      setData(fresh);
      setConfirmed(false);
      flash('Local save only - Firebase error');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Seed Data</h2>
      <div className="bg-[#121212] border border-red-950 p-6 rounded-xl mb-6 flex flex-col gap-4">
        <h3 className="font-bold text-red-500">Danger Zone: Reset Database</h3>
        <p className="text-sm text-[#D7E2EA]/60">This action will completely wipe out your custom Firebase data and restore it to default template presets.</p>
        <button
          onClick={handleReset}
          className={`px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-xs transition w-fit ${confirmed ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-950/40'}`}
        >
          {confirmed ? '⚠️ Confirm Database Reset' : 'Reset Database to Presets'}
        </button>
      </div>
    </div>
  );
};

// ─── BRAND LOGOS MANAGEMENT SUBCOMPONENT ─────────────────────────────────
const BrandLogosManagement: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [items, setItems] = useState<{ id: string; name: string; logoUrl: string }[]>([]);
  const [modal, setModal] = useState<{ isEdit: boolean; id?: string } | null>(null);
  const [form, setForm] = useState({ name: '', logoUrl: '' });

  useEffect(() => setItems((data as any).brandLogos || []), [(data as any).brandLogos]);

  const persist = (updated: any) => {
    setItems(updated);
    save('brandLogos', updated);
  };

  const openAdd = () => {
    setForm({ name: '', logoUrl: '' });
    setModal({ isEdit: false });
  };

  const openEdit = (item: any) => {
    setForm({ name: item.name, logoUrl: item.logoUrl || '' });
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
        <h2 className="text-2xl font-bold">Brand Logos</h2>
        <button onClick={openAdd} className="bg-[#7621B0] text-white font-semibold py-2 px-4 rounded-lg uppercase tracking-wider text-xs hover:bg-[#611a93]">
          + Add Logo
        </button>
      </div>
      <p className="text-sm text-[#D7E2EA]/50 mb-6">Yahan aap un brands ke logos add kar sakte ho jinke saath aapne kaam kiya hai. Ye logos aapki website pe showcase honge.</p>

      {/* Logos Grid Preview */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-[#121212] border border-[#222] rounded-2xl">
          {items.map((item: any) => (
            <div key={item.id} className="flex flex-col items-center gap-2 group/logo relative">
              <div className="w-20 h-20 bg-[#0C0C0C] border border-[#333] rounded-xl flex items-center justify-center overflow-hidden p-2">
                {item.logoUrl ? (
                  <img src={item.logoUrl} alt={item.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-xs text-[#D7E2EA]/30 text-center">{item.name}</span>
                )}
              </div>
              <span className="text-[10px] text-[#D7E2EA]/50 max-w-[80px] text-center truncate">{item.name}</span>
              <div className="absolute -top-2 -right-2 hidden group-hover/logo:flex gap-1">
                <button onClick={() => openEdit(item)} className="w-6 h-6 bg-[#7621B0] rounded-full text-[9px] text-white flex items-center justify-center">✏️</button>
                <button onClick={() => { if(confirm('Delete?')) persist(items.filter((i:any) => i.id !== item.id)); }} className="w-6 h-6 bg-red-700 rounded-full text-[9px] text-white flex items-center justify-center">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List */}
      <div className="flex flex-col gap-3">
        {items.map((item: any) => (
          <div key={item.id} className="bg-[#121212] border border-[#222] p-4 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0C0C0C] rounded-lg flex items-center justify-center overflow-hidden p-1">
                {item.logoUrl ? (
                  <img src={item.logoUrl} alt={item.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-[10px] text-[#D7E2EA]/30">No img</span>
                )}
              </div>
              <span className="font-semibold text-[#D7E2EA]">{item.name}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => openEdit(item)} className="text-xs text-[#D7E2EA]/50 hover:text-[#D7E2EA]">Edit</button>
              <button onClick={() => { if(confirm('Delete?')) persist(items.filter((i:any) => i.id !== item.id)); }} className="text-xs text-red-500 hover:text-red-400">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center text-[#D7E2EA]/30 py-12 italic">Abhi koi logo add nahi kiya. Upar "+ Add Logo" click karo.</div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] p-6 rounded-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{modal.isEdit ? 'Edit Brand Logo' : 'Add Brand Logo'}</h3>
            <div className="flex flex-col gap-4">
              <input
                className="bg-[#0C0C0C] border border-[#222] rounded p-2 text-sm"
                placeholder="Brand Name (e.g. Flipkart, ICICI Bank)"
                value={form.name}
                onChange={e => setForm(p => ({...p, name: e.target.value}))}
              />
              {/* Logo: URL paste karo ya upload karo - free aspect ratio */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/50 font-semibold">Brand Logo</label>
                <input
                  className="bg-[#0C0C0C] border border-[#222] rounded p-2 text-sm"
                  placeholder="Logo URL paste karo (e.g. https://...logo.png)"
                  value={form.logoUrl}
                  onChange={e => setForm(p => ({...p, logoUrl: e.target.value}))}
                />
                <p className="text-[10px] text-[#D7E2EA]/40 text-center">— ya apne computer se upload karo —</p>
                <ImageUpload
                  value={form.logoUrl}
                  onChange={url => setForm(p => ({...p, logoUrl: url}))}
                  folderPath="brand-logos"
                  label="Upload Brand Logo (PNG/SVG/JPG)"
                />
                {/* Live Preview */}
                {form.logoUrl && (
                  <div className="mt-2 p-4 bg-[#0C0C0C] border border-[#333] rounded-xl flex items-center justify-center min-h-[80px]">
                    <img
                      src={form.logoUrl}
                      alt="Logo Preview"
                      className="max-h-16 max-w-full object-contain"
                      onError={e => (e.currentTarget.style.display='none')}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-[#333] rounded text-xs">Cancel</button>
              <button onClick={saveItem} className="px-4 py-2 bg-[#7621B0] rounded text-xs font-bold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── WEBSITES MANAGEMENT SUBCOMPONENT ────────────────────────────────
const WebsitesManagement: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [items, setItems] = useState<typeof defaultData.websites>([]);
  const [modal, setModal] = useState<{ isEdit: boolean; id?: string } | null>(null);
  const [form, setForm] = useState({ title: '', description: '', url: '', previewUrl: '', tags: '' });

  useEffect(() => setItems(data.websites || []), [data.websites]);

  const persist = (updated: any) => {
    setItems(updated);
    save('websites', updated);
  };

  const openAdd = () => {
    setForm({ title: '', description: '', url: '', previewUrl: '', tags: '' });
    setModal({ isEdit: false });
  };

  const openEdit = (item: any) => {
    setForm({ ...item, tags: (item.tags || []).join(', ') });
    setModal({ isEdit: true, id: item.id });
  };

  const saveItem = () => {
    const tagsArr = (form.tags || '').split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
    if (modal?.isEdit) {
      persist(items.map((i: any) => i.id === modal.id ? { ...i, ...form, tags: tagsArr } : i));
    } else {
      persist([...items, { id: uid(), ...form, tags: tagsArr }]);
    }
    setModal(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Websites Built</h2>
        <button onClick={openAdd} className="bg-[#7621B0] text-white font-semibold py-2 px-4 rounded-lg uppercase tracking-wider text-xs hover:bg-[#611a93]">
          + Add Website
        </button>
      </div>
      <div className="flex flex-col gap-3 mb-8">
        {items.map((item: any) => (
          <div key={item.id} className="bg-[#121212] border border-[#222] p-4 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#D7E2EA]">{item.title}</h3>
              <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400">{item.url}</a>
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
          <div className="bg-[#121212] p-6 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{modal.isEdit ? 'Edit Website' : 'Add Website'}</h3>
            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
              <input className="bg-[#0C0C0C] border border-[#222] rounded p-2 text-sm" placeholder="Title" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
              <input className="bg-[#0C0C0C] border border-[#222] rounded p-2 text-sm" placeholder="Website URL (e.g. https://yoursite.com)" value={form.url} onChange={e => setForm(p => ({...p, url: e.target.value}))} />
              {/* Preview image: paste URL OR upload file */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/50 font-semibold">Preview Image</label>
                <input
                  className="bg-[#0C0C0C] border border-[#222] rounded p-2 text-sm"
                  placeholder="Paste image URL (e.g. https://i.imgur.com/abc.jpg)"
                  value={form.previewUrl}
                  onChange={e => setForm(p => ({...p, previewUrl: e.target.value}))}
                />
                <p className="text-[10px] text-[#D7E2EA]/40 px-1">— ya neeche se apne computer se upload karo —</p>
                <ImageUpload
                  value={form.previewUrl}
                  onChange={url => setForm(p => ({...p, previewUrl: url}))}
                  folderPath="websites"
                  label="Upload Website Screenshot / Mockup"
                />
                {form.previewUrl && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-white/10">
                    <img src={form.previewUrl} alt="Preview" className="w-full h-36 object-cover" onError={e => (e.currentTarget.style.display='none')} />
                  </div>
                )}
              </div>
              <textarea className="bg-[#0C0C0C] border border-[#222] rounded p-2 text-sm h-20" placeholder="Description" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
              <input className="bg-[#0C0C0C] border border-[#222] rounded p-2 text-sm" placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm(p => ({...p, tags: e.target.value}))} />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-[#333] rounded text-xs">Cancel</button>
              <button onClick={saveItem} className="px-4 py-2 bg-[#7621B0] rounded text-xs font-bold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── REVIEWS MANAGEMENT SUBCOMPONENT ─────────────────────────────────
const ReviewsManagement: React.FC<{ data: typeof defaultData; save: (s: string, v: any) => void }> = ({ data, save }) => {
  const [items, setItems] = useState<typeof defaultData.reviews>([]);
  const [modal, setModal] = useState<{ id?: string; isEdit?: boolean } | null>(null);
  const [form, setForm] = useState({ clientName: '', comment: '', rating: 5, logoUrl: '' });

  useEffect(() => setItems(data.reviews || []), [data.reviews]);

  const persist = (updated: any) => {
    setItems(updated);
    save('reviews', updated);
  };

  const toggleStatus = (id: string, status: string) => {
    persist(items.map((i: any) => i.id === id ? { ...i, status } : i));
  };

  const openAdd = () => {
    setForm({ clientName: '', comment: '', rating: 5, logoUrl: '' });
    setModal({ isEdit: false });
  };

  const openEdit = (item: any) => {
    setForm({ clientName: item.clientName, comment: item.comment, rating: item.rating, logoUrl: item.logoUrl || '' });
    setModal({ id: item.id, isEdit: true });
  };

  const saveEdit = () => {
    if (modal?.isEdit) {
      persist(items.map((i: any) => i.id === modal.id ? { ...i, ...form } : i));
    } else {
      const uid = () => Math.random().toString(36).slice(2, 9);
      persist([...items, { id: uid(), ...form, status: 'approved', date: new Date().toISOString() }]);
    }
    setModal(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Client Reviews</h2>
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
                <span className="text-amber-400 text-xs">★ {item.rating}/5</span>
                <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${item.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-[#D7E2EA]/60 italic">"{item.comment}"</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleStatus(item.id, item.status === 'approved' ? 'pending' : 'approved')} className="text-xs px-3 py-1.5 bg-[#181818] border border-[#333] rounded hover:bg-[#222]">
                {item.status === 'approved' ? 'Unapprove' : 'Approve'}
              </button>
              <button onClick={() => openEdit(item)} className="text-xs px-3 py-1.5 bg-[#181818] border border-[#333] rounded hover:bg-[#222]">Edit</button>
              <button onClick={() => { if(confirm('Delete?')) persist(items.filter((i:any) => i.id !== item.id)); }} className="text-xs px-3 py-1.5 bg-red-950/20 text-red-400 rounded hover:bg-red-950/40">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121212] p-6 rounded-2xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">{modal.isEdit ? 'Edit Review' : 'Add Review'}</h3>
            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
              <input className="bg-[#0C0C0C] border border-[#222] rounded p-2 text-sm" placeholder="Client Name" value={form.clientName} onChange={e => setForm(p => ({...p, clientName: e.target.value}))} />
              <input type="number" min="1" max="5" className="bg-[#0C0C0C] border border-[#222] rounded p-2 text-sm" placeholder="Rating" value={form.rating} onChange={e => setForm(p => ({...p, rating: parseInt(e.target.value)}))} />
              <ImageUpload
                value={form.logoUrl}
                onChange={url => setForm(p => ({...p, logoUrl: url}))}
                folderPath="logos"
                label="Client Brand Logo"
              />
              <textarea className="bg-[#0C0C0C] border border-[#222] rounded p-2 text-sm h-24" placeholder="Comment" value={form.comment} onChange={e => setForm(p => ({...p, comment: e.target.value}))} />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-[#333] rounded text-xs">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 bg-[#7621B0] rounded text-xs font-bold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
