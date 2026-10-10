import React, { useEffect, useState } from "react";
import {
  LayoutDashboard, FolderKanban, Newspaper, Milestone, Settings2, Inbox, LogOut, Menu, X,
} from "lucide-react";
import { ProjectsEditor } from "./ProjectsEditor";
import { NewsEditor } from "./NewsEditor";
import { MilestonesEditor } from "./MilestonesEditor";
import { FactsEditor, ChannelsEditor, InboxEditor } from "./SiteEditors";

type Tab = "projects" | "news" | "milestones" | "site" | "inbox";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "projects", label: "Projects", icon: <FolderKanban size={16} /> },
  { id: "news", label: "Berita", icon: <Newspaper size={16} /> },
  { id: "milestones", label: "Milestones", icon: <Milestone size={16} /> },
  { id: "site", label: "Facts & Channels", icon: <Settings2 size={16} /> },
  { id: "inbox", label: "Inbox", icon: <Inbox size={16} /> },
];

export function mediaUrl(key: string | null, endpoint: string): string | null {
  if (!key) return null;
  if (key.startsWith("http") || key.startsWith("/")) return key;
  return endpoint ? `${endpoint}/media/${key}` : key;
}

export const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<Tab>("projects");
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => (r.ok ? r.json() : { authenticated: false }))
      .then((d) => {
        if (!d?.authenticated) window.location.href = "/admin/login";
        else setReady(true);
      })
      .catch(() => setReady(true));
    fetch("/api/admin/storage-meta")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.endpoint) (window as unknown as { __S3_ENDPOINT?: string }).__S3_ENDPOINT = d.endpoint;
      })
      .catch(() => undefined);
    fetch("/api/admin/inquiries")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.inquiries) setUnread(d.inquiries.filter((x: { isRead: boolean }) => !x.isRead).length);
      })
      .catch(() => undefined);
  }, []);

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  if (!ready) return <p className="text-sm text-slate-500 py-16 text-center">Memeriksa sesi…</p>;

  const Nav = (
    <nav className="space-y-1">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => {
            setTab(t.id);
            setMenuOpen(false);
          }}
          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
            tab === t.id ? "bg-[#192C56] text-white shadow" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {t.icon}
          {t.label}
          {t.id === "inbox" && unread > 0 && (
            <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${tab === "inbox" ? "bg-white text-[#192C56]" : "bg-red-600 text-white"}`}>
              {unread}
            </span>
          )}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-20 bg-[#192C56] text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <img src="/icon.svg" alt="Merantaw" className="w-8 h-8 rounded-lg bg-white p-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold leading-tight">Merantaw Admin</p>
            <p className="text-[11px] text-white/60 font-mono">company profile CMS</p>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <button
            type="button"
            onClick={logout}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 rounded-xl transition-all"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-4 pb-3">
            <div className="bg-white rounded-2xl p-2 text-slate-800">
              {Nav}
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50 rounded-xl mt-1"
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <aside className="hidden md:block">
          <div className="sticky top-20 bg-white rounded-2xl border border-slate-200 p-3">
            <p className="flex items-center gap-1.5 px-4 pt-2 pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <LayoutDashboard size={12} /> Kelola konten
            </p>
            {Nav}
          </div>
        </aside>

        <main className="min-w-0">
          {tab === "projects" && <ProjectsEditor endpoint="" />}
          {tab === "news" && <NewsEditor />}
          {tab === "milestones" && <MilestonesEditor />}
          {tab === "site" && (
            <div className="space-y-6">
              <section>
                <h2 className="text-sm font-bold text-[#0F172A] mb-3">Studio facts (angka homepage)</h2>
                <FactsEditor />
              </section>
              <section>
                <h2 className="text-sm font-bold text-[#0F172A] mb-3">Channels (kontak & sosmed)</h2>
                <ChannelsEditor />
              </section>
            </div>
          )}
          {tab === "inbox" && <InboxEditor />}
          <p className="mt-8 text-center text-[11px] text-slate-400">
            Perubahan tersimpan ke database Neon langsung & tampil setelah refresh halaman publik.
          </p>
        </main>
      </div>
    </div>
  );
};
