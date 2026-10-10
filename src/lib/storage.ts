import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";
import { env } from "./env";

export const MEDIA_BUCKET = "media";

let _files: Files | null = null;

export function getFiles(): Files {
  if (!_files) {
    _files = new Files({ adapter: neon({ bucket: MEDIA_BUCKET }) });
  }
  return _files;
}

/** Public read URL for an object key in the public_read bucket. */
export function publicUrl(key: string): string {
  const endpoint = env("AWS_ENDPOINT_URL_S3");
  if (!endpoint) throw new Error("Missing AWS_ENDPOINT_URL_S3");
  return `${endpoint.replace(/\/$/, "")}/${MEDIA_BUCKET}/${key}`;
}

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export function assertImageFile(contentType: string, size: number): void {
  if (!ALLOWED_MIME.has(contentType)) {
    throw new Error(`Unsupported image type: ${contentType}`);
  }
  if (size > 5 * 1024 * 1024) {
    throw new Error("Image too large (max 5 MB)");
  }
}

export function extFor(contentType: string): string {
  switch (contentType) {
    case "image/png": return "png";
    case "image/jpeg": return "jpg";
    case "image/webp": return "webp";
    case "image/gif": return "gif";
    case "image/svg+xml": return "svg";
    default: return "bin";
  }
}
