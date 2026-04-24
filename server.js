import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PORT = Number(process.env.PORT || 4173);
const ROOT = process.cwd();

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const target = decoded === "/" ? "/index.html" : decoded;
  const normalized = normalize(target).replace(/^(\.\.[/\\])+/, "");
  return join(ROOT, normalized);
}

createServer(async (req, res) => {
  const filePath = safePath(req.url || "/");
  const extension = extname(filePath);

  try {
    const content = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    res.end(content);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}).listen(PORT, () => {
  console.log(`Workout Tracker running at http://localhost:${PORT}`);
});
