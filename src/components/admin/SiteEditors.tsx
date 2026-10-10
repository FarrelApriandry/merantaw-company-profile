import React, { useEffect, useState } from "react";
import { Plus, Trash2, Check, MailOpen } from "lucide-react";
import { apiJson, Field, inputCls, SaveBar, useDirty } from "./ui";

/* ---------- Studio facts ---------- */

interface Fact {
  key: string;
  value: string;
  mode: string;
  note: string;
}

const FACT_LABELS: Record<string, string> = {
  active_core: "Anggota inti aktif",
  network_total: "Total kolaborator (historis)",
  ip_count: "Jumlah HKI",
  partners_count: "Jumlah mitra program",
  founded_year: "Tahun berdiri (untuk hitung tahun dev otomatis)",
  published_count: "Karya terbit (auto dari DB)",
};

export const FactsEditor: React.FC = () => {
  const [facts, setFacts, dirty, markSaved, reset] = useDirty<Fact[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiJson<{ facts: Fact[] }>("/api/admin/site")
      .then((d) => {
        reset(d.facts);
        setLoaded(true);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      const payload: Record<string, { value: string; mode: string }> = {};
      for (const f of facts) payload[f.key] = { value: f.value, mode: f.mode };
      await apiJson("/api/admin/site", { method: "POST", body: JSON.stringify({ facts: payload }) });
      markSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  };

  if (!loaded) return <p className="text-sm text-slate-500 py-8 text-center">Memuat…</p>;

  return (
    <div>
      {error && <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-xl mb-4">{error}</p>}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        {facts.map((f) => (
          <div key={f.key} className="grid grid-cols-1 sm:grid-cols-[1fr_140px_120px] gap-3 items-end">
            <Field label={`${FACT_LABELS[f.key] ?? f.key} (${f.key})`}>
              <input
                value={f.value}
                disabled={f.mode === "auto"}
                onChange={(e) => setFacts((all) => all.map((x) => (x.key === f.key ? { ...x, value: e.target.value } : x)))}
                className={`${inputCls} ${f.mode === "auto" ? "opacity-60" : ""}`}
              />
            </Field>
            <Field label="Mode">
              <select
                value={f.mode}
                onChange={(e) => setFacts((all) => all.map((x) => (x.key === f.key ? { ...x, mode: e.target.value } : x)))}
                className={inputCls}
              >
                <option value="manual">Manual</option>
                <option value="auto">Auto</option>
              </select>
            </Field>
            <p className="text-[11px] text-slate-500 pb-3">{f.note}</p>
          </div>
        ))}
        <p className="text-[11px] text-slate-500">Mode “auto” hanya berlaku untuk karya terbit (dihitung dari project berstatus published/flagship).</p>
      </div>
      <div className="mt-4">
        <SaveBar dirty={dirty} busy={busy} onSave={save} label="Simpan facts" />
      </div>
    </div>
  );
};

/* ---------- Channels ---------- */

interface Channel {
  key: string;
  value: string;
  label: string;
  isLink: boolean;
  sortOrder: number;
}

export const ChannelsEditor: React.FC = () => {
  const [channels, setChannels, dirty, markSaved, reset] = useDirty<Channel[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiJson<{ channels: Channel[] }>("/api/admin/site")
      .then((d) => {
        reset([...d.channels].sort((a, b) => a.sortOrder - b.sortOrder));
        setLoaded(true);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      await apiJson("/api/admin/site", { method: "POST", body: JSON.stringify({ channels }) });
      markSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  };

  if (!loaded) return <p className="text-sm text-slate-500 py-8 text-center">Memuat…</p>;

  return (
    <div>
      {error && <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-xl mb-4">{error}</p>}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        {channels.map((c) => (
          <div key={c.key} className="grid grid-cols-1 sm:grid-cols-[130px_1fr_150px_90px_40px] gap-3 items-end">
            <Field label="Key">
              <input value={c.key} disabled className={`${inputCls} font-mono opacity-60`} />
            </Field>
            <Field label={`Nilai (${c.label})`}>
              <input
                value={c.value}
                onChange={(e) => setChannels((all) => all.map((x) => (x.key === c.key ? { ...x, value: e.target.value } : x)))}
                className={inputCls}
                placeholder={c.isLink ? "https://…" : "teks"}
              />
            </Field>
            <Field label="Label">
              <input
                value={c.label}
                onChange={(e) => setChannels((all) => all.map((x) => (x.key === c.key ? { ...x, label: e.target.value } : x)))}
                className={inputCls}
              />
            </Field>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 pb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={c.isLink}
                onChange={(e) => setChannels((all) => all.map((x) => (x.key === c.key ? { ...x, isLink: e.target.checked } : x)))}
                className="w-4 h-4 accent-[#192C56]"
              />
              Link?
            </label>
            <span className="pb-3 font-mono text-[11px] text-slate-400">#{c.sortOrder}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <SaveBar dirty={dirty} busy={busy} onSave={save} label="Simpan channels" />
      </div>
    </div>
  );
};

/* ---------- Inbox ---------- */

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const InboxEditor: React.FC = () => {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = () =>
    apiJson<{ inquiries: Inquiry[] }>("/api/admin/inquiries")
      .then((d) => {
        setItems(d.inquiries);
        setLoaded(true);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat."));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mark = async (id: string, isRead: boolean) => {
    try {
      await apiJson("/api/admin/inquiries", { method: "PATCH", body: JSON.stringify({ id, isRead }) });
      setItems((all) => all.map((x) => (x.id === id ? { ...x, isRead } : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal update.");
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Hapus pesan ini?")) return;
    try {
      await apiJson(`/api/admin/inquiries?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      setItems((all) => all.filter((x) => x.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
    }
  };

  if (!loaded) return <p className="text-sm text-slate-500 py-8 text-center">Memuat inbox…</p>;

  const shown = filter === "unread" ? items.filter((x) => !x.isRead) : items;
  const unreadCount = items.filter((x) => !x.isRead).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${filter === "all" ? "bg-[#192C56] text-white" : "bg-white text-slate-600 border border-slate-200"}`}
        >
          Semua ({items.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${filter === "unread" ? "bg-[#192C56] text-white" : "bg-white text-slate-600 border border-slate-200"}`}
        >
          Belum dibaca ({unreadCount})
        </button>
      </div>

      {error && <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">{error}</p>}

      {shown.map((m) => {
        const open = openId === m.id;
        return (
          <div key={m.id} className={`bg-white rounded-2xl border overflow-hidden ${m.isRead ? "border-slate-200" : "border-[#192C56]/40 shadow-sm"}`}>
            <button
              type="button"
              onClick={() => {
                setOpenId(open ? null : m.id);
                if (!open && !m.isRead) mark(m.id, true);
              }}
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
            >
              {!m.isRead && <span className="w-2 h-2 rounded-full bg-[#192C56] shrink-0" />}
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-bold text-[#0F172A] truncate">{m.subject}</span>
                <span className="block text-xs text-slate-500 truncate">
                  {m.name} · {m.email} · {new Date(m.createdAt).toLocaleString("id-ID")}
                </span>
              </span>
            </button>
            {open && (
              <div className="px-5 pb-5 pt-1 border-t border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mb-4">{m.message}</p>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#192C56] hover:bg-[#233C70] rounded-xl transition-all"
                  >
                    Balas via email
                  </a>
                  <button
                    type="button"
                    onClick={() => mark(m.id, !m.isRead)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    {m.isRead ? <MailOpen size={14} /> : <Check size={14} />}
                    {m.isRead ? "Tandai belum dibaca" : "Tandai dibaca"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(m.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Plus size={14} className="rotate-45" /> Hapus
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {shown.length === 0 && <p className="text-sm text-slate-500 py-8 text-center">Inbox kosong.</p>}
    </div>
  );
};
