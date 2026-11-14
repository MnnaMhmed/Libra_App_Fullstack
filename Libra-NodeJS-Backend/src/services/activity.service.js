import { prisma } from "../config/prisma.js";
export async function recordActivity({ userId, action, entityName, entityId, details }) {
  return prisma.activityLog.create({
    data: { systemUserId: userId || null, action, entityName, entityId: entityId || null, details: details || undefined }
  });
}
