export const getDashboard = (req, res) => {
  res.json({
    role: "student",
    upcomingExams: [],
    notifications: []
  });
};
