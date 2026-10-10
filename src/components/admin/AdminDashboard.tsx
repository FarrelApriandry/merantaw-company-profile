import React, { useEffect, useState } from "react";
import {
  LayoutDashboard, FolderKanban, Newspaper, Milestone, Settings2, Inbox, LogOut, Menu, X, ExternalLink,
} from "lucide-react";
import { OverviewPanel } from "./OverviewPanel";
import { ProjectsEditor } from "./ProjectsEditor";
import { NewsEditor } from "./NewsEditor";
import { MilestonesEditor } from "./MilestonesEditor";
import { SitePanel, InboxEditor } from "./SiteEditors";

type Tab = "overview" | "projects" | "news" | "milestones" | "site" | "inbox";

const TABS: { id: Tab; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Ringkasan", desc: "Statistik konten", icon: <LayoutDashboard size={16} /> },
  { id: "projects", label: "Projects", desc: "Portofolio karya", icon: <FolderKanban size={16} /> },
  { id: "news", label: "Berita", desc: "Artikel & kabar", icon: <Newspaper size={16} /> },
  { id: "milestones", label: "Milestones", desc: "Linimasa", icon: <Milestone size={16} /> },
  { id: "site", label: "Pengaturan situs", desc: "Facts & channels", icon: <Settings2 size={16} /> },
  { id: "inbox", label: "Inbox", desc: "Pesan kontak", icon: <Inbox size={16} /> },
];

export const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<Tab>("overview");
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

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-sm text-slate-600">
          <span className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-[#192C56] animate-spin" />
          Memeriksa sesi…
        </div>
      </div>
    );
  }

  const Nav = (
    <nav className="space-y-1" aria-label="Navigasi admin">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => {
            setTab(t.id);
            setMenuOpen(false);
            window.scrollTo({ top: 0 });
          }}
          aria-current={tab === t.id ? "page" : undefined}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-xl transition-all text-left ${
            tab === t.id
              ? "bg-[#192C56] text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]"
          }`}
        >
          <span className={`shrink-0 ${tab === t.id ? "text-white" : "text-slate-400"}`}>{t.icon}</span>
          <span className="flex-1 min-w-0">
            <span className="block font-bold leading-tight">{t.label}</span>
            <span className={`block text-[11px] leading-tight mt-0.5 ${tab === t.id ? "text-white/60" : "text-slate-400"}`}>
              {t.desc}
            </span>
          </span>
          {t.id === "inbox" && unread > 0 && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${tab === "inbox" ? "bg-white text-[#192C56]" : "bg-red-600 text-white"}`}>
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-30 bg-[#192C56] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <a href="/admin" className="flex items-center gap-2.5 flex-1 min-w-0" aria-label="Merantaw Admin">
            <img src="/icon.svg" alt="" className="w-8 h-8 rounded-lg bg-white p-0.5 shrink-0" />
            <span className="min-w-0">
              <span className="block text-sm font-bold leading-tight">Merantaw Admin</span>
              <span className="block text-[11px] text-white/60">
                CMS company profile
              </span>
            </span>
          </a>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <ExternalLink size={13} /> Situs
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <button
            type="button"
            onClick={logout}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 rounded-lg transition-all"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>
        {menuOpen && (
          <div className="lg:hidden px-4 pb-3">
            <div className="bg-white rounded-2xl p-2.5 text-slate-800 shadow-xl">
              {Nav}
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50 rounded-xl mt-1 transition-all"
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[248px_minmax(0,1fr)] gap-6 items-start">
        <aside className="hidden lg:block sticky top-20">
          <div className="bg-white rounded-2xl border border-slate-200 p-3">
            <p className="px-3.5 pt-1.5 pb-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Kelola konten
            </p>
            {Nav}
          </div>
          <p className="mt-4 px-1 text-[11px] text-slate-500 leading-relaxed">
            Perubahan tersimpan ke database Neon dan tampil di situs publik setelah halaman di-refresh.
          </p>
        </aside>

        <main className="min-w-0">
          {tab === "overview" && <OverviewPanel go={(t) => { setTab(t); window.scrollTo({ top: 0 }); }} />}
          {tab === "projects" && <ProjectsEditor />}
          {tab === "news" && <NewsEditor />}
          {tab === "milestones" && <MilestonesEditor />}
          {tab === "site" && <SitePanel />}
          {tab === "inbox" && <InboxEditor />}
        </main>
      </div>
    </div>
  );
};
