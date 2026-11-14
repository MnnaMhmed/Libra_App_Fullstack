import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination, paginated } from "../middleware/pagination.js";

export const listActivity = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = getPagination(req.query);
  const search = req.query.search?.trim();
  const where = {
    ...(search ? { OR: [{ action: { contains: search, mode: "insensitive" } }, { entityName: { contains: search, mode: "insensitive" } }] } : {}),
    ...(req.query.entityName ? { entityName: req.query.entityName } : {}),
    ...(req.query.action ? { action: req.query.action.toUpperCase() } : {})
  };
  const [data, total] = await prisma.$transaction([
    prisma.activityLog.findMany({ where, include: { user: { select: { id: true, fullName: true, email: true } } }, skip, take, orderBy: { timestamp: "desc" } }),
    prisma.activityLog.count({ where })
  ]);
  res.json(paginated(data, total, page, limit));
});
