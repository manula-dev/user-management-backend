import { handleCreateUser } from "../controllers/user.controller.js"; // use exact export name
import { handleLogin } from "../controllers/auth.controller.js";

export const authRoutes = {
  "/register": (req, res) => {
    if (req.method === "POST") return handleCreateUser(req, res);
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
  },

  "/auth/login": (req, res) => {
    if (req.method === "POST") return handleLogin(req, res);
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
  },
};
