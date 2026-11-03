import type { PermissionRow, PermissionType } from "../../api/permissions";
import type { DataTableColumn } from "../tables";
import { DataTable } from "../tables";
import PermissionMatrix from "./PermissionMatrix";

export interface PermissionTableRow extends PermissionRow {
  rowKey: string;
}

interface PermissionTableProps {
  rows: PermissionTableRow[];
  onPermissionChange: (
    row: PermissionTableRow,
    permission: PermissionType
  ) => void;
}

const PermissionTable = ({ rows, onPermissionChange }: PermissionTableProps) => {
  const columns: DataTableColumn<PermissionTableRow>[] = [
    {
      key: "user",
      header: "User",
      render: (row) => row.userEmail,
    },
    {
      key: "entity",
      header: "Entity",
      render: (row) => row.entityName,
    },
    {
      key: "permissions",
      header: "Permissions",
      render: (row) => (
        <PermissionMatrix
          permission={row.permission}
          rowLabel={`${row.userEmail} on ${row.entityName}`}
          onChange={(permission) => onPermissionChange(row, permission)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      emptyMessage="No assigned entities yet."
      getRowKey={(row) => row.rowKey}
    />
  );
};

export default PermissionTable;
