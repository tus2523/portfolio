import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import { defaultData } from '../../lib/store';

interface ExperienceSectionProps {
  experience: typeof defaultData.experience;
  theme?: 'light' | 'dark';
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  return (
    <section
      id="experience"
      className="py-24 sm:py-32 px-6 sm:px-10 md:px-14 bg-[var(--theme-hero-bg,#ccd5ae)] text-[var(--theme-text,#01472e)] font-sans rounded-t-[5rem] relative z-20 shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden transition-colors duration-500"
    >
      <div className="max-w-5xl mx-auto flex flex-col">
        {/* Section Header with generous, safe spacing */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 sm:mb-20 border-b border-current/15 pb-8 gap-6 sm:gap-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-70 block mb-4 sm:mb-6">
              Career Trajectory — 05
            </span>
            <h2 className="font-display uppercase text-[clamp(3.5rem,13vw,170px)] leading-[0.92] tracking-[-0.04em] text-[var(--theme-text,#01472e)]">
              TIMELINE
            </h2>
          </div>

          <p className="max-w-xs text-xs sm:text-sm opacity-80 leading-relaxed font-normal self-start lg:self-end">
            Track record across camera direction, celebrity BTS projects, and high-retention video editing.
          </p>
        </div>

        {experience && experience.length > 0 ? (
          <div className="max-w-4xl mx-auto w-full relative pl-4 sm:pl-8">
            {/* Vertical timeline axis */}
            <div className="absolute left-[20px] sm:left-[28px] top-3 bottom-3 w-[2px] bg-current/20" />

            <div className="flex flex-col gap-8">
              {experience.map((ex) => (
                <div key={ex.id} className="relative pl-8 sm:pl-12 group">
                  {/* Timeline node */}
                  <div className="absolute left-[-2px] sm:left-[6px] top-2 w-6 h-6 rounded-full bg-[var(--theme-accent-bg,#fefae0)] border-2 border-current flex items-center justify-center shadow-md group-hover:scale-125 transition-transform duration-300">
                    <div className="w-2 h-2 rounded-full bg-current" />
                  </div>

                  <div className="bg-[var(--theme-accent-bg,#fefae0)] border border-current/15 hover:border-current/40 p-8 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] transition-all duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] flex items-center gap-2">
                        <Calendar size={13} /> {ex.year}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.25em] opacity-50">
                        PRODUCTION RECORD
                      </span>
                    </div>

                    <h3 className="font-display uppercase text-2xl sm:text-3xl tracking-tight text-[var(--theme-text,#01472e)]">
                      {ex.role}
                    </h3>

                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider opacity-70 mt-1 flex items-center gap-2">
                      <Briefcase size={13} />
                      {ex.company}
                    </p>

                    <p className="text-xs sm:text-sm opacity-85 mt-4 font-normal leading-relaxed">
                      {ex.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center opacity-40 py-12 uppercase tracking-widest text-xs">
            No experience listed.
          </div>
        )}
      </div>
    </section>
  );
};
