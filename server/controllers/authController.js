import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Staff from "../models/Staff.js";

const normalizeRole = (role) => {
  const raw = String(role || "").toLowerCase();

  if (raw === "principal" || raw === "admin") return "admin";
  if (raw === "staff" || raw === "hod") return "hod";
  if (raw === "student") return "student";

  return null;
};

export const login = async (req, res) => {
  const { email, password, role = "student" } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) {
    return res.status(400).json({ message: "Invalid role" });
  }

  let userId = "";
  let userEmail = String(email).toLowerCase();

  if (normalizedRole === "admin") {
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@examsmart.com").toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (userEmail !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    userId = "admin-user";
  }

  if (normalizedRole === "hod") {
    const staff = await Staff.findOne({ email: userEmail });

    if (!staff) {
      return res.status(404).json({ message: "Staff user not found" });
    }

    const expectedPassword = staff.staffId;
    if (password !== expectedPassword) {
      return res.status(401).json({ message: "Invalid staff password" });
    }

    userId = String(staff._id);
    userEmail = staff.email;
  }

  if (normalizedRole === "student") {
    const student = await Student.findOne({ email: userEmail });

    if (!student) {
      return res.status(404).json({ message: "Student user not found" });
    }

    const expectedPassword = student.rollNo;
    if (password !== expectedPassword) {
      return res.status(401).json({ message: "Invalid student password" });
    }

    userId = String(student._id);
    userEmail = student.email;
  }

  const token = jwt.sign(
    { id: userId, email: userEmail, role: normalizedRole },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "1h" }
  );

  return res.json({
    token,
    role: normalizedRole,
    user: {
      id: userId,
      email: userEmail,
      role: normalizedRole,
    },
  });
};
