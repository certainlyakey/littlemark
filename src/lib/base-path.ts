export function normalizeBasePath(value: string | undefined): string {
  const path = value?.trim() ?? "";
  if (!path || /^\/*$/.test(path)) return "/";
  if (/[?#\\]/.test(path) || path.includes(":") || path.startsWith("//")) {
    throw new Error("VITE_BASE_PATH must be a URL pathname, such as /littlemark/.");
  }
  const segments = path.split("/").filter(Boolean);
  if (segments.some((segment) => segment === "." || segment === "..")) {
    throw new Error("VITE_BASE_PATH must not contain relative path segments.");
  }
  return `/${segments.join("/")}/`;
}
