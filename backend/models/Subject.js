const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: String,
  teacher: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Subject", subjectSchema);