import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { db } from "../../../db/client";
import { news, newsI18n } from "../../../db/schema";
import { requireAdmin } from "../../../lib/auth";

export const prerender = false;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function bad(msg: string, status = 400) {
  return json({ error: msg }, status);
}

// GET /api/admin/news -> all news with i18n (newest first)
export const GET: APIRoute = async ({ request }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const rows = await db.select().from(news);
  const i18n = await db.select().from(newsI18n);
  rows.sort((a, b) => (b.publishedAt ?? b.createdAt).getTime() - (a.publishedAt ?? a.createdAt).getTime());
  return json({
    news: rows.map((n) => ({
      ...n,
      i18n: Object.fromEntries(i18n.filter((t) => t.newsId === n.id).map((t) => [t.lang, t])),
    })),
  });
};

interface I18nBody {
  title?: string;
  excerpt?: string;
  body?: string;
}

// POST /api/admin/news -> create or update (upsert)
export const POST: APIRoute = async ({ request }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  let body: {
    id?: string;
    status?: string;
    coverKey?: string | null;
    publishedAt?: string | null;
    i18n?: { en?: I18nBody; id?: I18nBody };
  };
  try {
    body = await request.json();
  } catch {
    return bad("invalid JSON body");
  }
  const id = (body.id ?? "").trim().slice(0, 120);
  if (!SLUG_RE.test(id)) return bad("id must be a kebab-case slug");
  if (body.status !== undefined && body.status !== "draft" && body.status !== "published") {
    return bad("invalid status");
  }
  const status = body.status ?? "draft";
  let publishedAt: Date | null = null;
  if (body.publishedAt) {
    const d = new Date(body.publishedAt);
    if (Number.isNaN(d.getTime())) return bad("invalid publishedAt");
    publishedAt = d;
  } else if (status === "published") {
    publishedAt = new Date();
  }

  const now = new Date();
  await db
    .insert(news)
    .values({
      id,
      status,
      coverKey: body.coverKey ? body.coverKey.slice(0, 500) : null,
      publishedAt,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: news.id,
      set: {
        status,
        coverKey: body.coverKey ? body.coverKey.slice(0, 500) : null,
        publishedAt,
        updatedAt: now,
      },
    });

  for (const lang of ["en", "id"] as const) {
    const t = body.i18n?.[lang];
    if (!t) continue;
    await db
      .insert(newsI18n)
      .values({
        newsId: id,
        lang,
        title: (t.title ?? "").slice(0, 300),
        excerpt: (t.excerpt ?? "").slice(0, 600),
        body: (t.body ?? "").slice(0, 60000),
      })
      .onConflictDoUpdate({
        target: [newsI18n.newsId, newsI18n.lang],
        set: {
          title: (t.title ?? "").slice(0, 300),
          excerpt: (t.excerpt ?? "").slice(0, 600),
          body: (t.body ?? "").slice(0, 60000),
        },
      });
  }

  return json({ ok: true, id });
};

// DELETE /api/admin/news?id=slug
export const DELETE: APIRoute = async ({ request, url }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const id = (url.searchParams.get("id") ?? "").trim();
  if (!SLUG_RE.test(id)) return bad("invalid id");
  await db.delete(newsI18n).where(eq(newsI18n.newsId, id));
  await db.delete(news).where(eq(news.id, id));
  return json({ ok: true });
};
