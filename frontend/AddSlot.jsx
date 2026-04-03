import { useState } from "react";
import axios from "axios";

function AddSlot() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    day: "",
    slot: "",
    subject: "",
    teacher: "",
    room: "",
  });

  const handleSubmit = async () => {
    await axios.post("http://localhost:5000/add-slot", {
      ...form,
      userId: user._id,
    });

    alert("Slot added");
  };

  return (
    <div className="container mt-5">
      <h3>Add Timetable Slot</h3>

      <input placeholder="Day" onChange={(e) => setForm({ ...form, day: e.target.value })} />
      <input placeholder="Slot (9-10)" onChange={(e) => setForm({ ...form, slot: e.target.value })} />
      <input placeholder="Subject" onChange={(e) => setForm({ ...form, subject: e.target.value })} />
      <input placeholder="Teacher" onChange={(e) => setForm({ ...form, teacher: e.target.value })} />
      <input placeholder="Room" onChange={(e) => setForm({ ...form, room: e.target.value })} />

      <button onClick={handleSubmit}>Add</button>
    </div>
  );
}

export default AddSlot;