import { useEffect, useState } from "react";
import { getAllPermissions, upsertPermission } from "../api/permissions";
import type { PermissionRow, PermissionType } from "../api/permissions";
import { useAuth } from "../auth/useAuth";
import styles from "./UserPermissionsPage.module.css";

interface Row extends PermissionRow {
  rowKey: string;
}

const UserPermissionsPage = () => {
  const { refreshPermissions } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAllPermissions();
        const mappedRows: Row[] = data.map((row) => ({
          ...row,
          rowKey: `${row.userId}_${row.entityId}`,
        }));

        setRows(mappedRows);
      } catch (fetchError) {
        console.error("Failed to fetch permissions", fetchError);
        setError("Failed to load permissions");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const setPermission = async (row: Row, permission: PermissionType) => {
    setRows((previousRows) =>
      previousRows.map((currentRow) =>
        currentRow.rowKey === row.rowKey
          ? { ...currentRow, permission }
          : currentRow
      )
    );

    if (permission === "NONE") {
      return;
    }

    try {
      await upsertPermission({
        userId: row.userId,
        entityId: row.entityId,
        permission,
      });

      await refreshPermissions();
    } catch (saveError) {
      console.error("Failed to save permission", saveError);
      alert("Failed to save permission");
    }
  };

  if (loading) return <p>Loading permissions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Permissions</h1>

      {rows.length === 0 ? (
        <p>No assigned entities yet.</p>
      ) : (
        <div className={styles.table}>
          <div className={styles.header}>
            <span>User</span>
            <span>Entity</span>
            <span>Permissions</span>
          </div>

          {rows.map((row) => (
            <div key={row.rowKey} className={styles.row}>
              <span>{row.userEmail}</span>
              <span>{row.entityName}</span>

              <div className={styles.permissions}>
                <label>
                  <input
                    type="checkbox"
                    checked={row.permission === "READ"}
                    disabled={row.permission === "READ_WRITE"}
                    onChange={() =>
                      setPermission(
                        row,
                        row.permission === "READ" ? "NONE" : "READ"
                      )
                    }
                  />
                  Read
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={row.permission === "WRITE"}
                    disabled={row.permission === "READ_WRITE"}
                    onChange={() =>
                      setPermission(
                        row,
                        row.permission === "WRITE" ? "NONE" : "WRITE"
                      )
                    }
                  />
                  Write
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={row.permission === "READ_WRITE"}
                    disabled={
                      row.permission === "READ" || row.permission === "WRITE"
                    }
                    onChange={() =>
                      setPermission(
                        row,
                        row.permission === "READ_WRITE"
                          ? "NONE"
                          : "READ_WRITE"
                      )
                    }
                  />
                  Read / Write
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPermissionsPage;
