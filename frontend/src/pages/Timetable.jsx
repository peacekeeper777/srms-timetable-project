import { useEffect, useState } from "react";
import axios from "axios";

function Timetable() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(`http://localhost:5000/timetable/${user._id}`);
    setData(res.data);
  };

  const deleteSlot = async (id) => {
    await axios.delete(`http://localhost:5000/delete-slot/${id}`);
    fetchData();
  };

  return (
    <div className="container mt-5">
      <h2>Timetable</h2>

      <table className="table table-bordered text-center">
        <thead>
          <tr>
            <th>Day</th>
            <th>Slot</th>
            <th>Subject</th>
            <th>Teacher</th>
            <th>Room</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.day}</td>
              <td>{item.slot}</td>
              <td>{item.subject}</td>
              <td>{item.teacher}</td>
              <td>{item.room}</td>
              <td>
                <button onClick={() => deleteSlot(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Timetable;