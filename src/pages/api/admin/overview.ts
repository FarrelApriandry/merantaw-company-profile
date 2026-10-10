import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { projects, news, milestones, inquiries } from "../../../db/schema";
import { requireAdmin } from "../../../lib/auth";

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// GET /api/admin/overview -> honest aggregates for the dashboard overview
export const GET: APIRoute = async ({ request }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const [allProjects, allNews, allMilestones, allInquiries] = await Promise.all([
    db.select({ id: projects.id, status: projects.status, updatedAt: projects.updatedAt }).from(projects),
    db.select({ id: news.id, status: news.status, publishedAt: news.publishedAt, createdAt: news.createdAt }).from(news),
    db.select({ id: milestones.id, yearLabel: milestones.yearLabel }).from(milestones),
    db
      .select({ id: inquiries.id, isRead: inquiries.isRead, createdAt: inquiries.createdAt, name: inquiries.name, subject: inquiries.subject })
      .from(inquiries),
  ]);

  const publishedProjects = allProjects.filter((p) => p.status === "published" || p.status === "flagship").length;
  const draftProjects = allProjects.filter((p) => p.status === "draft" || p.status === "pipeline").length;
  const publishedNews = allNews.filter((n) => n.status === "published").length;
  const draftNews = allNews.filter((n) => n.status === "draft").length;
  const unread = allInquiries.filter((i) => !i.isRead).length;

  const latestNews = [...allNews]
    .sort((a, b) => (b.publishedAt ?? b.createdAt).getTime() - (a.publishedAt ?? a.createdAt).getTime())
    .slice(0, 3)
    .map((n) => ({ id: n.id, status: n.status, date: (n.publishedAt ?? n.createdAt).toISOString() }));

  const latestInquiries = [...allInquiries]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3)
    .map((i) => ({ id: i.id, name: i.name, subject: i.subject, isRead: i.isRead, date: i.createdAt.toISOString() }));

  const recentProjects = [...allProjects]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 3)
    .map((p) => ({ id: p.id, status: p.status }));

  return json({
    counts: {
      projects: allProjects.length,
      publishedProjects,
      draftProjects,
      news: allNews.length,
      publishedNews,
      draftNews,
      milestones: allMilestones.length,
      inquiries: allInquiries.length,
      unread,
    },
    latestNews,
    latestInquiries,
    recentProjects,
  });
};
