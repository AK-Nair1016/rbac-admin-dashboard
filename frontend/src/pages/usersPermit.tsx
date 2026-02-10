// import { useEffect, useState } from "react";
// import styles from "./UsersPermit.module.css";
// import { upsertPermission } from "../api/permissions";
// import { useAuth } from "../auth/AuthContext";
// import axios from "../api/axios";

// type Permission = "NONE" | "READ" | "WRITE" | "READ_WRITE";

// interface Row {
//   rowKey: string;
//   userId: string;
//   userEmail: string;
//   entityId: string;
//   entityName: string;
//   permission: Permission;
// }

// const UsersPermit = () => {
//   const { refreshPermissions } = useAuth();

//   const [rows, setRows] = useState<Row[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchPermissions = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await axios.get("/permissions");

//         if (!Array.isArray(res.data)) {
//           console.error("❌ Invalid permissions payload", res.data);
//           setRows([]);
//           return;
//         }

//         setRows(
//           res.data.map((r: any) => ({
//             rowKey: `${r.user_id}_${r.entity_id}`,
//             userId: r.user_id,
//             userEmail: r.user_email,
//             entityId: r.entity_id,
//             entityName: r.entity_name,
//             permission: r.permission ?? "NONE",
//           }))
//         );
//       } catch (err) {
//         console.error("❌ Failed to fetch permissions", err);
//         setError("Failed to load permissions");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPermissions();
//   }, []);

//   const setPermission = async (
//     row: Row,
//     permission: Permission
//   ) => {
//     setRows((prev) =>
//       prev.map((r) =>
//         r.rowKey === row.rowKey ? { ...r, permission } : r
//       )
//     );

//     if (permission === "NONE") return;
//     console.group("✏️ Upsert Permission");
// console.log("userId:", row.userId);
// console.log("entityId:", row.entityId);
// console.log("permission:", permission);
// console.groupEnd();


//     await upsertPermission({
//       userId: row.userId,
//       entityId: row.entityId,
//       permission,
//     });

//     await refreshPermissions();
//   };

//   if (loading) return <p>Loading permissions…</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>User Permissions</h1>

//       {rows.length === 0 ? (
//         <p>No assigned entities yet.</p>
//       ) : (
//         <div className={styles.table}>
//           <div className={styles.header}>
//             <span>User</span>
//             <span>Entity</span>
//             <span>Permissions</span>
//           </div>

//           {rows.map((row) => (
//             <div key={row.rowKey} className={styles.row}>
//               <span>{row.userEmail}</span>
//               <span>{row.entityName}</span>

//               <div className={styles.permissions}>
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={row.permission === "READ"}
//                     disabled={row.permission === "READ_WRITE"}
//                     onChange={() =>
//                       setPermission(
//                         row,
//                         row.permission === "READ"
//                           ? "NONE"
//                           : "READ"
//                       )
//                     }
//                   />
//                   Read
//                 </label>

//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={row.permission === "WRITE"}
//                     disabled={row.permission === "READ_WRITE"}
//                     onChange={() =>
//                       setPermission(
//                         row,
//                         row.permission === "WRITE"
//                           ? "NONE"
//                           : "WRITE"
//                       )
//                     }
//                   />
//                   Write
//                 </label>

//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={row.permission === "READ_WRITE"}
//                     disabled={
//                       row.permission === "READ" ||
//                       row.permission === "WRITE"
//                     }
//                     onChange={() =>
//                       setPermission(
//                         row,
//                         row.permission === "READ_WRITE"
//                           ? "NONE"
//                           : "READ_WRITE"
//                       )
//                     }
//                   />
//                   Read / Write
//                 </label>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UsersPermit;

import { useEffect, useState } from "react";
import styles from "./UsersPermit.module.css";
import { upsertPermission, getAllPermissions } from "../api/permissions";
import type { PermissionRow, PermissionType } from "../api/permissions";

import { useAuth } from "../auth/AuthContext";

interface Row extends PermissionRow {
  rowKey: string;
}

const UsersPermit = () => {
  const { refreshPermissions } = useAuth();

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Fetching ALL permissions (admin view)");
        const data = await getAllPermissions(); // ✅ typed: PermissionRow[]

        console.log("✅ Permissions payload:", data);

        const mapped: Row[] = data.map((r) => ({
          ...r,
          rowKey: `${r.userId}_${r.entityId}`,
        }));

        console.table(mapped);
        setRows(mapped);
      } catch (err) {
        console.error("❌ Failed to fetch permissions", err);
        setError("Failed to load permissions");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const setPermission = async (row: Row, permission: PermissionType) => {
    console.group("✏️ Updating permission");
    console.log("userId:", row.userId);
    console.log("entityId:", row.entityId);
    console.log("permission:", permission);
    console.groupEnd();

    setRows((prev) =>
      prev.map((r) =>
        r.rowKey === row.rowKey ? { ...r, permission } : r
      )
    );

    if (permission === "NONE") return;

    try {
      await upsertPermission({
        userId: row.userId,
        entityId: row.entityId,
        permission,
      });

      console.log("✅ Permission saved");
      await refreshPermissions();
    } catch (err) {
      console.error("❌ Failed to save permission", err);
      alert("Failed to save permission");
    }
  };

  if (loading) return <p>Loading permissions…</p>;
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
                      row.permission === "READ" ||
                      row.permission === "WRITE"
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

export default UsersPermit;
