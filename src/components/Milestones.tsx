import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Award, DollarSign, Building2, ShieldCheck, Flag } from 'lucide-react';
import type { CmsMilestone } from '../lib/cms';

const KIND_ICONS: Record<string, React.ReactNode> = {
  grant: <Building2 size={20} />,
  angel: <DollarSign size={20} />,
  competition: <Award size={20} />,
  showcase: <Flag size={20} />,
  innovation: <Building2 size={20} />,
  compliance: <ShieldCheck size={20} />,
};

const KIND_STYLES: Record<string, { badge: string; iconWrap: string; iconColor: string }> = {
  grant: { badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", iconWrap: "bg-[#192C56]/8", iconColor: "text-[#192C56]" },
  angel: { badge: "bg-blue-50 text-[#192C56] border border-blue-200", iconWrap: "bg-[#192C56]/8", iconColor: "text-[#192C56]" },
  competition: { badge: "bg-amber-50 text-amber-800 border border-amber-200", iconWrap: "bg-amber-500/10", iconColor: "text-amber-600" },
  showcase: { badge: "bg-slate-100 text-slate-700", iconWrap: "bg-[#192C56]/8", iconColor: "text-[#192C56]" },
  innovation: { badge: "bg-slate-100 text-slate-700", iconWrap: "bg-[#192C56]/8", iconColor: "text-[#192C56]" },
  compliance: { badge: "bg-[#192C56]/10 text-[#192C56] border border-[#192C56]/20", iconWrap: "bg-[#192C56]/8", iconColor: "text-[#192C56]" },
};

export const Milestones: React.FC = () => {
  const { t, lang } = useLanguage();
  const [items, setItems] = useState<CmsMilestone[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/milestones?lang=${lang}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || cancelled) return;
        if (d.milestones) setItems(d.milestones);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [lang]);

  // Fallback to static translation keys while loading (keeps first paint identical to old site)
  const fallbackKeys = ["p2mw", "investor", "uadFair", "kmiExpo", "gelarKarya", "legalIp"] as const;
  const legacyMeta: Record<string, { year: string; kind: string; badge: string }> = {
    p2mw: { year: "2025 · GRANT", kind: "grant", badge: "Rp 10.000.000" },
    investor: { year: "2026 · ANGEL", kind: "angel", badge: "Rp 5.000.000" },
    uadFair: { year: "2025 · COMPETITION", kind: "competition", badge: "3rd Place Winner" },
    kmiExpo: { year: "2025 · SHOWCASE", kind: "showcase", badge: "Exhibition" },
    gelarKarya: { year: "2025 · INNOVATION", kind: "innovation", badge: "University Level" },
    legalIp: { year: "COMPLIANCE", kind: "compliance", badge: "4 Registered IPs" },
  };

  return (
    <section id="milestones" className="scroll-mt-20 py-24 sm:py-32 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold tracking-widest text-[#192C56] uppercase font-mono">
            {t.milestones.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-2 mb-4">
            {t.milestones.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {t.milestones.subtitle}
          </p>
        </div>

        {/* Institutional Partner Banner */}
        <div className="mb-14 p-6 sm:p-8 bg-[#FAF9F6] rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#192C56] font-mono">
              {t.milestones.institutionalTag}
            </span>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {t.milestones.institutionalDesc}
            </p>
          </div>
          {/* Institutional Badges */}
          <div className="flex flex-wrap items-center gap-4">
            <img
              src="/assets/untidar-logo.svg"
              alt="Universitas Tidar"
              className="h-12 w-auto shadow-2xs hover:shadow-xs transition-shadow"
            />
            <img
              src="/assets/belmawa-logo.svg"
              alt="Belmawa Kemdikbud"
              className="h-12 w-auto shadow-2xs hover:shadow-xs transition-shadow"
            />
          </div>
        </div>

        {/* Milestones Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items
            ? items.map((m) => {
                const style = KIND_STYLES[m.kind] ?? KIND_STYLES.showcase;
                return (
                  <div key={m.id} className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#192C56]/40 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-slate-500">{m.yearLabel} · {m.kind.toUpperCase()}</span>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${style.badge}`}>
                        {m.badgeText}
                      </span>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${style.iconWrap} flex items-center justify-center ${style.iconColor} mb-4`}>
                      {KIND_ICONS[m.kind] ?? <Flag size={20} />}
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A] mb-1">
                      {m.title}
                    </h3>
                    <span className="text-xs font-semibold text-[#192C56] block mb-3">
                      {m.org}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {m.description}
                    </p>
                  </div>
                );
              })
            : fallbackKeys.map((key) => {
                const meta = legacyMeta[key];
                const style = KIND_STYLES[meta.kind];
                const item = t.milestones.items[key];
                return (
                  <div key={key} className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#192C56]/40 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-slate-500">{meta.year}</span>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${style.badge}`}>
                        {meta.badge}
                      </span>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${style.iconWrap} flex items-center justify-center ${style.iconColor} mb-4`}>
                      {KIND_ICONS[meta.kind]}
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A] mb-1">
                      {item.title}
                    </h3>
                    <span className="text-xs font-semibold text-[#192C56] block mb-3">
                      {item.org}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
};
