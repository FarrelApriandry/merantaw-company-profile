import { randomBytes, createHash, timingSafeEqual, scryptSync, randomFillSync } from "node:crypto";
import { eq, lt } from "drizzle-orm";
import { db } from "../db/client";
import { adminSessions } from "../db/schema";

const SESSION_COOKIE = "merantaw_admin";
const SESSION_DAYS = 7;

/* ---------- password (scrypt, colon-free modular format) ---------- */

export function hashPassword(password: string, saltHex?: string): string {
  const salt = saltHex ?? randomBytes(16).toString("hex");
  const derived = scryptSync(password, Buffer.from(salt, "hex"), 64) as Buffer;
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, expected] = parts;
  const derived = scryptSync(password, Buffer.from(salt, "hex"), 64) as Buffer;
  const a = derived;
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/* ---------- sessions (DB-backed, hashed tokens) ---------- */

function newToken(): string {
  const buf = Buffer.alloc(32);
  randomFillSync(buf);
  return buf.toString("base64url");
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(): Promise<{ token: string; expiresAt: Date }> {
  const token = newToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 3600 * 1000);
  await db.insert(adminSessions).values({ id: hashToken(token), expiresAt });
  // opportunistic cleanup of expired sessions
  await db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date()));
  return { token, expiresAt };
}

export async function validateSession(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const id = hashToken(token);
  const rows = await db.select().from(adminSessions).where(eq(adminSessions.id, id)).limit(1);
  if (rows.length === 0) return false;
  if (rows[0].expiresAt.getTime() < Date.now()) {
    await db.delete(adminSessions).where(eq(adminSessions.id, id));
    return false;
  }
  return true;
}

export async function destroySession(token: string | undefined | null): Promise<void> {
  if (!token) return;
  await db.delete(adminSessions).where(eq(adminSessions.id, hashToken(token)));
}

export function sessionCookie(token: string, expiresAt: Date): string {
  const maxAge = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; Secure`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function getSessionToken(req: Request): string | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  for (const part of cookie.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === SESSION_COOKIE) return rest.join("=");
  }
  return null;
}

/** Guard for admin API routes. Returns null when authorized, else a 401 Response. */
export async function requireAdmin(req: Request): Promise<Response | null> {
  const ok = await validateSession(getSessionToken(req));
  if (ok) return null;
  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: { "content-type": "application/json" },
  });
}
