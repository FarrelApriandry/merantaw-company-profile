import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { teamDisciplines } from '../data/studioData';
import { Users, UserCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const StudioTeam: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="team" className="scroll-mt-20 py-24 sm:py-32 bg-[#FAF9F6] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold tracking-widest text-[#192C56] uppercase font-mono">
            {t.team.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-2 mb-4">
            {t.team.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {t.team.subtitle}
          </p>
        </div>

        {/* Core & Extended Network Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: 3 Active Core Members */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#192C56]/5 rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#192C56] text-white flex items-center justify-center shadow-xs">
                  <UserCheck size={24} />
                </div>
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#192C56]">
                  03
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-[#0F172A] mb-3">
                {t.team.coreTitle}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal">
                {t.team.coreDesc}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#192C56]">
              <CheckCircle2 size={15} />
              <span>Dedicated Core Production Unit</span>
            </div>
          </div>

          {/* Card 2: 10 Developers Across History */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#192C56] flex items-center justify-center border border-slate-200">
                  <Users size={24} />
                </div>
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-700">
                  10
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-[#0F172A] mb-3">
                {t.team.networkTitle}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal">
                {t.team.networkDesc}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Sparkles size={15} className="text-amber-500" />
              <span>Multidisciplinary Collaboration Network</span>
            </div>
          </div>
        </div>

        {/* Disciplines & Competencies Strip */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h4 className="text-sm font-bold tracking-wider uppercase text-slate-500 font-mono">
              {t.team.disciplinesLabel}
            </h4>
            <span className="text-xs font-semibold text-slate-500">
              {t.team.founderNote}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {teamDisciplines.map((role) => (
              <span
                key={role}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#FAF9F6] text-slate-700 border border-slate-200/90 hover:border-[#192C56] hover:text-[#192C56] transition-colors"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
