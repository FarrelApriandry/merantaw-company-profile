/** Single helper to read env in Astro server code (works with .env + shell). */
export function env(name: string): string | undefined {
  try {
    const m = (import.meta as unknown as { env?: Record<string, unknown> }).env?.[name];
    if (typeof m === "string" && m.length > 0) return m;
  } catch {
    // ignore — import.meta may not exist in some runtimes
  }
  const p = (process as unknown as { env?: Record<string, unknown> })?.env?.[name];
  return typeof p === "string" && p.length > 0 ? p : undefined;
}
