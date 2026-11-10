import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.resolve(scriptDirectory, "../dist/public");
const entryPath = path.join(publicRoot, "runtime-entry.json");
const rawPort = process.env.PORT;
if (!rawPort) throw new Error("PORT environment variable is required.");
const port = Number(rawPort);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? "/";
const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
const entry = JSON.parse(await readFile(entryPath, "utf8"));
if (typeof entry.html !== "string" || !entry.html.includes('id="root"')) {
  throw new Error(`Runtime entry document is invalid: ${entryPath}`);
}

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".otf", "font/otf"],
  [".pdf", "application/pdf"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".ttf", "font/ttf"],
  [".wasm", "application/wasm"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function sendDocument(response) {
  response.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-cache",
  });
  response.end(entry.html);
}

async function handleRequest(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  const requestUrl = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  let pathname = decodeURIComponent(requestUrl.pathname);
  if (normalizedBase !== "/" && !pathname.startsWith(normalizedBase)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  if (normalizedBase !== "/") pathname = pathname.slice(normalizedBase.length - 1);
  const extension = path.extname(pathname).toLowerCase();
  const wantsDocument =
    (request.headers.accept ?? "").includes("text/html") &&
    (!extension || extension === ".html");

  if (wantsDocument || pathname === "/" || pathname === "/index.html") {
    sendDocument(response);
    return;
  }

  const relativePath = pathname.replace(/^\/+/, "");
  const filePath = path.resolve(publicRoot, relativePath);
  if (filePath !== publicRoot && !filePath.startsWith(`${publicRoot}${path.sep}`)) {
    response.writeHead(400);
    response.end("Invalid path");
    return;
  }

  let fileStats;
  try {
    fileStats = await stat(filePath);
  } catch {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  if (!fileStats.isFile()) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": mimeTypes.get(extension) ?? "application/octet-stream",
    "Cache-Control": pathname.startsWith("/assets/")
      ? "public, max-age=31536000, immutable"
      : "public, max-age=3600",
    "Content-Length": fileStats.size,
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  createReadStream(filePath).pipe(response);
}

const server = createServer((request, response) => {
  void handleRequest(request, response).catch((error) => {
    console.error("Pexly request failed:", error);
    if (!response.headersSent) response.writeHead(500);
    response.end("Internal server error");
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Pexly server listening on port ${port}`);
});
