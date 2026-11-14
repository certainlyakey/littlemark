import { spawnSync } from "node:child_process";
import process from "node:process";

// These builds share output directories, so run the two deployments in sequence.
// Never reuse an existing dev server: tests must exercise the published files.
for (const basePath of ["/", "/demo/"]) {
  console.log(`\nBuilding and testing the static demo at ${basePath}`);
  const env = { ...process.env, VITE_BASE_PATH: basePath };
  for (const args of [
    ["run", "build"],
    ["run", "test:e2e:built", ...process.argv.slice(2)],
  ]) {
    const result = spawnSync("bun", args, { env, stdio: "inherit" });
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}
