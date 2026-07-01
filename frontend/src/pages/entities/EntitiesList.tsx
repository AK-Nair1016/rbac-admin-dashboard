import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  assignUserToEntity,
  getAllEntities,
  getAssignableUsers,
  getMyEntities,
  updateEntityStatus,
} from "../../api/entities";
import type { Entity } from "../../api/entities";
import { useAuth } from "../../auth/useAuth";
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
  const navigate = useNavigate();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    let start = Math.max(1, page - Math.floor(MAX_VISIBLE_PAGES / 2));
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }

    for (let currentPage = start; currentPage <= end; currentPage += 1) {
      pages.push(currentPage);
    }

    return pages;
  };

  useEffect(() => {
    if (!user) {
      setEntities([]);
      setUsers([]);
      setLoading(false);
      return;
    }

    const fetchEntities = async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
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

        setEntities(response.data);
        setTotal(response.total);

        if (user.role === "admin" || user.role === "manager") {
          const assignableUsers = await getAssignableUsers();
          setUsers(assignableUsers);
        }
      } catch (fetchError) {
        console.error("Failed to load entities", fetchError);
        setError("Failed to load entities");
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, [appliedSearch, page, user]);

  const handleStatusToggle = async (entity: Entity) => {
    const newStatus = entity.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      setUpdatingId(entity.id);
      await updateEntityStatus(entity.id, newStatus);

      setEntities((previousEntities) =>
        previousEntities.map((currentEntity) =>
          currentEntity.id === entity.id
            ? { ...currentEntity, status: newStatus }
            : currentEntity
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAssignUser = async (entityId: string, userId: string) => {
    if (!user || !userId) {
      return;
    }

    try {
      await assignUserToEntity(entityId, userId);
      setLoading(true);
      setError(null);

      const response =
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

      setEntities(response.data);
      setTotal(response.total);

      if (user.role === "admin" || user.role === "manager") {
        const assignableUsers = await getAssignableUsers();
        setUsers(assignableUsers);
      }

      alert("User assigned successfully");
    } catch {
      alert("Failed to assign user");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) return <p className={styles.info}>Loading entities...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  const canManage = user.role === "admin" || user.role === "manager";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Entities</h1>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by entity name..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className={styles.searchInput}
        />

        <button
          className={styles.searchBtn}
          onClick={() => {
            setPage(1);
            setAppliedSearch(search);
          }}
        >
          Search
        </button>
      </div>

      <div className={styles.table}>
        <div className={styles.header}>
          <span>Name</span>
          <span>Status</span>
          <span>Assigned User</span>
          <span>Actions</span>
        </div>

        {entities.map((entity) => {
          const canRead = canManage || hasPermission(entity.id, "READ");
          const canWrite = canManage || hasPermission(entity.id, "WRITE");

          if (!canRead) {
            return null;
          }

          return (
            <div key={entity.id} className={styles.row}>
              <span>{entity.name}</span>

              <span
                className={`${styles.status} ${
                  entity.status === "ACTIVE" ? styles.active : styles.inactive
                }`}
              >
                {entity.status}
              </span>

              <span>
                {canManage && canWrite ? (
                  <select
                    className={styles.assignDropdown}
                    defaultValue=""
                    onChange={(event) =>
                      handleAssignUser(entity.id, event.target.value)
                    }
                  >
                    <option value="" disabled>
                      Assign user
                    </option>
                    {users.map((assignableUser) => (
                      <option key={assignableUser.id} value={assignableUser.id}>
                        {assignableUser.email}
                      </option>
                    ))}
                  </select>
                ) : (
                  "-"
                )}
              </span>

              <span className={styles.actionsCell}>
                {canWrite && (
                  <>
                    <button
                      className={styles.editBtn}
                      onClick={() => navigate(`/entities/${entity.id}/edit`)}
                    >
                      Edit
                    </button>

                    <button
                      className={styles.statusToggleBtn}
                      disabled={updatingId === entity.id}
                      onClick={() => handleStatusToggle(entity)}
                    >
                      {updatingId === entity.id
                        ? "Updating..."
                        : entity.status === "ACTIVE"
                          ? "Deactivate"
                          : "Activate"}
                    </button>
                  </>
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
          Previous
        </button>

        {getPageNumbers().map((currentPage) => (
          <button
            key={currentPage}
            className={`${styles.pageBtn} ${
              currentPage === page ? styles.activePage : ""
            }`}
            onClick={() => setPage(currentPage)}
          >
            {currentPage}
          </button>
        ))}

        <button
          className={styles.navBtn}
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EntitiesList;
