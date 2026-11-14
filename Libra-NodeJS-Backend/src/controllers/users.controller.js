import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { getPagination, paginated } from "../middleware/pagination.js";
import { recordActivity } from "../services/activity.service.js";

export const listUsers = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = getPagination(req.query);
  const search = req.query.search?.trim();
  const where = search ? { OR: [{ fullName: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] } : {};
  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({ where, skip, take, orderBy: { id: "desc" }, select: { id: true, fullName: true, email: true, role: true, status: true, createdAt: true } }),
    prisma.user.count({ where })
  ]);
  res.json(paginated(data, total, page, limit));
});
export const createUser = asyncHandler(async (req, res) => {
  const { password, ...data } = req.body;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { ...data, email: data.email.toLowerCase(), passwordHash }, select: { id: true, fullName: true, email: true, role: true, status: true } });
  await recordActivity({ userId: req.user.id, action: "CREATE", entityName: "User", entityId: user.id });
  res.status(201).json({ success: true, data: user });
});
export const updateUser = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (id === req.user.id && req.body.status === "INACTIVE") throw new ApiError(400, "You cannot deactivate your own account.");
  const user = await prisma.user.update({ where: { id }, data: { ...req.body, email: req.body.email?.toLowerCase() }, select: { id: true, fullName: true, email: true, role: true, status: true } });
  await recordActivity({ userId: req.user.id, action: "UPDATE", entityName: "User", entityId: id });
  res.json({ success: true, data: user });
});
export const deleteUser = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (id === req.user.id) throw new ApiError(400, "You cannot delete your own account.");
  await prisma.user.delete({ where: { id } });
  await recordActivity({ userId: req.user.id, action: "DELETE", entityName: "User", entityId: id });
  res.json({ success: true, message: "User deleted." });
});
