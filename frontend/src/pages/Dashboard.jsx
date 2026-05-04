import { CalendarPlus, LogOut, Sparkles, Table2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../utils/auth";

function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();

  if (!user) {
    return (
      <main className="page page-narrow">
        <div className="card auth-card">
          <h2>Session expired</h2>
          <p className="subtitle">Please sign in again to continue.</p>
          <button className="button" onClick={() => navigate("/login")}>Sign in</button>
        </div>
      </main>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <main className="page">
      <header className="app-header">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1 className="title">Automatic Timetable Generator</h1>
          <p className="subtitle">Signed in as {user.email}</p>
        </div>
        <div className="header-actions">
          <button className="button button-secondary" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <section className="content dashboard-grid">
        <article className="card action-card">
          <CalendarPlus size={26} color="#2563eb" />
          <h3>Add class slot</h3>
          <p>Create a manual timetable entry with class, subject, teacher, room, day, and slot.</p>
          <button className="button" onClick={() => navigate("/add-subject")}>
            Add slot
          </button>
        </article>

        <article className="card action-card">
          <Table2 size={26} color="#0f766e" />
          <h3>View timetable</h3>
          <p>Review saved timetable entries in a clean weekly grid and remove incorrect slots.</p>
          <button className="button" onClick={() => navigate("/timetable")}>
            Open timetable
          </button>
        </article>

        <article className="card action-card">
          <Sparkles size={26} color="#7c3aed" />
          <h3>AI generator</h3>
          <p>Generate and analyze a timetable using your AI scheduling flow.</p>
          <button className="button" onClick={() => navigate("/generate")}>
            Generate with AI
          </button>
        </article>
      </section>
    </main>
  );
}

export default Dashboard;
