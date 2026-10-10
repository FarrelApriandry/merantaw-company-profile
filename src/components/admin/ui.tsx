import { useEffect, useState } from "react";
import { Search, X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export async function api(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(path, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
  if (res.status === 401 && !path.endsWith("/session")) {
    window.location.href = "/admin/login";
    throw new Error("Sesi berakhir, silakan login ulang.");
  }
  return res;
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await api(path, init);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? `Request gagal (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function uploadImage(file: File, prefix: string): Promise<{ key: string; url: string }> {
  const form = new FormData();
  form.append("file", file);
  form.append("prefix", prefix);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  if (res.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Sesi berakhir, silakan login ulang.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Upload gagal.");
  }
  return res.json();
}

export function formatDate(iso: string | null, lang: "en" | "id" = "id"): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

/* ---------- form bits ---------- */

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-700 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-slate-500 mt-1">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#192C56] focus:ring-2 focus:ring-[#192C56]/25 transition-all placeholder:text-slate-400";

export function LangTabs({ lang, setLang }: { lang: "en" | "id"; setLang: (l: "en" | "id") => void }) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-slate-200 bg-white" role="tablist" aria-label="Bahasa konten">
      {(["id", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          role="tab"
          aria-selected={lang === l}
          onClick={() => setLang(l)}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-md uppercase transition-all ${
            lang === l ? "bg-[#192C56] text-white shadow-sm" : "text-slate-500 hover:text-[#192C56]"
          }`}
        >
          {l === "en" ? "EN" : "ID"}
        </button>
      ))}
    </div>
  );
}

export function FormSection({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
      <div>
        <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">{title}</h3>
        {desc && <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

export function ErrorBanner({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl">
      <AlertCircle size={14} className="shrink-0 mt-0.5" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="hover:text-red-900" aria-label="Tutup error">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

/* ---------- page header ---------- */

export function PageHeader({
  breadcrumb,
  title,
  desc,
  actions,
}: {
  breadcrumb: string;
  title: string;
  desc?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{breadcrumb}</p>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">{title}</h1>
        {desc && <p className="text-xs sm:text-sm text-slate-500 mt-1">{desc}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

/* ---------- stat card ---------- */

export function StatCard({
  icon,
  tint,
  value,
  label,
  sub,
  onClick,
}: {
  icon: React.ReactNode;
  tint: string;
  value: string | number;
  label: string;
  sub?: string;
  onClick?: () => void;
}) {
  const cls = `bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex items-center gap-4 text-left w-full transition-all ${
    onClick ? "hover:border-[#192C56]/40 hover:shadow-md cursor-pointer" : ""
  }`;
  return (
    <button type="button" onClick={onClick} disabled={!onClick} className={cls}>
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tint}`}>{icon}</span>
      <span className="min-w-0">
        <span className="block text-2xl font-extrabold text-[#0F172A] leading-none">{value}</span>
        <span className="block text-xs font-bold text-slate-700 mt-1.5">{label}</span>
        {sub && <span className="block text-[11px] text-slate-500 mt-0.5 truncate">{sub}</span>}
      </span>
    </button>
  );
}

/* ---------- toolbar: search + filter + add ---------- */

export function Toolbar({
  search,
  setSearch,
  searchPlaceholder,
  filterValue,
  setFilterValue,
  filterOptions,
  countLabel,
  addLabel,
  onAdd,
}: {
  search: string;
  setSearch: (v: string) => void;
  searchPlaceholder: string;
  filterValue?: string;
  setFilterValue?: (v: string) => void;
  filterOptions?: { value: string; label: string }[];
  countLabel: string;
  addLabel: string;
  onAdd: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3 mb-4 flex flex-col sm:flex-row sm:items-center gap-2.5">
      <div className="relative flex-1 min-w-0">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className={`${inputCls} pl-9 pr-8`}
          aria-label={searchPlaceholder}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            aria-label="Hapus pencarian"
          >
            <X size={14} />
          </button>
        )}
      </div>
      {filterOptions && setFilterValue && (
        <select
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className={`${inputCls} sm:w-44`}
          aria-label="Filter status"
        >
          {filterOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
      <span className="hidden lg:block text-xs text-slate-500 whitespace-nowrap px-1">{countLabel}</span>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#192C56] hover:bg-[#233C70] rounded-lg transition-all whitespace-nowrap"
      >
        {addLabel}
      </button>
    </div>
  );
}

/* ---------- status badge ---------- */

const STATUS_STYLE: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  flagship: "bg-amber-50 text-amber-700 border-amber-200",
  Terbit: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  Draf: "bg-slate-100 text-slate-600 border-slate-200",
  pipeline: "bg-blue-50 text-blue-700 border-blue-200",
  archived: "bg-stone-100 text-stone-500 border-stone-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border whitespace-nowrap ${
        STATUS_STYLE[status] ?? "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

/* ---------- table shell ---------- */

export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

/* ---------- loading + empty ---------- */

export function SkeletonRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3" aria-label="Memuat">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-lg bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 rounded bg-slate-100 w-2/3" />
            <div className="h-3 rounded bg-slate-100 w-1/3" />
          </div>
          <div className="h-6 w-16 rounded-full bg-slate-100 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  desc,
  actionLabel,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-12 px-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <p className="text-sm font-bold text-[#0F172A]">{title}</p>
      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{desc}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#192C56] hover:bg-[#233C70] rounded-lg transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/* ---------- drawer (slide-over editor) ---------- */

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-[#0F172A]/50" onClick={onClose} />
      <div
        className={`absolute right-0 top-0 h-full w-full ${
          wide ? "max-w-3xl" : "max-w-2xl"
        } bg-white shadow-2xl flex flex-col animate-[slideIn_.18s_ease-out]`}
      >
        <div className="flex items-start gap-3 px-5 sm:px-6 py-4 border-b border-slate-200 shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-extrabold text-[#0F172A] tracking-tight truncate">{title}</h2>
            {subtitle && <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            aria-label="Tutup editor"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-4">{children}</div>
        {footer && (
          <div className="px-5 sm:px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: .5; } to { transform: none; opacity: 1; } }`}</style>
    </div>
  );
}

/* ---------- confirm dialog (replaces window.confirm) ---------- */

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Hapus",
  busy,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-[#0F172A]/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-sm font-extrabold text-[#0F172A]">{title}</h3>
        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-all"
          >
            {busy && <Loader2 size={13} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- save button with feedback ---------- */

export function SaveButton({
  onClick,
  busy,
  justSaved,
  label = "Simpan",
}: {
  onClick: () => void;
  busy: boolean;
  justSaved?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white rounded-lg transition-all disabled:opacity-50 ${
        justSaved ? "bg-emerald-600" : "bg-[#192C56] hover:bg-[#233C70]"
      }`}
    >
      {busy ? (
        <>
          <Loader2 size={14} className="animate-spin" /> Menyimpan…
        </>
      ) : justSaved ? (
        <>
          <CheckCircle2 size={14} /> Tersimpan
        </>
      ) : (
        label
      )}
    </button>
  );
}

/* ---------- dirty tracking ---------- */

export function useDirty<T>(initial: T): [T, React.Dispatch<React.SetStateAction<T>>, boolean, () => void, (v: T) => void] {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);
  const markSaved = (v?: T) => setSaved(v ?? value);
  const reset = (v: T) => {
    setValue(v);
    setSaved(v);
  };
  return [value, setValue, dirty, markSaved, reset];
}

export function useSavedTick(): [boolean, () => void] {
  const [tick, setTick] = useState(false);
  const flash = () => {
    setTick(true);
    window.setTimeout(() => setTick(false), 2200);
  };
  return [tick, flash];
}
