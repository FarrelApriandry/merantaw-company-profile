import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { flagshipProject } from '../data/studioData';
import { resolveMediaUrl, useSite, type CmsProject } from '../lib/cms';
import { ExternalLink, Info, CheckCircle2, Gamepad2, Sparkles } from 'lucide-react';

const FALLBACK_BANNER = "/assets/pasar-bubrah-banner.svg";

export const FeaturedProject: React.FC = () => {
  const { t, lang } = useLanguage();
  const site = useSite();
  const [projects, setProjects] = useState<CmsProject[] | null>(null);
  const [activeImage, setActiveImage] = useState<string>(flagshipProject.bannerImage);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/projects?lang=${lang}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || cancelled) return;
        if (d.projects?.length) {
          setProjects(d.projects);
          const flag = d.projects.find((p: CmsProject) => p.isFlagship) ?? d.projects[0];
          const banner = resolveMediaUrl(flag.bannerKey, flag.id === "pasar-bubrah" ? FALLBACK_BANNER : "");
          setActiveImage(banner);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [lang, site]);

  const cmsFlag = projects?.find((p) => p.isFlagship);
  const flag = cmsFlag ?? null;
  // Pipeline teaser: second published project or R&D placeholder
  const pipeline = projects?.find((p) => !p.isFlagship && p.status !== "archived" && p.status !== "draft") ?? null;

  const title = flag?.title || flagshipProject.title;
  const year = flag?.year || flagshipProject.year;
  const platform = flag?.platform || flagshipProject.platform;
  const status = flag ? (flag.status === "flagship" ? "Flagship Release" : flag.status) : flagshipProject.status;
  const distUrl = flag?.distributionUrl || flagshipProject.distributionUrl;
  const description = flag?.description || t.featuredProject.description;
  const culturalNote = flag?.culturalNote || t.featuredProject.culturalNote;
  const banner = flag ? resolveMediaUrl(flag.bannerKey, flag.id === "pasar-bubrah" ? FALLBACK_BANNER : "") : flagshipProject.bannerImage;
  const thumbs = flag?.thumbnails?.length
    ? flag.thumbnails.map((k) => resolveMediaUrl(k, ""))
    : flagshipProject.thumbnails;
  const gallery = [banner, ...thumbs.filter((x) => x && x !== banner)];

  return (
    <section id="works" className="scroll-mt-20 py-24 sm:py-32 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#192C56] uppercase font-mono">
              {t.featuredProject.sectionTag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-2">
              {t.featuredProject.title}
            </h2>
          </div>
          <div className="text-xs font-semibold text-slate-500 font-mono">
            FLAGSHIP 01 &amp; R&amp;D PIPELINE
          </div>
        </div>

        {/* Brand Clarification Alert Box (Honoring Section 18 from brand doc) */}
        <div className="mb-10 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
          <Info size={20} className="text-[#192C56] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            <span className="font-bold text-[#192C56] uppercase mr-1 tracking-wide">
              {t.featuredProject.horrorClarificationBadge}:
            </span>
            {t.featuredProject.horrorClarificationText}
          </div>
        </div>

        {/* Flagship Production Card */}
        <div className="bg-[#FAF9F6] rounded-3xl border border-slate-200 overflow-hidden shadow-sm mb-12">
          {/* Main Visual Showcase */}
          <div className="relative aspect-video sm:aspect-21/9 w-full bg-[#0E1626] overflow-hidden group">
            <img
              src={activeImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            />
            {/* Corner Badge */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#192C56] text-white tracking-wider uppercase shadow-md">
                {t.featuredProject.flagshipBadge}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-xs text-[#0F172A] tracking-wider uppercase shadow-md">
                {year}
              </span>
            </div>
          </div>

          {/* Interactive Thumbnails Selector */}
          <div className="p-4 sm:p-6 bg-slate-100/70 border-b border-slate-200 flex items-center gap-3 overflow-x-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0 font-mono mr-2">
              Previews:
            </span>
            {gallery.map((src, idx) => (
              <button
                key={src + idx}
                type="button"
                onClick={() => setActiveImage(src)}
                className={`h-14 aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImage === src
                    ? 'border-[#192C56] ring-2 ring-[#192C56]/20'
                    : 'border-slate-300 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={src} alt={idx === 0 ? "Main Banner" : `Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Project Details Grid */}
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left Column: Description & Cultural Focus */}
              <div className="lg:col-span-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-4">
                  {title}
                </h3>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6 font-normal">
                  {description}
                </p>
                {culturalNote && (
                  <p className="text-sm text-slate-500 leading-relaxed border-l-2 border-[#192C56] pl-4 py-1 italic mb-8">
                    {culturalNote}
                  </p>
                )}

                {/* itch.io CTA Button */}
                <div className="flex flex-wrap items-center gap-4">
                  {distUrl && (
                    <a
                      href={distUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white bg-[#192C56] hover:bg-[#233C70] rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                    >
                      <Gamepad2 size={18} />
                      <span>{t.featuredProject.itchCta}</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <a
                    href="/#contact"
                    className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all cursor-pointer"
                  >
                    <span>{t.nav.inquireBtn}</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Project Specifications Table */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-slate-500 font-mono mb-4">
                    Specifications
                  </h4>
                  <dl className="space-y-4 text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <dt className="text-slate-500 font-medium">{t.featuredProject.statusLabel}</dt>
                      <dd className="font-bold text-[#192C56]">{status}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <dt className="text-slate-500 font-medium">{t.featuredProject.platformLabel}</dt>
                      <dd className="font-bold text-slate-800">{platform}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <dt className="text-slate-500 font-medium">{t.featuredProject.yearLabel}</dt>
                      <dd className="font-bold text-slate-800">{year}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <dt className="text-slate-500 font-medium">Developer</dt>
                      <dd className="font-bold text-[#192C56]">Merantaw</dd>
                    </div>
                    {distUrl && (
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <dt className="text-slate-500 font-medium">Distribution</dt>
                        <dd className="font-bold text-slate-800">itch.io Playable Demo</dd>
                      </div>
                    )}
                  </dl>
                </div>
                {distUrl && (
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
                    <CheckCircle2 size={14} />
                    <span>Public Demo Active</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline: 2nd Project Teaser Card */}
        <div className="bg-gradient-to-r from-[#0E1626] to-[#192C56] text-white p-8 sm:p-10 rounded-3xl shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold tracking-widest uppercase mb-3">
              <Sparkles size={12} />
              <span>{t.featuredProject.upcomingTag}</span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight mb-2">
              {pipeline?.title || t.featuredProject.upcomingTitle}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {pipeline?.description || t.featuredProject.upcomingDesc}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-mono font-semibold tracking-wider text-slate-200">
              STATUS: {pipeline ? pipeline.status.toUpperCase() : "R&D PROTOTYPING"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
