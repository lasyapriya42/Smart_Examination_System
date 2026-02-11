export const getDashboard = (req, res) => {
  res.json({
    role: "hod",
    stats: {
      subjects: 0,
      faculty: 0,
      examsScheduled: 0
    }
  });
};
