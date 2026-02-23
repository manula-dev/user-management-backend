import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "mysecret";

export function authenticate(req, res, handler) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Token required" }));
  }

  const token = authHeader.split(" ")[1].trim();

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;

    // 🔹 Super clean console output for easy copy
    console.log(token); // just the token string
    console.log("User ID:", payload.userId);

    return handler(req, res);
  } catch (err) {
    res.writeHead(403, { "Content-Type": "application/json" });
    console.log("❌ Invalid token attempt:", token);
    return res.end(JSON.stringify({ message: "Invalid token" }));
  }
}
