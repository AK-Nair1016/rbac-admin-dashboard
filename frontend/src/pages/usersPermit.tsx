import { useState } from "react";
import styles from "./UsersPermit.module.css";

type Permission = "NONE" | "READ" | "WRITE" | "READ_WRITE";

interface Row {
  id: string;
  userEmail: string;
  entityName: string;
  permission: Permission;
}

const UsersPermit = () => {
  const [rows, setRows] = useState<Row[]>([
    {
      id: "1",
      userEmail: "manager@test.com",
      entityName: "Audit Module",
      permission: "READ_WRITE",
    },
    {
      id: "2",
      userEmail: "user@test.com",
      entityName: "System Config",
      permission: "READ",
    },
  ]);

  const setPermission = (id: string, permission: Permission) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, permission } : r
      )
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Permissions</h1>

      <div className={styles.table}>
        <div className={styles.header}>
          <span>User</span>
          <span>Entity</span>
          <span>Permissions</span>
        </div>

        {rows.map((row) => (
          <div key={row.id} className={styles.row}>
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
                      row.id,
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
                      row.id,
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
                    row.permission === "READ" ||
                    row.permission === "WRITE"
                  }
                  onChange={() =>
                    setPermission(
                      row.id,
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
    </div>
  );
};

export default UsersPermit;
