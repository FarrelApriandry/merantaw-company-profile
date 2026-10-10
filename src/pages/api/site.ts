import type { APIRoute } from "astro";
import { or, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { studioFacts, channels, projects } from "../../db/schema";
import { env } from "../../lib/env";

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// GET /api/site -> studio facts + channels (merged with static fallback)
export const GET: APIRoute = async () => {
  const factsRows = await db.select().from(studioFacts);
  const channelRows = await db
    .select()
    .from(channels)
    .orderBy(channels.sortOrder);

  // Compute auto values
  const factsMap: Record<string, { value: string; mode: string }> = {};
  for (const f of factsRows) factsMap[f.key] = { value: f.value, mode: f.mode };

  // Auto: published_count from projects
  if (factsMap.published_count?.mode === "auto") {
    const rows = await db
      .select({ id: projects.id })
      .from(projects)
      .where(or(eq(projects.status, "published"), eq(projects.status, "flagship")));
    factsMap.published_count = { ...factsMap.published_count, value: String(rows.length) };
  }

  // Auto: years_dev from founded_year
  if (factsMap.years_dev?.mode === "auto" && factsMap.founded_year) {
    const founded = parseInt(factsMap.founded_year.value, 10);
    if (!isNaN(founded)) {
      const years = new Date().getFullYear() - founded + 1;
      factsMap.years_dev = { ...factsMap.years_dev, value: `${years}+` };
    }
  }

  return json({
    facts: factsMap,
    mediaBase: ((env("AWS_ENDPOINT_URL_S3") ?? env("NEON_STORAGE_ENDPOINT") ?? "").replace(/\/$/, "")) + "/media",
    channels: channelRows.map((c) => ({
      key: c.key,
      value: c.value,
      label: c.label,
      isLink: c.isLink,
      sortOrder: c.sortOrder,
    })),
  });
};