const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const Teacher = require("../models/Teacher");
const Timetable = require("../models/Timetable");
const { generateTimetable } = require("../services/scheduleService");
const { analyzeTimetable } = require("../services/aiService");

// POST /api/generate
// Body: { className, semester }
router.post("/api/generate", async (req, res) => {
  try {
    const { className, semester } = req.body;

    // 1. Fetch all subjects with teachers populated
    const subjects = await Subject.find().populate("teacher");
    const teachers = await Teacher.find();

    if (subjects.length === 0) {
      return res.status(400).json({ error: "No subjects found. Add subjects first." });
    }

    // 2. Run CSP scheduling algorithm
    const { slots, conflicts } = generateTimetable(subjects, teachers);

    // 3. Send to Claude AI for analysis (the USP)
    const aiResult = await analyzeTimetable(slots, conflicts, className);

    // 4. Save to DB
    const timetable = await Timetable.create({
      className,
      semester,
      slots,
      conflicts,
      aiExplanation: aiResult.explanation,
      aiSuggestions: aiResult.suggestions,
    });

    res.json({
      success: true,
      timetable,
      aiAnalysis: aiResult,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/timetables
router.get("/api/timetables", async (req, res) => {
  try {
    const timetables = await Timetable.find().sort({ generatedAt: -1 });
    res.json(timetables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/chat — ask AI anything about the timetable
router.post("/api/ai/chat", async (req, res) => {
  try {
    const { timetableId, question } = req.body;
    const timetable = await Timetable.findById(timetableId);
    if (!timetable) return res.status(404).json({ error: "Timetable not found" });

    const summary = timetable.slots
      .map((s) => `${s.day} P${s.period}: ${s.subject} (${s.teacher})`)
      .join(", ");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: `You are a timetable assistant. The current timetable for class "${timetable.className}" is: ${summary}`,
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await response.json();
    res.json({ answer: data.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;