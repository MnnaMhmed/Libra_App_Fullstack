import { verifyAccessToken } from "../utils/tokens.js";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/apiError.js";

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) throw new ApiError(401, "Authentication required.");
    const payload = verifyAccessToken(header.slice(7));
    const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
    if (!user || user.status !== "ACTIVE") throw new ApiError(401, "Account is unavailable.");
    req.user = { id: user.id, fullName: user.fullName, email: user.email, role: user.role };
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(401, "Invalid or expired access token."));
  }
}

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return next(new ApiError(403, "You do not have permission to perform this action."));
  next();
};
