
// app.js
/*
import http from "http";
import { handleUserByIdRoute, userRoutes } from "./routes/user.routes.js";
import { authRoutes} from "./routes/auth.routes.js";
import { authenticate } from "./middleware/auth.js";

function withAuth(handle) {
    return (req, res) => authenticate(req, res, () =>  handle(req, res)); 
}
export function createServer() {
   // wrap user routes with authentication 
   const protectedUserRoutes = {};
   for ( const path in userRoutes) {
     protectedUserRoutes[path] = withAuth(userRoutes[path]);  
   }
   const routes = {
     "/": (req, res) => {
       res.writeHead(200, { "content-type": "text/plain" });
       res.end("Welcome to the Home Page");        
     },
     "/health": (req, res) => {
       res.writeHead(200, { "content-type": "text/plain"});
       res.end("ok"); 
     },
     "/about": (req, res) => {
       res.writeHead(200, { "content-type": "text/plain"});
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

       if (path.startsWith("/user") && path.split("/").length === 3) {
         return withAuth(handleUserByIdRoute)(req, res);   
       }

       res.writeHead(404, {"Content-type": "application/json" });
       res.end(JSON.stringify({ error: "Not Found" }));
    });
    
    return server; 
}

///////  server.js 

  process.on("unhandledRejection", err => {
  console.error("UNHANDLED REJECTION:", err);
});

  process.on("uncaughtException", err => {
  console.error("UNCAUGHT EXCEPTION:", err);
});    

import "dotenv/config";
import { createServer } from "./app.js";

const server = createServer();

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
   console.log("Server started successfully!");
});



/////// user.routes.js

import {
  handleCreateUser,
  handleDeleteUser,
  handleUpdateUser,
  handleGetUsers,
  handleGetMe,
  handleGetUserById,
} from "../controllers/user.controller.js";

export const userRoutes = {
  "/users": (req, res) => {
    if (req.method === "GET") {
      return handleGetUsers(req, res);
    }

    if (req.method === "POST") {
      return handleCreateUser(req, res);
    }

    res.writeHead(405, {"content-type": "application/json" });
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
  },
  "/users/me": (req, res) => {
    if (req.method === "GET") {
      return handleGetMe(req, res);
    }

    res.writeHead(405, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Method Not Allowed" })); 
  },
};

export function handleUserByIdRoute(req, res)  {
   const parts = req.url.split("/").filter(Boolean); // removes empty strings 
   const id = Number(parts[1]); // 0 = "users", 1 = ID 

   if (!Number.isInteger(id) || id <= 0) {
     res.writeHead(400, { "content-type": "application/json" });
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

   res.writeHead(405, { "content-type": "application/json" });
   res.end(JSON.stringify({ error: "Method Not Allowed"} ));
}


// user.controller.js

import { userService } from "../services/user.service.js";
import { createUserSchema, updateUserSchema } from "../validator/user.validator.js";

export async function handleGetUsers(req, res) {
  try {
    const users = await userService.getUsers();
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(users));
  } catch (err) {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }

 export async function handleGetUserById(req, res, id) {
  try {
    const user = await userService.getUserByid(id);
    if (!user) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }

    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (err) {
    res.writeHead(500, { "content-type": "application/json" });
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
      res.writeHead(400, { "content-type": "application/json" });
      return res.end(JSON.stringify({ error: "Invalid JSON" }));
    }
    
    const { error, value } = updateUserSchema.validate(parsedData);

    if(error) {
      res.writeHead(400, { "content-type": "application/json" });
      return res.end(JSON.stringify({ error: error.details[0].message }));
    }  

    try {
      const updatedUser = await userService.updateUser(id, value);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(updatedUser));
    } catch (err) {
      if (err.message === "User not found") {
        res.writeHead(404, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "User not found" }));
      }

      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
}  
  
export function handleDeleteUser(req, res, id) {
  try {
  await userService.deleteUser(id);
  res.writeHead(200, { "content-type": "application/json"});
  res.end(JSON.stringify({ message: "User deleted successfully" }));  
  } catch (err) {
  if (err.message === "User not found") {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "User not found" }));    
  }
  
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }  
}

  export async function handleCreateUser(req, res) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    
    req.on("end", async () => {
      let parsedData;

      try {
        parsedData = JSON.parse(body);
      } catch {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));  
      }
      
      const { error, value } = createUserSchema.validate(parsedData);

      if (error) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: error.details[0].message }));
      }
      
      try {
        const newUser = await userService.createUser(value);
        res.writeHead(201, { "content-type": "application/json" });
        res.end(JSON.stringify(newUser));
      } catch (err) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    });
  }
  
  export async function handleGetMe(req, res) {
    try {
      const userId = req.user.userId;
      const user = await userService.getUserByid(userId);

      if (!user) {
        res.writeHead(404, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "User not found" }));
        return;
      }

      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(user));
      } catch (err) {
        console.error("Error fetching user data:", err);
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
  }    

  // 

*/















    









































