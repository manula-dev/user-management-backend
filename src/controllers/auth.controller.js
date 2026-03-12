/*import { authService } from "../services/auth.service.js";

export function handleLogin(req, res) {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const { email, password } = JSON.parse(body);

      const result = await authService.login(email, password);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
} */

 import { authService } from "../services/auth.service.js";
import { signupSchema, loginSchema } from "../schemas/auth.schemas.js";

function getValidationMessage(error) {
  return error?.issues?.[0]?.message || "Invalid request body";
}

// ✅ LOGIN (updated with validation)

export function handleLogin(req, res) {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      let parsedBody;

      try {
        parsedBody = JSON.parse(body || "{}");
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

      const result = loginSchema.safeParse(parsedBody);

      if (!result.success) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            error: getValidationMessage(result.error),
          })
        );
      }

      const loginResult = await authService.login(
        result.data.email,
        result.data.password
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(loginResult));
    } catch (err) {
      console.error("Login error:", err);

      if (res.headersSent) return;

      if (err?.message === "Invalid credentials") {
        res.writeHead(401, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: err.message }));
      }

      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
}



// ✅ SIGNUP (NEW — supports admin secret)

export function handleSignup(req, res) {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      let parsedBody;

      // ✅ protect JSON parsing
      try {
        parsedBody = JSON.parse(body || "{}");
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

      // ✅ SAFE Zod validation (no throw)
      const result = signupSchema.safeParse(parsedBody);

      if (!result.success) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            error: getValidationMessage(result.error),
          })
        );
      }

      const user = await authService.signup(result.data);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
    } catch (err) {
      if (err?.code === "P2002") {
        res.writeHead(409, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Email already exists" }));
      }

      console.error("Signup error:", err);

      if (res.headersSent) return;

      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
}






















