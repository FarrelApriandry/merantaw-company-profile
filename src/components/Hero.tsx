import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { metricsData } from '../data/studioData';
import { ArrowDown, Sparkles, MapPin, Layers } from 'lucide-react';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern border-b border-slate-200/80">
      {/* Subtle decorative glow elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#192C56]/8 via-[#233C70]/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Editorial Eyebrow */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#192C56]/8 border border-[#192C56]/15 text-[#192C56] text-xs font-bold tracking-wider uppercase">
            <Sparkles size={13} className="text-[#192C56]" />
            <span>{t.hero.badge}</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <MapPin size={13} />
            <span>{t.hero.locationLabel}</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0F172A] leading-[1.08] mb-8">
            {t.hero.headline}{' '}
            <span className="text-[#192C56] underline decoration-slate-300 decoration-wavy decoration-2 underline-offset-8">
              {t.hero.headlineHighlight}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mb-10 font-normal">
            {t.hero.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-16">
            <a
              href="#works"
              className="px-6 py-3.5 text-sm font-bold tracking-wide text-white bg-[#192C56] hover:bg-[#233C70] rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
            >
              <span>{t.hero.primaryCta}</span>
              <Layers size={16} />
            </a>
            <a
              href="#capabilities"
              className="px-6 py-3.5 text-sm font-bold tracking-wide text-[#192C56] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs hover:border-[#192C56] transition-all duration-200 cursor-pointer"
            >
              {t.hero.secondaryCta}
            </a>
          </div>
        </div>

        {/* Metrics & Track Record Strip */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-4">
            Studio Key Facts &amp; Track Record
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {metricsData.map((m) => {
              const labelKey = m.id as keyof typeof t.hero.metricsLabels;
              const label = t.hero.metricsLabels[labelKey] || m.id;
              return (
                <div
                  key={m.id}
                  className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:border-[#192C56]/40 transition-colors"
                >
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#192C56] font-mono tracking-tight">
                      {m.value}
                    </span>
                    {m.suffix && (
                      <span className="text-sm font-bold text-slate-500 font-mono">
                        {m.suffix}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-600 leading-snug">
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
