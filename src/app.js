import http from "http";
import { handleUserByIdRoute, userRoutes } from "./routes/user.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { authenticate } from "./middleware/auth.js";

function withAuth(handler) {
  return (req, res) => authenticate(req, res, () => handler(req, res));
}
export function createServer() {

  // Wrap user routes with authentication
const protectedUserRoutes = {};
for (const path in userRoutes) {
  protectedUserRoutes[path] = withAuth(userRoutes[path]);
}
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
    ...protectedUserRoutes,
    ...authRoutes,
  };

  const server = http.createServer((req, res) => {
    const rawPath = req.url.split("?")[0];
    const path = rawPath !== "/" ? rawPath.replace(/\/+$/, "") : rawPath;

    if (path.startsWith("/users/") && path.split("/").length === 3) {
      return withAuth(handleUserByIdRoute)(req, res);
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
