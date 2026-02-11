export const getAnalytics = (req, res) => {
  res.json({
    attempted: 0,
    pending: 0,
    passRate: 0
  });
};
