'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getData, updateSection, resetData, login, logout, isLoggedIn, parseCampaignCsv, getYoutubeId } from '../lib/store';
import { db } from '../lib/firebase';
import { ref, set, onValue } from 'firebase/database';

/* ─── tiny uuid helper ───────────────────────────────────── */
const uid = () => Math.random().toString(36).slice(2, 9);

/* ─── Sidebar nav items ──────────────────────────────────── */
const NAV = [
  { id: 'stats',      icon: '📊', label: 'Hero Stats'     },
  { id: 'campaigns',  icon: '📋', label: 'Campaigns'      },
  { id: 'videos',     icon: '🎬', label: 'Video Projects' },
  { id: 'experience', icon: '💼', label: 'Experience'     },
  { id: 'skills',     icon: '🛠️', label: 'Skills'         },
  { id: 'about',      icon: '👤', label: 'About'          },
  { id: 'seed',       icon: '🗄️', label: 'Seed Data'      },
];

export default function AdminPage() {
  const [tab, setTab]     = useState('stats');
  const [data, setData]   = useState(() => getData());
  const [saved, setSaved] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loginErr, setLoginErr] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setAuthed(isLoggedIn());
    
    // Load initial data from Firebase
    const portfolioRef = ref(db, 'portfolio_content');
    const unsubscribe = onValue(portfolioRef, (snapshot) => {
      const fbData = snapshot.val();
      if (fbData) {
        setData(fbData);
      } else {
        setData(getData()); // Fallback to local store
      }
    });

    return () => unsubscribe();
  }, []);

  // ── MOUNT CHECK (Hydration Fix) ─────────────────────────────
  if (!isMounted) return <div style={{ minHeight: '100vh', background: 'var(--bg)' }} />;

  // ── LOGIN SCREEN ────────────────────────────────────────────
  if (!authed) {
    const handleLogin = (e) => {
      e.preventDefault();
      if (login(loginForm.email, loginForm.password)) {
        setAuthed(true);
        setLoginErr('');
      } else {
        setLoginErr('Invalid email or password.');
      }
    };
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{ width: 'min(420px, 100%)' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--gold)' }}>ST</span> Admin
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Portfolio Manager
            </div>
          </div>

          {/* Card */}
          <form onSubmit={handleLogin} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '2rem',
          }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.75rem', marginTop: 0 }}>Sign in to continue</h2>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="admin@example.com"
                value={loginForm.email}
                onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                  required
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--muted)',
                    cursor: 'pointer', fontSize: '0.85rem',
                  }}
                >{showPass ? 'Hide' : 'Show'}</button>
              </div>
            </div>

            {loginErr && (
              <p style={{ color: 'var(--red)', fontSize: '0.88rem', marginBottom: '1rem' }}>{loginErr}</p>
            )}

            <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}>
              Sign In →
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
            <Link href="/" style={{ color: 'var(--muted)' }}>← Back to Portfolio</Link>
          </p>
        </div>
      </div>
    );
  }

  if (!data) return <div style={{ padding: '3rem', color: '#888' }}>Loading…</div>;

  const flash = (msg = 'Changes saved!') => {
    setSaved(msg);
    setTimeout(() => setSaved(''), 2500);
  };

  const save = async (section, val) => {
    // 1. Update local state immediately for snappy feel
    const updated = { ...data, [section]: val };
    setData(updated);
    
    // 2. Sync to Firebase for real-time global update
    try {
      const portfolioRef = ref(db, 'portfolio_content');
      await set(portfolioRef, updated);
      flash('Changes synced live to Firebase! ✨');
    } catch (err) {
      console.error("Firebase sync error:", err);
      flash('Local save only - Firebase error');
    }
  };

  const saveCampaigns = async (sheetUrl) => {
    try {
      // 1. Save URL to portfolio content
      await save('campaigns', { sheetUrl });

      // 2. Fetch and Parse CSV
      const res = await fetch(`/api/campaigns?url=${encodeURIComponent(sheetUrl)}`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const csvText = await res.text();
      const { grouped, brands } = parseCampaignCsv(csvText);

      if (brands.length === 0) throw new Error("No data found in sheet. Check column headers.");

      // 3. Sync parsed data to Firebase
      const campaignsRef = ref(db, 'campaigns_data');
      await set(campaignsRef, { grouped, brands, lastSync: Date.now() });
      flash('Campaign data synced live! 🚀');
    } catch (err) {
      console.error("Sync error:", err);
      flash(`Sync Error: ${err.message}`);
    }
  };

  return (
    <div className="admin-layout">
      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className="admin-sidebar">
        <div className="admin-logo-wrap">
          <div className="admin-logo"><span>ST</span> Admin</div>
          <div className="admin-subtitle">Portfolio Manager</div>
        </div>

        <nav className="admin-nav">
          {NAV.map(n => (
            <div
              key={n.id}
              className={`admin-nav-item ${tab === n.id ? 'active' : ''}`}
              onClick={() => setTab(n.id)}
            >
              <span className="admin-nav-icon">{n.icon}</span>
              {n.label}
            </div>
          ))}
        </nav>

        <div className="admin-footer-nav">
          <Link href="/" className="admin-nav-item" style={{ display: 'flex', textDecoration: 'none' }}>
            <span className="admin-nav-icon">←</span>
            View Site
          </Link>
          <div
            className="admin-nav-item"
            onClick={() => { logout(); setAuthed(false); }}
            style={{ color: 'var(--red)', cursor: 'pointer' }}
          >
            <span className="admin-nav-icon">🚪</span>
            Logout
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────── */}
      <main className="admin-content">
        {saved && (
          <div style={{
            position: 'fixed', top: '1.5rem', right: '2rem', zIndex: 9999,
            background: 'var(--gold)', color: '#000',
            padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-sm)',
            fontWeight: 600, fontSize: '0.9rem', animation: 'slideUp 0.2s ease',
          }}>{saved}</div>
        )}

        {tab === 'stats'      && <HeroStats      data={data} save={save} />}
        {tab === 'campaigns'  && <Campaigns      data={data} saveCampaigns={saveCampaigns} />}
        {tab === 'videos'     && <VideoProjects  data={data} save={save} flash={flash} setData={setData} />}
        {tab === 'experience' && <Experience     data={data} save={save} />}
        {tab === 'skills'     && <Skills         data={data} save={save} />}
        {tab === 'about'      && <About          data={data} save={save} />}
        {tab === 'seed'       && <SeedData       setData={setData} flash={flash} />}
      </main>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB: HERO STATS
════════════════════════════════════════════════════════════ */
function HeroStats({ data, save }) {
  const [form, setForm] = useState({ ...(data.heroStats || {}) });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    setForm({ ...(data.heroStats || {}) });
  }, [data.heroStats]);

  return (
    <>
      <h2 className="admin-page-title">Hero Stats</h2>

      <div className="admin-section">
        <div className="admin-section-title">Statistics</div>
        <div className="stats-grid">
          {[1,2,3,4].map(n => (
            <div key={n} style={{ display: 'flex', gap: '0.75rem' }}>
              <div className="form-group" style={{ flex: '0 0 80px' }}>
                <label className="form-label">Stat {n} Value</label>
                <input className="form-input" value={form[`stat${n}Value`]} onChange={e => set(`stat${n}Value`, e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Stat {n} Label</label>
                <input className="form-input" value={form[`stat${n}Label`]} onChange={e => set(`stat${n}Label`, e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-title">Social Links</div>
        {[
          { key: 'instagramUrl', label: 'Instagram URL' },
          { key: 'linkedinUrl',  label: 'LinkedIn URL'  },
          { key: 'youtubeUrl',   label: 'YouTube URL'   },
        ].map(({ key, label }) => (
          <div className="form-group" key={key}>
            <label className="form-label">{label}</label>
            <input className="form-input" value={form[key]} onChange={e => set(key, e.target.value)} />
          </div>
        ))}
      </div>

      <button className="btn btn-gold" onClick={() => save('heroStats', form)}>
        💾 Save Changes
      </button>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB: CAMPAIGNS
════════════════════════════════════════════════════════════ */
function Campaigns({ data, saveCampaigns }) {
  const [url, setUrl] = useState((data.campaigns || {}).sheetUrl || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUrl((data.campaigns || {}).sheetUrl || '');
  }, [data.campaigns]);

  const handleRefresh = async () => {
    if (!url) return;
    setLoading(true);
    await saveCampaigns(url);
    setLoading(false);
  };

  return (
    <>
      <h2 className="admin-page-title">Campaigns</h2>

      <div className="admin-section">
        <div className="admin-section-title">Google Sheet Integration</div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Paste the <strong style={{ color: 'var(--fg)' }}>public CSV export link</strong> of your Google Sheet below.
          The public portfolio will fetch campaign data directly from this link in real time.
          <br /><br />
          <strong style={{ color: 'var(--gold)' }}>How to get the link:</strong> In Google Sheets → File → Share →
          Publish to Web → choose CSV → copy the link.
        </p>

        <div className="form-group">
          <label className="form-label">Google Sheet CSV URL</label>
          <input
            className="form-input"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.5rem' }}>
          <button 
            className="btn btn-gold" 
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? '⏳ Syncing...' : '🔄 Save & Sync Data'}
          </button>
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              🔗 Open Google Sheet
            </a>
          )}
        </div>
      </div>

      <div className="admin-section" style={{ opacity: 0.6 }}>
        <div className="admin-section-title">Expected Sheet Columns</div>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
          Your sheet should have columns like: <strong style={{ color: 'var(--fg)' }}>Brand, Campaign Name, Creator, Platform, Reach, Notes</strong>.
          The first column will be used to group campaigns by brand in the public tabs.
        </p>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB: VIDEO PROJECTS
════════════════════════════════════════════════════════════ */
function SortableProject({ p, openManage, openEdit, deleteProject }) {
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
    <div ref={setNodeRef} style={style} className="vp-card">
      <div className="vp-card-header" style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab', marginRight: '1rem', marginTop: '0.2rem', fontSize: '1.2rem', color: 'var(--muted)', display: 'flex', alignItems: 'center' }}>
          ☰
        </div>
        <div>
          <div className="vp-tags">
            {(p.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <h3 style={{ margin: '0.4rem 0 0.2rem', fontSize: '1.1rem' }}>{p.title}</h3>
          <div className="vp-desc">{p.description}</div>
          <div className="vp-count">{(p.videos || []).length} video(s) added</div>
        </div>
      </div>
      <div className="vp-actions">
        <button className="btn btn-gold btn-sm" onClick={() => openManage(p)}>🎬 Manage Videos</button>
        <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>✏️ Edit Project</button>
        <button className="btn btn-danger btn-sm" onClick={() => deleteProject(p.id)}>🗑 Delete</button>
      </div>
    </div>
  );
}

function VideoProjects({ data, save, flash, setData }) {
  const [projects, setProjects] = useState([...(data.videoProjects || [])]);
  const [modal, setModal] = useState(null); // { type: 'project'|'videos', project?, isEdit }
  const [form, setForm] = useState({});
  const [manageProject, setManageProject] = useState(null);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editVideoTitle, setEditVideoTitle] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [fetchingTitles, setFetchingTitles] = useState(false);

  useEffect(() => {
    const updatedProjects = data.videoProjects || [];
    setProjects(updatedProjects);
    if (manageProject) {
      const freshProject = updatedProjects.find(p => p.id === manageProject.id);
      if (freshProject) {
        setManageProject(freshProject);
      }
    }
  }, [data.videoProjects]);

  // Auto-fetch title for new video input
  useEffect(() => {
    const ytid = getYoutubeId(newVideoUrl);
    if (ytid) {
      const fetchTitle = async () => {
        try {
          const res = await fetch(`/api/youtube-title?url=${encodeURIComponent(newVideoUrl)}`);
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
  }, [newVideoUrl]);

  // Auto-fetch title when editing video URL
  useEffect(() => {
    const ytid = getYoutubeId(editVideoUrl);
    if (ytid && editingVideoId) {
      const fetchTitle = async () => {
        try {
          const res = await fetch(`/api/youtube-title?url=${encodeURIComponent(editVideoUrl)}`);
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
  }, [editVideoUrl]);

  const persist = (updated) => {
    setProjects(updated);
    save('videoProjects', updated);
  };

  const openAdd = () => {
    setForm({ title: '', description: '', tags: '' });
    setModal({ type: 'project', isEdit: false });
  };

  const openEdit = (p) => {
    setForm({ title: p.title, description: p.description, tags: (p.tags || []).join(', ') });
    setModal({ type: 'project', isEdit: true, id: p.id });
  };

  const saveProject = () => {
    const tags = (form.tags || '').split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
    if (modal.isEdit) {
      persist(projects.map(p => p.id === modal.id ? { ...p, title: form.title, description: form.description, tags } : p));
    } else {
      persist([...projects, { id: uid(), title: form.title, description: form.description, tags, videos: [] }]);
    }
    setModal(null);
  };

  const deleteProject = (id) => {
    if (!confirm('Delete this project?')) return;
    persist(projects.filter(p => p.id !== id));
  };

  const openManage = (p) => {
    setManageProject({ ...p });
    setModal({ type: 'videos' });
    setNewVideoUrl('');
    setNewVideoTitle('');
    setEditingVideoId(null);
    setEditVideoTitle('');
    setEditVideoUrl('');
  };

  const startVideoEdit = (v) => {
    setEditingVideoId(v.id);
    setEditVideoTitle(v.title);
    setEditVideoUrl(v.url);
  };

  const cancelVideoEdit = () => {
    setEditingVideoId(null);
    setEditVideoTitle('');
    setEditVideoUrl('');
  };

  const saveVideoEdit = (vidId) => {
    if (!editVideoUrl.trim()) return;
    const updatedVideos = (manageProject.videos || []).map(v => 
      v.id === vidId 
        ? { ...v, title: editVideoTitle.trim() || 'Untitled', url: editVideoUrl.trim() } 
        : v
    );
    const updatedProject = { ...manageProject, videos: updatedVideos };
    setManageProject(updatedProject);
    persist(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    cancelVideoEdit();
  };

  const fetchAllTitles = async () => {
    if (!manageProject.videos || manageProject.videos.length === 0) return;
    setFetchingTitles(true);
    try {
      const updatedVideos = await Promise.all(
        manageProject.videos.map(async (v) => {
          const ytid = getYoutubeId(v.url);
          if (ytid) {
            try {
              const res = await fetch(`/api/youtube-title?url=${encodeURIComponent(v.url)}`);
              if (res.ok) {
                const data = await res.json();
                if (data.title) {
                  return { ...v, title: data.title };
                }
              }
            } catch (err) {
              console.error("Failed to fetch title for video:", v.id, err);
            }
          }
          return v;
        })
      );
      const updatedProject = { ...manageProject, videos: updatedVideos };
      setManageProject(updatedProject);
      persist(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      flash('All YouTube titles updated! 🎬');
    } catch (err) {
      console.error(err);
      flash('Error updating titles');
    } finally {
      setFetchingTitles(false);
    }
  };

  const addVideo = () => {
    if (!newVideoUrl) return;
    const vid = { id: uid(), url: newVideoUrl.trim(), title: newVideoTitle.trim() || 'Untitled' };
    const updated = { ...manageProject, videos: [...(manageProject.videos || []), vid] };
    setManageProject(updated);
    persist(projects.map(p => p.id === updated.id ? updated : p));
    setNewVideoUrl('');
    setNewVideoTitle('');
  };

  const deleteVideo = (vidId) => {
    const updated = { ...manageProject, videos: (manageProject.videos || []).filter(v => v.id !== vidId) };
    setManageProject(updated);
    persist(projects.map(p => p.id === updated.id ? updated : p));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex(p => p.id === active.id);
      const newIndex = projects.findIndex(p => p.id === over.id);
      
      const updated = arrayMove(projects, oldIndex, newIndex);
      persist(updated);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="admin-page-title" style={{ margin: 0 }}>Video Projects</h2>
        <button className="btn btn-gold btn-sm" onClick={openAdd}>+ Add Project</button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={projects.map(p => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {projects.map(p => (
            <SortableProject 
              key={p.id} 
              p={p} 
              openManage={openManage} 
              openEdit={openEdit} 
              deleteProject={deleteProject} 
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* ADD/EDIT PROJECT MODAL */}
      {modal?.type === 'project' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal.isEdit ? 'Edit Project' : 'Add Project'}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input className="form-input" value={form.tags} placeholder="MUSIC, EDITING, BRAND" onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-gold" onClick={saveProject}>Save Project</button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE VIDEOS MODAL */}
      {modal?.type === 'videos' && manageProject && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" style={{ width: 'min(600px, 100%)' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Manage Videos — {manageProject.title}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>

            {manageProject.videos && manageProject.videos.length > 0 && (
              <button 
                className="btn btn-outline btn-sm" 
                style={{ marginBottom: '1.25rem', width: '100%', justifyContent: 'center' }} 
                onClick={fetchAllTitles}
                disabled={fetchingTitles}
              >
                {fetchingTitles ? '🔍 Fetching Titles...' : '🎬 Fetch All YouTube Titles'}
              </button>
            )}

            <div className="video-list">
              {!(manageProject.videos && manageProject.videos.length > 0) && (
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>No videos yet. Add one below.</p>
              )}
              {(manageProject.videos || []).map(v => {
                const isEditing = editingVideoId === v.id;
                const ytid = getYoutubeId(v.url);

                if (isEditing) {
                  return (
                    <div key={v.id} className="video-list-item" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                      <input
                        className="form-input"
                        value={editVideoTitle}
                        onChange={e => setEditVideoTitle(e.target.value)}
                        placeholder="Video Title"
                        style={{ flex: '1 1 150px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                      />
                      <input
                        className="form-input"
                        value={editVideoUrl}
                        onChange={e => setEditVideoUrl(e.target.value)}
                        placeholder="YouTube / Drive URL"
                        style={{ flex: '1 1 200px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                      />
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button className="btn btn-gold btn-sm" onClick={() => saveVideoEdit(v.id)}>💾 Save</button>
                        <button className="btn btn-outline btn-sm" onClick={cancelVideoEdit}>✕</button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={v.id} className="video-list-item">
                    {ytid
                      ? <img src={`https://img.youtube.com/vi/${ytid}/default.jpg`} className="video-list-thumb" alt="" />
                      : <div className="video-list-thumb" />}
                    <span className="video-list-title">{v.title}</span>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '0.2rem 0.4rem', fontSize: '0.9rem' }} onClick={() => startVideoEdit(v)}>✏️</button>
                    <a href={v.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">🔗</a>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteVideo(v.id)}>🗑</button>
                  </div>
                );
              })}
            </div>

            <hr className="divider" />
            <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Add New Video</div>
            <div className="form-group">
              <label className="form-label">YouTube / Drive URL</label>
              <input className="form-input" value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div className="form-group">
              <label className="form-label">Video Title</label>
              <input className="form-input" value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} placeholder="Episode 1 — BTS" />
            </div>
            <button className="btn btn-gold" onClick={addVideo}>+ Add Video</button>
          </div>
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB: EXPERIENCE
════════════════════════════════════════════════════════════ */
function Experience({ data, save }) {
  const [items, setItems] = useState([...(data.experience || [])]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    setItems(data.experience || []);
  }, [data.experience]);

  const persist = (updated) => { setItems(updated); save('experience', updated); };

  const openAdd = () => {
    setForm({ year: '', role: '', company: '', description: '' });
    setModal({ isEdit: false });
  };
  const openEdit = (item) => {
    setForm({ ...item });
    setModal({ isEdit: true, id: item.id });
  };
  const saveItem = () => {
    if (modal.isEdit) {
      persist(items.map(i => i.id === modal.id ? { ...i, ...form } : i));
    } else {
      persist([...items, { id: uid(), ...form }]);
    }
    setModal(null);
  };
  const deleteItem = (id) => {
    if (!confirm('Delete this entry?')) return;
    persist(items.filter(i => i.id !== id));
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="admin-page-title" style={{ margin: 0 }}>Experience</h2>
        <button className="btn btn-gold btn-sm" onClick={openAdd}>+ Add Entry</button>
      </div>

      <div className="admin-section" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="exp-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Role</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td style={{ color: 'var(--muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{item.year}</td>
                <td style={{ fontWeight: 600 }}>{item.role}</td>
                <td style={{ color: 'var(--muted)' }}>{item.company}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}>✏️</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteItem(item.id)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal.isEdit ? 'Edit Entry' : 'Add Entry'}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            {[
              { key: 'year',        label: 'Year / Period',  ph: '2024 – 2026'          },
              { key: 'role',        label: 'Role / Title',   ph: 'Influencer Marketing Executive' },
              { key: 'company',     label: 'Company',        ph: 'Illuminati Media'      },
              { key: 'description', label: 'Description',    ph: 'What did you do here?', multi: true },
            ].map(({ key, label, ph, multi }) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                {multi
                  ? <textarea className="form-input" rows={3} value={form[key] || ''} placeholder={ph} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                  : <input className="form-input" value={form[key] || ''} placeholder={ph} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />}
              </div>
            ))}
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-gold" onClick={saveItem}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB: ABOUT
════════════════════════════════════════════════════════════ */
function About({ data, save }) {
  const [form, setForm] = useState({ ...(data.about || {}) });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    setForm({ ...(data.about || {}) });
  }, [data.about]);

  return (
    <>
      <h2 className="admin-page-title">About</h2>

      <div className="admin-section">
        <div className="admin-section-title">About Text</div>
        <div className="form-group">
          <label className="form-label">About</label>
          <textarea className="form-input" rows={5} value={form.bio} onChange={e => set('bio', e.target.value)} />
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-title">Contact Information</div>
        {[
          { key: 'email',        label: 'Email',         type: 'email' },
          { key: 'phone',        label: 'Phone',         type: 'text'  },
          { key: 'instagramUrl', label: 'Instagram URL', type: 'url'   },
          { key: 'linkedinUrl',  label: 'LinkedIn URL',  type: 'url'   },
          { key: 'youtubeUrl',   label: 'YouTube URL',   type: 'url'   },
        ].map(({ key, label, type }) => (
          <div className="form-group" key={key}>
            <label className="form-label">{label}</label>
            <input className="form-input" type={type} value={form[key] || ''} onChange={e => set(key, e.target.value)} />
          </div>
        ))}
      </div>

      <button className="btn btn-gold" onClick={() => save('about', form)}>💾 Save Changes</button>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB: SKILLS & EXPERTISE
════════════════════════════════════════════════════════════ */
function Skills({ data, save }) {
  const [text, setText] = useState((data.skills || []).join(', '));

  useEffect(() => {
    setText((data.skills || []).join(', '));
  }, [data.skills]);

  const handleSave = () => {
    const skillsArray = text.split(',').map(s => s.trim()).filter(Boolean);
    save('skills', skillsArray);
  };

  return (
    <>
      <h2 className="admin-page-title">Skills & Expertise</h2>

      <div className="admin-section">
        <div className="admin-section-title">Edit Skills</div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Enter your skills separated by <strong style={{ color: 'var(--fg)' }}>commas</strong>. 
          Each item will appear as a premium tag in the "Skills & Expertise" section on your homepage.
        </p>

        <div className="form-group">
          <label className="form-label">Skills List (Comma Separated)</label>
          <textarea 
            className="form-input" 
            rows={10} 
            value={text} 
            onChange={e => setText(e.target.value)}
            placeholder="Premiere Pro, After Effects, Influencer Campaigns, Creator Briefing..."
            style={{ fontFamily: 'inherit', lineHeight: 1.6 }}
          />
        </div>

        <button className="btn btn-gold" onClick={handleSave}>
          💾 Save Skills & Tags
        </button>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB: SEED DATA
════════════════════════════════════════════════════════════ */
function SeedData({ setData, flash }) {
  const [confirmed, setConfirmed] = useState(false);

  const handleReset = async () => {
    if (!confirmed) { setConfirmed(true); return; }
    const fresh = resetData();
    try {
      const portfolioRef = ref(db, 'portfolio_content');
      await set(portfolioRef, fresh);
      setData(fresh);
      setConfirmed(false);
      flash('Database reset to defaults and synced to Firebase! ✨');
    } catch (err) {
      console.error("Firebase sync error:", err);
      setData(fresh);
      setConfirmed(false);
      flash('Local save only - Firebase error');
    }
  };

  return (
    <>
      <h2 className="admin-page-title">Seed Data</h2>
      <div className="admin-section danger-card">
        <div className="admin-section-title">Reset Database (Danger Zone)</div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          This will overwrite all your current data (Stats, Videos, Experience, About) with the default starting values.
          Campaign Google Sheet URL will also be reset. <strong style={{ color: 'var(--red)' }}>This cannot be undone.</strong>
        </p>

        {confirmed && (
          <p style={{ color: 'var(--red)', fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem' }}>
            ⚠️ Are you sure? Click again to confirm reset.
          </p>
        )}

        <button className="btn btn-danger" onClick={handleReset}>
          {confirmed ? '⚠️ Confirm Reset' : '🗄️ Seed All Data'}
        </button>
        {confirmed && (
          <button className="btn btn-ghost" style={{ marginLeft: '0.75rem' }} onClick={() => setConfirmed(false)}>
            Cancel
          </button>
        )}
      </div>
    </>
  );
}
