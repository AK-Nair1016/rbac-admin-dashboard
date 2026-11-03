import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { createEntity } from "../../api/entities";
import styles from "./CreateEntity.module.css";

const CreateEntity = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user?.role === "user") {
    return <p>You are not allowed to create entities.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("📤 Creating entity:", { name, status });

      await createEntity({ name, status });

      console.log("✅ Entity created successfully");
      navigate("/entities");
    } catch (err) {
      console.error("❌ Create entity failed", err);
      setError("Failed to create entity");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className={styles.page}>
    <div className={styles.container}>
      <h1 className={styles.title}>Create Entity</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading}
        >
          {loading ? "Creating…" : "Create Entity"}
        </button>
      </form>
    </div>
  </div>
  );
};

export default CreateEntity;
