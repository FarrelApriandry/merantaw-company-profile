import type { APIRoute } from "astro";
import {
  verifyPassword,
  hashPassword,
  createSession,
  destroySession,
  getSessionToken,
  validateSession,
  sessionCookie,
  clearSessionCookie,
} from "../../../lib/auth";
import { env } from "../../../lib/env";

export const prerender = false;

// Plaintext bootstrap: ADMIN_PASSWORD (edit di .env / Vercel).
// Hash turunan: ADMIN_PASSWORD_HASH (diutamakan bila diset).
// Saat login pakai plaintext + hash belum diset -> hash dicetak SEKALI ke log
// server agar bisa dipindah ke ADMIN_PASSWORD_HASH, lalu hapus ADMIN_PASSWORD.
function expectedHash(): string | null {
  const h = env("ADMIN_PASSWORD_HASH");
  if (h && h.startsWith("scrypt$")) return h;
  return null;
}

function bootstrapPassword(): string | null {
  const p = env("ADMIN_PASSWORD");
  return p && p.length >= 8 ? p : null;
}

function json(data: unknown, status = 200, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

// POST /api/admin/session { password } -> login
export const POST: APIRoute = async ({ request }) => {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }
  if (!body.password) {
    return json({ error: "invalid credentials" }, 401);
  }

  const expected = expectedHash();
  if (expected) {
    if (!verifyPassword(body.password, expected)) {
      return json({ error: "invalid credentials" }, 401);
    }
  } else {
    // Bootstrap mode: compare against ADMIN_PASSWORD, then emit a one-time
    // hash to the server log so it can be pinned as ADMIN_PASSWORD_HASH.
    const plain = bootstrapPassword();
    if (!plain || body.password !== plain) {
      return json({ error: "invalid credentials" }, 401);
    }
    console.warn(
      "[admin] BOOTSTRAP LOGIN — pin this hash as ADMIN_PASSWORD_HASH then remove ADMIN_PASSWORD:\n" +
        hashPassword(plain)
    );
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
