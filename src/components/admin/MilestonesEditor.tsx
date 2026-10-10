import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Pencil, Award } from "lucide-react";
import {
  apiJson, Field, inputCls, LangTabs, useDirty, useSavedTick,
  PageHeader, Toolbar, TableWrap, Drawer, ConfirmDialog,
  ErrorBanner, SaveButton, FormSection, EmptyState, SkeletonRows,
} from "./ui";

interface MilestoneI18n {
  title: string;
  org: string;
  description: string;
}

export interface MilestoneItem {
  id: string;
  yearLabel: string;
  kind: string;
  badgeText: string;
  sortOrder: number;
  i18n: Partial<Record<"en" | "id", MilestoneI18n>>;
}

const emptyI18n = (): MilestoneI18n => ({ title: "", org: "", description: "" });

const KIND_OPTIONS = [
  { value: "grant", label: "Grant — hibah / pendanaan" },
  { value: "angel", label: "Angel — investasi" },
  { value: "competition", label: "Competition — lomba / penghargaan" },
  { value: "showcase", label: "Showcase — pameran / demo" },
  { value: "innovation", label: "Innovation — program inovasi" },
  { value: "compliance", label: "Compliance — HKI / legalitas" },
];

const KIND_FILTER = [{ value: "all", label: "Semua jenis" }, ...KIND_OPTIONS.map((k) => ({ value: k.value, label: k.label.split(" — ")[0] }))];

function titleOf(m: MilestoneItem): string {
  return m.i18n.en?.title || m.i18n.id?.title || m.id;
}

export const MilestonesEditor: React.FC = () => {
  const [items, setItems, dirty, markSaved, reset] = useDirty<MilestoneItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [lang, setLang] = useState<"en" | "id">("id");
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState("all");
  const [editing, setEditing] = useState<MilestoneItem | null>(null);
  const [deleting, setDeleting] = useState<MilestoneItem | null>(null);
  const [savedTick, flashSaved] = useSavedTick();

  useEffect(() => {
    apiJson<{ milestones: MilestoneItem[] }>("/api/admin/milestones")
      .then((d) => {
        reset(d.milestones);
        setLoaded(true);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((m) => {
      if (kindFilter !== "all" && m.kind !== kindFilter) return false;
      if (!q) return true;
      return (
        m.id.toLowerCase().includes(q) ||
        (m.i18n.en?.title ?? "").toLowerCase().includes(q) ||
        (m.i18n.id?.title ?? "").toLowerCase().includes(q) ||
        (m.i18n.en?.org ?? "").toLowerCase().includes(q) ||
        (m.i18n.id?.org ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, search, kindFilter]);

  const refresh = async () => {
    const fresh = await apiJson<{ milestones: MilestoneItem[] }>("/api/admin/milestones");
    reset(fresh.milestones);
    return fresh.milestones;
  };

  const saveEditing = async () => {
    if (!editing) return;
    setBusy(true);
    setError("");
    try {
      await apiJson("/api/admin/milestones", {
        method: "POST",
        body: JSON.stringify({
          id: editing.id,
          yearLabel: editing.yearLabel,
          kind: editing.kind,
          badgeText: editing.badgeText,
          sortOrder: editing.sortOrder,
          i18n: editing.i18n,
        }),
      });
      const fresh = await refresh();
      setEditing(fresh.find((m) => m.id === editing.id) ?? null);
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
      await apiJson(`/api/admin/milestones?id=${encodeURIComponent(deleting.id)}`, { method: "DELETE" });
      await refresh();
      setDeleting(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
    } finally {
      setBusy(false);
    }
  };

  const patchEditing = (fn: (m: MilestoneItem) => MilestoneItem) => setEditing((e) => (e ? fn(e) : e));

  const newItem = (): MilestoneItem => ({
    id: `milestone-${Date.now().toString(36)}`,
    yearLabel: String(new Date().getFullYear()),
    kind: "competition",
    badgeText: "",
    sortOrder: items.length + 1,
    i18n: { en: emptyI18n(), id: emptyI18n() },
  });

  if (!loaded) {
    return (
      <div>
        <PageHeader breadcrumb="Dashboard / Milestones" title="Milestones" desc="Linimasa pencapaian studio di homepage." />
        <SkeletonRows rows={5} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Dashboard / Milestones"
        title="Milestones"
        desc="Linimasa pencapaian — penghargaan, hibah, showcase — yang tampil di homepage."
        actions={<LangTabs lang={lang} setLang={setLang} />}
      />
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <Toolbar
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Cari judul atau organisasi…"
        filterValue={kindFilter}
        setFilterValue={setKindFilter}
        filterOptions={KIND_FILTER}
        countLabel={`${filtered.length} dari ${items.length} milestone`}
        addLabel="+ Milestone baru"
        onAdd={() => setEditing(newItem())}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<Award size={22} />}
          title="Belum ada milestone"
          desc="Catat pencapaian pertama — mis. Juara 3 UAD Fair 2025 atau hibah P2MW — agar linimasa homepage terisi."
          actionLabel="+ Milestone baru"
          onAction={() => setEditing(newItem())}
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Award size={22} />} title="Tidak ada hasil" desc="Coba kata kunci lain atau ubah filter jenis." />
      ) : (
        <TableWrap>
          <table className="w-full text-sm min-w-150">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-20">Tahun</th>
                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Milestone</th>
                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Jenis</th>
                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-t border-slate-100 first:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] font-bold text-slate-500 whitespace-nowrap">{m.yearLabel}</td>
                  <td className="px-4 py-3 min-w-0">
                    <span className="block text-sm font-bold text-[#0F172A] truncate">{titleOf(m)}</span>
                    <span className="block text-[11px] text-slate-500 truncate">{m.badgeText || m.i18n.en?.org || m.i18n.id?.org || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 hidden md:table-cell whitespace-nowrap capitalize">{m.kind}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setEditing(m)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#192C56] hover:bg-[#192C56]/5 rounded-lg transition-all"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(m)}
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
          Ada perubahan yang belum tersimpan — buka milestone lalu tekan Simpan.
        </p>
      )}

      <Drawer
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? titleOf(editing) : ""}
        subtitle={editing?.id}
        footer={
          <>
            <span className="text-[11px] text-slate-500">Item baru — simpan untuk membuat</span>
            <SaveButton onClick={saveEditing} busy={busy} justSaved={savedTick} label="Simpan milestone" />
          </>
        }
      >
        {editing && (
          <>
            <FormSection title="Waktu & jenis" desc="Label tahun bebas — bisa rentang seperti 2024–2025.">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Label tahun">
                  <input value={editing.yearLabel} onChange={(e) => patchEditing((x) => ({ ...x, yearLabel: e.target.value }))} className={inputCls} placeholder="2025" />
                </Field>
                <Field label="Urutan tampil">
                  <input type="number" value={editing.sortOrder} onChange={(e) => patchEditing((x) => ({ ...x, sortOrder: Number(e.target.value) || 0 }))} className={inputCls} />
                </Field>
              </div>
              <Field label="Jenis pencapaian" hint="Menentukan ikon yang tampil di linimasa homepage">
                <select value={editing.kind} onChange={(e) => patchEditing((x) => ({ ...x, kind: e.target.value }))} className={inputCls}>
                  {KIND_OPTIONS.map((k) => (
                    <option key={k.value} value={k.value}>{k.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Slug / ID">
                <input value={editing.id} disabled className={`${inputCls} font-mono opacity-60`} />
              </Field>
            </FormSection>

            <FormSection title="Badge" desc="Teks singkat di kartu linimasa — mis. nominal hibah atau peringkat juara. Sama untuk EN & ID.">
              <Field label="Teks badge">
                <input
                  value={editing.badgeText}
                  onChange={(e) => patchEditing((x) => ({ ...x, badgeText: e.target.value }))}
                  className={inputCls}
                  placeholder="cth. Juara 3 · Rp 10.000.000"
                />
              </Field>
            </FormSection>

            <FormSection title={`Konten — ${lang.toUpperCase()}`} desc="Isi kedua bahasa.">
              <Field label="Judul">
                <input
                  value={editing.i18n[lang]?.title ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    patchEditing((x) => ({ ...x, i18n: { ...x.i18n, [lang]: { ...(x.i18n[lang] ?? emptyI18n()), title: v } } }));
                  }}
                  className={inputCls}
                  placeholder={lang === "id" ? "cth. Juara 3 UAD Fair 2025" : "e.g. 3rd Place UAD Fair 2025"}
                />
              </Field>
              <Field label="Organisasi / penyelenggara">
                <input
                  value={editing.i18n[lang]?.org ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    patchEditing((x) => ({ ...x, i18n: { ...x.i18n, [lang]: { ...(x.i18n[lang] ?? emptyI18n()), org: v } } }));
                  }}
                  className={inputCls}
                  placeholder="cth. Universitas Ahmad Dahlan"
                />
              </Field>
              <Field label="Deskripsi singkat">
                <textarea
                  rows={3}
                  value={editing.i18n[lang]?.description ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    patchEditing((x) => ({ ...x, i18n: { ...x.i18n, [lang]: { ...(x.i18n[lang] ?? emptyI18n()), description: v } } }));
                  }}
                  className={inputCls}
                />
              </Field>
            </FormSection>
          </>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!deleting}
        title="Hapus milestone?"
        message={`"${deleting ? titleOf(deleting) : ""}" akan dihapus permanen beserta seluruh terjemahannya. Tindakan ini tidak bisa dibatalkan.`}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
};
