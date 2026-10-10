import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { resolveMediaUrl, type CmsNews } from '../lib/cms';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';

function renderMarkdown(src: string): string {
  // Minimal safe markdown: escape HTML, then handle headings/bold/italic/links/paragraphs
  const escaped = src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const lines = escaped.split("\n");
  const html: string[] = [];
  let inList = false;
  for (const line of lines) {
    const h3 = line.match(/^###\s+(.*)/);
    const h2 = line.match(/^##\s+(.*)/);
    const h1 = line.match(/^#\s+(.*)/);
    const li = line.match(/^[-*]\s+(.*)/);
    if (h3 || h2 || h1) {
      if (inList) { html.push("</ul>"); inList = false; }
      const level = h3 ? 3 : h2 ? 2 : 1;
      const text = (h3?.[1] ?? h2?.[1] ?? h1?.[1] ?? "");
      html.push(`<h${level} class="font-bold text-[#0F172A] mt-6 mb-2 text-${level === 1 ? "2xl" : level === 2 ? "xl" : "lg"}">${inline(text)}</h${level}>`);
    } else if (li) {
      if (!inList) { html.push('<ul class="list-disc pl-5 space-y-1 my-3">'); inList = true; }
      html.push(`<li>${inline(li[1])}</li>`);
    } else if (line.trim() === "") {
      if (inList) { html.push("</ul>"); inList = false; }
    } else {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<p class="my-3 leading-relaxed">${inline(line)}</p>`);
    }
  }
  if (inList) html.push("</ul>");
  return html.join("\n");
}

function inline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|\W)\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#192C56] font-semibold hover:underline">$1</a>');
}

export const NewsDetail: React.FC<{ slug: string }> = ({ slug }) => {
  const { lang, setLang } = useLanguage();
  const [item, setItem] = useState<CmsNews | null>(null);
  const [missing, setMissing] = useState(false);

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
        const found = (d.news ?? []).find((n: CmsNews) => n.id === slug);
        if (found) setItem(found);
        else setMissing(true);
      })
      .catch(() => {
        if (!cancelled) setMissing(true);
      });
    return () => {
      cancelled = true;
    };
  }, [lang, slug]);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <header className="bg-[#192C56] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <a href="/news" className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline">
            <ArrowLeft size={14} /> {lang === "id" ? "Berita" : "News"}
          </a>
          <span className="flex-1" />
          <LanguageToggle />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!item && !missing && <p className="text-sm text-slate-500">Memuat…</p>}
        {missing && (
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] mb-2">404</h1>
            <p className="text-sm text-slate-600">{lang === "id" ? "Berita tidak ditemukan." : "News article not found."}</p>
            <a href="/news" className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-[#192C56] hover:underline">
              <ArrowLeft size={14} /> {lang === "id" ? "Kembali" : "Back"}
            </a>
          </div>
        )}
        {item && (
          <article className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">{item.title}</h1>
            {item.publishedAt && (
              <p className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 mb-6">
                <CalendarDays size={13} />
                {new Date(item.publishedAt).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
            {item.coverKey && (
              <img src={resolveMediaUrl(item.coverKey, "")} alt={item.title} className="w-full rounded-2xl border border-slate-200 bg-white mb-8" />
            )}
            <div
              className="text-[15px] text-slate-700"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(item.body || "") }}
            />
          </article>
        )}
      </main>
    </div>
  );
};
