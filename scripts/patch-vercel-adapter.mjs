// Postinstall patch for @astrojs/vercel (see: Vercel "Cannot find native binding" crash).
//
// The adapter's dist/serverless/middleware.js has a STATIC `import { rolldown }`
// at module top-level. That import leaks into the Lambda server bundle as
// `import "rolldown"`, and at runtime rolldown tries to load its native binary
// binding — which npm's optional-dependencies bug often skips on Vercel — so
// every request crashes with "Cannot find module '@rolldown/binding-wasm32-wasi'".
//
// Rolldown is only ever needed at BUILD time (edge-middleware bundling inside
// generateEdgeMiddleware), never at request time. So we convert the static
// import into a lazy dynamic import executed only when that function runs.
//
// Idempotent: safe to run on every install; skips when already patched or
// when the adapter code changes shape.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "node_modules", "@astrojs", "vercel", "dist", "serverless", "middleware.js");

if (!existsSync(target)) {
  console.log("[patch-vercel-adapter] adapter not installed, skipping");
  process.exit(0);
}

let src = readFileSync(target, "utf8");

if (src.includes("__rolldownFn")) {
  console.log("[patch-vercel-adapter] already patched, skipping");
  process.exit(0);
}

const oldImport = 'import { rolldown } from "rolldown";';
if (!src.includes(oldImport)) {
  console.log("[patch-vercel-adapter] static rolldown import not found (adapter may have fixed it upstream), skipping");
  process.exit(0);
}
src = src.replace(
  oldImport,
  'let __rolldownFn = null;\nasync function getRolldown() { if (!__rolldownFn) { const m = await import("rolldown"); __rolldownFn = m.rolldown; } return __rolldownFn; }',
);

const oldCall = "const bundle = await rolldown({";
if (!src.includes(oldCall)) {
  console.log("[patch-vercel-adapter] rolldown call site not found, skipping");
  process.exit(0);
}
src = src.replace(oldCall, "const rolldown = await getRolldown();\n\tconst bundle = await rolldown({");

writeFileSync(target, src);
console.log("[patch-vercel-adapter] patched middleware.js (lazy rolldown import)");
