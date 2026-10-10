import type { APIRoute } from "astro";
import { eq, asc } from "drizzle-orm";
import { db } from "../../db/client";
import {
  projects,
  projectI18n,
  projectThumbnails,
} from "../../db/schema";

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// GET /api/projects?lang=en|id -> published+flagship projects with i18n + thumbnails
export const GET: APIRoute = async ({ url }) => {
  const lang = (url.searchParams.get("lang") ?? "en") as "en" | "id";
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.status, "published"))
    .orderBy(asc(projects.sortOrder));
  // also include flagship
  const flagshipRows = await db
    .select()
    .from(projects)
    .where(eq(projects.status, "flagship"))
    .orderBy(asc(projects.sortOrder));
  const allProjects = [...flagshipRows, ...rows];
  const i18n = await db.select().from(projectI18n);
  const thumbs = await db.select().from(projectThumbnails).orderBy(asc(projectThumbnails.sortOrder));

  const localized = allProjects.map((p) => {
    const loc = i18n.find((t) => t.projectId === p.id && t.lang === lang);
    return {
      id: p.id,
      status: p.status,
      year: p.year,
      platform: p.platform,
      distributionUrl: p.distributionUrl,
      bannerKey: p.bannerKey,
      sortOrder: p.sortOrder,
      isFlagship: p.isFlagship,
      title: loc?.title ?? "",
      typeLabel: loc?.typeLabel ?? "",
      description: loc?.description ?? "",
      culturalNote: loc?.culturalNote ?? "",
      thumbnails: thumbs.filter((t) => t.projectId === p.id).map((t) => t.storageKey),
    };
  });

  return json({ projects: localized });
};