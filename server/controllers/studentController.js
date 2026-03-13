import Student from "../models/Student.js";
import mongoose from "mongoose";

export const getDashboard = (req, res) => {
  res.json({
    role: "student",
    upcomingExams: [],
    notifications: [],
  });
};

export const createStudent = async (req, res) => {
  try {
    const { name, rollNo, email, year, department, semester, section } = req.body;

    const student = await Student.create({
      name,
      rollNo,
      email,
      year,
      department,
      semester,
      section,
    });

    return res.status(201).json(student);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ year: 1, department: 1, section: 1, rollNo: 1 });
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json(student);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid student id" });
    }

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ message: "Student deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteStudentsBulk = async (req, res) => {
  try {
    const { year, department, section } = req.body || {};
    const filter = {};

    if (year !== undefined && year !== null && String(year).trim() !== "") {
      filter.year = Number(year);
    }
    if (department && String(department).trim() !== "") {
      filter.department = String(department).trim();
    }
    if (section && String(section).trim() !== "" && String(section).toUpperCase() !== "ALL") {
      filter.section = String(section).trim();
    }

    const result = await Student.deleteMany(filter);

    return res.json({
      message:
        Object.keys(filter).length === 0
          ? "All students deleted successfully"
          : "Students deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getStudentsGrouped = async (req, res) => {
  try {
    const students = await Student.find()
      .sort({ year: 1, department: 1, section: 1, rollNo: 1, name: 1 })
      .lean();

    const grouped = {};

    students.forEach((s) => {
      const yearKey = String(s.year ?? "NA").trim();
      const deptKey = String(s.department ?? "NA").trim().toUpperCase();
      const sectionKey = String(s.section ?? "NA").trim().toUpperCase();

      if (!grouped[yearKey]) grouped[yearKey] = {};
      if (!grouped[yearKey][deptKey]) grouped[yearKey][deptKey] = {};
      if (!grouped[yearKey][deptKey][sectionKey]) grouped[yearKey][deptKey][sectionKey] = [];

      grouped[yearKey][deptKey][sectionKey].push(s);
    });

    const sortKeys = (obj) =>
      Object.keys(obj || {}).sort((a, b) =>
        String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" })
      );

    const sortedGrouped = {};
    sortKeys(grouped).forEach((yearKey) => {
      sortedGrouped[yearKey] = {};
      sortKeys(grouped[yearKey]).forEach((deptKey) => {
        sortedGrouped[yearKey][deptKey] = {};
        sortKeys(grouped[yearKey][deptKey]).forEach((sectionKey) => {
          sortedGrouped[yearKey][deptKey][sectionKey] = grouped[yearKey][deptKey][sectionKey];
        });
      });
    });

    return res.json(sortedGrouped);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
