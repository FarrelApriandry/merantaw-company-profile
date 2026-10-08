import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { capabilitiesList } from '../data/studioData';
import {
  Gamepad2,
  Code2,
  Globe2,
  Smartphone,
  Box,
  Palette,
  Cpu,
  Compass,
  ArrowRight
} from 'lucide-react';

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Gamepad2,
  Code2,
  Globe2,
  Smartphone,
  Box,
  Palette,
  Cpu,
  Compass
};

export const Capabilities: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="capabilities" className="scroll-mt-20 py-24 sm:py-32 bg-[#FAF9F6] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold tracking-widest text-[#192C56] uppercase font-mono">
            {t.capabilities.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-2 mb-4">
            {t.capabilities.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {t.capabilities.subtitle}
          </p>
        </div>

        {/* 8 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilitiesList.map((cap) => {
            const Icon = iconMap[cap.icon] || Code2;
            const itemTranslation = t.capabilities.items[cap.id] || {
              title: cap.id,
              desc: ""
            };

            return (
              <div
                key={cap.id}
                className="group relative bg-white p-7 rounded-2xl border border-slate-200 hover:border-[#192C56] transition-all duration-300 shadow-2xs hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-[#192C56] transition-colors">
                      {cap.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-slate-200 flex items-center justify-center text-[#192C56] group-hover:bg-[#192C56] group-hover:text-white transition-all duration-300 shadow-2xs">
                      <Icon size={20} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-[#0F172A] tracking-tight mb-3 group-hover:text-[#192C56] transition-colors">
                    {itemTranslation.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {itemTranslation.desc}
                  </p>
                </div>

                {/* Technical Tags */}
                <div>
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {cap.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] font-semibold bg-slate-50 text-slate-600 rounded-md border border-slate-200/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
