import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Star, ImagePlus, Loader2, ExternalLink, Pencil, Newspaper, ImageOff } from "lucide-react";
import {
  apiJson, uploadImage, Field, inputCls, LangTabs, useDirty, useSavedTick,
  PageHeader, Toolbar, TableWrap, StatusBadge, Drawer, ConfirmDialog,
  ErrorBanner, SaveButton, FormSection, EmptyState, SkeletonRows, formatDate,
} from "./ui";

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

export interface Project {
  id: string;
  status: string;
  year: string;
  platform: string;
  distributionUrl: string | null;
  bannerKey: string | null;
  sortOrder: number;
  isFlagship: boolean;
  updatedAt?: string;
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

const STATUS_FILTER = [
  { value: "all", label: "Semua status" },
  { value: "published", label: "Published" },
  { value: "flagship", label: "Flagship" },
  { value: "pipeline", label: "Pipeline" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const STATUS_OPTIONS = ["draft", "pipeline", "published", "flagship", "archived"];

function titleOf(p: Project): string {
  return p.i18n.en?.title || p.i18n.id?.title || p.id;
}

export const ProjectsEditor: React.FC = () => {
  const [items, setItems, dirty, markSaved, reset] = useDirty<Project[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [lang, setLang] = useState<"en" | "id">("id");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [savedTick, flashSaved] = useSavedTick();

  useEffect(() => {
    apiJson<{ projects: Project[] }>("/api/admin/projects")
      .then((d) => {
        reset(d.projects);
        setLoaded(true);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!q) return true;
      return (
        p.id.toLowerCase().includes(q) ||
        (p.i18n.en?.title ?? "").toLowerCase().includes(q) ||
        (p.i18n.id?.title ?? "").toLowerCase().includes(q) ||
        (p.platform ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, search, statusFilter]);

  const refresh = async () => {
    const fresh = await apiJson<{ projects: Project[] }>("/api/admin/projects");
    reset(fresh.projects);
    return fresh.projects;
  };

  const saveEditing = async () => {
    if (!editing) return;
    setBusy(true);
    setError("");
    try {
      await apiJson("/api/admin/projects", {
        method: "POST",
        body: JSON.stringify({
          id: editing.id,
          status: editing.status,
          year: editing.year,
          platform: editing.platform,
          distributionUrl: editing.distributionUrl,
          bannerKey: editing.bannerKey,
          sortOrder: editing.sortOrder,
          isFlagship: editing.isFlagship,
          i18n: editing.i18n,
          thumbnails: editing.thumbnails.map((t) => t.storageKey),
        }),
      });
      const fresh = await refresh();
      setEditing(fresh.find((p) => p.id === editing.id) ?? null);
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
      await apiJson(`/api/admin/projects?id=${encodeURIComponent(deleting.id)}`, { method: "DELETE" });
      await refresh();
      setDeleting(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (kind: "banner" | "thumb", file: File) => {
    if (!editing) return;
    setUploading(`${editing.id}:${kind}`);
    setError("");
    try {
      const { key } = await uploadImage(file, "projects");
      if (kind === "banner") {
        setEditing({ ...editing, bannerKey: key });
      } else {
        setEditing({
          ...editing,
          thumbnails: [...editing.thumbnails, { id: `tmp-${Date.now()}`, storageKey: key, sortOrder: editing.thumbnails.length }],
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal.");
    } finally {
      setUploading(null);
    }
  };

  const patchEditing = (fn: (p: Project) => Project) => setEditing((e) => (e ? fn(e) : e));

  if (!loaded) {
    return (
      <div>
        <PageHeader breadcrumb="Dashboard / Projects" title="Projects" desc="Kelola portofolio game & karya studio." />
        <SkeletonRows rows={5} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Dashboard / Projects"
        title="Projects"
        desc="Portofolio game & karya studio yang tampil di homepage."
        actions={<LangTabs lang={lang} setLang={setLang} />}
      />
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <Toolbar
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Cari judul, slug, atau platform…"
        filterValue={statusFilter}
        setFilterValue={setStatusFilter}
        filterOptions={STATUS_FILTER}
        countLabel={`${filtered.length} dari ${items.length} project`}
        addLabel="+ Project baru"
        onAdd={() => {
          const id = `project-${Date.now().toString(36)}`;
          setEditing({
            id,
            status: "draft",
            year: String(new Date().getFullYear()),
            platform: "",
            distributionUrl: null,
            bannerKey: null,
            sortOrder: items.length + 1,
            isFlagship: false,
            i18n: { en: emptyI18n(), id: emptyI18n() },
            thumbnails: [],
          });
        }}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<Newspaper size={22} />}
          title="Belum ada project"
          desc="Tambahkan project pertama — mis. Nusantara Pasar Bubrah — lengkap dengan banner, deskripsi EN/ID, dan link distribusi."
          actionLabel="+ Project baru"
          onAction={() => {
            const id = `project-${Date.now().toString(36)}`;
            setEditing({
              id, status: "draft", year: String(new Date().getFullYear()), platform: "",
              distributionUrl: null, bannerKey: null, sortOrder: 1, isFlagship: false,
              i18n: { en: emptyI18n(), id: emptyI18n() }, thumbnails: [],
            });
          }}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Newspaper size={22} />}
          title="Tidak ada hasil"
          desc="Coba kata kunci lain atau ubah filter status."
        />
      ) : (
        <TableWrap>
          <table className="w-full text-sm min-w-150">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project</th>
                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Platform</th>
                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Tahun</th>
                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-slate-100 first:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3 min-w-0">
                      {p.bannerKey ? (
                        <img src={mediaUrl(p.bannerKey) ?? ""} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0" />
                      ) : (
                        <span className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                          <ImageOff size={18} />
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-[#0F172A] truncate">{titleOf(p)}</span>
                          {p.isFlagship && <Star size={13} className="text-amber-500 fill-amber-500 shrink-0" />}
                        </span>
                        <span className="block text-[11px] text-slate-500 font-mono truncate">{p.id}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 hidden sm:table-cell whitespace-nowrap">{p.platform || "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 font-mono hidden md:table-cell whitespace-nowrap">{p.year}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setEditing(p)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#192C56] hover:bg-[#192C56]/5 rounded-lg transition-all"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(p)}
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
          Ada perubahan di daftar yang belum tersimpan ke server — buka kartu project lalu tekan Simpan.
        </p>
      )}

      <Drawer
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? titleOf(editing) : ""}
        subtitle={editing?.id}
        wide
        footer={
          <>
            <span className="text-[11px] text-slate-500">
              {editing?.updatedAt ? `Terakhir diubah ${formatDate(editing.updatedAt)}` : "Item baru — simpan untuk membuat"}
            </span>
            <span className="flex items-center gap-2">
              {editing?.distributionUrl && (
                <a
                  href={editing.distributionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-all"
                >
                  <ExternalLink size={13} /> Cek link
                </a>
              )}
              <SaveButton onClick={saveEditing} busy={busy} justSaved={savedTick} label="Simpan project" />
            </span>
          </>
        }
      >
        {editing && (
          <>
            <FormSection title="Publikasi" desc="Status menentukan tampil di situs publik atau tidak.">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Field label="Status">
                  <select value={editing.status} onChange={(e) => patchEditing((x) => ({ ...x, status: e.target.value }))} className={inputCls}>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Tahun">
                  <input value={editing.year} onChange={(e) => patchEditing((x) => ({ ...x, year: e.target.value }))} className={inputCls} />
                </Field>
                <Field label="Urutan tampil">
                  <input type="number" value={editing.sortOrder} onChange={(e) => patchEditing((x) => ({ ...x, sortOrder: Number(e.target.value) || 0 }))} className={inputCls} />
                </Field>
                <Field label="Slug / ID">
                  <input value={editing.id} disabled className={`${inputCls} font-mono opacity-60`} />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input type="checkbox" checked={editing.isFlagship} onChange={(e) => patchEditing((x) => ({ ...x, isFlagship: e.target.checked }))} className="w-4 h-4 accent-[#192C56]" />
                Flagship — ditampilkan besar di homepage
              </label>
            </FormSection>

            <FormSection title={`Konten — ${lang.toUpperCase()}`} desc="Isi kedua bahasa sebelum menerbitkan.">
              <Field label="Judul">
                <input
                  value={editing.i18n[lang]?.title ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    patchEditing((x) => ({ ...x, i18n: { ...x.i18n, [lang]: { ...(x.i18n[lang] ?? emptyI18n()), title: v } } }));
                  }}
                  className={inputCls}
                  placeholder={lang === "id" ? "cth. Nusantara: Pasar Bubrah" : "e.g. Nusantara: Pasar Bubrah"}
                />
              </Field>
              <Field label="Label tipe">
                <input
                  value={editing.i18n[lang]?.typeLabel ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    patchEditing((x) => ({ ...x, i18n: { ...x.i18n, [lang]: { ...(x.i18n[lang] ?? emptyI18n()), typeLabel: v } } }));
                  }}
                  className={inputCls}
                  placeholder="cth. Game aksi-petualangan"
                />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Platform" hint="cth. PC / itch.io / Android">
                  <input value={editing.platform} onChange={(e) => patchEditing((x) => ({ ...x, platform: e.target.value }))} className={inputCls} />
                </Field>
                <Field label="Link distribusi" hint="URL itch.io / Steam / Play Store">
                  <input value={editing.distributionUrl ?? ""} onChange={(e) => patchEditing((x) => ({ ...x, distributionUrl: e.target.value || null }))} className={inputCls} placeholder="https://…" />
                </Field>
              </div>
              <Field label="Deskripsi">
                <textarea
                  rows={4}
                  value={editing.i18n[lang]?.description ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    patchEditing((x) => ({ ...x, i18n: { ...x.i18n, [lang]: { ...(x.i18n[lang] ?? emptyI18n()), description: v } } }));
                  }}
                  className={inputCls}
                />
              </Field>
              <Field label="Catatan budaya" hint="Konteks budaya / cerita di balik karya — opsional">
                <textarea
                  rows={2}
                  value={editing.i18n[lang]?.culturalNote ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    patchEditing((x) => ({ ...x, i18n: { ...x.i18n, [lang]: { ...(x.i18n[lang] ?? emptyI18n()), culturalNote: v } } }));
                  }}
                  className={inputCls}
                />
              </Field>
            </FormSection>

            <FormSection title="Media" desc="Banner tampil besar di homepage; thumbnail tampil di galeri.">
              <div>
                <span className="block text-xs font-bold text-slate-700 mb-2">Banner</span>
                <div className="flex items-center gap-3">
                  {editing.bannerKey
                    ? <img src={mediaUrl(editing.bannerKey) ?? ""} alt="" className="h-16 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                    : <span className="h-16 w-28 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400"><ImageOff size={18} /></span>}
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#192C56] bg-[#192C56]/5 hover:bg-[#192C56]/10 rounded-lg cursor-pointer transition-all">
                    {uploading === `${editing.id}:banner` ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                    Upload banner
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile("banner", e.target.files[0])} />
                  </label>
                  {editing.bannerKey && (
                    <button type="button" onClick={() => patchEditing((x) => ({ ...x, bannerKey: null }))} className="text-xs font-semibold text-red-600 hover:underline">
                      Hapus
                    </button>
                  )}
                </div>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-700 mb-2">Thumbnails ({editing.thumbnails.length})</span>
                <div className="flex flex-wrap items-center gap-2">
                  {editing.thumbnails.map((th) => (
                    <span key={th.id} className="relative group">
                      <img src={mediaUrl(th.storageKey) ?? ""} alt="" className="h-14 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                      <button
                        type="button"
                        onClick={() => patchEditing((x) => ({ ...x, thumbnails: x.thumbnails.filter((t) => t.id !== th.id) }))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white hidden group-hover:flex items-center justify-center"
                        aria-label="Hapus thumbnail"
                      >
                        <Trash2 size={11} />
                      </button>
                    </span>
                  ))}
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#192C56] bg-[#192C56]/5 hover:bg-[#192C56]/10 rounded-lg cursor-pointer transition-all">
                    {uploading === `${editing.id}:thumb` ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    Tambah
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile("thumb", e.target.files[0])} />
                  </label>
                </div>
              </div>
            </FormSection>
          </>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!deleting}
        title="Hapus project?"
        message={`"${deleting ? titleOf(deleting) : ""}" akan dihapus permanen beserta seluruh terjemahan dan thumbnail-nya. Tindakan ini tidak bisa dibatalkan.`}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
};
