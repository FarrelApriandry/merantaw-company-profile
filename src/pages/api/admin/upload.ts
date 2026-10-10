import type { APIRoute } from "astro";
import { randomUUID } from "node:crypto";
import { getFiles, assertImageFile, extFor, publicUrl } from "../../../lib/storage";
import { requireAdmin } from "../../../lib/auth";

export const prerender = false;

// POST /api/admin/upload (multipart form, field: file) -> { key, url }
export const POST: APIRoute = async ({ request }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "invalid multipart body" }, 400);
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return json({ error: "missing file field" }, 400);
  }
  try {
    assertImageFile(file.type, file.size);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "invalid file" }, 400);
  }

  const prefix = ((form.get("prefix") as string) || "uploads").replace(/[^a-z0-9-]/gi, "").slice(0, 32) || "uploads";
  const key = `${prefix}/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${extFor(file.type)}`;
  const buf = Buffer.from(await file.arrayBuffer());

  try {
    await getFiles().upload(key, buf, { contentType: file.type });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "upload failed" }, 500);
  }
  return json({ ok: true, key, url: publicUrl(key) });
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
