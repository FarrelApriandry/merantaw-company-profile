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
  const plain = bootstrapPassword();
  // Terima salah satu: hash (bila cocok) ATAU plaintext (bila cocok).
  // Ini agar update ADMIN_PASSWORD di .env langsung bisa dipakai login
  // walau ADMIN_PASSWORD_HASH lama masih terset.
  let ok = false;
  if (expected && body.password && verifyPassword(body.password, expected)) ok = true;
  if (!ok && plain && body.password === plain) {
    ok = true;
    console.warn(
      "[admin] BOOTSTRAP LOGIN — pin this hash as ADMIN_PASSWORD_HASH then remove ADMIN_PASSWORD:\n" +
        hashPassword(plain)
    );
  }
  if (!ok) {
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
