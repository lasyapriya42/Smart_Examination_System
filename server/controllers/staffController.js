import Staff from "../models/Staff.js";

// Get staff grouped by department
export const getStaffGrouped = async (req, res) => {
  try {
    const staff = await Staff.find();

    const grouped = {};

    staff.forEach((s) => {
      if (!grouped[s.department]) {
        grouped[s.department] = [];
      }
      grouped[s.department].push(s);
    });

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create staff
export const createStaff = async (req, res) => {
  try {
    const { name, staffId, email, department, designation, phone } = req.body;

    const newStaff = new Staff({
      name,
      staffId,
      email,
      department,
      designation,
      phone,
    });

    await newStaff.save();
    res.status(201).json(newStaff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
