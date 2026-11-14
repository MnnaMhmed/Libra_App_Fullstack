import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { getPagination, paginated } from "../middleware/pagination.js";
import { recordActivity } from "../services/activity.service.js";

const include = { publisher: true, bookAuthors: { include: { author: true } }, bookCategories: { include: { category: true } } };
function normalize(data) {
  const { authorIds, categoryIds, ...rest } = data;
  return {
    ...rest,
    ...(authorIds ? { bookAuthors: { deleteMany: {}, create: authorIds.map(authorId => ({ author: { connect: { id: authorId } } })) } } : {}),
    ...(categoryIds ? { bookCategories: { deleteMany: {}, create: categoryIds.map(categoryId => ({ category: { connect: { id: categoryId } } })) } } : {})
  };
}
export const listBooks = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = getPagination(req.query);
  const search = req.query.search?.trim();
  const where = {
    ...(search ? { OR: [
      { title: { contains: search, mode: "insensitive" } },
      { isbn: { contains: search, mode: "insensitive" } },
      { bookAuthors: { some: { author: { name: { contains: search, mode: "insensitive" } } } } }
    ] } : {}),
    ...(req.query.status ? { status: req.query.status.toUpperCase() } : {}),
    ...(req.query.categoryId ? { bookCategories: { some: { categoryId: Number(req.query.categoryId) } } } : {}),
    ...(req.query.publisherId ? { publisherId: Number(req.query.publisherId) } : {})
  };
  const [data, total] = await prisma.$transaction([
    prisma.book.findMany({ where, include, skip, take, orderBy: { id: "desc" } }),
    prisma.book.count({ where })
  ]);
  res.json(paginated(data, total, page, limit));
});
export const getBook = asyncHandler(async (req, res) => {
  const data = await prisma.book.findUnique({ where: { id: Number(req.params.id) }, include: { ...include, borrowings: { include: { member: true }, orderBy: { borrowDate: "desc" }, take: 10 } } });
  if (!data) throw new ApiError(404, "Book not found.");
  res.json({ success: true, data });
});
export const createBook = asyncHandler(async (req, res) => {
  const data = await prisma.book.create({ data: normalize(req.body), include });
  await recordActivity({ userId: req.user.id, action: "CREATE", entityName: "Book", entityId: data.id });
  res.status(201).json({ success: true, data });
});
export const updateBook = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!(await prisma.book.findUnique({ where: { id } }))) throw new ApiError(404, "Book not found.");
  const data = await prisma.book.update({ where: { id }, data: normalize(req.body), include });
  await recordActivity({ userId: req.user.id, action: "UPDATE", entityName: "Book", entityId: id });
  res.json({ success: true, data });
});
export const deleteBook = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const active = await prisma.borrowing.count({ where: { bookId: id, returnDate: null } });
  if (active) throw new ApiError(409, "Book has an active borrowing and cannot be deleted.");
  await prisma.book.delete({ where: { id } });
  await recordActivity({ userId: req.user.id, action: "DELETE", entityName: "Book", entityId: id });
  res.json({ success: true, message: "Book deleted successfully." });
});
