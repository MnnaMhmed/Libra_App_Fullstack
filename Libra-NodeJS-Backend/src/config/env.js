import dotenv from "dotenv";
dotenv.config();

const required = ["DATABASE_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`);
}
if (process.env.JWT_ACCESS_SECRET.length < 32 || process.env.JWT_REFRESH_SECRET.length < 32) {
  throw new Error("JWT secrets must be at least 32 characters long.");
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"
};
