import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import hodRoutes from "./routes/hod.js";
import studentRoutes from "./routes/student.js";
import staffRoutes from "./routes/staff.js";
import examRoutes from "./routes/exams.js";
import departmentRoutes from "./routes/departments.js";
import resultRoutes from "./routes/results.js";
import analyticsRoutes from "./routes/analytics.js";
import blockRoutes from "./routes/blocks.js";
import roomRoutes from "./routes/rooms.js";
import bulkUploadRoutes from "./routes/bulkUpload.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
connectDB();
app.use("/api/student", studentRoutes);
app.use("/api/students", studentRoutes);
app.use("/students", studentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/rooms", roomRoutes);
app.use("/api/upload", bulkUploadRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/hod", hodRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/students", studentRoutes);
app.use("/students", studentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/staff", staffRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/blocks", blockRoutes);
app.use("/blocks", blockRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/rooms", roomRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
