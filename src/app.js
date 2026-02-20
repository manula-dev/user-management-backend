import http from "http";
import { handleUserByIdRoute, userRoutes } from "./routes/user.routes.js";

export function createServer() {
  const routes = {
    "/": (req, res) => {
      res.writeHead(200, { "content-type": "text/plain" });
      res.end("Welcome to the Home Page");
    },
    "/health": (req, res) => {
      res.writeHead(200, { "content-type": "text/plain" });
      res.end("ok");
    },
    "/about": (req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("About Page");
    },
    ...userRoutes,
  };

  const server = http.createServer((req, res) => {
    const rawPath = req.url.split("?")[0];
    const path = rawPath !== "/" ? rawPath.replace(/\/+$/, "") : rawPath;

    if (path.startsWith("/users/") && path.split("/").length === 3) {
      return handleUserByIdRoute(req, res);
    }

    const handler = routes[path];

    if (handler) {
      handler(req, res);
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  });

  return server;
}
