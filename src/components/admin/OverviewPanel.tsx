import React, { useEffect, useState } from "react";
import {
  FolderKanban,
  Newspaper,
  Milestone,
  Inbox,
  ArrowRight,
  ArrowUpRight,
  FileWarning,
} from "lucide-react";
import { apiJson, StatCard, TableWrap, StatusBadge, formatDate, SkeletonRows } from "./ui";

type Tab = "projects" | "news" | "milestones" | "site" | "inbox";

interface Overview {
  counts: {
    projects: number;
    publishedProjects: number;
    draftProjects: number;
    news: number;
    publishedNews: number;
    draftNews: number;
    milestones: number;
    inquiries: number;
    unread: number;
  };
  latestNews: { id: string; status: string; date: string }[];
  latestInquiries: { id: string; name: string; subject: string; isRead: boolean; date: string }[];
  recentProjects: { id: string; status: string }[];
}

export const OverviewPanel: React.FC<{ go: (t: Tab) => void }> = ({ go }) => {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiJson<Overview>("/api/admin/overview")
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat ringkasan."));
  }, []);

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-6 text-sm text-red-700">
        Gagal memuat ringkasan: {error}
      </div>
    );
  }

  if (!data) return <SkeletonRows rows={5} />;

  const c = data.counts;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Dashboard / Ringkasan</p>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">Ringkasan konten</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Status terkini seluruh konten situs. Klik kartu untuk langsung mengelola.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          icon={<FolderKanban size={20} />}
          tint="bg-blue-50 text-[#192C56]"
          value={c.projects}
          label="Projects"
          sub={`${c.publishedProjects} terbit · ${c.draftProjects} draf`}
          onClick={() => go("projects")}
        />
        <StatCard
          icon={<Newspaper size={20} />}
          tint="bg-emerald-50 text-emerald-700"
          value={c.news}
          label="Berita"
          sub={`${c.publishedNews} terbit · ${c.draftNews} draf`}
          onClick={() => go("news")}
        />
        <StatCard
          icon={<Milestone size={20} />}
          tint="bg-amber-50 text-amber-700"
          value={c.milestones}
          label="Milestones"
          sub="tampil di homepage"
          onClick={() => go("milestones")}
        />
        <StatCard
          icon={<Inbox size={20} />}
          tint={c.unread > 0 ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500"}
          value={c.unread}
          label="Pesan belum dibaca"
          sub={`${c.inquiries} total pesan`}
          onClick={() => go("inbox")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Berita terbaru</h2>
            <button
              type="button"
              onClick={() => go("news")}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#192C56] hover:underline"
            >
              Kelola <ArrowRight size={12} />
            </button>
          </div>
          {data.latestNews.length === 0 ? (
            <p className="px-4 py-6 text-xs text-slate-500 text-center">Belum ada berita.</p>
          ) : (
            <TableWrap>
              <table className="w-full text-sm">
                <tbody>
                  {data.latestNews.map((n) => (
                    <tr key={n.id} className="border-t border-slate-100 first:border-0 hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-700 truncate max-w-44">{n.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={n.status === "published" ? "Terbit" : "Draf"} />
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 text-right whitespace-nowrap">{formatDate(n.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Pesan masuk terbaru</h2>
            <button
              type="button"
              onClick={() => go("inbox")}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#192C56] hover:underline"
            >
              Buka inbox <ArrowRight size={12} />
            </button>
          </div>
          {data.latestInquiries.length === 0 ? (
            <p className="px-4 py-6 text-xs text-slate-500 text-center">Inbox kosong.</p>
          ) : (
            <TableWrap>
              <table className="w-full text-sm">
                <tbody>
                  {data.latestInquiries.map((m) => (
                    <tr key={m.id} className="border-t border-slate-100 first:border-0 hover:bg-slate-50">
                      <td className="px-4 py-3 min-w-0">
                        <span className="flex items-center gap-2">
                          {!m.isRead && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                          <span className="min-w-0">
                            <span className="block text-xs font-bold text-[#0F172A] truncate">{m.subject || "(tanpa subjek)"}</span>
                            <span className="block text-[11px] text-slate-500 truncate">{m.name}</span>
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 text-right whitespace-nowrap">{formatDate(m.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
        </div>
      </div>

      {(c.draftProjects > 0 || c.draftNews > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5 flex items-start gap-2.5">
          <FileWarning size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-bold">Perlu perhatian:</span> {c.draftProjects} project dan {c.draftNews} berita
            masih berstatus draf — tidak tampil di situs publik sampai diterbitkan.
          </p>
        </div>
      )}

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#192C56] transition-colors"
      >
        <ArrowUpRight size={14} /> Lihat situs publik
      </a>
    </div>
  );
};
