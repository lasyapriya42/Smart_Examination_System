import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, role = "student" } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const token = jwt.sign(
    { id: "demo-user", email, role },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "1h" }
  );

  return res.json({ token, user: { id: "demo-user", email, role } });
};
