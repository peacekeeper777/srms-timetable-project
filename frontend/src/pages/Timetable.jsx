import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Constants to build the grid structure
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const SLOTS = ["1", "2", "3", "4", "5", "6"];

function Timetable() {
  const navigate = useNavigate();
  // Safe parsing to prevent crash
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const [data, setData] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!user || !user._id) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/timetable/${user._id}`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch timetable", err);
    }
  };

  // Helper function to map data to the correct grid cell
  const getSlotData = (day, slot) => {
    return data.find((item) => item.day === day && item.slot === String(slot));
  };

  const deleteSlot = async (id) => {
    if (window.confirm("Are you sure you want to delete this class slot?")) {
      try {
        await axios.delete(`${API_URL}/delete-slot/${id}`);
        fetchData(); // Refresh the grid
      } catch (err) {
        console.error("Failed to delete slot", err);
      }
    }
  };

  if (!user) return null; // Prevents render error while redirecting

  return (
    <div style={{ padding: "20px" }}>
      <h2>University Timetable</h2>
      
      <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>Day / Slot</th>
            {SLOTS.map(s => <th key={s}>Slot {s}</th>)}
          </tr>
        </thead>
        <tbody>
          {DAYS.map((day) => (
            <tr key={day}>
              <td style={{ fontWeight: "bold", backgroundColor: "#fafafa" }}>{day}</td>
              
              {SLOTS.map((slot) => {
                const session = getSlotData(day, slot); // Check if a class exists here
                
                return (
                  <td key={slot} style={{ height: "80px", width: "150px" }}>
                    {session ? (
                      <div style={{ fontSize: "0.8rem", padding: "5px" }}>
                        <strong>{session.subject}</strong><br />
                        {session.teacher}<br />
                        <em>Room: {session.room}</em><br />
                        <button 
                          onClick={() => deleteSlot(session._id)}
                          style={{ fontSize: "10px", marginTop: "5px", cursor: "pointer", background: "#ff4d4d", color: "white", border: "none", borderRadius: "3px", padding: "3px 6px" }}
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: "#ccc" }}>Free</span>
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

export default Timetable;