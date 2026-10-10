import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { apiJson, Field, inputCls, LangTabs, useDirty } from "./ui";

interface MilestoneI18n {
  title: string;
  org: string;
  description: string;
}

interface Milestone {
  id: string;
  yearLabel: string;
  kind: string;
  badgeText: string;
  sortOrder: number;
  i18n: Partial<Record<"en" | "id", MilestoneI18n>>;
}

const emptyI18n = (): MilestoneI18n => ({ title: "", org: "", description: "" });

const KIND_ICONS: Record<string, string> = {
  grant: "Building2",
  angel: "DollarSign",
  competition: "Award",
  showcase: "Flag",
  innovation: "Building2",
  compliance: "ShieldCheck",
};

export const MilestonesEditor: React.FC = () => {
  const [items, setItems, dirty, markSaved, reset] = useDirty<Milestone[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "id">("en");

  useEffect(() => {
    apiJson<{ milestones: Milestone[] }>("/api/admin/milestones")
      .then((d) => {
        reset(d.milestones);
        setLoaded(true);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const patch = (id: string, fn: (m: Milestone) => Milestone) =>
    setItems((all) => all.map((m) => (m.id === id ? fn(m) : m)));

  const addNew = () => {
    const id = `milestone-${Date.now().toString(36)}`;
    setItems((all) => [
      ...all,
      { id, yearLabel: String(new Date().getFullYear()), kind: "competition", badgeText: "", sortOrder: all.length + 1, i18n: { en: emptyI18n(), id: emptyI18n() } },
    ]);
    setOpenId(id);
  };

  const save = async (m: Milestone) => {
    setBusy(true);
    setError("");
    try {
      await apiJson("/api/admin/milestones", {
        method: "POST",
        body: JSON.stringify({
          id: m.id, yearLabel: m.yearLabel, kind: m.kind,
          badgeText: m.badgeText, sortOrder: m.sortOrder, i18n: m.i18n,
        }),
      });
      const fresh = await apiJson<{ milestones: Milestone[] }>("/api/admin/milestones");
      reset(fresh.milestones);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (m: Milestone) => {
    if (!window.confirm(`Hapus milestone "${m.id}"?`)) return;
    setBusy(true);
    try {
      await apiJson(`/api/admin/milestones?id=${encodeURIComponent(m.id)}`, { method: "DELETE" });
      const fresh = await apiJson<{ milestones: Milestone[] }>("/api/admin/milestones");
      reset(fresh.milestones);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
    } finally {
      setBusy(false);
    }
  };

  if (!loaded) return <p className="text-sm text-slate-500 py-8 text-center">Memuat milestones…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LangTabs lang={lang} setLang={setLang} />
          <span className="text-xs text-slate-500">{items.length} milestone</span>
        </div>
        <button
          type="button"
          onClick={addNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#192C56] hover:bg-[#233C70] rounded-xl transition-all"
        >
          <Plus size={14} /> Milestone baru
        </button>
      </div>

      {error && <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">{error}</p>}

      {items.map((m) => {
        const t = m.i18n[lang] ?? emptyI18n();
        const open = openId === m.id;
        const setT = (k: keyof MilestoneI18n, v: string) =>
          patch(m.id, (x) => ({ ...x, i18n: { ...x.i18n, [lang]: { ...(x.i18n[lang] ?? emptyI18n()), [k]: v } } }));
        return (
          <div key={m.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : m.id)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
            >
              <span className="font-mono text-[11px] font-bold text-slate-500 shrink-0">{m.yearLabel}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-bold text-[#0F172A] truncate">
                  {m.i18n.en?.title || m.i18n.id?.title || m.id}
                </span>
                <span className="block text-xs text-slate-500 truncate">{m.badgeText}</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0 bg-slate-100 text-slate-600">
                {KIND_ICONS[m.kind] ?? m.kind}
              </span>
            </button>

            {open && (
              <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Field label="Slug / ID">
                    <input value={m.id} disabled className={`${inputCls} font-mono opacity-60`} />
                  </Field>
                  <Field label="Label tahun">
                    <input value={m.yearLabel} onChange={(e) => patch(m.id, (x) => ({ ...x, yearLabel: e.target.value }))} className={inputCls} placeholder="2025 / 2024 - 2025" />
                  </Field>
                  <Field label="Jenis">
                    <select value={m.kind} onChange={(e) => patch(m.id, (x) => ({ ...x, kind: e.target.value }))} className={inputCls}>
                      <option value="grant">Grant</option>
                      <option value="angel">Angel</option>
                      <option value="competition">Competition</option>
                      <option value="showcase">Showcase</option>
                      <option value="innovation">Innovation</option>
                      <option value="compliance">Compliance</option>
                    </select>
                  </Field>
                  <Field label="Urutan">
                    <input type="number" value={m.sortOrder} onChange={(e) => patch(m.id, (x) => ({ ...x, sortOrder: Number(e.target.value) || 0 }))} className={inputCls} />
                  </Field>
                </div>
                <Field label="Badge (mis. Rp 10.000.000 / Juara 3 — sama EN+ID)">
                  <input value={m.badgeText} onChange={(e) => patch(m.id, (x) => ({ ...x, badgeText: e.target.value }))} className={inputCls} />
                </Field>
                <div className="space-y-3">
                  <Field label={`Judul (${lang.toUpperCase()})`}>
                    <input value={t.title} onChange={(e) => setT("title", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label={`Organisasi (${lang.toUpperCase()})`}>
                    <input value={t.org} onChange={(e) => setT("org", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label={`Deskripsi (${lang.toUpperCase()})`}>
                    <textarea rows={2} value={t.description} onChange={(e) => setT("description", e.target.value)} className={inputCls} />
                  </Field>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => remove(m)}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                  <button
                    type="button"
                    onClick={() => save(m)}
                    disabled={busy}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-[#192C56] hover:bg-[#233C70] disabled:opacity-50 rounded-xl transition-all"
                  >
                    {busy ? "Menyimpan…" : "Simpan milestone"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {dirty && <p className="text-[11px] font-mono text-amber-700">Ada perubahan belum disimpan — tekan “Simpan milestone” di tiap kartu.</p>}
    </div>
  );
};
