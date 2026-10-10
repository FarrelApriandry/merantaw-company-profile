import React, { useEffect, useState } from "react";
import { MailOpen, Check, Trash2, Reply, Search, Inbox as InboxIcon, Globe, Link2 } from "lucide-react";
import {
  apiJson, Field, inputCls, useDirty, useSavedTick,
  PageHeader, TableWrap, StatusBadge, ConfirmDialog,
  ErrorBanner, SaveButton, FormSection, EmptyState, SkeletonRows, formatDate,
} from "./ui";

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
  founded_year: "Tahun berdiri",
  published_count: "Karya terbit",
};

const FACT_HINTS: Record<string, string> = {
  founded_year: "Dipakai menghitung otomatis “tahun pengalaman” di homepage.",
  published_count: "Mode Auto menghitung dari project berstatus published/flagship.",
};

export const FactsEditor: React.FC = () => {
  const [facts, setFacts, dirty, markSaved, reset] = useDirty<Fact[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [savedTick, flashSaved] = useSavedTick();

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
      flashSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  };

  if (!loaded) return <SkeletonRows rows={4} />;

  return (
    <div>
      <ErrorBanner message={error} onDismiss={() => setError("")} />
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-4">
        <table className="w-full text-sm min-w-150">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left">
              <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Metrik</th>
              <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-36">Nilai</th>
              <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-32">Mode</th>
            </tr>
          </thead>
          <tbody>
            {facts.map((f) => (
              <tr key={f.key} className="border-t border-slate-100 first:border-0 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <span className="block text-xs font-bold text-[#0F172A]">{FACT_LABELS[f.key] ?? f.key}</span>
                  <span className="block text-[11px] text-slate-500 font-mono mt-0.5">{f.key}</span>
                  {FACT_HINTS[f.key] && <span className="block text-[11px] text-slate-500 mt-0.5">{FACT_HINTS[f.key]}</span>}
                </td>
                <td className="px-4 py-3">
                  <input
                    value={f.value}
                    disabled={f.mode === "auto"}
                    onChange={(e) => setFacts((all) => all.map((x) => (x.key === f.key ? { ...x, value: e.target.value } : x)))}
                    className={`${inputCls} ${f.mode === "auto" ? "opacity-60" : ""} !py-2`}
                    aria-label={`Nilai ${FACT_LABELS[f.key] ?? f.key}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={f.mode}
                    onChange={(e) => setFacts((all) => all.map((x) => (x.key === f.key ? { ...x, mode: e.target.value } : x)))}
                    className={`${inputCls} !py-2`}
                    aria-label={`Mode ${FACT_LABELS[f.key] ?? f.key}`}
                  >
                    <option value="manual">Manual</option>
                    <option value="auto">Auto</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-500">
          {dirty ? "Ada perubahan belum disimpan." : "Angka ini tampil sebagai metrik di hero homepage."}
        </span>
        <SaveButton onClick={save} busy={busy} justSaved={savedTick} label="Simpan facts" />
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
  const [savedTick, flashSaved] = useSavedTick();

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
      flashSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  };

  if (!loaded) return <SkeletonRows rows={6} />;

  return (
    <div>
      <ErrorBanner message={error} onDismiss={() => setError("")} />
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-4">
        <table className="w-full text-sm min-w-170">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left">
              <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-32">Key</th>
              <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nilai</th>
              <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-40 hidden md:table-cell">Label</th>
              <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-20 text-center">Link</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((c) => (
              <tr key={c.key} className="border-t border-slate-100 first:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">{c.key}</td>
                <td className="px-4 py-3 min-w-44">
                  <span className="flex items-center gap-2">
                    {c.isLink
                      ? <Link2 size={13} className="text-slate-400 shrink-0" />
                      : <Globe size={13} className="text-slate-400 shrink-0" />}
                    <input
                      value={c.value}
                      onChange={(e) => setChannels((all) => all.map((x) => (x.key === c.key ? { ...x, value: e.target.value } : x)))}
                      className={`${inputCls} !py-2`}
                      placeholder={c.isLink ? "https://…" : "teks"}
                      aria-label={`Nilai ${c.key}`}
                    />
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <input
                    value={c.label}
                    onChange={(e) => setChannels((all) => all.map((x) => (x.key === c.key ? { ...x, label: e.target.value } : x)))}
                    className={`${inputCls} !py-2`}
                    aria-label={`Label ${c.key}`}
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={c.isLink}
                    onChange={(e) => setChannels((all) => all.map((x) => (x.key === c.key ? { ...x, isLink: e.target.checked } : x)))}
                    className="w-4 h-4 accent-[#192C56]"
                    aria-label={`${c.key} adalah link`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-500">
          {dirty ? "Ada perubahan belum disimpan." : "Kontak & sosmed di footer dan halaman kontak."}
        </span>
        <SaveButton onClick={save} busy={busy} justSaved={savedTick} label="Simpan channels" />
      </div>
    </div>
  );
};

/* ---------- Site tab shell ---------- */

export const SitePanel: React.FC = () => {
  const [section, setSection] = useState<"facts" | "channels">("facts");
  return (
    <div>
      <PageHeader
        breadcrumb="Dashboard / Pengaturan situs"
        title="Pengaturan situs"
        desc="Angka metrik homepage dan daftar kontak / media sosial."
        actions={
          <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-slate-200 bg-white">
            {(
              [
                { id: "facts", label: "Facts" },
                { id: "channels", label: "Channels" },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
                  section === s.id ? "bg-[#192C56] text-white shadow-sm" : "text-slate-500 hover:text-[#192C56]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        }
      />
      {section === "facts" ? <FactsEditor /> : <ChannelsEditor />}
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
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Inquiry | null>(null);
  const [busy, setBusy] = useState(false);

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

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await apiJson(`/api/admin/inquiries?id=${encodeURIComponent(deleting.id)}`, { method: "DELETE" });
      setItems((all) => all.filter((x) => x.id !== deleting.id));
      setDeleting(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus.");
    } finally {
      setBusy(false);
    }
  };

  if (!loaded) {
    return (
      <div>
        <PageHeader breadcrumb="Dashboard / Inbox" title="Inbox" desc="Pesan dari formulir kontak situs." />
        <SkeletonRows rows={5} />
      </div>
    );
  }

  const q = search.trim().toLowerCase();
  const shown = items.filter((m) => {
    if (filter === "unread" && m.isRead) return false;
    if (!q) return true;
    return (
      m.subject.toLowerCase().includes(q) ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });
  const unreadCount = items.filter((x) => !x.isRead).length;

  return (
    <div>
      <PageHeader
        breadcrumb="Dashboard / Inbox"
        title="Inbox"
        desc="Pesan dari formulir kontak — klik baris untuk membaca & membalas."
        actions={
          <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-slate-200 bg-white">
            {(
              [
                { id: "all", label: `Semua (${items.length})` },
                { id: "unread", label: `Belum dibaca (${unreadCount})` },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                  filter === f.id ? "bg-[#192C56] text-white shadow-sm" : "text-slate-500 hover:text-[#192C56]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
      />
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <div className="bg-white rounded-2xl border border-slate-200 p-3 mb-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, subjek, atau isi pesan…"
            className={`${inputCls} pl-9`}
            aria-label="Cari pesan"
          />
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<InboxIcon size={22} />}
          title="Inbox kosong"
          desc="Belum ada pesan dari formulir kontak. Pesan baru otomatis masuk ke sini dan menaikkan badge di sidebar."
        />
      ) : shown.length === 0 ? (
        <EmptyState icon={<InboxIcon size={22} />} title="Tidak ada hasil" desc="Coba kata kunci lain atau ubah filter." />
      ) : (
        <TableWrap>
          <table className="w-full text-sm min-w-160">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pesan</th>
                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Tanggal</th>
                <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((m) => {
                const open = openId === m.id;
                return (
                  <React.Fragment key={m.id}>
                    <tr
                      onClick={() => {
                        setOpenId(open ? null : m.id);
                        if (!open && !m.isRead) mark(m.id, true);
                      }}
                      className={`border-t border-slate-100 first:border-0 hover:bg-slate-50 cursor-pointer transition-colors ${
                        !m.isRead ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <td className="px-4 py-3 min-w-0">
                        <span className="flex items-center gap-2.5">
                          {!m.isRead && <span className="w-2 h-2 rounded-full bg-[#192C56] shrink-0" aria-label="Belum dibaca" />}
                          <span className="min-w-0">
                            <span className={`block text-sm truncate ${m.isRead ? "font-semibold text-slate-700" : "font-bold text-[#0F172A]"}`}>
                              {m.subject || "(tanpa subjek)"}
                            </span>
                            <span className="block text-[11px] text-slate-500 truncate">
                              {m.name} · {m.email}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 hidden md:table-cell whitespace-nowrap">{formatDate(m.createdAt)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={m.isRead ? "Dibaca" : "Baru"} />
                      </td>
                    </tr>
                    {open && (
                      <tr className="bg-slate-50/60">
                        <td colSpan={3} className="px-4 sm:px-6 py-4">
                          <FormSection title="Isi pesan" desc={`${m.name} <${m.email}> · ${formatDate(m.createdAt)}`}>
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-white border border-slate-200 rounded-lg p-3.5">{m.message}</p>
                          </FormSection>
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <a
                              href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#192C56] hover:bg-[#233C70] rounded-lg transition-all"
                            >
                              <Reply size={13} /> Balas via email
                            </a>
                            <button
                              type="button"
                              onClick={() => mark(m.id, !m.isRead)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-lg transition-all"
                            >
                              {m.isRead ? <MailOpen size={13} /> : <Check size={13} />}
                              {m.isRead ? "Tandai belum dibaca" : "Tandai dibaca"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleting(m)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={13} /> Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </TableWrap>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Hapus pesan?"
        message={`Pesan dari "${deleting?.name ?? ""}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
};
