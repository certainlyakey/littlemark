import { describe, expect, it } from "vitest";

import { normalizeBasePath } from "./base-path";

describe("Deployment base path", () => {
  it.each([undefined, "", "/", "  /  "])("defaults %j to the domain root", (value) => {
    expect(normalizeBasePath(value)).toBe("/");
  });

  it.each(["demo", "/demo", "/demo/", " /demo/ "])(
    "normalizes %j for assets and navigation",
    (value) => {
      expect(normalizeBasePath(value)).toBe("/demo/");
    },
  );

  it.each([
    "https://example.com/demo",
    "//example.com/demo",
    "/demo?x=1",
    "/demo#hash",
    "/../demo",
    "/demo/./child",
    "/demo\\child",
  ])("rejects an invalid deployment path: %s", (value) => {
    expect(() => normalizeBasePath(value)).toThrow("VITE_BASE_PATH");
  });
});
