export const listExams = (req, res) => {
  res.json({ exams: [] });
};

export const createExam = (req, res) => {
  res.status(201).json({ message: "Exam created (placeholder)" });
};
