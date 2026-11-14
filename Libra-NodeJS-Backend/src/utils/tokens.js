import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { env } from "../config/env.js";

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, env.accessSecret, { expiresIn: env.accessExpiresIn });
}
export function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, type: "refresh" }, env.refreshSecret, { expiresIn: env.refreshExpiresIn });
}
export function verifyAccessToken(token) {
  return jwt.verify(token, env.accessSecret);
}
export function verifyRefreshToken(token) {
  return jwt.verify(token, env.refreshSecret);
}
export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
