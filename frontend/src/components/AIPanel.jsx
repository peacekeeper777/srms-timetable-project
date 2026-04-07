import { useState } from "react";
import axios from "axios";

export default function AIPanel({ timetable }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  if (!timetable) return null;

  const askAI = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ai/chat", {
        timetableId: timetable._id,
        question,
      });
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer("Error reaching AI. Check your API key.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>🤖 AI Analysis</h3>

      {/* Explanation */}
      <div style={styles.card}>
        <p style={styles.label}>How this timetable was built</p>
        <p style={styles.text}>{timetable.aiExplanation}</p>
      </div>

      {/* Suggestions */}
      {timetable.aiSuggestions?.length > 0 && (
        <div style={styles.card}>
          <p style={styles.label}>Suggestions to improve</p>
          <ul style={styles.list}>
            {timetable.aiSuggestions.map((s, i) => (
              <li key={i} style={styles.listItem}>💡 {s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Conflicts */}
      {timetable.conflicts?.length > 0 && (
        <div style={{ ...styles.card, borderLeft: "4px solid #e74c3c" }}>
          <p style={styles.label}>⚠️ Conflicts detected</p>
          <ul style={styles.list}>
            {timetable.conflicts.map((c, i) => (
              <li key={i} style={{ ...styles.listItem, color: "#e74c3c" }}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Chat with AI */}
      <div style={styles.card}>
        <p style={styles.label}>Ask AI about this timetable</p>
        <input
          style={styles.input}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder='e.g. "Can Math be moved to morning slots?"'
          onKeyDown={(e) => e.key === "Enter" && askAI()}
        />
        <button style={styles.btn} onClick={askAI} disabled={loading}>
          {loading ? "Thinking..." : "Ask AI"}
        </button>
        {answer && <p style={styles.answer}>{answer}</p>}
      </div>
    </div>
  );
}

const styles = {
  panel: { background: "#f8f9fa", borderRadius: 12, padding: 20, marginTop: 24 },
  heading: { marginBottom: 16, fontSize: 18 },
  card: { background: "#fff", borderRadius: 8, padding: 16, marginBottom: 12, borderLeft: "4px solid #6c63ff" },
  label: { fontWeight: 600, fontSize: 13, color: "#888", marginBottom: 8 },
  text: { fontSize: 14, lineHeight: 1.6, margin: 0 },
  list: { paddingLeft: 16, margin: 0 },
  listItem: { fontSize: 14, marginBottom: 6 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #ddd", fontSize: 14, marginBottom: 10, boxSizing: "border-box" },
  btn: { background: "#6c63ff", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 6, cursor: "pointer", fontSize: 14 },
  answer: { background: "#f0eeff", borderRadius: 6, padding: 12, fontSize: 14, lineHeight: 1.6, marginTop: 10 },
};