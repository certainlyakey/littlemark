import { readFileSync } from "node:fs";
import process from "node:process";
import { defineConfig, devices } from "@playwright/test";

// Test the path baked into the artifact, not the caller's current environment.
// `test:e2e` builds first; `test:e2e:built` deliberately checks an existing build.
const { basePath } = JSON.parse(readFileSync(".output/static.json", "utf8")) as {
  basePath: string;
};
const variant = basePath === "/" ? "root" : "subpath";
const baseURL = `http://127.0.0.1:4175${basePath}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env["CI"]),
  retries: process.env["CI"] ? 1 : 0,
  timeout: 30_000,
  outputDir: `test-results/${variant}`,
  reporter: [
    ["list"],
    ["json", { outputFile: `test-results/${variant}/results.json` }],
    ["html", { outputFolder: `playwright-report/${variant}`, open: "never" }],
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "bun run preview",
    url: baseURL,
    env: { HOST: "127.0.0.1", PORT: "4175" },
    reuseExistingServer: false,
    timeout: 15_000,
  },
});
