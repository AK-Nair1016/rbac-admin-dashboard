import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";

const Login = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!authContext) {
        throw new Error("Auth context missing");
      }

      const res = await api.post("/auth/login", { email, password });
      authContext.login(res.data.token);
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
      {/* LEFT: ILLUSTRATION */}
      <div className={styles.left}>
        <img src="src/assets/loginImg.png" alt="Secure dashboard access"className={styles.image}
        />
      </div>

      {/* RIGHT: LOGIN */}
      <div className={styles.right}>
        <div className={styles.card}>
          <h1 className={styles.heading}>Login to Dashboard</h1>
          <p className={styles.subheading}>
            Secure access for administrators and managers
          </p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Authenticating…" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
