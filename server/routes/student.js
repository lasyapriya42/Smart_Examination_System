import { Router } from "express";
import Student from "../models/Student.js";

const router = Router();

console.log("✅ student.js routes loaded");

// TEST ROUTE
router.get("/test", (req, res) => {
  res.send("Student route working");
});

// GROUPED ROUTE
router.get("/grouped", async (req, res) => {
  try {
    const students = await Student.find();

    const grouped = {};

    students.forEach((s) => {

      if (!grouped[s.year]) grouped[s.year] = {};

      if (!grouped[s.year][s.department])
        grouped[s.year][s.department] = {};

      if (!grouped[s.year][s.department][s.section])
        grouped[s.year][s.department][s.section] = [];

      grouped[s.year][s.department][s.section].push(s);
    });

    res.json(grouped);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// CREATE STUDENT
router.post("/", async (req, res) => {
  try {
    const { name, rollNo, email, year, department, semester } = req.body;

    const newStudent = new Student({
      name,
      rollNo,
      email,
      year,
      department,
      semester,
    });

    await newStudent.save();

    res.status(201).json(newStudent);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

export default router;