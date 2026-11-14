import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../services/activity.service.js";

export const getProfile = asyncHandler(async (req, res) => {
  const data = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, fullName: true, email: true, role: true, status: true, createdAt: true, updatedAt: true } });
  res.json({ success: true, data });
});
export const updateProfile = asyncHandler(async (req, res) => {
  const data = await prisma.user.update({ where: { id: req.user.id }, data: { ...req.body, email: req.body.email?.toLowerCase() }, select: { id: true, fullName: true, email: true, role: true, status: true } });
  await recordActivity({ userId: req.user.id, action: "UPDATE", entityName: "Profile", entityId: req.user.id });
  res.json({ success: true, data });
});
