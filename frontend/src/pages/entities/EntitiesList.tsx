import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getAllEntities, getMyEntities } from "../../api/entities";
import type { Entity } from "../../api/entities";
import styles from "./EntitiesList.module.css";

const LIMIT = 10;
const MAX_VISIBLE_PAGES = 5;

const EntitiesList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  if (!user) return null;

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  // 🔹 Page numbers generator (Google-style)
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];

    let start = Math.max(1, page - Math.floor(MAX_VISIBLE_PAGES / 2));
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          user.role === "user"
            ? await getMyEntities({ page, limit: LIMIT })
            : await getAllEntities({ page, limit: LIMIT });

        setEntities(response.data);
        setTotal(response.total);
      } catch {
        setError("Failed to load entities");
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, [user, page]);

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

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          className={styles.navBtn}
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ‹
        </button>

        {getPageNumbers().map((p) => (
          <button
            key={p}
            className={`${styles.pageBtn} ${
              p === page ? styles.activePage : ""
            }`}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}

        <button
          className={styles.navBtn}
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default EntitiesList;
