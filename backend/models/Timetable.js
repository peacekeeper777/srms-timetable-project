const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  day: String,
  period: Number,
  subject: String,
  teacher: String,
  room: String,
});

const TimetableSchema = new mongoose.Schema({
  className: { type: String, required: true },
  semester: String,
  slots: [SlotSchema],
  aiExplanation: { type: String },
  aiSuggestions: [{ type: String }],
  conflicts: [{ type: String }],
  generatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Timetable", TimetableSchema);