
/*
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

    const handler = routes[path];

    if (handler) {
      handler(req, res);
      return;
    }

    if (path.startsWith("/users/") && path.split("/").length === 3) {
      return withAuth(handleUserByIdRoute)(req, res);
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  });

  return server;
}
 */


import express from "express";
import { authRouter} from "./routes/auth.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { authenticate } from "./middleware/auth.js";

const app = express();

app.use(express.json());

//public routes
app.get("/", (req, res) => {  
  res.send("Welcome to the Home Page");
});

app.get("/about", (req, res) => {
 res.send("This is the About Page");
});

app.get("/health", (req, res) => {
 res.send("ok");     
}); 

// Protected routes (replaces withAuth wrapper)
app.use("/users", authenticate, userRoutes);

// Auth routes (no authentication required) 
app.use("/", authRouter);

// 404 handler 
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export default app;

