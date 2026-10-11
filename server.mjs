import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteDirectory = path.resolve(projectDirectory, "dist");
const sitePrefix = `${siteDirectory}${path.sep}`;
const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT deve ser um número entre 1 e 65535.");
}

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

const securityHeaders = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "font-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "img-src 'self' data:",
    "object-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
  ].join("; "),
  "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

function respond(response, status, body) {
  response.writeHead(status, {
    ...securityHeaders,
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
    "Content-Type": "text/plain; charset=utf-8",
  });
  response.end(body);
}

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    respond(response, 405, "Método não permitido.");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(request.url ?? "/", "http://localhost").pathname,
    );
  } catch {
    respond(response, 400, "Endereço inválido.");
    return;
  }

  const requestedPath = path.resolve(siteDirectory, `.${pathname}`);
  if (
    requestedPath !== siteDirectory &&
    !requestedPath.startsWith(sitePrefix)
  ) {
    respond(response, 403, "Acesso negado.");
    return;
  }

  let filePath = requestedPath;
  try {
    if ((await stat(filePath)).isDirectory())
      filePath = path.join(filePath, "index.html");
  } catch {
    if (path.extname(pathname)) {
      respond(response, 404, "Arquivo não encontrado.");
      return;
    }
    filePath = path.join(siteDirectory, "index.html");
  }

  let fileInfo;
  try {
    fileInfo = await stat(filePath);
  } catch {
    respond(response, 404, "Arquivo não encontrado.");
    return;
  }
  if (!fileInfo.isFile()) {
    respond(response, 404, "Arquivo não encontrado.");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const isHashedAsset = pathname.startsWith("/assets/");
  response.writeHead(200, {
    ...securityHeaders,
    "Cache-Control": isHashedAsset
      ? "public, max-age=31536000, immutable"
      : "no-cache",
    "Content-Length": fileInfo.size,
    "Content-Type": contentTypes.get(extension) ?? "application/octet-stream",
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  const stream = createReadStream(filePath);
  stream.on("error", () => {
    if (response.headersSent) response.destroy();
    else respond(response, 500, "Não foi possível carregar o arquivo.");
  });
  stream.pipe(response);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Aplicação disponível na porta ${port}.`);
});
