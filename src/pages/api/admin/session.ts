import type { APIRoute } from "astro";
import {
  verifyPassword,
  createSession,
  destroySession,
  getSessionToken,
  validateSession,
  sessionCookie,
  clearSessionCookie,
} from "../../../lib/auth";

export const prerender = false;

function json(data: unknown, status = 200, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

// POST /api/admin/session { password } -> login
export const POST: APIRoute = async ({ request }) => {
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedHash) {
    return json({ error: "admin login not configured" }, 500);
  }
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }
  if (!body.password || !verifyPassword(body.password, expectedHash)) {
    // uniform timing-safe-ish failure (scrypt verify runs on non-empty input)
    return json({ error: "invalid credentials" }, 401);
  }
  const { token, expiresAt } = await createSession();
  return json({ ok: true }, 200, { "set-cookie": sessionCookie(token, expiresAt) });
};

// GET /api/admin/session -> { authenticated: boolean }
export const GET: APIRoute = async ({ request }) => {
  const ok = await validateSession(getSessionToken(request));
  return json({ authenticated: ok });
};

// DELETE /api/admin/session -> logout
export const DELETE: APIRoute = async ({ request }) => {
  await destroySession(getSessionToken(request));
  return json({ ok: true }, 200, { "set-cookie": clearSessionCookie() });
};
