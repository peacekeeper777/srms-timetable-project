import { useState } from "react";
import axios from "axios";
import { CalendarDays, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Fill all fields before registering.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/register`, {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      alert(res.data.message);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page page-narrow">
      <section className="auth-shell">
        <div className="brand">
          <div className="brand-mark">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="eyebrow">AI Timetable</p>
            <h1 className="title">Create account</h1>
          </div>
        </div>

        <form className="card auth-card form" onSubmit={handleRegister}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              className="input"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              className="input"
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button className="button" type="submit" disabled={loading}>
            <UserPlus size={18} />
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already registered? <Link to="/">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
