import { Router } from "express";
import * as c from "../controllers/profile.controller.js";
import { validate } from "../middleware/validate.js";
import { profileSchema } from "../validation/schemas.js";
const router = Router();
router.get("/", c.getProfile);
router.patch("/", validate(profileSchema), c.updateProfile);
export default router;
