const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

function fallbackAnalysis(slots, conflicts, className) {
  const subjectCount = new Set(slots.map((slot) => slot.subject)).size;

  return {
    explanation: `A timetable was generated for ${className} by spreading ${subjectCount} subject(s) across weekdays and available periods.`,
    suggestions: [
      "Review teacher workload before finalizing the timetable.",
      "Keep lab subjects in rooms with the right equipment.",
      "Avoid placing too many difficult subjects on the same day.",
      "Check whether students get enough variety across the week.",
    ],
    softIssues: conflicts,
  };
}

function getFallbackAnalysis(slots, conflicts, className) {
  return fallbackAnalysis(slots, conflicts, className);
}

async function analyzeTimetable(slots, conflicts, className) {
  if (!genAI) {
    return fallbackAnalysis(slots, conflicts, className);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const timetableSummary = slots
    .map((slot) => `${slot.day} Period ${slot.period}: ${slot.subject} (${slot.teacher}) in ${slot.room}`)
    .join("\n");

  const prompt = `
You are a helpful academic timetable assistant. Explain this timetable for a non-technical college staff member.

Class: ${className}

TIMETABLE:
${timetableSummary}

KNOWN CONFLICTS:
${conflicts.length > 0 ? conflicts.join("\n") : "No hard conflicts detected."}

Return only JSON in this shape:
{
  "explanation": "2-3 simple sentences explaining the timetable.",
  "suggestions": ["3-5 practical suggestions in simple language"],
  "softIssues": ["possible concerns, or an empty array"]
}
`.trim();

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : fallbackAnalysis(slots, conflicts, className);
  }
}

async function chatWithAI(timetable, question) {
  if (!genAI) {
    return "AI chat is not configured yet. Add a valid GEMINI_API_KEY in backend/.env and restart the backend server.";
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const summary = (timetable.slots || [])
    .map((slot) => `${slot.day} Period ${slot.period}: ${slot.subject} (${slot.teacher}) in ${slot.room}`)
    .join(", ");

  const prompt = `
You are a timetable assistant. Answer in simple language for a non-technical user.

Class: ${timetable.className}
Current timetable: ${summary || "No slots saved."}
Question: ${question}

Give a short helpful answer. If the request needs a timetable change, explain what should be moved.
`.trim();

  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { analyzeTimetable, chatWithAI, getFallbackAnalysis };
