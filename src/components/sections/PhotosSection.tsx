import React, { useState } from 'react';
import type { PhotoItem } from '../../lib/store';
import { X, ArrowUpRight, FolderOpen, Maximize2 } from 'lucide-react';
import { InteractiveFolder } from '../InteractiveFolder';

interface PhotosSectionProps {
  photos: PhotoItem[];
}

export const PhotosSection: React.FC<PhotosSectionProps> = ({ photos }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);

  if (!photos || photos.length === 0) return null;

  const categories = ['All', ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))];

  const filteredPhotos =
    selectedCategory === 'All'
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  // Group photos for interactive folders
  const folderSets = [
    {
      id: 'bts',
      label: 'BTS ARCHIVE',
      color: '#01472e',
      category: 'Celebrity BTS',
      photos: photos.filter(p => p.category?.toLowerCase().includes('bts') || p.category?.toLowerCase().includes('celebrity')),
    },
    {
      id: 'comm',
      label: 'COMMERCIAL',
      color: '#025235',
      category: 'Commercial',
      photos: photos.filter(p => p.category?.toLowerCase().includes('commercial') || p.category?.toLowerCase().includes('wedding')),
    },
    {
      id: 'music',
      label: 'MUSIC & LIVE',
      color: '#1b4d3e',
      category: 'Live Events',
      photos: photos.filter(p => p.category?.toLowerCase().includes('music') || p.category?.toLowerCase().includes('live')),
    },
    {
      id: 'suite',
      label: 'EDIT SUITE',
      color: '#2a6041',
      category: 'Editing',
      photos: photos.filter(p => p.category?.toLowerCase().includes('edit')),
    },
  ];

  return (
    <section
      id="photos"
      className="py-24 sm:py-32 px-6 sm:px-10 md:px-14 bg-[#fefae0] text-[#01472e] font-sans rounded-t-[5rem] relative z-20 shadow-[0_-25px_50px_-12px_rgba(1,71,46,0.12)] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 sm:mb-20 border-b border-[#01472e]/15 pb-8 gap-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#01472e]/70 block mb-2">
              Visual Archive — 02
            </span>
            <h2 className="font-display uppercase text-[15vw] leading-[0.8] tracking-[-0.05em] text-[#01472e]">
              STILLS
            </h2>
          </div>

          <div className="flex flex-col gap-2 max-w-sm self-start lg:self-end">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#01472e]/60">
              Interactive Production Folders
            </span>
            <p className="text-xs sm:text-sm text-[#01472e]/80 leading-relaxed font-normal">
              Click folders below to reveal drifting stills and on-set archives.
            </p>
          </div>
        </div>

        {/* ── Interactive Folders Showcase ── */}
        <div className="mb-20 p-8 sm:p-12 rounded-[3.5rem] bg-[#e9edc9]/50 border border-[#01472e]/15 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 pb-4 border-b border-[#01472e]/15 gap-4">
            <div className="flex items-center gap-2.5">
              <FolderOpen size={20} className="text-[#01472e]" />
              <h3 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-[#01472e]">
                CLASSIFIED ARCHIVES
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#01472e]/60">
              [Click Folder To Open • Hover Papers To Drift]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8 justify-items-center py-6">
            {folderSets.map((fSet) => {
              const folderPhotos = fSet.photos.length > 0 ? fSet.photos : photos.slice(0, 3);
              const items = folderPhotos.slice(0, 3).map((item, pIdx) => (
                <div
                  key={item.id || pIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhoto(item);
                  }}
                  className="w-full h-full relative cursor-pointer group/photo overflow-hidden rounded-[8px]"
                  title={`Click to view: ${item.title}`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover/photo:scale-115 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-[#01472e]/20 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 size={12} className="text-[#fefae0]" />
                  </div>
                </div>
              ));

              return (
                <div key={fSet.id} className="flex flex-col items-center gap-4">
                  <InteractiveFolder
                    size={1.3}
                    color={fSet.color}
                    label={fSet.label}
                    items={items}
                  />

                  <div className="flex flex-col items-center text-center mt-3">
                    <span className="font-display uppercase text-lg text-[#01472e] tracking-tight">
                      {fSet.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(fSet.category in categories ? fSet.category : 'All')}
                      className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#01472e]/70 hover:text-[#01472e] underline mt-0.5"
                    >
                      FILTER GALLERY ({folderPhotos.length} STILLS)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-4 border-b border-[#01472e]/15">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#01472e]/60">
              Filter By Collection:
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-[#01472e] text-[#fefae0] shadow-[0_10px_20px_-5px_rgba(1,71,46,0.25)]'
                    : 'bg-[#e9edc9] text-[#01472e] border border-[#01472e]/15 hover:bg-[#ccd5ae]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              onClick={() => setActivePhoto(photo)}
              className="group cursor-pointer flex flex-col"
            >
              {/* 4/5 Aspect Ratio Image Container with 2.5rem radius */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] bg-[#01472e]/10 border border-[#01472e]/15 shadow-[0_25px_50px_-12px_rgba(1,71,46,0.18)]">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  loading="lazy"
                />

                {/* Subtle organic green hover tint */}
                <div className="absolute inset-0 bg-[#01472e]/0 group-hover:bg-[#01472e]/20 transition-colors duration-500 pointer-events-none" />

                {/* Floating Top-Right View Icon */}
                <div className="absolute top-5 right-5 w-12 h-12 rounded-full bg-[#fefae0] text-[#01472e] flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-xl">
                  <ArrowUpRight size={20} />
                </div>
              </div>

              {/* Metadata */}
              <div className="mt-4 pt-3 border-t border-[#01472e]/15 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[#01472e] group-hover:opacity-80 transition-opacity">
                    {photo.title}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#01472e]/60">
                    {photo.date || "2024"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.25em] text-[#01472e]/70">
                  <span>{photo.category}</span>
                  <span className="text-[#01472e]/40">[PHOTO STILL]</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-[#01472e]/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300"
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
        </div>
      )}
    </section>
  );
};
