import { Router } from "express";
import * as c from "../controllers/wishlist.controller.js";
const router = Router();
router.get("/", c.listWishlist);
router.post("/:bookId", c.addWishlist);
router.delete("/:bookId", c.removeWishlist);
export default router;
