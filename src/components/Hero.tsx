import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { metricsData } from '../data/studioData';
import { useSite } from '../lib/cms';
import { ArrowDown, Sparkles, MapPin, Layers } from 'lucide-react';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const site = useSite();

  const metrics = metricsData.map((m) => {
    const facts = site?.facts;
    if (!facts) return m;
    switch (m.id) {
      case 'activeTeam':
        return { ...m, value: facts.active_core?.value ?? m.value, suffix: '' };
      case 'historicalNetwork':
        return { ...m, value: facts.network_total?.value ?? m.value, suffix: '+' };
      case 'yearsDev': {
        const founded = parseInt(facts.founded_year?.value ?? '', 10);
        const yrs = Number.isFinite(founded)
          ? Math.max(1, new Date().getFullYear() - founded + 1)
          : null;
        return { ...m, value: yrs !== null ? String(yrs) : m.value, suffix: 'Yrs' };
      }
      case 'publishedWork':
        return { ...m, value: facts.published_count?.value ?? m.value, suffix: '' };
      case 'intellectualProperty':
        return { ...m, value: facts.ip_count?.value ?? m.value, suffix: '' };
      case 'institutionalPartners':
        return { ...m, value: facts.partners_count?.value ?? m.value, suffix: '' };
      default:
        return m;
    }
  });

  return (
    <section className="relative pt-32 pb-0 overflow-hidden bg-black text-white">
      {/* Cinematic dark backdrop (mockup) */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/assets/pasar-bubrah-banner.svg"
          alt=""
          className="w-full h-full object-cover opacity-60"
        />
        {/* Legibility overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_70%_30%,rgba(0,153,255,0.16),transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Editorial Eyebrow */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold tracking-wider uppercase backdrop-blur-md">
            <Sparkles size={13} className="text-white" />
            <span>{t.hero.badge}</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <MapPin size={13} />
            <span>{t.hero.locationLabel}</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-8">
            {t.hero.headline}{' '}
            <span className="text-white underline decoration-white/30 decoration-2 underline-offset-8">
              {t.hero.headlineHighlight}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mb-10 font-normal">
            {t.hero.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-16">
            <a
              href="/#works"
              className="px-6 py-3.5 text-sm font-bold tracking-wide text-black bg-white hover:bg-slate-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
            >
              <span>{t.hero.primaryCta}</span>
              <Layers size={16} />
            </a>
            <a
              href="/#capabilities"
              className="px-6 py-3.5 text-sm font-bold tracking-wide text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl shadow-xs backdrop-blur-md transition-all duration-200 cursor-pointer"
            >
              {t.hero.secondaryCta}
            </a>
          </div>
        </div>

        {/* Metrics & Track Record Strip */}
        <div className="mt-8 pt-8 border-t border-white/15">
          <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-4">
            Studio Key Facts &amp; Track Record
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {metrics.map((m) => {
              const labelKey = m.id as keyof typeof t.hero.metricsLabels;
              const label = t.hero.metricsLabels[labelKey] || m.id;
              return (
                <div
                  key={m.id}
                  className="bg-white/[0.06] backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xs hover:border-white/30 transition-colors"
                >
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                      {m.value}
                    </span>
                    {m.suffix && (
                      <span className="text-sm font-bold text-slate-400 font-mono">
                        {m.suffix}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-300 leading-snug">
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gradient bridge: dark hero -> light Philosophy */}
      <div
        className="relative z-10 h-32 sm:h-44 mt-12 bg-gradient-to-b from-transparent via-[#0E1626]/70 to-[#FAF9F6]"
        aria-hidden="true"
      />
    </section>
  );
};
