import { ShieldCheck } from "lucide-react";
import styles from "./PermissionToolbar.module.css";

interface PermissionToolbarProps {
  rowCount: number;
}

const PermissionToolbar = ({ rowCount }: PermissionToolbarProps) => {
  return (
    <div className={styles.toolbar}>
      <span className={styles.icon}>
        <ShieldCheck size={18} aria-hidden="true" />
      </span>
      <div>
        <strong>{rowCount}</strong>
        <span> permission assignments</span>
      </div>
    </div>
  );
};

export default PermissionToolbar;
