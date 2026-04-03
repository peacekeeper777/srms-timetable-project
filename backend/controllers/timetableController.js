const Timetable = require("../models/Timetable");

// ➕ Add slot manually
exports.addSlot = async (req, res) => {
  try {
    const { userId, day, slot, subject, teacher, room, type } = req.body;

    // prevent clash (same day + slot)
    const exists = await Timetable.findOne({ userId, day, slot });

    if (exists) {
      return res.status(400).json({ message: "Slot already exists" });
    }

    await Timetable.create({
      userId,
      day,
      slot,
      subject,
      teacher,
      room,
      type,
    });

    res.json({ message: "Slot added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📥 Get full timetable
exports.getTimetable = async (req, res) => {
  try {
    const data = await Timetable.find({ userId: req.params.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Delete specific slot
exports.deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    await Timetable.findByIdAndDelete(id);

    res.json({ message: "Slot deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔁 Replace teacher (adjustment)
exports.updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacher, subject } = req.body;

    await Timetable.findByIdAndUpdate(id, {
      teacher,
      subject,
    });

    res.json({ message: "Slot updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};