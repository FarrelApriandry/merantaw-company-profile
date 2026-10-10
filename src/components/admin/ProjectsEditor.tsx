import React, { useEffect, useState } from "react";
import { Plus, Trash2, Star, ImagePlus, Loader2, ExternalLink } from "lucide-react";
import { apiJson, uploadImage, Field, inputCls, LangTabs, useDirty } from "./ui";

interface ProjectI18n {
  title: string;
  typeLabel: string;
  description: string;
  culturalNote: string;
}

interface Thumb {
  id: string;
  storageKey: string;
  sortOrder: number;
}

interface Project {
  id: string;
  status: string;
  year: string;
  platform: string;
  distributionUrl: string | null;
  bannerKey: string | null;
  sortOrder: number;
  isFlagship: boolean;
  i18n: Partial<Record<"en" | "id", ProjectI18n>>;
  thumbnails: Thumb[];
}

const emptyI18n = (): ProjectI18n => ({ title: "", typeLabel: "", description: "", culturalNote: "" });

function mediaUrl(key: string | null): string | null {
  if (!key) return null;
  if (key.startsWith("http") || key.startsWith("/")) return key;
  const endpoint = (window as unknown as { __S3_ENDPOINT?: string }).__S3_ENDPOINT;
  return endpoint ? `${endpoint.replace(/\/$/, "")}/media/${key}` : key;
}

export const ProjectsEditor: React.FC<{ endpoint: string }> = ({ endpoint }) => {
  const [items, setItems, dirty, markSaved, reset] = useDirty<Project[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "id">("en");
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    apiJson<{ projects: Project[] }>("/api/admin/projects")
      .then((d) => {
        reset(d.projects);
        setLoaded(true);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const patch = (id: string, fn: (p: Project) => Project) =>
    setItems((all) => all.map((p) => (p.id === id ? fn(p) : p)));

  const addNew = () => {
    const id = `project-${Date.now().toString(36)}`;
    setItems((all) => [
      ...all,
      {
        id,
        status: "draft",
        year: String(new Date().getFullYear()),
        platform: "",
        distributionUrl: null,
        bannerKey: null,
        sortOrder: all.length + 1,
        isFlagship: false,
        i18n: { en: emptyI18n(), id: emptyI18n() },
        thumbnails: [],
      },
    ]);
    setOpenId(id);
  };

  const save = async (p: Project) => {
    setBusy(true);
    setError("");
    try {
      await apiJson("/api/admin/projects", {
        method: "POST",
        body: JSON.stringify({
          id: p.id,
          status: p.status,
          year: p.year,
          platform: p.platform,
          distributionUrl: p.distributionUrl,
          bannerKey: p.bannerKey,
          sortOrder: p.sortOrder,
          isFlagship: p.isFlagship,
          i18n: p.i18n,
          thumbnails: p.thumbnails.map((t) => t.storageKey),
        }),
      });
      const fresh = await apiJson<{ projects: Project[] }>("/api/admin/projects");
      reset(fresh.projects);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p: Project) => {
    if (!window.confirm(`Hapus project "${p.id}"?`)) return;
    setBusy(true);
    try {
      await apiJson(`/api/admin/projects?id=${encodeURIComponent(p.id)}`, { method: "DELETE" });
      const fresh = await apiJson<{ projects: Project[] }>("/api/admin/projects");
      reset(fresh.projects);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (p: Project, kind: "banner" | "thumb", file: File) => {
    setUploading(`${p.id}:${kind}`);
    setError("");
    try {
      const { key } = await uploadImage(file, "projects");
      if (kind === "banner") {
        patch(p.id, (x) => ({ ...x, bannerKey: key }));
      } else {
        patch(p.id, (x) => ({
          ...x,
          thumbnails: [...x.thumbnails, { id: `tmp-${Date.now()}`, storageKey: key, sortOrder: x.thumbnails.length }],
        }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal.");
    } finally {
      setUploading(null);
    }
  };

  if (!loaded) return <p className="text-sm text-slate-500 py-8 text-center">Memuat projects…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LangTabs lang={lang} setLang={setLang} />
          <span className="text-xs text-slate-500">{items.length} project</span>
        </div>
        <button
          type="button"
          onClick={addNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#192C56] hover:bg-[#233C70] rounded-xl transition-all"
        >
          <Plus size={14} /> Project baru
        </button>
      </div>

      {error && <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">{error}</p>}

      {items.map((p) => {
        const t = p.i18n[lang] ?? emptyI18n();
        const open = openId === p.id;
        const setT = (k: keyof ProjectI18n, v: string) =>
          patch(p.id, (x) => ({ ...x, i18n: { ...x.i18n, [lang]: { ...(x.i18n[lang] ?? emptyI18n()), [k]: v } } }));
        return (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : p.id)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
            >
              {p.bannerKey ? (
                <img src={mediaUrl(p.bannerKey) ?? ""} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0" />
              ) : (
                <span className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                  <ImagePlus size={18} />
                </span>
              )}
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-bold text-[#0F172A] truncate">
                  {p.i18n.en?.title || p.i18n.id?.title || p.id}
                </span>
                <span className="block text-xs text-slate-500 font-mono">
                  {p.id} · {p.status} · {p.year}
                </span>
              </span>
              {p.isFlagship && <Star size={15} className="text-amber-500 fill-amber-500 shrink-0" />}
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0 ${p.status === "published" || p.status === "flagship" ? "bg-emerald-50 text-emerald-700" : p.status === "draft" ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-[#192C56]"}`}>
                {p.status}
              </span>
            </button>

            {open && (
              <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Field label="Slug / ID">
                    <input value={p.id} disabled className={`${inputCls} font-mono opacity-60`} />
                  </Field>
                  <Field label="Status">
                    <select value={p.status} onChange={(e) => patch(p.id, (x) => ({ ...x, status: e.target.value }))} className={inputCls}>
                      <option value="draft">Draft</option>
                      <option value="pipeline">Pipeline / R&D</option>
                      <option value="published">Published</option>
                      <option value="flagship">Flagship</option>
                      <option value="archived">Archived</option>
                    </select>
                  </Field>
                  <Field label="Tahun">
                    <input value={p.year} onChange={(e) => patch(p.id, (x) => ({ ...x, year: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="Urutan">
                    <input type="number" value={p.sortOrder} onChange={(e) => patch(p.id, (x) => ({ ...x, sortOrder: Number(e.target.value) || 0 }))} className={inputCls} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Platform">
                    <input value={p.platform} onChange={(e) => patch(p.id, (x) => ({ ...x, platform: e.target.value }))} className={inputCls} placeholder="PC / itch.io" />
                  </Field>
                  <Field label="Link distribusi">
                    <input value={p.distributionUrl ?? ""} onChange={(e) => patch(p.id, (x) => ({ ...x, distributionUrl: e.target.value || null }))} className={inputCls} placeholder="https://…" />
                  </Field>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={p.isFlagship} onChange={(e) => patch(p.id, (x) => ({ ...x, isFlagship: e.target.checked }))} className="w-4 h-4 accent-[#192C56]" />
                  Flagship (ditampilkan besar di homepage)
                </label>

                <div className="space-y-3">
                  <Field label={`Judul (${lang.toUpperCase()})`}>
                    <input value={t.title} onChange={(e) => setT("title", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label={`Tipe label (${lang.toUpperCase()})`}>
                    <input value={t.typeLabel} onChange={(e) => setT("typeLabel", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label={`Deskripsi (${lang.toUpperCase()})`}>
                    <textarea rows={3} value={t.description} onChange={(e) => setT("description", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label={`Catatan budaya (${lang.toUpperCase()})`}>
                    <textarea rows={2} value={t.culturalNote} onChange={(e) => setT("culturalNote", e.target.value)} className={inputCls} />
                  </Field>
                </div>

                <div>
                  <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Banner</span>
                  <div className="flex items-center gap-3">
                    {p.bannerKey && <img src={mediaUrl(p.bannerKey) ?? ""} alt="" className="h-16 rounded-lg object-cover bg-slate-100" />}
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#192C56] bg-[#192C56]/5 hover:bg-[#192C56]/10 rounded-xl cursor-pointer transition-all">
                      {uploading === `${p.id}:banner` ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                      Upload banner
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(p, "banner", e.target.files[0])} />
                    </label>
                    {p.bannerKey && (
                      <button type="button" onClick={() => patch(p.id, (x) => ({ ...x, bannerKey: null }))} className="text-xs font-semibold text-red-600 hover:underline">
                        Hapus
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Thumbnails ({p.thumbnails.length})</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {p.thumbnails.map((th) => (
                      <span key={th.id} className="relative group">
                        <img src={mediaUrl(th.storageKey) ?? ""} alt="" className="h-14 rounded-lg object-cover bg-slate-100" />
                        <button
                          type="button"
                          onClick={() => patch(p.id, (x) => ({ ...x, thumbnails: x.thumbnails.filter((t) => t.id !== th.id) }))}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white hidden group-hover:flex items-center justify-center"
                          aria-label="Hapus thumbnail"
                        >
                          <Trash2 size={11} />
                        </button>
                      </span>
                    ))}
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#192C56] bg-[#192C56]/5 hover:bg-[#192C56]/10 rounded-xl cursor-pointer transition-all">
                      {uploading === `${p.id}:thumb` ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                      Tambah
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(p, "thumb", e.target.files[0])} />
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => remove(p)}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                    {p.distributionUrl && (
                      <a href={p.distributionUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#192C56]">
                        <ExternalLink size={12} /> Cek link
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => save(p)}
                    disabled={busy}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-[#192C56] hover:bg-[#233C70] disabled:opacity-50 rounded-xl transition-all"
                  >
                    {busy ? "Menyimpan…" : "Simpan project"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {dirty && <p className="text-[11px] font-mono text-amber-700">Ada perubahan belum disimpan — tekan “Simpan project” di tiap kartu.</p>}
    </div>
  );
};
