const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const Teacher = require("../models/Teacher");
const Timetable = require("../models/Timetable");
const { generateTimetable } = require("../services/scheduleService");
const { analyzeTimetable, chatWithAI, getFallbackAnalysis } = require("../services/aiService");

router.post("/api/generate", async (req, res) => {
  try {
    const { className, semester, subjects: inputSubjects = [] } = req.body;

    if (!className?.trim()) {
      return res.status(400).json({ error: "Enter a class name before generating." });
    }

    let subjects = inputSubjects
      .filter((subject) => subject.name?.trim())
      .map((subject, index) => ({
        name: subject.name.trim(),
        code: subject.code?.trim() || `SUB${index + 1}`,
        hoursPerWeek: Number(subject.hoursPerWeek) || 3,
        requiresLab: Boolean(subject.requiresLab),
        teacherName: subject.teacher?.trim() || "TBA",
      }));

    if (subjects.length === 0) {
      subjects = await Subject.find().populate("teacher");
    }

    const teachers = await Teacher.find();

    if (subjects.length === 0) {
      return res.status(400).json({ error: "Add at least one subject before generating." });
    }

    const { slots, conflicts } = generateTimetable(subjects, teachers);
    let aiResult;

    try {
      aiResult = await analyzeTimetable(slots, conflicts, className.trim());
    } catch (aiError) {
      console.error("AI analysis failed:", aiError.message);
      aiResult = getFallbackAnalysis(slots, conflicts, className.trim());
    }

    const timetable = await Timetable.create({
      className: className.trim(),
      semester: semester?.trim(),
      slots,
      conflicts: [...conflicts, ...(aiResult.softIssues || [])],
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

router.get("/api/timetables", async (req, res) => {
  try {
    const timetables = await Timetable.find().sort({ generatedAt: -1 });
    res.json(timetables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/ai/chat", async (req, res) => {
  try {
    const { timetableId, question } = req.body;
    const timetable = await Timetable.findById(timetableId);
    if (!timetable) return res.status(404).json({ error: "Timetable not found" });

    const answer = await chatWithAI(timetable, question);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
