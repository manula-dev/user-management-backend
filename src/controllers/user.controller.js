/*
import { userService } from "../services/user.service.js";
import { createUserSchema, updateUserSchema } from "../validators/user.validator.js";

export async function handleGetUsers(req, res) {
  try {
    const users = await userService.getUsers();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}
export async function handleGetUserById(req, res, id) {
  try {
    const user = await userService.getUserById(id);

    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}
export function handleUpdateUser(req, res, id) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    let parsedData;

    try {
      parsedData = JSON.parse(body);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Invalid JSON" }));
    }

    const { error, value } = updateUserSchema.validate(parsedData);

    if (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: error.details[0].message }));
    }

    try {
      const updatedUser = await userService.updateUser(id, value);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(updatedUser));
    } catch (err) {
      if (err.message === "User not found") {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "User not found" }));
      }

      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
}
export async function handleDeleteUser(req, res, id) {
  try {
    await userService.deleteUser(id);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User deleted successfully" }));
  } catch (err) {
    if (err.message === "User not found") {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}
export function handleCreateUser(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    let parsedData;

    try {
      parsedData = JSON.parse(body);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Invalid JSON" }));
    }

    const { error, value } = createUserSchema.validate(parsedData);

    if (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: error.details[0].message }));
    }

    try {
      const newUser = await userService.createUser(value);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newUser));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
}
export async function handleGetMe(req, res) {
try {
  const userId = req.user.userId; // Assuming req.user is populated by authentication middleware
  const user = await userService.getUserById(userId);
  
  if (!user) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "User Not Found" }));
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ user }));
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
} */ 

import { userService } from "../services/user.service.js";
import { createUserSchema, updateUserSchema } from "../validators/user.validator.js";

// Get /users 
export async function getUsers(req, res) {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);  
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// GET /users/:id 
export async function getUserById(req, res) {
  try {
    const { id } = req.params; 
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }   
}

// POST /users
export async function createUser(req, res) {
  const { error, value } = createUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  try {
    const newUser = await userService.createUser(value);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }  
}

// PUT /user/:id
export async function updateUser(req, res) {
  const { id } = req.params;

  const { error, value } = updateUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  try {
    const updatedUser = await userService.updateUser(id, value);
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// DELETE /users/:id 
export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    await userService.deleteUser(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    if (err.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// GET /users/me
export async function getMe(req, res) {
  try {
    const userId = req.user.userId;

    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}     
