import { isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import loginImg from "../assets/loginImg.png";
import { useAuth } from "../auth/useAuth";
import styles from "./Login.module.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.token);
      navigate("/dashboard", { replace: true });
    } catch (requestError: unknown) {
      if (isAxiosError(requestError)) {
        setError(
          requestError.response?.data?.message ||
            "Invalid credentials. Please try again."
        );
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <img
          src={loginImg}
          alt="Secure access to the API Access Governance Platform"
          className={styles.image}
        />
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <h1 className={styles.heading}>Sign in to Access Governance</h1>
          <p className={styles.subheading}>
            Secure access to the API Access Governance Platform
          </p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              className={styles.input}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className={styles.input}
            />

            <button
              type="submit"
              disabled={loading}
              className={styles.primaryButton}
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
