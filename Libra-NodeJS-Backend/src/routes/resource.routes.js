import { Router } from "express";
import { listResource, getResource, createResource, updateResource, deleteResource } from "../controllers/crud.controller.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validation/schemas.js";

export function resourceRouter(resource, schema, options = {}) {
  const router = Router();
  const { writeRoles = ["ADMINISTRATOR", "LIBRARIAN"], deleteRoles = ["ADMINISTRATOR"] } = options;
  router.get("/", listResource(resource));
  router.get("/:id", validate(idParamSchema), getResource(resource));
  router.post("/", (req, res, next) => {
    if (!req.user || !writeRoles.includes(req.user.role)) return res.status(403).json({ success: false, message: "Forbidden." });
    next();
  }, validate(schema), createResource(resource));
  router.put("/:id", (req, res, next) => {
    if (!req.user || !writeRoles.includes(req.user.role)) return res.status(403).json({ success: false, message: "Forbidden." });
    next();
  }, validate(idParamSchema), validate(schema), updateResource(resource));
  router.delete("/:id", (req, res, next) => {
    if (!req.user || !deleteRoles.includes(req.user.role)) return res.status(403).json({ success: false, message: "Forbidden." });
    next();
  }, validate(idParamSchema), deleteResource(resource));
  return router;
}
