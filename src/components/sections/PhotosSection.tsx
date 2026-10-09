import React, { useState } from 'react';
import type { PhotoItem } from '../../lib/store';
import { FadeIn } from '../FadeIn';
import { X, Maximize2, Tag, Calendar } from 'lucide-react';

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
    <section id="photos" className="py-20 bg-[#0C0C0C] relative border-t border-[#D7E2EA]/10 font-kanit select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[#7621B0] font-bold text-xs sm:text-sm tracking-widest uppercase">Portfolio Gallery</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2 uppercase tracking-wide">
                Photo Showcase &amp; Stills
              </h2>
              <p className="text-[#D7E2EA]/70 mt-3 max-w-2xl text-sm md:text-base">
                Behind-the-scenes moments, celebrity shoot stills, live concert videography frames, and production setups.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition tracking-wider uppercase ${
                    selectedCategory === cat
                      ? 'bg-[#7621B0] text-white shadow-lg shadow-[#7621B0]/30'
                      : 'bg-[#181818] text-[#D7E2EA]/70 hover:bg-[#222222] hover:text-white border border-[#D7E2EA]/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <FadeIn key={photo.id || idx} delay={idx * 0.1}>
              <div
                onClick={() => setActivePhoto(photo)}
                className="group relative bg-[#141414] rounded-2xl overflow-hidden border border-[#D7E2EA]/10 cursor-pointer shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#7621B0]/50"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-black/50 relative">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-[#7621B0]/90 text-white p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                  {photo.category && (
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[#D7E2EA] text-[11px] font-bold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1 uppercase tracking-wider">
                      <Tag className="w-3 h-3 text-[#7621B0]" />
                      {photo.category}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-white group-hover:text-[#7621B0] transition-colors">
                    {photo.title}
                  </h3>
                  {photo.description && (
                    <p className="text-xs text-[#D7E2EA]/60 mt-1 line-clamp-2">
                      {photo.description}
                    </p>
                  )}
                  {photo.date && (
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-[#D7E2EA]/40">
                      <Calendar className="w-3 h-3" />
                      <span>{photo.date}</span>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#141414] rounded-2xl overflow-hidden border border-[#D7E2EA]/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-[#7621B0] text-white p-2 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-h-[75vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-[#141414] border-t border-[#D7E2EA]/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#7621B0]/30 text-[#D7E2EA] border border-[#7621B0]/50 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {activePhoto.category}
                </span>
                {activePhoto.date && (
                  <span className="text-xs text-[#D7E2EA]/50">{activePhoto.date}</span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-white">{activePhoto.title}</h3>
              {activePhoto.description && (
                <p className="text-sm text-[#D7E2EA]/80 mt-2">{activePhoto.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
