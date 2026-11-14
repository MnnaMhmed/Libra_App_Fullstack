import { Prisma } from "@prisma/client";
import { env } from "../config/env.js";

export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found.` });
}

export function errorHandler(error, req, res, next) {
  let status = error.statusCode || 500;
  let message = error.message || "Internal server error.";
  let details = error.details;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") { status = 409; message = "A record with this unique value already exists."; }
    else if (error.code === "P2025") { status = 404; message = "Record not found."; }
    else if (error.code === "P2003") { status = 409; message = "This record is referenced by other records."; }
  }

  if (status >= 500 && env.nodeEnv === "production") message = "Internal server error.";
  res.status(status).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(env.nodeEnv === "development" && status >= 500 ? { stack: error.stack } : {})
  });
}
