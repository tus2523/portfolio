import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { PhotoItem } from '../../lib/store';
import { X, ArrowUpRight, FolderOpen } from 'lucide-react';
import { InteractiveFolder } from '../InteractiveFolder';

interface PhotosSectionProps {
  photos: PhotoItem[];
}

export const PhotosSection: React.FC<PhotosSectionProps> = ({ photos }) => {
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);
  const [activeFolderModal, setActiveFolderModal] = useState<any | null>(null);

  // Close modals on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activePhoto) setActivePhoto(null);
        else if (activeFolderModal) setActiveFolderModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhoto, activeFolderModal]);

  if (!photos || photos.length === 0) return null;

  // Group photos into 4 primary production folders
  const folderSets = [
    {
      id: 'bts',
      label: 'BTS ARCHIVE',
      color: '#01472e',
      description: 'Celebrity BTS videography, prime lens setups, vanity trailers, and on-floor camera coordination across Mumbai sets.',
      photos: photos.filter(p => p.category?.toLowerCase().includes('bts') || p.category?.toLowerCase().includes('celebrity')),
    },
    {
      id: 'comm',
      label: 'COMMERCIAL',
      color: '#025235',
      description: 'High-speed turntable tracking, commercial studio lighting, macro drink styling, and apparel campaign shoots.',
      photos: photos.filter(p => p.category?.toLowerCase().includes('commercial') || p.category?.toLowerCase().includes('wedding')),
    },
    {
      id: 'music',
      label: 'MUSIC & LIVE',
      color: '#1b4d3e',
      description: 'EDM festival mainstages, live concert atmosphere, dynamic dance choreography, and rap music video cuts.',
      photos: photos.filter(p => p.category?.toLowerCase().includes('music') || p.category?.toLowerCase().includes('live')),
    },
    {
      id: 'suite',
      label: 'EDIT SUITE',
      color: '#2a6041',
      description: 'Multi-cam Premiere Pro timelines, DaVinci Resolve color science, custom LUT grading, and After Effects motion suite.',
      photos: photos.filter(p => p.category?.toLowerCase().includes('edit')),
    },
  ];

  return (
    <section
      id="photos"
      className="py-24 sm:py-32 px-6 sm:px-10 md:px-14 bg-[#fefae0] text-[#01472e] font-sans rounded-t-[5rem] relative z-20 shadow-[0_-25px_50px_-12px_rgba(1,71,46,0.12)]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 sm:mb-20 border-b border-[#01472e]/15 pb-8 gap-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#01472e]/70 block mb-4 sm:mb-6">
              Visual Archive — 02
            </span>
            <h2 className="font-display uppercase text-[clamp(3.5rem,13vw,170px)] leading-[0.92] tracking-[-0.04em] text-[#01472e]">
              STILLS
            </h2>
          </div>

          <div className="flex flex-col gap-2 max-w-sm self-start lg:self-end">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#01472e]/60">
              Interactive Classified Folders
            </span>
            <p className="text-xs sm:text-sm text-[#01472e]/80 leading-relaxed font-normal">
              Click any folder below to open the complete collection and browse all production stills.
            </p>
          </div>
        </div>

        {/* ── Interactive Folders Showcase ── */}
        <div className="p-8 sm:p-12 rounded-[3.5rem] bg-[#e9edc9]/50 border border-[#01472e]/15 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 pb-4 border-b border-[#01472e]/15 gap-4">
            <div className="flex items-center gap-2.5">
              <FolderOpen size={20} className="text-[#01472e]" />
              <h3 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-[#01472e]">
                CLASSIFIED ARCHIVES
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#01472e]/60">
              [Click Folder To Open Full Stills Album]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8 justify-items-center py-6">
            {folderSets.map((fSet) => {
              const folderPhotos = fSet.photos.length > 0 ? fSet.photos : photos;

              // 3 top preview cards for the folder animation
              const previewItems = folderPhotos.slice(0, 3).map((item, pIdx) => (
                <div
                  key={item.id || pIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFolderModal({ ...fSet, photos: folderPhotos });
                  }}
                  className="w-full h-full relative cursor-pointer overflow-hidden rounded-[8px]"
                  title={`Open ${fSet.label}`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ));

              return (
                <div key={fSet.id} className="flex flex-col items-center gap-5 w-full">
                  <InteractiveFolder
                    size={1.15}
                    color={fSet.color}
                    label={fSet.label}
                    items={previewItems}
                    count={folderPhotos.length}
                    onClick={() => setActiveFolderModal({ ...fSet, photos: folderPhotos })}
                  />

                  <div className="flex flex-col items-center text-center mt-2 w-full">
                    <span className="font-display uppercase text-xl text-[#01472e] tracking-tight">
                      {fSet.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveFolderModal({ ...fSet, photos: folderPhotos })}
                      className="mt-2 px-4 py-2 rounded-full bg-[#01472e] text-[#fefae0] text-[9px] font-bold uppercase tracking-[0.2em] hover:scale-105 transition-transform flex items-center gap-1.5 shadow-md"
                    >
                      <span>VIEW ALL ({folderPhotos.length} STILLS)</span>
                      <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── EXPANDED FULL FOLDER VIEW MODAL (PORTALED to prevent clipping!) ── */}
      {activeFolderModal && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[999999] bg-[#01472e]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in font-sans"
          onClick={() => setActiveFolderModal(null)}
        >
          <div
            className="relative w-full max-w-6xl max-h-[90vh] bg-[#fefae0] rounded-[3rem] p-6 sm:p-10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] border border-[#01472e]/20 text-[#01472e] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Folder Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#01472e]/15 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#01472e] text-[#fefae0] flex items-center justify-center shadow-md">
                  <FolderOpen size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#01472e]/60 block">
                    PRODUCTION FOLDER
                  </span>
                  <h3 className="font-display uppercase text-3xl sm:text-4xl text-[#01472e] tracking-tight">
                    {activeFolderModal.label}
                  </h3>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveFolderModal(null)}
                  className="w-11 h-11 rounded-full bg-[#01472e]/10 hover:bg-[#01472e] text-[#01472e] hover:text-[#fefae0] flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Close Folder"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Folder Description */}
            <p className="text-xs sm:text-sm text-[#01472e]/80 py-4 font-normal leading-relaxed border-b border-[#01472e]/10">
              {activeFolderModal.description}
            </p>

            {/* All Photos in this Folder Grid */}
            <div className="flex-1 min-h-0 overflow-y-auto pt-6 pb-2 pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(activeFolderModal.photos || []).map((pItem: PhotoItem, pIdx: number) => (
                  <div
                    key={pItem.id || pIdx}
                    onClick={() => setActivePhoto(pItem)}
                    className="group cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-[#01472e]/10 border border-[#01472e]/15 shadow-md">
                      <img
                        src={pItem.imageUrl}
                        alt={pItem.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-[#01472e]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-full bg-[#fefae0] text-[#01472e] text-[9px] font-bold uppercase tracking-widest shadow-md">
                          VIEW FULL
                        </span>
                      </div>
                    </div>
                    <div className="mt-2.5 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#01472e]">
                      <span className="truncate max-w-[80%]">{pItem.title}</span>
                      <span className="text-[#01472e]/50">{pItem.date || '2024'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── LIGHTBOX MODAL (PORTALED to prevent clipping!) ── */}
      {activePhoto && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999999] bg-[#01472e]/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#fefae0] rounded-[2.5rem] overflow-hidden border border-[#01472e]/20 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] text-[#01472e]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-[#01472e] text-[#fefae0] flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
            >
              <X size={20} />
            </button>

            <div className="max-h-[75vh] bg-[#01472e]/10 flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>

            <div className="p-8 bg-[#fefae0] border-t border-[#01472e]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#01472e]/60 block mb-1">
                  {activePhoto.category} — {activePhoto.date || "2024"}
                </span>
                <h3 className="font-display uppercase text-3xl tracking-tight text-[#01472e]">
                  {activePhoto.title}
                </h3>
                {activePhoto.description && (
                  <p className="text-xs text-[#01472e]/80 mt-1 max-w-lg">
                    {activePhoto.description}
                  </p>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#01472e]/50 shrink-0">
                [TUSHAR MARU STILLS]
              </span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
