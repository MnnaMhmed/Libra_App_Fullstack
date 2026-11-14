import { Router } from "express";
import { listActivity } from "../controllers/activity.controller.js";
const router = Router();
router.get("/", listActivity);
export default router;
