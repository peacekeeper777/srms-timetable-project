const Subject = require("../models/Subject");

exports.addSubject = async (req, res) => {
  try {
    const { name, teacher, userId } = req.body;

    await Subject.create({ name, teacher, userId });

    res.json({ message: "Subject added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.params.userId });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
