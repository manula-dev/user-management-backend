import { authService } from "../services/auth.service.js";
import { signupSchema, loginSchema } from "../schemas/auth.schemas.js";

function getValidationMessage(error) {
  return error?.issues?.[0]?.message || "Invalid request body";
}

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
  } catch (error) {
    console.error("Login error:", error);

    if (error?.message === "Invalid credentials") {
      return res.status(401).json({ error: error.message });
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
  } catch (error) {
    if (error?.code === "P2002") {
      return res.status(409).json({ error: "Email already exists" });
    }

    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
