import { Edit3 } from "lucide-react";
import type { AssignableUser, Entity } from "../../api/entities";
import { Button } from "../common";
import styles from "./EntityActions.module.css";

interface EntityActionsProps {
  canAssign: boolean;
  canWrite: boolean;
  entity: Entity;
  users: AssignableUser[];
  updating: boolean;
  onAssignUser: (entityId: string, userId: string) => void;
  onEdit: (entityId: string) => void;
  onStatusToggle: (entity: Entity) => void;
}

const EntityActions = ({
  canAssign,
  canWrite,
  entity,
  users,
  updating,
  onAssignUser,
  onEdit,
  onStatusToggle,
}: EntityActionsProps) => {
  if (!canWrite) {
    return <span className={styles.placeholder}>No actions</span>;
  }

  return (
    <div className={styles.actions}>
      {canAssign && (
        <label className={styles.assignLabel}>
          <span className={styles.srOnly}>Assign user to {entity.name}</span>
          <select
            className={styles.assignSelect}
            defaultValue=""
            onChange={(event) => onAssignUser(entity.id, event.target.value)}
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
        </label>
      )}
      <Button
        aria-label={`Edit ${entity.name}`}
        onClick={() => onEdit(entity.id)}
        variant="secondary"
      >
        <Edit3 size={15} aria-hidden="true" />
        Edit
      </Button>
      <Button
        disabled={updating}
        onClick={() => onStatusToggle(entity)}
        variant={entity.status === "ACTIVE" ? "secondary" : "primary"}
      >
        {updating
          ? "Updating..."
          : entity.status === "ACTIVE"
            ? "Deactivate"
            : "Activate"}
      </Button>
    </div>
  );
};

export default EntityActions;
