import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import process from "node:process";

const root = resolve(".output/public");
const { basePath } = JSON.parse(await readFile(".output/static.json", "utf8"));
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

// Serve the actual Pages artifact, with directory redirects and a real 404
// status for unknown URLs. Do not use an SPA catch-all returning HTTP 200.
const server = createServer(async (request, response) => {
  try {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    const url = new URL(request.url, "http://localhost");
    if (basePath !== "/" && url.pathname === basePath.slice(0, -1)) {
      response.writeHead(301, { Location: `${basePath}${url.search}` }).end();
      return;
    }
    if (!url.pathname.startsWith(basePath)) {
      response.writeHead(404).end("Not Found");
      return;
    }
    const pathname = decodeURIComponent(url.pathname.slice(basePath.length));
    let filename = resolve(root, pathname || ".");
    if (filename !== root && !filename.startsWith(`${root}${sep}`)) {
      response.writeHead(404).end("Not Found");
      return;
    }
    try {
      const info = await stat(filename);
      if (info.isDirectory()) {
        if (!url.pathname.endsWith("/")) {
          response.writeHead(301, { Location: `${url.pathname}/${url.search}` }).end();
          return;
        }
        filename = resolve(filename, "index.html");
      }
      const body = await readFile(filename);
      response.writeHead(200, {
        "Content-Type": types[extname(filename)] ?? "application/octet-stream",
      });
      response.end(request.method === "HEAD" ? undefined : body);
    } catch (error) {
      if (error.code !== "ENOENT" && error.code !== "ENOTDIR") throw error;
      const body = await readFile(resolve(root, "404.html"));
      response.writeHead(404, { "Content-Type": types[".html"] });
      response.end(request.method === "HEAD" ? undefined : body);
    }
  } catch (error) {
    if (error instanceof URIError) {
      response.writeHead(400).end("Bad Request");
      return;
    }
    console.error(error);
    response.writeHead(500).end("Preview server error");
  }
});

const port = Number(process.env.PORT ?? 4173);
const host = process.env.HOST ?? "127.0.0.1";
server.listen(port, host, () => {
  console.log(`Static preview: http://${host}:${port}${basePath}`);
});
