import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEntityById, updateEntity } from "../../api/entities";
import type { Entity } from "../../api/entities";

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
        setName(data.name);
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
        name,
        status,
      });

      navigate("/entities");
    } catch {
      setError("Failed to update entity");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading entity...</p>;
  if (error) return <p>{error}</p>;
  if (!entity) return <p>Entity not found</p>;

  return (
    <div>
      <h1>Edit Entity</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default EditEntity;
