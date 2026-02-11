import { Router } from "express";
import { createDepartment, listDepartments } from "../controllers/departmentController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth(["admin", "hod"]) , listDepartments);
router.post("/", requireAuth(["admin"]) , createDepartment);

export default router;
