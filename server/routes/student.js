import { Router } from "express";
import { getDashboard } from "../controllers/studentController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", requireAuth(["student"]) , getDashboard);

export default router;
