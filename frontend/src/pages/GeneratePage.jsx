import { useState } from "react";
import axios from "axios";
import AIPanel from "../components/AIPanel";

export default function GeneratePage() {
  const [className, setClassName] = useState("");
  const [semester, setSemester] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!className) return setError("Enter a class name");
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/generate", {
        className,
        semester,
      });
      setResult(res.data.timetable);
    } catch (err) {
      setError(err.response?.data?.error || "Generation failed");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
      <h2>Generate Timetable with AI</h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input
          placeholder="Class name (e.g. CS-A)"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          style={{ flex: 1, padding: "10px 14px", borderRadius: 6, border: "1px solid #ddd" }}
        />
        <input
          placeholder="Semester (e.g. Sem 3)"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          style={{ flex: 1, padding: "10px 14px", borderRadius: 6, border: "1px solid #ddd" }}
        />
        <button
          onClick={generate}
          disabled={loading}
          style={{ background: "#6c63ff", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 6, cursor: "pointer" }}
        >
          {loading ? "Generating..." : "⚡ Generate with AI"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <>
          {/* Timetable Grid */}
          <TimetableGrid slots={result.slots} />
          {/* AI Panel — the USP */}
          <AIPanel timetable={result} />
        </>
      )}
    </div>
  );
}

function TimetableGrid({ slots }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = [1, 2, 3, 4, 5, 6];

  const getSlot = (day, period) =>
    slots.find((s) => s.day === day && s.period === period);

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            <th style={th}>Period</th>
            {days.map((d) => <th key={d} style={th}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {periods.map((p) => (
            <tr key={p}>
              <td style={{ ...td, fontWeight: 600, background: "#f8f9fa" }}>P{p}</td>
              {days.map((d) => {
                const slot = getSlot(d, p);
                return (
                  <td key={d} style={{ ...td, background: slot ? "#eef0ff" : "#fff" }}>
                    {slot ? (
                      <>
                        <div style={{ fontWeight: 600 }}>{slot.subject}</div>
                        <div style={{ color: "#888", fontSize: 11 }}>{slot.teacher}</div>
                        <div style={{ color: "#aaa", fontSize: 10 }}>{slot.room}</div>
                      </>
                    ) : "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: "10px 12px", background: "#6c63ff", color: "#fff", textAlign: "left", border: "1px solid #ddd" };
const td = { padding: "10px 12px", border: "1px solid #eee", verticalAlign: "top", minWidth: 110 };