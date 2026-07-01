import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEntity } from "../../api/entities";
import { useAuth } from "../../auth/useAuth";
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createEntity({ name, status });
      navigate("/entities");
    } catch (createError) {
      console.error("Failed to create entity", createError);
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
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </div>

          <div className={styles.field}>
            <label>Status</label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Creating..." : "Create Entity"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEntity;
