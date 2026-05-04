const Timetable = require("../models/Timetable");

exports.addSlot = async (req, res) => {
    try {
        const { day, slot, className, subject, teacher, room, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is missing. Please re-login." });
        }

        if (!day || !slot || !className || !subject || !teacher || !room) {
            return res.status(400).json({ message: "All slot fields are required." });
        }

        const existingSlot = await Timetable.findOne({ userId, day, slot: Number(slot) });
        if (existingSlot) {
            return res.status(409).json({ message: `${day} Slot ${slot} already has a class. Delete it before adding another.` });
        }

        const newSlot = new Timetable({ day, slot: Number(slot), className, subject, teacher, room, userId });
        await newSlot.save();

        res.status(201).json({ message: "Slot added successfully!", data: newSlot });
    } catch (error) {
        res.status(500).json({ message: "Database Error: " + error.message });
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

exports.getAvailability = async (req, res) => {
    try {
        res.status(200).json({
            availableTeachers: [],
            availableRooms: []
        });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};
