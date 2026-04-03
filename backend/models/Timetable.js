const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  day: String,
  slot: String,
  subject: String,
  teacher: String,
  room: String,
  type: {
    type: String,
    default: "LECTURE", // LECTURE | LAB | FREE
  },
});

module.exports = mongoose.model("Timetable", timetableSchema);