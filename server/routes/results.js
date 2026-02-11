import { Router } from "express";
import { approveResults, listResults } from "../controllers/resultController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth(["admin", "hod"]) , listResults);
router.post("/approve", requireAuth(["admin"]) , approveResults);

export default router;
