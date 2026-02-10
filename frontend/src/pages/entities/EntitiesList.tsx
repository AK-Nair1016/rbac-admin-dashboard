import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  getAllEntities,
  getMyEntities,
  updateEntityStatus,
  getAssignableUsers,
  assignUserToEntity,
} from "../../api/entities";
import type { Entity } from "../../api/entities";
import styles from "./EntitiesList.module.css";

const LIMIT = 10;
const MAX_VISIBLE_PAGES = 5;

interface AssignableUser {
  id: string;
  email: string;
  employee_id: string;
}

const EntitiesList = () => {
  const { user, hasPermission } = useAuth();

  const [entities, setEntities] = useState<Entity[]>([]);
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (!user) return null;

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    let start = Math.max(1, page - Math.floor(MAX_VISIBLE_PAGES / 2));
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res =
          user.role === "user"
            ? await getMyEntities({ page, limit: LIMIT })
            : await getAllEntities({ page, limit: LIMIT });

        setEntities(res.data);
        setTotal(res.total);

        if (user.role === "admin" || user.role === "manager") {
          const userList = await getAssignableUsers();
          setUsers(userList);
        }
      } catch (err) {
        console.error("❌ Failed to load entities", err);
        setError("Failed to load entities");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, page]);

  const handleStatusToggle = async (entity: Entity) => {
    const newStatus =
      entity.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      setUpdatingId(entity.id);
      await updateEntityStatus(entity.id, newStatus);

      setEntities((prev) =>
        prev.map((e) =>
          e.id === entity.id ? { ...e, status: newStatus } : e
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAssignUser = async (
    
    entityId: string,
    userId: string
  ) => {
    if (!userId) return;
    console.group("🧩 Assign User to Entity");
console.log("entityId:", entityId);
console.log("userId:", userId);
console.groupEnd();

    try {
      await assignUserToEntity(entityId, userId);
      alert("User assigned successfully");
    } catch {
      alert("Failed to assign user");
    }
    console.log("✅ Assignment API success");

  };

  if (loading) return <p className={styles.info}>Loading entities…</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  const canManage =
    user.role === "admin" || user.role === "manager";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Entities</h1>

      <div className={styles.table}>
        <div className={styles.header}>
          <span>Name</span>
          <span>Status</span>
          <span>Assigned User</span>
          <span>Actions</span>
        </div>

        {entities.map((entity) => {
          const canRead =
            canManage || hasPermission(entity.id, "READ");
          const canWrite =
            canManage || hasPermission(entity.id, "WRITE");

          if (!canRead) return null;

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
                {canManage && canWrite ? (
                  <select
                    defaultValue=""
                    onChange={(e) =>
                      handleAssignUser(entity.id, e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Assign user
                    </option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.email}
                      </option>
                    ))}
                  </select>
                ) : (
                  "-"
                )}
              </span>

              <span>
                {canWrite && (
                  <button
                    className={styles.statusToggleBtn}
                    disabled={updatingId === entity.id}
                    onClick={() => handleStatusToggle(entity)}
                  >
                    {updatingId === entity.id
                      ? "Updating…"
                      : entity.status === "ACTIVE"
                      ? "Deactivate"
                      : "Activate"}
                  </button>
                )}
              </span>
            </div>
          );
        })}
      </div>

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
