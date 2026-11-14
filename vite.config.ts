import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

import { normalizeBasePath } from "./src/lib/base-path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const base = normalizeBasePath(env["VITE_BASE_PATH"]);

  return {
    base,
    plugins: [
      tailwindcss(),
      tanstackStart({
        router: { basepath: base },
        spa: { enabled: true },
        prerender: { autoStaticPathsDiscovery: false, crawlLinks: false },
      }),
      react(),
    ],
    resolve: {
      tsconfigPaths: true,
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
  };
});
