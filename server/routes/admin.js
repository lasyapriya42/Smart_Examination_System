import { Router } from "express";
import { getDashboard } from "../controllers/adminController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", requireAuth(["admin"]) , getDashboard);

export default router;
