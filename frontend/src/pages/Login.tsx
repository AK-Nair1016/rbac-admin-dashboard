import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import loginImg from "../assets/loginImg.png";

const Login = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔐 Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ⏳ UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🚀 Handle login submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!authContext) {
        throw new Error("Auth context missing");
      }

      const res = await api.post("/auth/login", { email, password });

      // 🔑 Save token in context
      authContext.login(res.data.token);

      // 🔄 Redirect after login
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* 🖼 Left Illustration Panel */}
      <div className={styles.left}>
        <img
          src={loginImg}
          alt="Secure dashboard access"
          className={styles.image}
        />
      </div>

      {/* 🔐 Right Login Panel */}
      <div className={styles.right}>
        <div className={styles.card}>
          <h1 className={styles.heading}>Login to Dashboard</h1>
          <p className={styles.subheading}>
            Secure access for administrators and managers
          </p>

          {/* ❗ Error Message */}
          {error && <div className={styles.errorBox}>{error}</div>}

          {/* 📝 Login Form */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className={styles.input}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className={styles.input}
            />

            <button
              type="submit"
              disabled={loading}
              className={styles.primaryButton}
            >
              {loading ? "Authenticating…" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
