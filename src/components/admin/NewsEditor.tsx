import React, { useEffect, useState } from "react";
import { Plus, Trash2, ImagePlus, Loader2 } from "lucide-react";
import { apiJson, uploadImage, Field, inputCls, LangTabs, useDirty } from "./ui";

interface NewsI18n {
  title: string;
  excerpt: string;
  body: string;
}

interface NewsItem {
  id: string;
  status: string;
  coverKey: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  i18n: Partial<Record<"en" | "id", NewsI18n>>;
}

const emptyI18n = (): NewsI18n => ({ title: "", excerpt: "", body: "" });

function mediaUrl(key: string | null): string | null {
  if (!key) return null;
  if (key.startsWith("http") || key.startsWith("/")) return key;
  const endpoint = (window as unknown as { __S3_ENDPOINT?: string }).__S3_ENDPOINT;
  return endpoint ? `${endpoint.replace(/\/$/, "")}/media/${key}` : key;
}

export const NewsEditor: React.FC = () => {
  const [items, setItems, dirty, markSaved, reset] = useDirty<NewsItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "id">("en");
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    apiJson<{ news: NewsItem[] }>("/api/admin/news")
      .then((d) => {
        reset(d.news);
        setLoaded(true);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const patch = (id: string, fn: (n: NewsItem) => NewsItem) =>
    setItems((all) => all.map((n) => (n.id === id ? fn(n) : n)));

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100) || `berita-${Date.now().toString(36)}`;

  const addNew = () => {
    const id = `berita-${Date.now().toString(36)}`;
    setItems((all) => [
      { id, status: "draft", coverKey: null, publishedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), i18n: { en: emptyI18n(), id: emptyI18n() } },
      ...all,
    ]);
    setOpenId(id);
  };

  const save = async (n: NewsItem) => {
    setBusy(true);
    setError("");
    try {
      await apiJson("/api/admin/news", {
        method: "POST",
        body: JSON.stringify({
          id: n.id,
          status: n.status,
          coverKey: n.coverKey,
          publishedAt: n.status === "published" ? n.publishedAt : null,
          i18n: n.i18n,
        }),
      });
      const fresh = await apiJson<{ news: NewsItem[] }>("/api/admin/news");
      reset(fresh.news);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (n: NewsItem) => {
    if (!window.confirm(`Hapus berita "${n.id}"?`)) return;
    setBusy(true);
    try {
      await apiJson(`/api/admin/news?id=${encodeURIComponent(n.id)}`, { method: "DELETE" });
      const fresh = await apiJson<{ news: NewsItem[] }>("/api/admin/news");
      reset(fresh.news);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (n: NewsItem, file: File) => {
    setUploading(n.id);
    setError("");
    try {
      const { key } = await uploadImage(file, "news");
      patch(n.id, (x) => ({ ...x, coverKey: key }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal.");
    } finally {
      setUploading(null);
    }
  };

  if (!loaded) return <p className="text-sm text-slate-500 py-8 text-center">Memuat berita…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LangTabs lang={lang} setLang={setLang} />
          <span className="text-xs text-slate-500">{items.length} berita</span>
        </div>
        <button
          type="button"
          onClick={addNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#192C56] hover:bg-[#233C70] rounded-xl transition-all"
        >
          <Plus size={14} /> Berita baru
        </button>
      </div>

      {error && <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">{error}</p>}

      {items.map((n) => {
        const t = n.i18n[lang] ?? emptyI18n();
        const open = openId === n.id;
        const setT = (k: keyof NewsI18n, v: string) =>
          patch(n.id, (x) => ({ ...x, i18n: { ...x.i18n, [lang]: { ...(x.i18n[lang] ?? emptyI18n()), [k]: v } } }));
        return (
          <div key={n.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : n.id)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
            >
              {n.coverKey ? (
                <img src={mediaUrl(n.coverKey) ?? ""} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0" />
              ) : (
                <span className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                  <ImagePlus size={18} />
                </span>
              )}
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-bold text-[#0F172A] truncate">
                  {n.i18n.en?.title || n.i18n.id?.title || n.id}
                </span>
                <span className="block text-xs text-slate-500 font-mono">
                  /news/{n.id} · {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString("id-ID") : "belum terbit"}
                </span>
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0 ${n.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {n.status === "published" ? "Terbit" : "Draf"}
              </span>
            </button>

            {open && (
              <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Field label="Slug / ID">
                    <input value={n.id} disabled className={`${inputCls} font-mono opacity-60`} />
                  </Field>
                  <Field label="Status">
                    <select value={n.status} onChange={(e) => patch(n.id, (x) => ({ ...x, status: e.target.value }))} className={inputCls}>
                      <option value="draft">Draf</option>
                      <option value="published">Terbit</option>
                    </select>
                  </Field>
                  <Field label="Tanggal terbit">
                    <input
                      type="date"
                      value={n.publishedAt ? n.publishedAt.slice(0, 10) : ""}
                      onChange={(e) => patch(n.id, (x) => ({ ...x, publishedAt: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                      className={inputCls}
                    />
                  </Field>
                </div>

                <div className="space-y-3">
                  <Field label={`Judul (${lang.toUpperCase()}) — slug auto dari judul ID`}>
                    <input
                      value={t.title}
                      onChange={(e) => {
                        const v = e.target.value;
                        setT("title", v);
                        if (lang === "id" && n.id.startsWith("berita-")) patch(n.id, (x) => ({ ...x }));
                      }}
                      onBlur={(e) => {
                        if (lang === "id" && n.id.startsWith("berita-") && e.target.value) {
                          const s = slugify(e.target.value);
                          patch(n.id, (x) => ({ ...x, id: s }));
                          setOpenId(s);
                        }
                      }}
                      className={inputCls}
                    />
                  </Field>
                  <Field label={`Ringkasan (${lang.toUpperCase()})`}>
                    <textarea rows={2} value={t.excerpt} onChange={(e) => setT("excerpt", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label={`Isi — markdown (${lang.toUpperCase()})`}>
                    <textarea rows={8} value={t.body} onChange={(e) => setT("body", e.target.value)} className={`${inputCls} font-mono`} placeholder="# Judul&#10;&#10;Paragraf…" />
                  </Field>
                </div>

                <div>
                  <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Gambar sampul</span>
                  <div className="flex items-center gap-3">
                    {n.coverKey && <img src={mediaUrl(n.coverKey) ?? ""} alt="" className="h-16 rounded-lg object-cover bg-slate-100" />}
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#192C56] bg-[#192C56]/5 hover:bg-[#192C56]/10 rounded-xl cursor-pointer transition-all">
                      {uploading === n.id ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                      Upload sampul
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(n, e.target.files[0])} />
                    </label>
                    {n.coverKey && (
                      <button type="button" onClick={() => patch(n.id, (x) => ({ ...x, coverKey: null }))} className="text-xs font-semibold text-red-600 hover:underline">
                        Hapus
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => remove(n)}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                  <button
                    type="button"
                    onClick={() => save(n)}
                    disabled={busy}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-[#192C56] hover:bg-[#233C70] disabled:opacity-50 rounded-xl transition-all"
                  >
                    {busy ? "Menyimpan…" : "Simpan berita"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {dirty && <p className="text-[11px] font-mono text-amber-700">Ada perubahan belum disimpan — tekan “Simpan berita” di tiap kartu.</p>}
      {items.length === 0 && <p className="text-sm text-slate-500 py-8 text-center">Belum ada berita. Klik “Berita baru”.</p>}
    </div>
  );
};
