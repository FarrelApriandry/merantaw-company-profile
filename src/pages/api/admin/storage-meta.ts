import type { APIRoute } from "astro";
import { requireAdmin } from "../../../lib/auth";

export const prerender = false;

/** Public (admin-only) storage base URL so the dashboard can preview images. No secrets leaked. */
export const GET: APIRoute = async ({ request }) => {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const endpoint = process.env.NEON_STORAGE_ENDPOINT ?? process.env.AWS_ENDPOINT_URL_S3 ?? "";
  return Response.json({ endpoint: endpoint.replace(/\/$/, ""), bucket: "media" });
};
