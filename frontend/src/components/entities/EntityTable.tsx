import type { AssignableUser, Entity } from "../../api/entities";
import type { DataTableColumn } from "../tables";
import { DataTable } from "../tables";
import { StatusBadge } from "../common";
import EntityActions from "./EntityActions";

interface EntityTableProps {
  canManage: boolean;
  entities: Entity[];
  hasPermission: (entityId: string, permission: "READ" | "WRITE") => boolean;
  users: AssignableUser[];
  updatingId: string | null;
  onAssignUser: (entityId: string, userId: string) => void;
  onEdit: (entityId: string) => void;
  onStatusToggle: (entity: Entity) => void;
}

const EntityTable = ({
  canManage,
  entities,
  hasPermission,
  users,
  updatingId,
  onAssignUser,
  onEdit,
  onStatusToggle,
}: EntityTableProps) => {
  const visibleEntities = entities.filter(
    (entity) => canManage || hasPermission(entity.id, "READ")
  );

  const columns: DataTableColumn<Entity>[] = [
    {
      key: "name",
      header: "Name",
      render: (entity) => entity.name,
    },
    {
      key: "status",
      header: "Status",
      render: (entity) => <StatusBadge>{entity.status}</StatusBadge>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (entity) => {
        const canWrite = canManage || hasPermission(entity.id, "WRITE");

        return (
          <EntityActions
            canAssign={canManage && canWrite}
            canWrite={canWrite}
            entity={entity}
            users={users}
            updating={updatingId === entity.id}
            onAssignUser={onAssignUser}
            onEdit={onEdit}
            onStatusToggle={onStatusToggle}
          />
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={visibleEntities}
      emptyMessage="No entities match the current view."
      getRowKey={(entity) => entity.id}
    />
  );
};

export default EntityTable;
