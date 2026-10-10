import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { resolveMediaUrl, type CmsNews } from '../lib/cms';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';

export const NewsIndex: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const [items, setItems] = useState<CmsNews[] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('merantaw_lang');
    if (saved === 'en' || saved === 'id') setLang(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/news?lang=${lang}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || cancelled) return;
        setItems(d.news ?? []);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const heading = lang === "id" ? "Berita & Kabar Studio" : "Studio News & Updates";

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <header className="bg-[#192C56] text-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <a href="/" className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline">
            <ArrowLeft size={14} /> Merantaw
          </a>
          <span className="flex-1" />
          <LanguageToggle />
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-8">{heading}</h1>
        {!items && <p className="text-sm text-slate-500">Memuat…</p>}
        {items && items.length === 0 && (
          <p className="text-sm text-slate-500">{lang === "id" ? "Belum ada berita yang diterbitkan." : "No published news yet."}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(items ?? []).map((n) => (
            <a
              key={n.id}
              href={`/news/${n.id}`}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#192C56]/40 transition-all"
            >
              {n.coverKey && (
                <div className="aspect-video bg-slate-100 overflow-hidden">
                  <img src={resolveMediaUrl(n.coverKey, "")} alt={n.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                </div>
              )}
              <div className="p-6">
                {n.publishedAt && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-500 mb-2">
                    <CalendarDays size={12} />
                    {new Date(n.publishedAt).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                )}
                <h2 className="text-lg font-bold text-[#0F172A] group-hover:text-[#192C56] transition-colors mb-2">{n.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{n.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
};
