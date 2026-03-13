import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import Student from "../models/Student.js";

const router = express.Router();

// Configure file storage
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});

// Upload Route
router.post("/students", upload.single("file"), async (req, res) => {
  try {
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        for (let row of results) {
          await Student.create({
            rollNo: row.RollNo,
            name: row.Name,
            department: row.Department,
            year: row.Year,
            section: row.Section,
            email: row.Email || "",
          });
        }

        fs.unlinkSync(req.file.path); // delete file after upload

        res.json({
          message: "Students uploaded successfully",
          count: results.length,
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;