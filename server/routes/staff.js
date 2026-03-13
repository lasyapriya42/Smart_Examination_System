import { Router } from "express";
import {
  getStaffGrouped,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staffController.js";

const router = Router();

console.log("✅ staff.js routes loaded");

// Get staff grouped by department
router.get("/grouped", getStaffGrouped);
router.get("/", getStaff);

// Create staff
router.post("/", createStaff);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

export default router;
