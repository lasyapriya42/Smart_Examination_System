import { Router } from "express";
import { createExam, listExams } from "../controllers/examController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth(["admin", "hod", "faculty"]) , listExams);
router.post("/", requireAuth(["admin", "hod"]) , createExam);

export default router;
