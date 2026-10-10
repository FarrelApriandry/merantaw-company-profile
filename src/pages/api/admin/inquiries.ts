import type { APIRoute } from "astro";
import { eq, desc } from "drizzle-orm";
import { db } from "../../../db/client";
import { inquiries } from "../../../db/schema";
import { requireAdmin } from "../../../lib/auth";

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// GET /api/admin/inquiries?unread=1 -> list (newest first)
export const GET: APIRoute = async ({ request, url }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const rows = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(200);
  const unreadOnly = url.searchParams.get("unread") === "1";
  return json({ inquiries: unreadOnly ? rows.filter((r) => !r.isRead) : rows });
};

// PATCH /api/admin/inquiries { id, isRead } -> mark read/unread
export const PATCH: APIRoute = async ({ request }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  let body: { id?: string; isRead?: boolean };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }
  if (!body.id || typeof body.isRead !== "boolean") {
    return json({ error: "id and isRead are required" }, 400);
  }
  await db.update(inquiries).set({ isRead: body.isRead }).where(eq(inquiries.id, body.id));
  return json({ ok: true });
};

// DELETE /api/admin/inquiries?id=uuid
export const DELETE: APIRoute = async ({ request, url }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const id = (url.searchParams.get("id") ?? "").trim();
  if (!id) return json({ error: "invalid id" }, 400);
  await db.delete(inquiries).where(eq(inquiries.id, id));
  return json({ ok: true });
};
