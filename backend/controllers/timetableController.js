const Timetable = require("../models/Timetable");

exports.addSlot = async (req, res) => {
  try {
    const { userId, day, slot, subject, teacher, room } = req.body;

    // 1. User Slot Clash: Does this specific student/user already have a class now?
    const slotExists = await Timetable.findOne({ userId, day, slot });
    if (slotExists) {
      return res.status(400).json({ message: "You already have a class scheduled for this time slot." });
    }

    // 2. Teacher Clash: Is this teacher already teaching another class right now?
    const teacherClash = await Timetable.findOne({ teacher, day, slot });
    if (teacherClash) {
      return res.status(400).json({ message: `Teacher ${teacher} is already booked for this slot.` });
    }

    // 3. Room Clash: Is this room already occupied right now?
    const roomClash = await Timetable.findOne({ room, day, slot });
    if (roomClash) {
      return res.status(400).json({ message: `Room ${room} is already in use for this slot.` });
    }

    // If no clashes, create the slot
    await Timetable.create({
      userId,
      day,
      slot,
      subject,
      teacher,
      room,
    });

    res.json({ message: "Slot added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTimetable = async (req, res) => {
  try {
    const data = await Timetable.find({ userId: req.params.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ message: "Slot deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSlot = async (req, res) => {
  try {
    const { teacher, subject } = req.body;

    await Timetable.findByIdAndUpdate(req.params.id, {
      teacher,
      subject,
    });

    res.json({ message: "Slot updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};