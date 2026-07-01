import type { ReactNode } from "react";
import styles from "./State.module.css";

interface EmptyStateProps {
  title?: string;
  message: string;
  action?: ReactNode;
}

const EmptyState = ({ title = "No data found", message, action }: EmptyStateProps) => {
  return (
    <div className={styles.state}>
      <h2>{title}</h2>
      <p>{message}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

export default EmptyState;
