import { useState } from "react";
import axios from "axios";
import { CalendarDays, LogIn } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../utils/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email: email.trim(),
        password,
      });

      if (!res.data?.user) {
        setError(res.data?.message || "Login failed.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
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
            <h1 className="title">Sign in</h1>
          </div>
        </div>

        <form className="card auth-card form" onSubmit={handleLogin}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button className="button" type="submit" disabled={loading}>
            <LogIn size={18} />
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
