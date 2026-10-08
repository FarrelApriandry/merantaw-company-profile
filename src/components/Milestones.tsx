import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Award, DollarSign, Building2, ShieldCheck, Flag, CheckCircle } from 'lucide-react';

export const Milestones: React.FC = () => {
  const { t } = useLanguage();

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
          {/* P2MW Funding */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#192C56]/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-slate-500">2025 · GRANT</span>
              <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                Rp 10.000.000
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#192C56]/8 flex items-center justify-center text-[#192C56] mb-4">
              <Building2 size={20} />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">
              {t.milestones.items.p2mw.title}
            </h3>
            <span className="text-xs font-semibold text-[#192C56] block mb-3">
              {t.milestones.items.p2mw.org}
            </span>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {t.milestones.items.p2mw.desc}
            </p>
          </div>

          {/* Private Investor Funding */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#192C56]/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-slate-500">2026 · ANGEL</span>
              <span className="px-2.5 py-1 text-xs font-bold bg-blue-50 text-[#192C56] rounded-full border border-blue-200">
                Rp 5.000.000
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#192C56]/8 flex items-center justify-center text-[#192C56] mb-4">
              <DollarSign size={20} />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">
              {t.milestones.items.investor.title}
            </h3>
            <span className="text-xs font-semibold text-[#192C56] block mb-3">
              {t.milestones.items.investor.org}
            </span>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {t.milestones.items.investor.desc}
            </p>
          </div>

          {/* UAD Fair 2025 Award */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#192C56]/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-slate-500">2025 · COMPETITION</span>
              <span className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                3rd Place Winner
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-4">
              <Award size={20} />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">
              {t.milestones.items.uadFair.title}
            </h3>
            <span className="text-xs font-semibold text-[#192C56] block mb-3">
              {t.milestones.items.uadFair.org}
            </span>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {t.milestones.items.uadFair.desc}
            </p>
          </div>

          {/* KMI Expo */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#192C56]/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-slate-500">2025 · SHOWCASE</span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full">
                Exhibition
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#192C56]/8 flex items-center justify-center text-[#192C56] mb-4">
              <Flag size={20} />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">
              {t.milestones.items.kmiExpo.title}
            </h3>
            <span className="text-xs font-semibold text-[#192C56] block mb-3">
              {t.milestones.items.kmiExpo.org}
            </span>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {t.milestones.items.kmiExpo.desc}
            </p>
          </div>

          {/* Gelar Karya */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#192C56]/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-slate-500">2025 · INNOVATION</span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full">
                University Level
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#192C56]/8 flex items-center justify-center text-[#192C56] mb-4">
              <Building2 size={20} />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">
              {t.milestones.items.gelarKarya.title}
            </h3>
            <span className="text-xs font-semibold text-[#192C56] block mb-3">
              {t.milestones.items.gelarKarya.org}
            </span>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {t.milestones.items.gelarKarya.desc}
            </p>
          </div>

          {/* Legal Compliance & 4 IP */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#192C56]/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-slate-500">COMPLIANCE</span>
              <span className="px-2.5 py-1 text-xs font-bold bg-[#192C56]/10 text-[#192C56] rounded-full border border-[#192C56]/20">
                4 Registered IPs
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#192C56]/8 flex items-center justify-center text-[#192C56] mb-4">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">
              {t.milestones.items.legalIp.title}
            </h3>
            <span className="text-xs font-semibold text-[#192C56] block mb-3">
              {t.milestones.items.legalIp.org}
            </span>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {t.milestones.items.legalIp.desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
