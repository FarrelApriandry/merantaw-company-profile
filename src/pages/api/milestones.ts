import type { APIRoute } from "astro";
import { eq, desc } from "drizzle-orm";
import { db } from "../../db/client";
import { milestones, milestoneI18n } from "../../db/schema";

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// GET /api/milestones?lang=en|id -> all milestones with i18n, sorted by sortOrder then year
export const GET: APIRoute = async ({ url }) => {
  const lang = (url.searchParams.get("lang") ?? "en") as "en" | "id";
  const rows = await db
    .select()
    .from(milestones)
    .orderBy(milestones.sortOrder);
  const i18n = await db.select().from(milestoneI18n);

  const localized = rows.map((m) => {
    const loc = i18n.find((t) => t.milestoneId === m.id && t.lang === lang);
    return {
      id: m.id,
      yearLabel: m.yearLabel,
      kind: m.kind,
      badgeText: m.badgeText,
      sortOrder: m.sortOrder,
      title: loc?.title ?? "",
      org: loc?.org ?? "",
      description: loc?.description ?? "",
    };
  });

  return json({ milestones: localized });
};