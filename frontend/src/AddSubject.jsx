import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddSubject() {
  const navigate = useNavigate();
  // Safe parsing to prevent application crash if user is not logged in
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const [form, setForm] = useState({
    day: "Monday", // Default select values to prevent empty strings
    slot: "1",     
    subject: "",
    teacher: "",
    room: "",
  });

  // Redirect to login if user object doesn't exist
  useEffect(() => {
    if (!user || !user._id) {
      alert("Please log in to add subjects.");
      navigate("/login"); // Adjust route to your actual login page
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (!user?._id) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      await axios.post(`${API_URL}/add-slot`, {
        ...form,
        userId: user._id,
      });

      alert("Slot added successfully!");
      navigate("/timetable"); // Go back to timetable to see updates
    } catch (err) {
      alert(err.response?.data?.message || "Error adding slot");
    }
  };

  if (!user) return null; // Don't render form if redirecting

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add New Class</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
        </select>
        
        <input placeholder="Slot Number (e.g. 1)" type="number" required value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })} />
        <input placeholder="Subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <input placeholder="Teacher" required value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} />
        <input placeholder="Room" required value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />

        <button type="submit">Add Slot</button>
      </form>
    </div>
  );
}

export default AddSubject;