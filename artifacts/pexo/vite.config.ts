import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import { createEntryDocument } from "./src/lib/site-document.ts";

const rawPort = process.env.PORT;
if (!rawPort) throw new Error("PORT environment variable is required but was not provided.");
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT value: "${rawPort}"`);

const basePath = process.env.BASE_PATH;
if (!basePath) throw new Error("BASE_PATH environment variable is required but was not provided.");

const artifactRoot = path.resolve(import.meta.dirname);

const reactDocumentEntry: Plugin = {
  name: "pexly-react-document-entry",
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      if (request.method !== "GET" || !request.headers.accept?.includes("text/html")) {
        next();
        return;
      }

      const pathname = new URL(request.url ?? "/", "http://vite.local").pathname;
      const extension = path.extname(pathname);
      if (extension && extension.toLowerCase() !== ".html") {
        next();
        return;
      }

      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.setHeader("Cache-Control", "no-cache");
      const document = createEntryDocument({
          basePath,
          development: true,
          entryFile: "src/main.tsx",
        });
      void server
        .transformIndexHtml(pathname, document)
        .then((transformedDocument) => response.end(transformedDocument))
        .catch(next);
    });
  },
  config() {
    return {
      build: {
        rolldownOptions: {
          input: path.resolve(artifactRoot, "src/main.tsx"),
        },
      },
    };
  },
  generateBundle(_options, bundle) {
    const entry = Object.values(bundle).find(
      (output) =>
        output.type === "chunk" &&
        output.isEntry &&
        output.facadeModuleId?.endsWith("/src/main.tsx"),
    );
    if (!entry || entry.type !== "chunk") {
      this.error("Could not find the React application entry bundle.");
    }

    const viteMetadata = (entry as typeof entry & {
      viteMetadata?: { importedCss?: Set<string> };
    }).viteMetadata;
    this.emitFile({
      type: "asset",
      fileName: "runtime-entry.json",
      source: JSON.stringify({
        html: createEntryDocument({
          basePath,
          development: false,
          entryFile: entry.fileName,
          cssFiles: [...(viteMetadata?.importedCss ?? [])],
        }),
      }),
    });
  },
};

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss(), reactDocumentEntry],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      "@noble/hashes/sha256": path.resolve(import.meta.dirname, "node_modules/@noble/hashes/sha2.js"),
      "@noble/hashes/sha512": path.resolve(import.meta.dirname, "node_modules/@noble/hashes/sha2.js"),
      "@noble/hashes/sha3": path.resolve(import.meta.dirname, "node_modules/@noble/hashes/sha3.js"),
      "@noble/hashes/ripemd160": path.resolve(import.meta.dirname, "node_modules/@noble/hashes/legacy.js"),
      "@noble/hashes/hmac": path.resolve(import.meta.dirname, "node_modules/@noble/hashes/hmac.js"),
      "@noble/hashes/utils": path.resolve(import.meta.dirname, "node_modules/@noble/hashes/utils.js"),
      "@noble/hashes/scrypt": path.resolve(import.meta.dirname, "node_modules/@noble/hashes/scrypt.js"),
      "@noble/hashes/pbkdf2": path.resolve(import.meta.dirname, "node_modules/@noble/hashes/pbkdf2.js"),
    },
    dedupe: ["react", "react-dom"],
  },
  define: { global: "globalThis" },
  worker: { format: "es" },
  root: artifactRoot,
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: { strict: true },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
