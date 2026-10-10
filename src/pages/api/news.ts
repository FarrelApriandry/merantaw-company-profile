import type { APIRoute } from "astro";
import { eq, desc } from "drizzle-orm";
import { db } from "../../db/client";
import { news, newsI18n } from "../../db/schema";

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// GET /api/news?lang=en|id -> published news with i18n
export const GET: APIRoute = async ({ url }) => {
  const lang = (url.searchParams.get("lang") ?? "en") as "en" | "id";
  const rows = await db
    .select()
    .from(news)
    .where(eq(news.status, "published"))
    .orderBy(desc(news.publishedAt));
  const i18n = await db.select().from(newsI18n);

  const localized = rows.map((n) => {
    const loc = i18n.find((t) => t.newsId === n.id && t.lang === lang);
    return {
      id: n.id,
      status: n.status,
      coverKey: n.coverKey,
      publishedAt: n.publishedAt,
      title: loc?.title ?? "",
      excerpt: loc?.excerpt ?? "",
      body: loc?.body ?? "",
    };
  });

  return json({ news: localized });
};