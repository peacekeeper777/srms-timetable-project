const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  subjects: [{ type: String }],
  unavailableSlots: [{ day: String, period: Number }],
});

module.exports = mongoose.model("Teacher", TeacherSchema);