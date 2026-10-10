import { useState } from "react";

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

/* ---------- shared bits ---------- */

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#192C56] focus:ring-2 focus:ring-[#192C56]/25 transition-all";

export function LangTabs({ lang, setLang }: { lang: "en" | "id"; setLang: (l: "en" | "id") => void }) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-full border border-slate-200 bg-slate-50">
      {(["en", "id"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-3 py-1 text-xs font-bold rounded-full uppercase transition-all ${
            lang === l ? "bg-[#192C56] text-white shadow-sm" : "text-slate-500 hover:text-[#192C56]"
          }`}
        >
          {l === "en" ? "EN" : "ID"}
        </button>
      ))}
    </div>
  );
}

export function SaveBar({ dirty, busy, onSave, label = "Simpan perubahan" }: { dirty: boolean; busy: boolean; onSave: () => void; label?: string }) {
  return (
    <div className="sticky bottom-4 flex justify-end">
      <button
        type="button"
        onClick={onSave}
        disabled={!dirty || busy}
        className="px-6 py-3 text-sm font-bold text-white bg-[#192C56] hover:bg-[#233C70] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-lg transition-all"
      >
        {busy ? "Menyimpan…" : label}
      </button>
    </div>
  );
}

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
