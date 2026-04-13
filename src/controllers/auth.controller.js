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
/*
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
} */
import { authService } from "../services/auth.service.js";
import { signupSchema, loginSchema } from "../schemas/auth.schemas.js";

function getValidationMessage(error) {
  return error?.issues?.[0]?.message || "Invalid request body";
}
/*
// ✅ LOGIN
export function handleLogin(req, res) {
  try {
    const result = loginSchema.parse(req.body);

    if (!result.success) {
      return res.status(400).json({ 
        error: getValidationMessage(result.error),
      });
    }

    const loginResult = authService.login(result.data.email, result.data.password);
    
    res.status(200).json(loginResult);
  } catch (err) {
    console.error("Login error:", err);
    
    if (err?.message === "Invalid credentials") {
      return res.status(401).json({ error: err.message });
    }
    
    res.status(500).json({ error: "Internal server error" });
  }
} */
export async function handleLogin(req, res) {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: getValidationMessage(result.error),
      });
    }

    const loginResult = await authService.login(
      result.data.email,
      result.data.password
    );

    return res.status(200).json(loginResult);

  } catch (err) {
    console.error("Login error:", err);

    if (err?.message === "Invalid credentials") {
      return res.status(401).json({ error: err.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function handleSignup(req, res) {
  try {
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: getValidationMessage(result.error),
      });
    }

    const user = await authService.signup(result.data);

    return res.status(201).json(user);

  } catch (err) {
    if (err?.code === "P2002") {
      return res.status(409).json({ error: "Email already exists" });
    }

    console.error("Signup error:", err);

    return res.status(500).json({ error: "Internal server error" });
  }
}
    


















  

































