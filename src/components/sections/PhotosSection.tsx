import React, { useState } from 'react';
import type { PhotoItem } from '../../lib/store';
import { X, ArrowUpRight } from 'lucide-react';

interface PhotosSectionProps {
  photos: PhotoItem[];
}

export const PhotosSection: React.FC<PhotosSectionProps> = ({ photos }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);

  if (!photos || photos.length === 0) return null;

  const categories = ['All', ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))];

  const filteredPhotos = selectedCategory === 'All'
    ? photos
    : photos.filter((p) => p.category === selectedCategory);

  return (
    <section id="photos" className="py-24 px-6 sm:px-12 md:px-16 bg-[#FFFFFF] text-[#000000] font-sans border-b border-[#000000]/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 border-b border-[#000000]/10 pb-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#737373]">Index — 02</span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.05em] leading-[0.9] text-[#000000] mt-2">
              Photo Stills &amp; BTS
            </h2>
          </div>

          {/* Minimalist Studio Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-[0.1em] transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-[#000000] text-[#FFFFFF]'
                    : 'bg-[#FFFFFF] text-[#525252] border border-[#000000]/10 hover:border-[#000000]/30 hover:text-[#000000]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Studio Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              onClick={() => setActivePhoto(photo)}
              className="group cursor-pointer flex flex-col"
            >
              {/* 4:3 Image Container with 700ms grayscale-to-color transition */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-900 border border-[#000000]/10">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  loading="lazy"
                />

                {/* 10% black hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />

                {/* Top-Right Arrow */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-xl">
                  <ArrowUpRight size={18} />
                </div>
              </div>

              {/* Bottom Metadata */}
              <div className="mt-4 pt-3 border-t border-[#000000]/10 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold tracking-tight text-[#000000] group-hover:text-[#525252] transition-colors duration-300">
                    {photo.title}
                  </h3>
                  <span className="font-mono text-xs text-[#737373]">
                    {photo.date || "2024"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.1em] text-[#737373]">
                  <span>{photo.category}</span>
                  <span className="text-[#000000]/40">[PHOTO STILL]</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-[#000000]/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition duration-300"
            >
              <X size={18} />
            </button>

            <div className="max-h-[75vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-[#0A0A0A] border-t border-white/10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/50 block mb-1">
                  {activePhoto.category} — {activePhoto.date || "2024"}
                </span>
                <h3 className="text-xl font-bold tracking-tight">{activePhoto.title}</h3>
                {activePhoto.description && (
                  <p className="text-xs text-white/70 mt-1">{activePhoto.description}</p>
                )}
              </div>
              <span className="font-mono text-xs text-white/40 uppercase tracking-widest shrink-0">
                [Tushar Maru Archive]
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
