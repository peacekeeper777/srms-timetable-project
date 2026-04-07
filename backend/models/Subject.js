const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  hoursPerWeek: { type: Number, required: true },
  requiresLab: { type: Boolean, default: false },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
});

module.exports = mongoose.model("Subject", SubjectSchema);