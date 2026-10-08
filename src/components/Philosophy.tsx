import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Compass, Lightbulb, Globe2, Quote } from 'lucide-react';

export const Philosophy: React.FC = () => {
  const { t } = useLanguage();

  const pillarIcons = [Compass, Lightbulb, Globe2];

  return (
    <section id="philosophy" className="scroll-mt-20 py-24 sm:py-32 bg-[#FAF9F6] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold tracking-widest text-[#192C56] uppercase font-mono">
            {t.philosophy.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-2">
            {t.philosophy.title}
          </h2>
        </div>

        {/* Big Editorial Quote Card */}
        <div className="relative bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm mb-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#192C56]/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-[#192C56] text-white rounded-xl shadow-xs">
              <Quote size={24} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Core Studio Manifesto
              </span>
              <p className="text-xs font-medium text-slate-500">
                Farrel Apriandry — Founder of Merantaw
              </p>
            </div>
          </div>

          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-[#192C56] leading-snug tracking-tight mb-6">
            {t.philosophy.quoteIndonesian}
          </blockquote>

          <p className="text-sm sm:text-base font-medium text-slate-500 border-l-2 border-[#192C56]/30 pl-4 py-1 italic mb-6">
            {t.philosophy.quoteTranslation}
          </p>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            {t.philosophy.leadParagraph}
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {t.philosophy.pillars.map((pillar, idx) => {
            const Icon = pillarIcons[idx % pillarIcons.length];
            return (
              <div
                key={pillar.title}
                className="bg-white/90 p-7 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#192C56]/40 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#192C56]/8 flex items-center justify-center text-[#192C56] mb-5">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] tracking-tight mb-2.5">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-slate-500">
                  <span>PILLAR 0{idx + 1}</span>
                  <span className="text-[#192C56]">MERANTAW</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
