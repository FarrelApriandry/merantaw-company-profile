import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { resolveMediaUrl, type CmsNews } from '../lib/cms';
import { ArrowRight, CalendarDays, Newspaper } from 'lucide-react';

export const News: React.FC = () => {
  const { lang } = useLanguage();
  const [items, setItems] = useState<CmsNews[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/news?lang=${lang}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || cancelled) return;
        setItems((d.news ?? []).slice(0, 3));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [lang]);

  if (!items || items.length === 0) return null;

  const heading = lang === "id" ? "Berita & Kabar Studio" : "Studio News & Updates";
  const tag = lang === "id" ? "BERITA" : "NEWS";
  const readMore = lang === "id" ? "Baca selengkapnya" : "Read more";

  return (
    <section id="news" className="scroll-mt-20 py-24 sm:py-32 bg-[#FAF9F6] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#192C56] uppercase font-mono">
              {tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-2">
              {heading}
            </h2>
          </div>
          <a
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#192C56] hover:underline"
          >
            {lang === "id" ? "Semua berita" : "All news"} <ArrowRight size={14} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((n) => (
            <a
              key={n.id}
              href={`/news/${n.id}`}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#192C56]/40 transition-all"
            >
              {n.coverKey && (
                <div className="aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src={resolveMediaUrl(n.coverKey, "")}
                    alt={n.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              )}
              <div className="p-6">
                {n.publishedAt && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-500 mb-2">
                    <CalendarDays size={12} />
                    {new Date(n.publishedAt).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
                <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#192C56] transition-colors mb-2 leading-snug">
                  {n.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3">
                  {n.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#192C56]">
                  {readMore} <ArrowRight size={12} />
                </span>
              </div>
            </a>
          ))}
        </div>

        {items.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Newspaper size={16} />
            <span>{lang === "id" ? "Belum ada berita." : "No news yet."}</span>
          </div>
        )}
      </div>
    </section>
  );
};
