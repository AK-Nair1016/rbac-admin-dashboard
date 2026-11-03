import { useEffect, useState } from "react";
import { getAllPermissions, upsertPermission } from "../api/permissions";
import type { PermissionType } from "../api/permissions";
import { useAuth } from "../auth/useAuth";
import {
  ErrorState,
  FeedbackBanner,
  LoadingState,
  PageHeader,
  SectionCard,
} from "../components/common";
import {
  PermissionTable,
  PermissionToolbar,
} from "../components/permissions";
import type { PermissionTableRow } from "../components/permissions";
import styles from "./UserPermissionsPage.module.css";

const UserPermissionsPage = () => {
  const { refreshPermissions } = useAuth();
  const [rows, setRows] = useState<PermissionTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "danger" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAllPermissions();
        const mappedRows: PermissionTableRow[] = data.map((row) => ({
          ...row,
          rowKey: `${row.userId}_${row.entityId}`,
        }));

        setRows(mappedRows);
      } catch {
        setError("Failed to load permissions");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const setPermission = async (
    row: PermissionTableRow,
    permission: PermissionType
  ) => {
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
      setFeedback({
        tone: "success",
        message: "Permission updated successfully.",
      });
    } catch {
      setFeedback({
        tone: "danger",
        message: "Failed to save permission.",
      });
    }
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="User Permissions"
        description="Review and update entity permissions for assigned users."
      />

      {feedback && (
        <FeedbackBanner
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
          tone={feedback.tone}
        />
      )}

      <SectionCard actions={<PermissionToolbar rowCount={rows.length} />}>
        {loading && <LoadingState message="Loading permissions..." />}
        {!loading && error && (
          <ErrorState title="Permissions unavailable" message={error} />
        )}
        {!loading && !error && (
          <PermissionTable rows={rows} onPermissionChange={setPermission} />
        )}
      </SectionCard>
    </div>
  );
};

export default UserPermissionsPage;
