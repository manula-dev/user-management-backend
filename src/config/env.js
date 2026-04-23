/*
import "dotenv/config";

function readEnv(name, { required = false, defaultValue } = {}) {
  const rawValue = process.env[name];
  const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;

  if (value) {
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  if (required) {
    throw new Error(`${name} environment variable is required`);
  }

  return undefined;
}

export const env = {
  NODE_ENV: readEnv("NODE_ENV", { defaultValue: "development" }),
  PORT: Number.parseInt(readEnv("PORT", { defaultValue: "3000" }), 10),
  DATABASE_URL: readEnv("DATABASE_URL", { required: true }),
  JWT_SECRET: readEnv("JWT_SECRET", { required: true }),
  ADMIN_SECRET: readEnv("ADMIN_SECRET"),
  CORS_ORIGIN: readEnv("CORS_ORIGIN"),
};
console.log("ENV CHECK:", {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_SECRET: process.env.ADMIN_SECRET,
}); */ 

if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config();
}
function readEnv(name, { required = false, defaultValue } = {}) {
  const rawValue = process.env[name];
  const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;
  if (value) {
    return value;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  if (required) {
    throw new Error(`${name} environment variable is required`);
  }
  return undefined;
}

export const env = {
  NODE_ENV: readEnv("NODE_ENV", { defaultValue: "development" }),
  PORT: Number.parseInt(readEnv("PORT", { defaultValue: "3000" }), 10),
  DATABASE_URL: readEnv("DATABASE_URL", { required: true }),
  JWT_SECRET: readEnv("JWT_SECRET", { required: true }),
  ADMIN_SECRET: readEnv("ADMIN_SECRET"),
  CORS_ORIGIN: readEnv("CORS_ORIGIN"),
};

console.log("ENV CHECK:", {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_SECRET: process.env.ADMIN_SECRET,
});
