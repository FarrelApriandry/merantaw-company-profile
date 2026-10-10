import type { APIRoute } from "astro";
import { eq, asc } from "drizzle-orm";
import { db } from "../../../db/client";
import { milestones, milestoneI18n } from "../../../db/schema";
import { requireAdmin } from "../../../lib/auth";

export const prerender = false;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KINDS = new Set(["grant", "angel", "competition", "showcase", "innovation", "compliance"]);

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function bad(msg: string, status = 400) {
  return json({ error: msg }, status);
}

// GET /api/admin/milestones
export const GET: APIRoute = async ({ request }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const rows = await db.select().from(milestones).orderBy(asc(milestones.sortOrder));
  const i18n = await db.select().from(milestoneI18n);
  return json({
    milestones: rows.map((m) => ({
      ...m,
      i18n: Object.fromEntries(i18n.filter((t) => t.milestoneId === m.id).map((t) => [t.lang, t])),
    })),
  });
};

interface I18nBody {
  title?: string;
  org?: string;
  description?: string;
}

// POST /api/admin/milestones -> create or update (upsert)
export const POST: APIRoute = async ({ request }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  let body: {
    id?: string;
    yearLabel?: string;
    kind?: string;
    badgeText?: string;
    sortOrder?: number;
    i18n?: { en?: I18nBody; id?: I18nBody };
  };
  try {
    body = await request.json();
  } catch {
    return bad("invalid JSON body");
  }
  const id = (body.id ?? "").trim().slice(0, 120);
  if (!SLUG_RE.test(id)) return bad("id must be a kebab-case slug");
  if (body.kind !== undefined && !KINDS.has(body.kind)) return bad("invalid kind");

  const now = new Date();
  const row = {
    yearLabel: (body.yearLabel ?? "").slice(0, 64),
    kind: body.kind ?? "award",
    badgeText: (body.badgeText ?? "").slice(0, 200),
    sortOrder: Number.isFinite(body.sortOrder) ? Math.trunc(body.sortOrder!) : 0,
    updatedAt: now,
  };
  await db
    .insert(milestones)
    .values({ id, ...row, createdAt: now })
    .onConflictDoUpdate({ target: milestones.id, set: row });

  for (const lang of ["en", "id"] as const) {
    const t = body.i18n?.[lang];
    if (!t) continue;
    const trow = {
      title: (t.title ?? "").slice(0, 300),
      org: (t.org ?? "").slice(0, 300),
      description: (t.description ?? "").slice(0, 4000),
    };
    await db
      .insert(milestoneI18n)
      .values({ milestoneId: id, lang, ...trow })
      .onConflictDoUpdate({ target: [milestoneI18n.milestoneId, milestoneI18n.lang], set: trow });
  }

  return json({ ok: true, id });
};

// DELETE /api/admin/milestones?id=slug
export const DELETE: APIRoute = async ({ request, url }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const id = (url.searchParams.get("id") ?? "").trim();
  if (!SLUG_RE.test(id)) return bad("invalid id");
  await db.delete(milestoneI18n).where(eq(milestoneI18n.milestoneId, id));
  await db.delete(milestones).where(eq(milestones.id, id));
  return json({ ok: true });
};
