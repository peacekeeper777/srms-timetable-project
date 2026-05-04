import { useState } from "react";
import axios from "axios";
import { ArrowLeft, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AIPanel from "../components/AIPanel";
import { API_URL } from "../utils/api";
import { getStoredUser } from "../utils/auth";

const defaultSubject = {
  name: "",
  teacher: "",
  hoursPerWeek: 3,
  requiresLab: false,
};

const sampleSubjects = [
  { name: "Data Structures", teacher: "Dr. Sharma", hoursPerWeek: 4, requiresLab: true },
  { name: "Database Systems", teacher: "Prof. Khan", hoursPerWeek: 3, requiresLab: true },
  { name: "Operating Systems", teacher: "Dr. Mehta", hoursPerWeek: 3, requiresLab: false },
  { name: "Mathematics", teacher: "Prof. Rao", hoursPerWeek: 4, requiresLab: false },
];

export default function GeneratePage() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [className, setClassName] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([{ ...defaultSubject }]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const updateSubject = (index, field, value) => {
    setSubjects((current) =>
      current.map((subject, subjectIndex) =>
        subjectIndex === index ? { ...subject, [field]: value } : subject
      )
    );
  };

  const addSubject = () => {
    setSubjects((current) => [...current, { ...defaultSubject }]);
  };

  const removeSubject = (index) => {
    setSubjects((current) => current.filter((_, subjectIndex) => subjectIndex !== index));
  };

  const loadSamples = () => {
    setClassName("CSE-3A");
    setSemester("Semester 3");
    setSubjects(sampleSubjects);
    setError("");
    setNotice("Sample subjects added. You can edit them before generating.");
  };

  const generate = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    const cleanSubjects = subjects.filter((subject) => subject.name.trim());
    if (!className.trim()) return setError("Enter a class or section name.");
    if (cleanSubjects.length === 0) return setError("Add at least one subject.");

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/generate`, {
        className,
        semester,
        subjects: cleanSubjects,
      });
      setResult(res.data.timetable);
      setNotice("AI timetable generated. Review it below before saving to your weekly grid.");
    } catch (err) {
      setError(err.response?.data?.error || "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const saveToWeeklyGrid = async () => {
    if (!user?._id || !result?.slots?.length) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const requests = result.slots.map((slot) =>
        axios.post(`${API_URL}/add-slot`, {
          day: slot.day,
          slot: slot.period,
          className: result.className,
          subject: slot.subject,
          teacher: slot.teacher,
          room: slot.room,
          userId: user._id,
        })
      );

      await Promise.allSettled(requests);
      setNotice("Generated slots were sent to your weekly grid. Existing occupied cells were skipped by the backend.");
    } catch {
      setError("Could not save generated slots to the weekly grid.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page ai-page">
      <header className="app-header">
        <div>
          <p className="eyebrow">AI assistant</p>
          <h1 className="title">Generate timetable</h1>
          <p className="subtitle">Add subjects, click generate, then review AI suggestions in simple language.</p>
        </div>
        <div className="header-actions">
          <button className="button button-secondary" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={18} />
            Dashboard
          </button>
          <button className="button button-secondary" onClick={loadSamples}>
            Use sample data
          </button>
        </div>
      </header>

      <section className="content ai-layout">
        <form className="card form-card ai-form form" onSubmit={generate}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="className">Class or section</label>
              <input
                id="className"
                className="input"
                placeholder="e.g. CSE-3A"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="semester">Semester</label>
              <input
                id="semester"
                className="input"
                placeholder="e.g. Semester 3"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </div>
          </div>

          <div className="subject-list">
            <div className="section-heading">
              <div>
                <h2>Subjects</h2>
                <p className="subtitle">Enter what should appear in the timetable.</p>
              </div>
              <button className="button button-secondary" type="button" onClick={addSubject}>
                <Plus size={18} />
                Add subject
              </button>
            </div>

            {subjects.map((subject, index) => (
              <div className="subject-row" key={index}>
                <div className="field">
                  <label>Subject</label>
                  <input
                    className="input"
                    placeholder="Subject name"
                    value={subject.name}
                    onChange={(e) => updateSubject(index, "name", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Teacher</label>
                  <input
                    className="input"
                    placeholder="Teacher name"
                    value={subject.teacher}
                    onChange={(e) => updateSubject(index, "teacher", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Hours/week</label>
                  <input
                    className="input"
                    min="1"
                    max="6"
                    type="number"
                    value={subject.hoursPerWeek}
                    onChange={(e) => updateSubject(index, "hoursPerWeek", e.target.value)}
                  />
                </div>
                <label className="check-field">
                  <input
                    type="checkbox"
                    checked={subject.requiresLab}
                    onChange={(e) => updateSubject(index, "requiresLab", e.target.checked)}
                  />
                  Needs lab
                </label>
                <button className="icon-button" type="button" onClick={() => removeSubject(index)} aria-label="Remove subject">
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>

          {error && <p className="error">{error}</p>}
          {notice && <p className="notice">{notice}</p>}

          <button className="button" type="submit" disabled={loading}>
            <Sparkles size={18} />
            {loading ? "Generating..." : "Generate with AI"}
          </button>
        </form>

        <aside className="card ai-help">
          <h2>How to use</h2>
          <ol>
            <li>Enter your class name.</li>
            <li>Add subjects, teachers, and weekly hours.</li>
            <li>Mark lab subjects if needed.</li>
            <li>Generate and review the AI explanation.</li>
            <li>Save the result to your weekly timetable grid.</li>
          </ol>
        </aside>
      </section>

      {result && (
        <section className="content ai-results">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Generated result</p>
              <h2>{result.className}</h2>
            </div>
            <button className="button" onClick={saveToWeeklyGrid} disabled={saving || !user}>
              <Save size={18} />
              {saving ? "Saving..." : "Save to weekly grid"}
            </button>
          </div>
          <GeneratedTimetable slots={result.slots || []} />
          <AIPanel timetable={result} />
        </section>
      )}
    </main>
  );
}

function GeneratedTimetable({ slots }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = [1, 2, 3, 4, 5, 6];

  const getSlot = (day, period) =>
    slots.find((slot) => slot.day === day && slot.period === period);

  return (
    <div className="table-wrap">
      <table className="timetable">
        <thead>
          <tr>
            <th>Period</th>
            {days.map((day) => <th key={day}>{day}</th>)}
          </tr>
        </thead>
        <tbody>
          {periods.map((period) => (
            <tr key={period}>
              <td className="day-cell">P{period}</td>
              {days.map((day) => {
                const slot = getSlot(day, period);
                return (
                  <td key={day} className="slot-cell">
                    {slot ? (
                      <div className="session-card">
                        <span className="session-title">{slot.subject}</span>
                        <span className="session-meta">{slot.teacher}</span>
                        <span className="session-meta">Room: {slot.room}</span>
                      </div>
                    ) : (
                      <span className="empty-slot">Free</span>
                    )}
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
