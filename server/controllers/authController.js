import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Staff from "../models/Staff.js";

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalize = (value) => String(value || "").trim().toLowerCase();

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
  let userEmail = normalize(email);

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
    const localPart = userEmail.split("@")[0] || "";

    // Primary path: email lookup (case-insensitive)
    let student = await Student.findOne({
      email: { $regex: `^${escapeRegex(userEmail)}$`, $options: "i" },
    });

    // Fallback path: allow canonical college email (rollNo@svecw.edu.in)
    if (!student && userEmail.endsWith("@svecw.edu.in") && localPart) {
      student = await Student.findOne({
        rollNo: { $regex: `^${escapeRegex(localPart)}$`, $options: "i" },
      });
    }

    if (!student) {
      return res.status(404).json({ message: "Student user not found" });
    }

    // Student password: roll/register number in lowercase letters + digits.
    const enteredPassword = normalize(password);
    const expectedPassword = normalize(student.rollNo);
    if (!/^[a-z0-9]+$/.test(enteredPassword)) {
      return res.status(401).json({ message: "Password must contain only lowercase letters and numbers" });
    }

    if (enteredPassword !== expectedPassword) {
      return res.status(401).json({ message: "Invalid student password. Use your roll/register number in lowercase" });
    }

    userId = String(student._id);
    userEmail = normalize(student.email);
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
