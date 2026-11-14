import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const listWishlist = asyncHandler(async (req, res) => {
  const data = await prisma.wishlist.findMany({
    where: { userId: req.user.id },
    include: { book: { include: { publisher: true, bookAuthors: { include: { author: true } }, bookCategories: { include: { category: true } } } } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ success: true, data: data.map(x => x.book) });
});
export const addWishlist = asyncHandler(async (req, res) => {
  const bookId = Number(req.params.bookId);
  if (!(await prisma.book.findUnique({ where: { id: bookId } }))) throw new ApiError(404, "Book not found.");
  const data = await prisma.wishlist.create({ data: { userId: req.user.id, bookId }, include: { book: true } });
  res.status(201).json({ success: true, data: data.book });
});
export const removeWishlist = asyncHandler(async (req, res) => {
  const bookId = Number(req.params.bookId);
  await prisma.wishlist.deleteMany({ where: { userId: req.user.id, bookId } });
  res.json({ success: true, message: "Book removed from wishlist." });
});
