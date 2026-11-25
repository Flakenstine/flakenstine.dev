// Runs the production build the way the Docker image does: the standalone
// server, with the static files it doesn't copy for itself.
import { cpSync, existsSync } from "node:fs";

if (!existsSync(".next/standalone")) {
  console.error("Run `pnpm build` first.");
  process.exit(1);
}

cpSync("public", ".next/standalone/public", { recursive: true });
cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
process.env.PORT ??= "3000";
await import("../.next/standalone/server.js");
