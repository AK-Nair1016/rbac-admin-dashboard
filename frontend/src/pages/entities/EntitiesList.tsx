import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getAllEntities, getMyEntities } from "../../api/entities";
import type { Entity } from "../../api/entities";
import styles from "./EntitiesList.module.css";

const EntitiesList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setLoading(true);

        const response =
          user.role === "user"
            ? await getMyEntities()
            : await getAllEntities();

        setEntities(response.data);
      } catch {
        setError("Failed to load entities");
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, [user]);

  if (loading) return <p className={styles.info}>Loading entities…</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (entities.length === 0)
    return <p className={styles.info}>No entities found</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Entities</h1>

      <div className={styles.table}>
        <div className={styles.header}>
          <span>Name</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {entities.map((entity) => {
          const canEdit =
            user.role === "admin" ||
            user.role === "manager" ||
            (user.role === "user" &&
              entity.ownerId === user.userId);

          return (
            <div key={entity.id} className={styles.row}>
              <span>{entity.name}</span>

              <span
                className={`${styles.status} ${
                  entity.status === "ACTIVE"
                    ? styles.active
                    : styles.inactive
                }`}
              >
                {entity.status}
              </span>

              <span>
                {canEdit && (
                  <button
                    className={styles.editBtn}
                    onClick={() =>
                      navigate(`/entities/${entity.id}/edit`)
                    }
                  >
                    Edit
                  </button>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EntitiesList;
