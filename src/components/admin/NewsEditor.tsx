import React, { useEffect, useMemo, useState } from "react";
import { Trash2, ImagePlus, Loader2, Pencil, Newspaper, ImageOff, Eye } from "lucide-react";
import {
  apiJson, uploadImage, Field, inputCls, LangTabs, useDirty, useSavedTick,
  PageHeader, Toolbar, TableWrap, StatusBadge, Drawer, ConfirmDialog,
  ErrorBanner, SaveButton, FormSection, EmptyState, SkeletonRows, formatDate,
} from "./ui";

interface NewsI18n {
  title: string;
  excerpt: string;
  body: string;
}

export interface NewsItem {
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

const STATUS_FILTER = [
  { value: "all", label: "Semua status" },
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draf" },
];

function titleOf(n: NewsItem): string {
  return n.i18n.en?.title || n.i18n.id?.title || n.id;
}

export const NewsEditor: React.FC = () => {
  const [items, setItems, dirty, markSaved, reset] = useDirty<NewsItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [lang, setLang] = useState<"en" | "id">("id");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [deleting, setDeleting] = useState<NewsItem | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [savedTick, flashSaved] = useSavedTick();

  useEffect(() => {
    apiJson<{ news: NewsItem[] }>("/api/admin/news")
      .then((d) => {
        reset(d.news);
        setLoaded(true);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((n) => {
      if (statusFilter !== "all" && n.status !== statusFilter) return false;
      if (!q) return true;
      return (
        n.id.toLowerCase().includes(q) ||
        (n.i18n.en?.title ?? "").toLowerCase().includes(q) ||
        (n.i18n.id?.title ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, search, statusFilter]);

  const refresh = async () => {
    const fresh = await apiJson<{ news: NewsItem[] }>("/api/admin/news");
    reset(fresh.news);
    return fresh.news;
  };

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100) || `berita-${Date.now().toString(36)}`;

  const saveEditing = async () => {
    if (!editing) return;
    setBusy(true);
    setError("");
    try {
      await apiJson("/api/admin/news", {
        method: "POST",
        body: JSON.stringify({
          id: editing.id,
          status: editing.status,
          coverKey: editing.coverKey,
          publishedAt: editing.status === "published" ? editing.publishedAt : null,
          i18n: editing.i18n,
        }),
      });
      const fresh = await refresh();
      setEditing(fresh.find((n) => n.id === editing.id) ?? null);
      markSaved();
      flashSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await apiJson(`/api/admin/news?id=${encodeURIComponent(deleting.id)}`, { method: "DELETE" });
      await refresh();
      setDeleting(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (file: File) => {
    if (!editing) return;
    setUploading(editing.id);
    setError("");
    try {
      const { key } = await uploadImage(file, "news");
      setEditing({ ...editing, coverKey: key });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal.");
    } finally {
      setUploading(null);
    }
  };

  const patchEditing = (fn: (n: NewsItem) => NewsItem) => setEditing((e) => (e ? fn(e) : e));

  const newItem = (): NewsItem => ({
    id: `berita-${Date.now().toString(36)}`,
    status: "draft",
    coverKey: null,
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    i18n: { en: emptyI18n(), id: emptyI18n() },
  });

  if (!loaded) {
    return (
      <div>
        <PageHeader breadcrumb="Dashboard / Berita" title="Berita" desc="Artikel & kabar studio — max 3 terbaru tampil di homepage." />
        <SkeletonRows rows={5} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Dashboard / Berita"
        title="Berita"
        desc="Artikel & kabar studio — 3 terbaru yang terbit tampil di homepage."
        actions={<LangTabs lang={lang} setLang={setLang} />}
      />
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <Toolbar
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Cari judul atau slug…"
        filterValue={statusFilter}
        setFilterValue={setStatusFilter}
        filterOptions={STATUS_FILTER}
        countLabel={`${filtered.length} dari ${items.length} berita`}
        addLabel="+ Berita baru"
        onAdd={() => setEditing(newItem())}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<Newspaper size={22} />}
          title="Belum ada berita"
          desc="Tulis kabar studio pertama — mis. pengumuman rilis atau liputan pameran. Terbitkan agar tampil di homepage."
          actionLabel="+ Berita baru"
          onAction={() => setEditing(newItem())}
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Newspaper size={22} />} title="Tidak ada hasil" desc="Coba kata kunci lain atau ubah filter status." />
      ) : (
        <TableWrap>
          <table className="w-full text-sm min-w-150">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Berita</th>
                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Terbit</th>
                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((n) => (
                <tr key={n.id} className="border-t border-slate-100 first:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3 min-w-0">
                      {n.coverKey ? (
                        <img src={mediaUrl(n.coverKey) ?? ""} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0" />
                      ) : (
                        <span className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                          <ImageOff size={18} />
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-[#0F172A] truncate">{titleOf(n)}</span>
                        <span className="block text-[11px] text-slate-500 font-mono truncate">/news/{n.id}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 hidden md:table-cell whitespace-nowrap">{formatDate(n.publishedAt)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={n.status === "published" ? "Terbit" : "Draf"} />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {n.status === "published" && (
                      <a
                        href={`/news/${n.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-[#192C56] hover:bg-slate-100 rounded-lg transition-all"
                        aria-label="Lihat di situs"
                      >
                        <Eye size={13} /> Lihat
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setEditing(n)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#192C56] hover:bg-[#192C56]/5 rounded-lg transition-all"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(n)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={13} /> Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}

      {dirty && (
        <p className="text-[11px] font-semibold text-amber-700 mt-3">
          Ada perubahan yang belum tersimpan — buka berita lalu tekan Simpan.
        </p>
      )}

      <Drawer
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? titleOf(editing) : ""}
        subtitle={editing ? `/news/${editing.id}` : ""}
        wide
        footer={
          <>
            <span className="text-[11px] text-slate-500">
              {editing?.updatedAt && !editing.id.startsWith("berita-") ? `Terakhir diubah ${formatDate(editing.updatedAt)}` : "Item baru — simpan untuk membuat"}
            </span>
            <SaveButton onClick={saveEditing} busy={busy} justSaved={savedTick} label="Simpan berita" />
          </>
        }
      >
        {editing && (
          <>
            <FormSection title="Publikasi" desc="Hanya berita berstatus Terbit yang tampil di situs.">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Status">
                  <select value={editing.status} onChange={(e) => patchEditing((x) => ({ ...x, status: e.target.value }))} className={inputCls}>
                    <option value="draft">Draf</option>
                    <option value="published">Terbit</option>
                  </select>
                </Field>
                <Field label="Tanggal terbit" hint="Otomatis diisi saat diterbitkan bila kosong">
                  <input
                    type="date"
                    value={editing.publishedAt ? editing.publishedAt.slice(0, 10) : ""}
                    onChange={(e) => patchEditing((x) => ({ ...x, publishedAt: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                    className={inputCls}
                  />
                </Field>
                <Field label="Slug / ID" hint="Otomatis dari judul ID saat blur">
                  <input value={editing.id} disabled className={`${inputCls} font-mono opacity-60`} />
                </Field>
              </div>
            </FormSection>

            <FormSection title={`Konten — ${lang.toUpperCase()}`} desc="Isi kedua bahasa sebelum menerbitkan.">
              <Field label="Judul">
                <input
                  value={editing.i18n[lang]?.title ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    patchEditing((x) => ({ ...x, i18n: { ...x.i18n, [lang]: { ...(x.i18n[lang] ?? emptyI18n()), title: v } } }));
                  }}
                  onBlur={(e) => {
                    if (lang === "id" && editing.id.startsWith("berita-") && e.target.value) {
                      const s = slugify(e.target.value);
                      patchEditing((x) => ({ ...x, id: s }));
                    }
                  }}
                  className={inputCls}
                  placeholder={lang === "id" ? "cth. Merantaw Merilis Demo Terbaru" : "e.g. Merantaw Releases New Demo"}
                />
              </Field>
              <Field label="Ringkasan" hint="1–2 kalimat — tampil di kartu homepage">
                <textarea
                  rows={2}
                  value={editing.i18n[lang]?.excerpt ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    patchEditing((x) => ({ ...x, i18n: { ...x.i18n, [lang]: { ...(x.i18n[lang] ?? emptyI18n()), excerpt: v } } }));
                  }}
                  className={inputCls}
                />
              </Field>
              <Field label="Isi artikel" hint="Format markdown: # judul, **tebal**, - list, [teks](https://…)">
                <textarea
                  rows={10}
                  value={editing.i18n[lang]?.body ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    patchEditing((x) => ({ ...x, i18n: { ...x.i18n, [lang]: { ...(x.i18n[lang] ?? emptyI18n()), body: v } } }));
                  }}
                  className={`${inputCls} font-mono`}
                  placeholder={"# Judul\n\nParagraf pembuka…\n\n- Poin satu\n- Poin dua"}
                />
              </Field>
            </FormSection>

            <FormSection title="Gambar sampul" desc="Rasio 16:9 ideal untuk kartu homepage.">
              <div className="flex items-center gap-3">
                {editing.coverKey
                  ? <img src={mediaUrl(editing.coverKey) ?? ""} alt="" className="h-16 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                  : <span className="h-16 w-28 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400"><ImageOff size={18} /></span>}
                <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#192C56] bg-[#192C56]/5 hover:bg-[#192C56]/10 rounded-lg cursor-pointer transition-all">
                  {uploading === editing.id ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                  Upload sampul
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
                </label>
                {editing.coverKey && (
                  <button type="button" onClick={() => patchEditing((x) => ({ ...x, coverKey: null }))} className="text-xs font-semibold text-red-600 hover:underline">
                    Hapus
                  </button>
                )}
              </div>
            </FormSection>
          </>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!deleting}
        title="Hapus berita?"
        message={`"${deleting ? titleOf(deleting) : ""}" akan dihapus permanen beserta seluruh terjemahannya. Tindakan ini tidak bisa dibatalkan.`}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
};
