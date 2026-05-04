import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./utils/api";
import { getStoredUser } from "./utils/auth";

function AddSubject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = getStoredUser();

  const [form, setForm] = useState({
    day: "Monday",
    slot: 1,
    className: "",
    subject: "",
    teacher: "",
    room: "",
  });

  useEffect(() => {
    if (!user || !user._id) {
      navigate("/login");
    }
  }, [user, navigate]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user?._id) return;

    setLoading(true);
    try {
      const payload = {
        ...form,
        slot: Number(form.slot),
        userId: user._id,
      };

      await axios.post(`${API_URL}/add-slot`, payload);
      navigate("/timetable");
    } catch (err) {
      setError(err.response?.data?.message || "Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <main className="page">
      <header className="app-header">
        <div>
          <p className="eyebrow">Manual entry</p>
          <h1 className="title">Add class slot</h1>
          <p className="subtitle">Create one timetable entry for the selected day and slot.</p>
        </div>
        <button className="button button-secondary" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={18} />
          Dashboard
        </button>
      </header>

      <section className="content">
        <form className="card form-card form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="day">Day</label>
              <select id="day" className="select" value={form.day} onChange={(e) => updateForm("day", e.target.value)}>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="slot">Slot number</label>
              <input
                id="slot"
                className="input"
                min="1"
                max="6"
                type="number"
                required
                value={form.slot}
                onChange={(e) => updateForm("slot", e.target.value)}
              />
            </div>

            <div className="field field-full">
              <label htmlFor="className">Class or section</label>
              <input
                id="className"
                className="input"
                placeholder="e.g. CSE-3A"
                required
                value={form.className}
                onChange={(e) => updateForm("className", e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                className="input"
                placeholder="e.g. Data Structures"
                required
                value={form.subject}
                onChange={(e) => updateForm("subject", e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="teacher">Teacher</label>
              <input
                id="teacher"
                className="input"
                placeholder="e.g. Dr. Sharma"
                required
                value={form.teacher}
                onChange={(e) => updateForm("teacher", e.target.value)}
              />
            </div>

            <div className="field field-full">
              <label htmlFor="room">Room</label>
              <input
                id="room"
                className="input"
                placeholder="e.g. Lab-2 or Room 512"
                required
                value={form.room}
                onChange={(e) => updateForm("room", e.target.value)}
              />
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <button className="button" disabled={loading} type="submit">
            <Save size={18} />
            {loading ? "Saving..." : "Save slot"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AddSubject;
