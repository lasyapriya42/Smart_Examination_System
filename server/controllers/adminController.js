export const getDashboard = (req, res) => {
  res.json({
    role: "admin",
    stats: {
      users: 0,
      exams: 0,
      malpracticeAlerts: 0
    }
  });
};
