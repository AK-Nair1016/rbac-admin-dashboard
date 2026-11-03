import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  assignUserToEntity,
  getAllEntities,
  getAssignableUsers,
  getMyEntities,
  updateEntityStatus,
} from "../../api/entities";
import type { AssignableUser, Entity } from "../../api/entities";
import { useAuth } from "../../auth/useAuth";
import {
  EmptyState,
  ErrorState,
  FeedbackBanner,
  LoadingState,
  PageHeader,
  Pagination,
  SectionCard,
} from "../../components/common";
import { EntityTable, EntityToolbar } from "../../components/entities";
import styles from "./EntitiesList.module.css";

const LIMIT = 10;

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
  const [feedback, setFeedback] = useState<{
    tone: "success" | "danger" | "info";
    message: string;
  } | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

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
      } catch {
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
    } catch {
      setFeedback({
        tone: "danger",
        message: "Failed to update entity status.",
      });
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

      setFeedback({
        tone: "success",
        message: "User assigned successfully.",
      });
    } catch {
      setFeedback({
        tone: "danger",
        message: "Failed to assign user.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const canManage = user.role === "admin" || user.role === "manager";

  return (
    <div className={styles.page}>
      <PageHeader
        title="Entities"
        description="Manage access-governed entities and user assignments."
      />

      {feedback && (
        <FeedbackBanner
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
          tone={feedback.tone}
        />
      )}

      <SectionCard>
        <EntityToolbar
          canManage={canManage}
          search={search}
          onCreate={() => navigate("/entities/new")}
          onSearchChange={setSearch}
          onSearchSubmit={() => {
            setPage(1);
            setAppliedSearch(search);
          }}
        />
      </SectionCard>

      <SectionCard>
        {loading && <LoadingState message="Loading entities..." />}
        {!loading && error && (
          <ErrorState title="Entities unavailable" message={error} />
        )}
        {!loading && !error && total === 0 && (
          <EmptyState message="No entities found." />
        )}
        {!loading && !error && total > 0 && (
          <>
            <EntityTable
              canManage={canManage}
              entities={entities}
              hasPermission={hasPermission}
              users={users}
              updatingId={updatingId}
              onAssignUser={handleAssignUser}
              onEdit={(entityId) => navigate(`/entities/${entityId}/edit`)}
              onStatusToggle={handleStatusToggle}
            />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </SectionCard>
    </div>
  );
};

export default EntitiesList;
