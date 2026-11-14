import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { getPagination, paginated } from "../middleware/pagination.js";
import { recordActivity } from "../services/activity.service.js";

const models = {
  members: { model: "member", searchable: ["firstName", "lastName", "email", "phoneNumber"], entity: "Member" },
  authors: { model: "author", searchable: ["name", "biography"], entity: "Author" },
  publishers: { model: "publisher", searchable: ["name", "address", "email"], entity: "Publisher" },
  categories: { model: "category", searchable: ["name"], entity: "Category" }
};

export function listResource(resource) {
  return asyncHandler(async (req, res) => {
    const cfg = models[resource], { skip, take, page, limit } = getPagination(req.query);
    const search = req.query.search?.trim();
    const where = {
      ...(search ? { OR: cfg.searchable.map(field => ({ [field]: { contains: search, mode: "insensitive" } })) } : {}),
      ...(req.query.status ? { status: req.query.status.toUpperCase() } : {})
    };
    const [data, total] = await prisma.$transaction([
      prisma[cfg.model].findMany({ where, skip, take, orderBy: { id: "desc" } }),
      prisma[cfg.model].count({ where })
    ]);
    res.json(paginated(data, total, page, limit));
  });
}
export function getResource(resource) {
  return asyncHandler(async (req, res) => {
    const cfg = models[resource], data = await prisma[cfg.model].findUnique({ where: { id: Number(req.params.id) } });
    if (!data) throw new ApiError(404, `${cfg.entity} not found.`);
    res.json({ success: true, data });
  });
}
export function createResource(resource) {
  return asyncHandler(async (req, res) => {
    const cfg = models[resource], data = await prisma[cfg.model].create({ data: req.body });
    await recordActivity({ userId: req.user.id, action: "CREATE", entityName: cfg.entity, entityId: data.id });
    res.status(201).json({ success: true, data });
  });
}
export function updateResource(resource) {
  return asyncHandler(async (req, res) => {
    const cfg = models[resource], id = Number(req.params.id);
    const exists = await prisma[cfg.model].findUnique({ where: { id } });
    if (!exists) throw new ApiError(404, `${cfg.entity} not found.`);
    const data = await prisma[cfg.model].update({ where: { id }, data: req.body });
    await recordActivity({ userId: req.user.id, action: "UPDATE", entityName: cfg.entity, entityId: id });
    res.json({ success: true, data });
  });
}
export function deleteResource(resource) {
  return asyncHandler(async (req, res) => {
    const cfg = models[resource], id = Number(req.params.id);
    const exists = await prisma[cfg.model].findUnique({ where: { id } });
    if (!exists) throw new ApiError(404, `${cfg.entity} not found.`);
    await prisma[cfg.model].delete({ where: { id } });
    await recordActivity({ userId: req.user.id, action: "DELETE", entityName: cfg.entity, entityId: id });
    res.json({ success: true, message: `${cfg.entity} deleted successfully.` });
  });
}
