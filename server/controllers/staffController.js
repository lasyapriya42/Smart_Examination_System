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

export const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ department: 1, staffId: 1 });
    res.json(staff);
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

export const updateStaff = async (req, res) => {
  try {
    const updated = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Staff not found" });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const deleted = await Staff.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Staff not found" });
    }

    return res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
