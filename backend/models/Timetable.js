const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  day: { type: String, required: true },
  slot: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: { type: String, required: true },
  room: { type: String, required: true },
});

module.exports = mongoose.model("Timetable", timetableSchema);