import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import process from "node:process";
import { build, copyPublicAssets, createNitro, prepare } from "nitro/builder";
import { loadEnv } from "vite";

import { normalizeBasePath } from "../src/lib/base-path.ts";

const mode = process.argv[2] ?? "production";
const env = loadEnv(mode, process.cwd(), "VITE_");
const basePath = normalizeBasePath(env["VITE_BASE_PATH"]);

// Keep Nitro's static packaging separate from Vite: the pinned Nitro Vite
// integration attempts to bundle a server entry even for static presets.
const nitro = await createNitro({
  preset: "github_pages",
  builder: "rolldown",
  compatibilityDate: "2026-11-15",
  baseURL: basePath,
  publicAssets: [{ dir: "dist/client", baseURL: "/" }],
  framework: { name: "littlemark", previewCommand: "bun run preview" },
});

try {
  // Fail before replacing the previous output if shell generation failed.
  const shell = await readFile("dist/client/_shell.html", "utf8");
  if (!shell.includes("<html") || !shell.includes("<script")) {
    throw new Error("The TanStack Start SPA shell is missing its HTML or bootstrap scripts.");
  }

  await prepare(nitro);
  await copyPublicAssets(nitro);
  const publicDir = nitro.options.output.publicDir;
  await writeFile(`${publicDir}/index.html`, shell);
  await mkdir(`${publicDir}/design`, { recursive: true });
  await copyFile(`${publicDir}/index.html`, `${publicDir}/design/index.html`);
  await copyFile(`${publicDir}/index.html`, `${publicDir}/404.html`);
  await build(nitro);
  await writeFile(".output/static.json", `${JSON.stringify({ basePath }, null, 2)}\n`);
  console.log(`Static demo ready in .output/public (base path: ${basePath}).`);
} finally {
  await nitro.close();
}
