import { z } from "zod";

const id = z.coerce.number().int().positive();
const email = z.string().email().max(254);
const paginationQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().optional()
}).passthrough();

export const registerSchema = z.object({ body: z.object({
  fullName: z.string().trim().min(2).max(120),
  email,
  password: z.string().min(8).max(128)
}) });
export const loginSchema = z.object({ body: z.object({ email, password: z.string().min(1) }) });
export const changePasswordSchema = z.object({ body: z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128)
}) });

export const bookSchema = z.object({ body: z.object({
  title: z.string().trim().min(1).max(250),
  isbn: z.string().trim().min(3).max(30),
  edition: z.string().optional().nullable(),
  publicationYear: z.coerce.number().int().min(0).max(3000).optional().nullable(),
  language: z.string().max(80).optional(),
  publisherId: id.optional().nullable(),
  authorIds: z.array(id).optional(),
  categoryIds: z.array(id).optional(),
  status: z.enum(["AVAILABLE", "UNAVAILABLE"]).optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")).nullable(),
  summary: z.string().max(10000).optional().nullable()
}).partial({ edition: true, publicationYear: true, language: true, publisherId: true, authorIds: true, categoryIds: true, status: true, coverImageUrl: true, summary: true }) });
export const memberSchema = z.object({ body: z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email,
  phoneNumber: z.string().max(40).optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
}) });
export const authorSchema = z.object({ body: z.object({
  name: z.string().trim().min(1).max(150),
  biography: z.string().max(10000).optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
}) });
export const publisherSchema = z.object({ body: z.object({
  name: z.string().trim().min(1).max(180),
  address: z.string().max(300).optional().nullable(),
  email: email.optional().nullable().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
}) });
export const categorySchema = z.object({ body: z.object({
  name: z.string().trim().min(1).max(100),
  parentCategoryId: id.optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
}) });
export const userCreateSchema = z.object({ body: z.object({
  fullName: z.string().trim().min(2).max(120),
  email,
  password: z.string().min(8).max(128),
  role: z.enum(["ADMINISTRATOR", "LIBRARIAN", "STAFF"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
}) });
export const userUpdateSchema = z.object({ body: z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  email: email.optional(),
  role: z.enum(["ADMINISTRATOR", "LIBRARIAN", "STAFF"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
}).refine(v => Object.keys(v).length > 0) });
export const borrowingSchema = z.object({ body: z.object({
  bookId: id,
  memberId: id,
  dueDate: z.coerce.date()
}) });
export const updateBorrowingSchema = z.object({ body: z.object({
  dueDate: z.coerce.date().optional(),
  memberId: id.optional()
}) });
export const profileSchema = z.object({ body: z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  email: email.optional()
}).refine(v => Object.keys(v).length > 0) });
export const listSchema = z.object({ query: paginationQuery });
export const idParamSchema = z.object({ params: z.object({ id }) });
