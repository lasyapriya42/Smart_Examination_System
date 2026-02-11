export const listDepartments = (req, res) => {
  res.json({ departments: [] });
};

export const createDepartment = (req, res) => {
  res.status(201).json({ message: "Department created (placeholder)" });
};
