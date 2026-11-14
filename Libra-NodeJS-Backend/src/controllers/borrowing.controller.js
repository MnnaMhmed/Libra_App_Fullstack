import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { getPagination, paginated } from "../middleware/pagination.js";
import { recordActivity } from "../services/activity.service.js";

export const listBorrowings = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = getPagination(req.query);
  const search = req.query.search?.trim();
  const rows = await prisma.borrowing.findMany({
    where: search ? { OR: [
      { book: { title: { contains: search, mode: "insensitive" } } },
      { member: { firstName: { contains: search, mode: "insensitive" } } },
      { member: { lastName: { contains: search, mode: "insensitive" } } }
    ] } : {},
    include: { book: true, member: true }, skip, take, orderBy: { id: "desc" }
  });
  const total = await prisma.borrowing.count({ where: search ? { OR: [
    { book: { title: { contains: search, mode: "insensitive" } } },
    { member: { firstName: { contains: search, mode: "insensitive" } } },
    { member: { lastName: { contains: search, mode: "insensitive" } } }
  ] } : {} });
  const data = rows.map(x => ({ ...x, status: x.returnDate ? "RETURNED" : x.dueDate < new Date() ? "OVERDUE" : "BORROWED" }));
  res.json(paginated(data, total, page, limit));
});

export const createBorrowing = asyncHandler(async (req, res) => {
  const { bookId, memberId, dueDate } = req.body;
  const [book, member] = await Promise.all([
    prisma.book.findUnique({ where: { id: bookId } }),
    prisma.member.findUnique({ where: { id: memberId } })
  ]);
  if (!book) throw new ApiError(404, "Book not found.");
  if (book.status !== "AVAILABLE") throw new ApiError(409, "Book is not available.");
  if (!member || member.status !== "ACTIVE") throw new ApiError(400, "Member is not active or does not exist.");
  const data = await prisma.$transaction(async tx => {
    const borrowing = await tx.borrowing.create({ data: { bookId, memberId, dueDate }, include: { book: true, member: true } });
    await tx.book.update({ where: { id: bookId }, data: { status: "UNAVAILABLE" } });
    return borrowing;
  });
  await recordActivity({ userId: req.user.id, action: "BORROW", entityName: "Borrowing", entityId: data.id });
  res.status(201).json({ success: true, data });
});

export const returnBorrowing = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const current = await prisma.borrowing.findUnique({ where: { id }, include: { book: true, member: true } });
  if (!current) throw new ApiError(404, "Borrowing record not found.");
  if (current.returnDate) throw new ApiError(409, "This book has already been returned.");
  const data = await prisma.$transaction(async tx => {
    const borrowing = await tx.borrowing.update({ where: { id }, data: { returnDate: new Date() }, include: { book: true, member: true } });
    await tx.book.update({ where: { id: current.bookId }, data: { status: "AVAILABLE" } });
    return borrowing;
  });
  await recordActivity({ userId: req.user.id, action: "RETURN", entityName: "Borrowing", entityId: id });
  res.json({ success: true, data });
});

export const updateBorrowing = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const current = await prisma.borrowing.findUnique({ where: { id } });
  if (!current) throw new ApiError(404, "Borrowing record not found.");
  const data = await prisma.borrowing.update({ where: { id }, data: req.body, include: { book: true, member: true } });
  await recordActivity({ userId: req.user.id, action: "UPDATE", entityName: "Borrowing", entityId: id });
  res.json({ success: true, data });
});

export const deleteBorrowing = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const current = await prisma.borrowing.findUnique({ where: { id } });
  if (!current) throw new ApiError(404, "Borrowing record not found.");
  await prisma.$transaction(async tx => {
    await tx.borrowing.delete({ where: { id } });
    if (!current.returnDate) await tx.book.update({ where: { id: current.bookId }, data: { status: "AVAILABLE" } });
  });
  await recordActivity({ userId: req.user.id, action: "DELETE", entityName: "Borrowing", entityId: id });
  res.json({ success: true, message: "Borrowing record deleted." });
});
