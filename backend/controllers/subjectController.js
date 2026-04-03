const Subject = require("../models/Subject");

// Add subject
exports.addSubject = async (req, res) => {
  try {
    const { name, teacher, userId } = req.body;

    await Subject.create({ name, teacher, userId });

    res.json({ message: "Subject added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get subjects
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.params.userId });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};