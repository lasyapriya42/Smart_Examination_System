import { Router } from "express";
import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  deleteStudentsBulk,
  getStudentsGrouped,
} from "../controllers/studentController.js";

const router = Router();

console.log("✅ student.js routes loaded");

// TEST ROUTE
router.get("/test", (req, res) => {
  res.send("Student route working");
});

// GROUPED ROUTE
router.get("/grouped", getStudentsGrouped);
router.get("/", getStudents);
router.post("/", createStudent);
router.post("/delete-bulk", deleteStudentsBulk);
router.delete("/bulk", deleteStudentsBulk);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;