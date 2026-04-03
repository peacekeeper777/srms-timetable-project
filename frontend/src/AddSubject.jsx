import { useState } from "react";
import axios from "axios";

function AddSubject() {
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleAdd = async () => {
    await axios.post("http://localhost:5000/add-subject", {
      name,
      teacher,
      userId: user._id,
    });

    alert("Subject added");
    setName("");
    setTeacher("");
  };

  return (
    <div className="container mt-5">
      <h2>Add Subject</h2>

      <input
        className="form-control mb-2"
        placeholder="Subject"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Teacher"
        value={teacher}
        onChange={(e) => setTeacher(e.target.value)}
      />

      <button className="btn btn-primary" onClick={handleAdd}>
        Add
      </button>
    </div>
  );
}

export default AddSubject;