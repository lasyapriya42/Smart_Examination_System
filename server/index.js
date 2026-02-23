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
import blockRoutes, { roomRouter } from "./routes/blocks.js";
import roomRoutes from "./routes/rooms.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/student", studentRoutes);
app.use("/api/rooms", roomRoutes);

const { MONGODB_URI, PORT = 5000 } = process.env;

if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
    });
} else {
  console.warn("MONGODB_URI not set. Skipping database connection.");
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/hod", hodRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/blocks", blockRoutes);
app.use("/api/rooms", roomRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
