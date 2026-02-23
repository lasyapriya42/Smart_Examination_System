import { Router } from "express";
import {
  getStaffGrouped,
  createStaff,
} from "../controllers/staffController.js";

const router = Router();

console.log("✅ staff.js routes loaded");

// Get staff grouped by department
router.get("/grouped", getStaffGrouped);

// Create staff
router.post("/", createStaff);

export default router;
