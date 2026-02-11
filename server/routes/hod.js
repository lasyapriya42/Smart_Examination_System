import { Router } from "express";
import { getDashboard } from "../controllers/hodController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", requireAuth(["hod"]) , getDashboard);

export default router;
