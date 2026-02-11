export const listResults = (req, res) => {
  res.json({ results: [] });
};

export const approveResults = (req, res) => {
  res.json({ message: "Results approved (placeholder)" });
};
