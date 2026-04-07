const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeTimetable(slots, conflicts, className) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const timetableSummary = slots
    .map((s) => `${s.day} Period ${s.period}: ${s.subject} (${s.teacher}) → ${s.room}`)
    .join("\n");

  const prompt = `
You are an academic timetable expert. Analyze this auto-generated timetable for class "${className}".

TIMETABLE:
${timetableSummary}

${conflicts.length > 0 ? `KNOWN CONFLICTS:\n${conflicts.join("\n")}` : "No hard conflicts detected."}

Do the following:
1. Write a 2-3 sentence plain-English explanation of how this timetable was structured.
2. List 3-5 specific improvement suggestions.
3. Flag any soft issues (e.g. same teacher 3 consecutive periods, lab on Monday morning).

Respond ONLY in this exact JSON format, no extra text, no markdown:
{
  "explanation": "...",
  "suggestions": ["...", "...", "..."],
  "softIssues": ["...", "..."]
}
`.trim();

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    // Strip markdown code blocks if Gemini adds them
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch
      ? JSON.parse(jsonMatch[0])
      : { explanation: text, suggestions: [], softIssues: [] };
  }
}

async function chatWithAI(timetable, question) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const summary = timetable.slots
    .map((s) => `${s.day} P${s.period}: ${s.subject} (${s.teacher})`)
    .join(", ");

  const prompt = `You are a timetable assistant for class "${timetable.className}".
Current timetable: ${summary}
Question: ${question}
Give a short, helpful answer in 2-3 sentences.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { analyzeTimetable, chatWithAI };