import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { studioFacts, channels } from "../../../db/schema";
import { requireAdmin } from "../../../lib/auth";

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function bad(msg: string, status = 400) {
  return json({ error: msg }, status);
}

// GET /api/admin/site -> facts + channels
export const GET: APIRoute = async ({ request }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const facts = await db.select().from(studioFacts);
  const ch = await db.select().from(channels);
  return json({ facts, channels: ch });
};

interface FactBody {
  value?: string;
  mode?: string;
}

// POST /api/admin/site { facts?: Record<key, FactBody>, channels?: Array<{key,value,label,isLink,sortOrder}> }
export const POST: APIRoute = async ({ request }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  let body: {
    facts?: Record<string, FactBody>;
    channels?: Array<{ key?: string; value?: string; label?: string; isLink?: boolean; sortOrder?: number }>;
  };
  try {
    body = await request.json();
  } catch {
    return bad("invalid JSON body");
  }

  if (body.facts) {
    for (const [key, f] of Object.entries(body.facts)) {
      if (!/^[a-z0-9_]{1,64}$/.test(key)) return bad(`invalid fact key: ${key}`);
      if (f.mode !== undefined && f.mode !== "manual" && f.mode !== "auto") {
        return bad(`invalid mode for ${key}`);
      }
      await db
        .insert(studioFacts)
        .values({
          key,
          value: (f.value ?? "").slice(0, 500),
          mode: f.mode ?? "manual",
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: studioFacts.key,
          set: {
            value: (f.value ?? "").slice(0, 500),
            mode: f.mode ?? "manual",
            updatedAt: new Date(),
          },
        });
    }
  }

  if (Array.isArray(body.channels)) {
    for (const c of body.channels.slice(0, 50)) {
      const key = (c.key ?? "").trim().slice(0, 64);
      if (!/^[a-z0-9_]{1,64}$/.test(key)) return bad(`invalid channel key: ${key}`);
      await db
        .insert(channels)
        .values({
          key,
          value: (c.value ?? "").slice(0, 1000),
          label: (c.label ?? "").slice(0, 200),
          isLink: !!c.isLink,
          sortOrder: Number.isFinite(c.sortOrder) ? Math.trunc(c.sortOrder!) : 0,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: channels.key,
          set: {
            value: (c.value ?? "").slice(0, 1000),
            label: (c.label ?? "").slice(0, 200),
            isLink: !!c.isLink,
            sortOrder: Number.isFinite(c.sortOrder) ? Math.trunc(c.sortOrder!) : 0,
            updatedAt: new Date(),
          },
        });
    }
  }

  return json({ ok: true });
};
