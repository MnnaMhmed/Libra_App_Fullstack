import * as auth from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { recordActivity } from "../services/activity.service.js";

export const register = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await auth.register(req.body) }));
export const login = asyncHandler(async (req, res) => res.json({ success: true, data: await auth.login(req.body) }));
export const refresh = asyncHandler(async (req, res) => res.json({ success: true, data: await auth.refresh(req.body.refreshToken) }));
export const logout = asyncHandler(async (req, res) => {
  await auth.logout(req.body.refreshToken);
  if (req.user) await recordActivity({ userId: req.user.id, action: "LOGOUT", entityName: "User", entityId: req.user.id });
  res.json({ success: true, message: "Logged out successfully." });
});
export const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, fullName: true, email: true, role: true, status: true, createdAt: true } });
  res.json({ success: true, data: user });
});
export const changePassword = asyncHandler(async (req, res) => {
  await auth.changePassword(req.user.id, req.body);
  res.json({ success: true, message: "Password changed. Please sign in again." });
});
