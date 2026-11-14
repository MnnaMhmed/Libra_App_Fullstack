import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const [totalBooks, totalMembers, activeBorrowings, overdueBooks, categoryRows, recentBorrowings, popularBooks, monthly] = await Promise.all([
    prisma.book.count(),
    prisma.member.count(),
    prisma.borrowing.count({ where: { returnDate: null } }),
    prisma.borrowing.count({ where: { returnDate: null, dueDate: { lt: now } } }),
    prisma.category.findMany({ include: { _count: { select: { bookCategories: true } } } }),
    prisma.borrowing.findMany({ take: 6, orderBy: { borrowDate: "desc" }, include: { book: true, member: true } }),
    prisma.book.findMany({ take: 5, include: { _count: { select: { borrowings: true } } }, orderBy: { borrowings: { _count: "desc" } } }),
    prisma.$queryRaw`SELECT EXTRACT(MONTH FROM "borrowDate")::int AS month, COUNT(*)::int AS count FROM "Borrowing" WHERE EXTRACT(YEAR FROM "borrowDate") = EXTRACT(YEAR FROM CURRENT_DATE) GROUP BY month ORDER BY month`
  ]);
  res.json({ success: true, data: {
    totalBooks, totalMembers, activeBorrowings, overdueBooks,
    booksByCategory: categoryRows.map(c => ({ id: c.id, name: c.name, count: c._count.bookCategories })),
    recentBorrowings, popularBooks, monthlyBorrowings: monthly
  }});
});
