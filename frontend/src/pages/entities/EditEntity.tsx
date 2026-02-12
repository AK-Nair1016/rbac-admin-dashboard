import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEntityById, updateEntity } from "../../api/entities";
import type { Entity } from "../../api/entities";
import styles from "./EditEntity.module.css";

const EditEntity = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [entity, setEntity] = useState<Entity | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEntity = async () => {
      try {
        setLoading(true);
        const data = await getEntityById(id);

        setEntity(data);
        setName(data.name ?? "");
        setStatus(data.status ?? "ACTIVE");
      } catch {
        setError("Failed to load entity");
      } finally {
        setLoading(false);
      }
    };

    fetchEntity();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await updateEntity(id, {
        name: name.trim(),
        status,
      });

      navigate("/entities");
    } catch {
      setError("Failed to update entity");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.state}>Loading entity...</div>;
  if (!entity) return <div className={styles.state}>Entity not found</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Entity</h1>

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
          disabled={saving}
        >
          {saving ? "Updating…" : "Update Entity"}
        </button>
      </form>
    </div>
  );
};

export default EditEntity;
