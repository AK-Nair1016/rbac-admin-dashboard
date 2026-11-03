import type { PermissionType } from "../../api/permissions";
import { StatusBadge } from "../common";
import PermissionActions from "./PermissionActions";
import styles from "./PermissionMatrix.module.css";

interface PermissionMatrixProps {
  permission: PermissionType;
  rowLabel: string;
  onChange: (permission: PermissionType) => void;
}

const getStatusLabel = (permission: PermissionType) => {
  if (permission === "READ_WRITE") return "Read / Write";
  if (permission === "NONE") return "None";
  return permission.charAt(0) + permission.slice(1).toLowerCase();
};

const PermissionMatrix = ({
  permission,
  rowLabel,
  onChange,
}: PermissionMatrixProps) => {
  return (
    <div className={styles.matrix}>
      <StatusBadge tone={permission === "NONE" ? "neutral" : "info"}>
        {getStatusLabel(permission)}
      </StatusBadge>
      <PermissionActions
        permission={permission}
        rowLabel={rowLabel}
        onChange={onChange}
      />
    </div>
  );
};

export default PermissionMatrix;
