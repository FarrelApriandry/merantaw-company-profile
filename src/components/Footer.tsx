import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { studioInfo } from '../data/studioData';
import { useSite } from '../lib/cms';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const site = useSite();
  const channels = site?.channels ?? [];
  const itch = channels.find((c) => c.key === "itch")?.value ?? studioInfo.channels.itch;
  const github = channels.find((c) => c.key === "github")?.value ?? studioInfo.channels.github;
  const domain = channels.find((c) => c.key === "domain")?.value ?? studioInfo.domain;
  const location = channels.find((c) => c.key === "location")?.value;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0E1626] text-white pt-20 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/icon.svg"
                alt="Merantaw Emblem"
                className="w-10 h-10 rounded-xl"
              />
              <span className="font-extrabold tracking-widest text-xl text-white">
                MERANTAW
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>
            <div className="pt-2">
              <LanguageToggle />
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-300">
              <li>
                <a href="/#philosophy" className="hover:text-white transition-colors">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="/#works" className="hover:text-white transition-colors">
                  {t.nav.works}
                </a>
              </li>
              <li>
                <a href="/#capabilities" className="hover:text-white transition-colors">
                  {t.nav.capabilities}
                </a>
              </li>
              <li>
                <a href="/#milestones" className="hover:text-white transition-colors">
                  {t.nav.milestones}
                </a>
              </li>
              <li>
                <a href="/#team" className="hover:text-white transition-colors">
                  {t.nav.team}
                </a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-white transition-colors">
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Channels & Location Column */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              {t.footer.channels}
            </h4>
            <div className="flex flex-col gap-2 text-xs text-slate-300">
              <a
                href={itch}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors font-mono"
              >
                {itch.replace(/^https?:\/\//, "")}
              </a>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors font-mono"
              >
                {github.replace(/^https?:\/\//, "")}
              </a>
              <span className="text-slate-400 font-mono">
                Domain: {domain}
              </span>
              <span className="text-slate-400">
                {location ?? "Magelang, Central Java, Indonesia"}
              </span>
            </div>

            {/* Back to top button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                <ArrowUp size={13} />
                <span>Back to top</span>
              </button>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Compliance Section (Strict compliance with section 19 & 23) */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 space-y-3">
          <p className="leading-relaxed text-[11px] text-slate-400 font-mono">
            {t.footer.legalNote}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>
              &copy; {new Date().getFullYear()} Merantaw. {t.footer.allRightsReserved}
            </span>
            <span>
              Founder: Farrel Apriandry · Est. 2024
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
