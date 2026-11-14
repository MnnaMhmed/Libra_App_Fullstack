import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { signAccessToken, signRefreshToken, hashToken, verifyRefreshToken } from "../utils/tokens.js";
import { recordActivity } from "./activity.service.js";

const safeUser = ({ passwordHash, ...user }) => user;

async function issueTokens(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const decoded = verifyRefreshToken(refreshToken);
  await prisma.refreshToken.create({
    data: { tokenHash: hashToken(refreshToken), userId: user.id, expiresAt: new Date(decoded.exp * 1000) }
  });
  return { accessToken, refreshToken, user: safeUser(user) };
}

export async function register(data) {
  const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) throw new ApiError(409, "Email is already registered.");
  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: { fullName: data.fullName, email: data.email.toLowerCase(), passwordHash, role: "STAFF" }
  });
  await recordActivity({ userId: user.id, action: "REGISTER", entityName: "User", entityId: user.id });
  return issueTokens(user);
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || user.status !== "ACTIVE" || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, "Invalid email or password.");
  }
  await recordActivity({ userId: user.id, action: "LOGIN", entityName: "User", entityId: user.id });
  return issueTokens(user);
}

export async function refresh(refreshToken) {
  if (!refreshToken) throw new ApiError(401, "Refresh token is required.");
  let payload;
  try { payload = verifyRefreshToken(refreshToken); } catch { throw new ApiError(401, "Invalid or expired refresh token."); }
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: hashToken(refreshToken) } });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) throw new ApiError(401, "Refresh token has been revoked or expired.");
  await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
  const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
  if (!user || user.status !== "ACTIVE") throw new ApiError(401, "Account is unavailable.");
  return issueTokens(user);
}

export async function logout(refreshToken) {
  if (!refreshToken) return;
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(refreshToken), revokedAt: null },
    data: { revokedAt: new Date() }
  });
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) throw new ApiError(400, "Current password is incorrect.");
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { passwordHash } }),
    prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } })
  ]);
  await recordActivity({ userId, action: "PASSWORD_CHANGE", entityName: "User", entityId: userId });
}
