import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Plus, Save, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import { getStoredUser } from "../utils/auth";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const SLOTS = [1, 2, 3, 4, 5, 6];

const emptySlotForm = {
  day: "Monday",
  slot: 1,
  className: "",
  subject: "",
  teacher: "",
  room: "",
};

function Timetable() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [slotForm, setSlotForm] = useState(emptySlotForm);

  const fetchData = useCallback(async () => {
    if (!user?._id) return;

    try {
      const res = await axios.get(`${API_URL}/timetable/${user._id}`);
      const slotArray = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setData(slotArray);
      setError("");
    } catch (err) {
      console.error("Failed to fetch timetable:", err);
      setError("Could not load timetable data.");
      setData([]);
    }
  }, [user?._id]);

  useEffect(() => {
    if (!user || !user._id) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [fetchData, user, navigate]);

  const getSlotData = (day, slot) => {
    return data.find((item) => {
      if (!item.day || !item.slot) return false;

      const itemDay = String(item.day).trim().toLowerCase();
      const gridDay = String(day).trim().toLowerCase();
      const itemSlot = String(item.slot).trim();
      const gridSlot = String(slot).trim();

      return itemDay === gridDay && itemSlot === gridSlot;
    });
  };

  const openAddModal = (day = "Monday", slot = 1) => {
    setError("");
    setSlotForm({
      ...emptySlotForm,
      day,
      slot,
    });
    setModalOpen(true);
  };

  const closeAddModal = () => {
    if (saving) return;
    setModalOpen(false);
    setSlotForm(emptySlotForm);
  };

  const updateSlotForm = (field, value) => {
    setSlotForm((current) => ({ ...current, [field]: value }));
  };

  const saveSlot = async (e) => {
    e.preventDefault();
    if (!user?._id) return;

    setSaving(true);
    setError("");

    try {
      await axios.post(`${API_URL}/add-slot`, {
        ...slotForm,
        slot: Number(slotForm.slot),
        userId: user._id,
      });
      closeAddModal();
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save this slot.");
    } finally {
      setSaving(false);
    }
  };

  const deleteSlot = async (id) => {
    if (window.confirm("Are you sure you want to delete this class slot?")) {
      try {
        await axios.delete(`${API_URL}/delete-slot/${id}`);
        fetchData();
      } catch (err) {
        console.error("Failed to delete slot", err);
        setError("Could not delete the selected slot.");
      }
    }
  };

  if (!user) return null;

  return (
    <main className="page timetable-page">
      <header className="app-header">
        <div>
          <p className="eyebrow">Weekly grid</p>
          <h1 className="title">University timetable</h1>
          <p className="subtitle">{data.length} saved class slots</p>
        </div>
        <div className="header-actions">
          <button className="button button-secondary" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={18} />
            Dashboard
          </button>
          <button className="button" onClick={() => openAddModal()}>
            <Plus size={18} />
            Add slot
          </button>
        </div>
      </header>

      <section className="content">
        {error && <p className="error page-error">{error}</p>}

        <div className="table-wrap">
          <table className="timetable">
            <thead>
              <tr>
                <th>Day / Slot</th>
                {SLOTS.map((slot) => <th key={slot}>Slot {slot}</th>)}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day}>
                  <td className="day-cell">{day}</td>
                  {SLOTS.map((slot) => {
                    const session = getSlotData(day, slot);

                    return (
                      <td key={slot} className="slot-cell">
                        {session ? (
                          <div className="session-card">
                            <div>
                              <span className="session-title">{session.subject}</span>
                              <span className="session-class">{session.className}</span>
                            </div>
                            <span className="session-meta">{session.teacher}</span>
                            <span className="session-meta">Room: {session.room}</span>
                            <button className="button button-danger button-small" onClick={() => deleteSlot(session._id)}>
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        ) : (
                          <button className="empty-slot-button" onClick={() => openAddModal(day, slot)}>
                            <Plus size={16} />
                            Add class
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={closeAddModal}>
          <form className="modal-panel form" onSubmit={saveSlot} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">Insert slot</p>
                <h2>Add class to timetable</h2>
              </div>
              <button className="icon-button" type="button" onClick={closeAddModal} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="modal-day">Day</label>
                <select id="modal-day" className="select" value={slotForm.day} onChange={(e) => updateSlotForm("day", e.target.value)}>
                  {DAYS.map((day) => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>

              <div className="field">
                <label htmlFor="modal-slot">Slot</label>
                <select id="modal-slot" className="select" value={slotForm.slot} onChange={(e) => updateSlotForm("slot", e.target.value)}>
                  {SLOTS.map((slot) => <option key={slot} value={slot}>Slot {slot}</option>)}
                </select>
              </div>

              <div className="field field-full">
                <label htmlFor="modal-class">Class or section</label>
                <input
                  id="modal-class"
                  className="input"
                  placeholder="e.g. CSE-3A"
                  required
                  value={slotForm.className}
                  onChange={(e) => updateSlotForm("className", e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="modal-subject">Subject</label>
                <input
                  id="modal-subject"
                  className="input"
                  placeholder="e.g. Data Structures"
                  required
                  value={slotForm.subject}
                  onChange={(e) => updateSlotForm("subject", e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="modal-teacher">Teacher</label>
                <input
                  id="modal-teacher"
                  className="input"
                  placeholder="e.g. Dr. Sharma"
                  required
                  value={slotForm.teacher}
                  onChange={(e) => updateSlotForm("teacher", e.target.value)}
                />
              </div>

              <div className="field field-full">
                <label htmlFor="modal-room">Room</label>
                <input
                  id="modal-room"
                  className="input"
                  placeholder="e.g. Lab-2 or Room 512"
                  required
                  value={slotForm.room}
                  onChange={(e) => updateSlotForm("room", e.target.value)}
                />
              </div>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="modal-actions">
              <button className="button button-secondary" type="button" onClick={closeAddModal}>
                Cancel
              </button>
              <button className="button" type="submit" disabled={saving}>
                <Save size={18} />
                {saving ? "Saving..." : "Save class"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default Timetable;
