import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <h2 style={{ textAlign: "center" }}>No user found. Please login.</h2>;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        Automatic Timetable Generator
      </h1>

      <div style={styles.card}>
        <h2>Welcome {user.email}</h2>

        <div style={styles.buttons}>
          
          {/* ➕ ADD SUBJECT */}
          <button
            style={styles.btn}
            onClick={() => navigate("/add-subject")}
          >
            ➕ Add Subject
          </button>

          {/* 📅 GENERATE TIMETABLE */}
          <button
            style={styles.btn}
            onClick={() => navigate("/timetable")}
          >
            📅 Generate Timetable
          </button>

          {/* 🔓 LOGOUT */}
          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;



// 🎨 STYLES
const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "Arial",
  },
  title: {
    marginBottom: "30px",
  },
  card: {
    display: "inline-block",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    background: "#1e1e2f",
    color: "white",
  },
  buttons: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  btn: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    background: "#4CAF50",
    color: "white",
    cursor: "pointer",
  },
  logoutBtn: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    background: "#f44336",
    color: "white",
    cursor: "pointer",
  },
};