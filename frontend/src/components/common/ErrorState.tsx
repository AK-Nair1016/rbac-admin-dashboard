import type { ReactNode } from "react";
import styles from "./State.module.css";

interface ErrorStateProps {
  title?: string;
  message: string;
  action?: ReactNode;
}

const ErrorState = ({
  title = "Something went wrong",
  message,
  action,
}: ErrorStateProps) => {
  return (
    <div className={`${styles.state} ${styles.error}`} role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

export default ErrorState;
