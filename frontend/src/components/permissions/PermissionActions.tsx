import type { PermissionType } from "../../api/permissions";
import styles from "./PermissionActions.module.css";

interface PermissionActionsProps {
  permission: PermissionType;
  rowLabel: string;
  onChange: (permission: PermissionType) => void;
}

const PermissionActions = ({
  permission,
  rowLabel,
  onChange,
}: PermissionActionsProps) => {
  return (
    <fieldset className={styles.actions}>
      <legend className={styles.srOnly}>Permissions for {rowLabel}</legend>
      <label className={styles.option}>
        <input
          checked={permission === "READ"}
          disabled={permission === "READ_WRITE"}
          onChange={() => onChange(permission === "READ" ? "NONE" : "READ")}
          type="checkbox"
        />
        Read
      </label>
      <label className={styles.option}>
        <input
          checked={permission === "WRITE"}
          disabled={permission === "READ_WRITE"}
          onChange={() => onChange(permission === "WRITE" ? "NONE" : "WRITE")}
          type="checkbox"
        />
        Write
      </label>
      <label className={styles.option}>
        <input
          checked={permission === "READ_WRITE"}
          disabled={permission === "READ" || permission === "WRITE"}
          onChange={() =>
            onChange(permission === "READ_WRITE" ? "NONE" : "READ_WRITE")
          }
          type="checkbox"
        />
        Read / Write
      </label>
    </fieldset>
  );
};

export default PermissionActions;
