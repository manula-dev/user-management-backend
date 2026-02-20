import {
  handleCreateUser,
  handleDeleteUser,
  handleGetUserById,
  handleGetUsers,
  handleUpdateUser,
} from "../controllers/user.controller.js";

export const userRoutes = {
  "/users": (req, res) => {
    if (req.method === "GET") {
      return handleGetUsers(req, res);
    }

    if (req.method === "POST") {
      return handleCreateUser(req, res);
    }

    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
  },
};

export function handleUserByIdRoute(req, res) {
  const parts = req.url.split("/").filter(Boolean); // removes empty strings
 const id = Number(parts[1]); // 0 = "users", 1 = ID

  if (!Number.isInteger(id) || id <= 0) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Valid user ID is required" }));
  }

  if (req.method === "GET") {
    return handleGetUserById(req, res, id);
  }

  if (req.method === "PUT") {
    return handleUpdateUser(req, res, id);
  }

  if (req.method === "DELETE") {
    return handleDeleteUser(req, res, id);
  }

  res.writeHead(405, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Method Not Allowed" }));
}
