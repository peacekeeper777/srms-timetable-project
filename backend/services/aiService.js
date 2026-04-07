const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

/**
 * Sends the generated timetable to Claude API
 * Returns: explanation, suggestions[], flagged issues[]
 */
async function analyzeTimetable(slots, conflicts, className) {
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
2. List 3-5 specific improvement suggestions (e.g. spacing subjects better across the week, avoiding back-to-back heavy subjects).
3. Flag any soft issues (e.g. same teacher on 3 consecutive periods, lab scheduled on Monday morning).

Respond ONLY in this exact JSON format, no extra text:
{
  "explanation": "...",
  "suggestions": ["...", "...", "..."],
  "softIssues": ["...", "..."]
}
`.trim();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error: ${err}`);
  }

  const data = await response.json();
  const text = data.content[0].text;

  try {
    return JSON.parse(text);
  } catch {
    // Fallback if Claude adds extra text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { explanation: text, suggestions: [], softIssues: [] };
  }
}

module.exports = { analyzeTimetable };