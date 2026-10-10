import type { APIRoute } from "astro";
import { db } from "../../db/client";
import { inquiries } from "../../db/schema";

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }

  const name = (body.name ?? "").trim().slice(0, 200);
  const email = (body.email ?? "").trim().slice(0, 320);
  const subject = (body.subject ?? "").trim().slice(0, 300);
  const message = (body.message ?? "").trim().slice(0, 5000);

  if (!name || !email || !subject || !message) {
    return json({ error: "name, email, subject, and message are required" }, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ error: "invalid email address" }, 400);
  }

  const id = crypto.randomUUID();
  await db.insert(inquiries).values({ id, name, email, subject, message });
  return json({ ok: true, id }, 201);
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
