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
  // 🔐 Auth context (role + permission logic)
  const { user, hasPermission } = useAuth();

  // 📦 Core data state
  const [entities, setEntities] = useState<Entity[]>([]);
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔎 Search states
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  // 📄 Pagination state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // 🔄 Status update state
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (!user) return null;

  // 📊 Calculate total pages
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  // 📑 Pagination number logic
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

  // 🌐 Fetch entities from backend
  const fetchEntities = async () => {
    try {
      setLoading(true);
      setError(null);

      const res =
        user.role === "user"
          ? await getMyEntities({
              page,
              limit: LIMIT,
              search: appliedSearch,
            })
          : await getAllEntities({
              page,
              limit: LIMIT,
              search: appliedSearch,
            });

      setEntities(res.data);
      setTotal(res.total);

      // 👥 Load assignable users for admin/manager
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

  // 🔄 Refetch when user/page/search changes
  useEffect(() => {
    fetchEntities();
  }, [user, page, appliedSearch]);

  // 🔁 Toggle entity ACTIVE/INACTIVE
  const handleStatusToggle = async (entity: Entity) => {
    const newStatus =
      entity.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      setUpdatingId(entity.id);
      await updateEntityStatus(entity.id, newStatus);

      // Optimistic UI update
      setEntities((prev) =>
        prev.map((e) =>
          e.id === entity.id ? { ...e, status: newStatus } : e
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // 👤 Assign user to entity + refetch
  const handleAssignUser = async (
    entityId: string,
    userId: string
  ) => {
    if (!userId) return;

    try {
      await assignUserToEntity(entityId, userId);
      await fetchEntities();
      alert("User assigned successfully");
    } catch {
      alert("Failed to assign user");
    }
  };

  if (loading) return <p className={styles.info}>Loading entities…</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  const canManage =
    user.role === "admin" || user.role === "manager";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Entities</h1>

      {/* 🔎 Search Section */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by entity name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <button
          className={styles.searchBtn}
          onClick={() => {
            setPage(1);               // Reset pagination
            setAppliedSearch(search); // Apply search filter
          }}
        >
          Search
        </button>
      </div>

      {/* 📋 Entity Table */}
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

      {/* 📑 Pagination */}
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
