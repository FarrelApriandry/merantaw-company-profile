import type { APIRoute } from "astro";
import { eq, asc } from "drizzle-orm";
import { db } from "../../../db/client";
import {
  projects,
  projectI18n,
  projectThumbnails,
} from "../../../db/schema";
import { requireAdmin } from "../../../lib/auth";

export const prerender = false;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STATUSES = new Set(["draft", "flagship", "pipeline", "published", "archived"]);

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function bad(msg: string, status = 400) {
  return json({ error: msg }, status);
}

// GET /api/admin/projects -> all projects with i18n + thumbnails
export const GET: APIRoute = async ({ request }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const rows = await db.select().from(projects).orderBy(asc(projects.sortOrder));
  const i18n = await db.select().from(projectI18n);
  const thumbs = await db.select().from(projectThumbnails).orderBy(asc(projectThumbnails.sortOrder));
  return json({
    projects: rows.map((p) => ({
      ...p,
      i18n: Object.fromEntries(i18n.filter((t) => t.projectId === p.id).map((t) => [t.lang, t])),
      thumbnails: thumbs.filter((t) => t.projectId === p.id),
    })),
  });
}

interface I18nBody {
  title?: string;
  typeLabel?: string;
  description?: string;
  culturalNote?: string;
}

// POST /api/admin/projects -> create or update (upsert)
export const POST: APIRoute = async ({ request }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  let body: {
    id?: string;
    status?: string;
    year?: string;
    platform?: string;
    distributionUrl?: string | null;
    bannerKey?: string | null;
    sortOrder?: number;
    isFlagship?: boolean;
    i18n?: { en?: I18nBody; id?: I18nBody };
    thumbnails?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return bad("invalid JSON body");
  }
  const id = (body.id ?? "").trim().slice(0, 120);
  if (!SLUG_RE.test(id)) return bad("id must be a kebab-case slug");
  if (body.status !== undefined && !STATUSES.has(body.status)) return bad("invalid status");

  const now = new Date();
  await db
    .insert(projects)
    .values({
      id,
      status: body.status ?? "draft",
      year: (body.year ?? "").slice(0, 32),
      platform: (body.platform ?? "").slice(0, 200),
      distributionUrl: body.distributionUrl ? body.distributionUrl.slice(0, 500) : null,
      bannerKey: body.bannerKey ? body.bannerKey.slice(0, 500) : null,
      sortOrder: Number.isFinite(body.sortOrder) ? Math.trunc(body.sortOrder!) : 0,
      isFlagship: !!body.isFlagship,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: projects.id,
      set: {
        status: body.status ?? "draft",
        year: (body.year ?? "").slice(0, 32),
        platform: (body.platform ?? "").slice(0, 200),
        distributionUrl: body.distributionUrl ? body.distributionUrl.slice(0, 500) : null,
        bannerKey: body.bannerKey ? body.bannerKey.slice(0, 500) : null,
        sortOrder: Number.isFinite(body.sortOrder) ? Math.trunc(body.sortOrder!) : 0,
        isFlagship: !!body.isFlagship,
        updatedAt: now,
      },
    });

  for (const lang of ["en", "id"] as const) {
    const t = body.i18n?.[lang];
    if (!t) continue;
    await db
      .insert(projectI18n)
      .values({
        projectId: id,
        lang,
        title: (t.title ?? "").slice(0, 300),
        typeLabel: (t.typeLabel ?? "").slice(0, 300),
        description: (t.description ?? "").slice(0, 8000),
        culturalNote: (t.culturalNote ?? "").slice(0, 2000),
      })
      .onConflictDoUpdate({
        target: [projectI18n.projectId, projectI18n.lang],
        set: {
          title: (t.title ?? "").slice(0, 300),
          typeLabel: (t.typeLabel ?? "").slice(0, 300),
          description: (t.description ?? "").slice(0, 8000),
          culturalNote: (t.culturalNote ?? "").slice(0, 2000),
        },
      });
  }

  if (Array.isArray(body.thumbnails)) {
    await db.delete(projectThumbnails).where(eq(projectThumbnails.projectId, id));
    const keys = body.thumbnails.filter((k) => typeof k === "string").slice(0, 12);
    for (let i = 0; i < keys.length; i++) {
      await db.insert(projectThumbnails).values({
        id: crypto.randomUUID(),
        projectId: id,
        storageKey: keys[i].slice(0, 500),
        sortOrder: i,
      });
    }
  }

  return json({ ok: true, id });
};

// DELETE /api/admin/projects?id=slug
export const DELETE: APIRoute = async ({ request, url }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const id = (url.searchParams.get("id") ?? "").trim();
  if (!SLUG_RE.test(id)) return bad("invalid id");
  await db.delete(projectThumbnails).where(eq(projectThumbnails.projectId, id));
  await db.delete(projectI18n).where(eq(projectI18n.projectId, id));
  await db.delete(projects).where(eq(projects.id, id));
  return json({ ok: true });
};
