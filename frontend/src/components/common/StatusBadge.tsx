import styles from "./StatusBadge.module.css";

type StatusTone = "success" | "warning" | "danger" | "neutral" | "info";

interface StatusBadgeProps {
  children: string;
  tone?: StatusTone;
}

const getToneFromLabel = (label: string): StatusTone => {
  const normalizedLabel = label.toLowerCase();

  if (["active", "approved", "granted"].includes(normalizedLabel)) {
    return "success";
  }

  if (["pending", "expiring"].includes(normalizedLabel)) {
    return "warning";
  }

  if (["inactive", "rejected", "revoked", "expired"].includes(normalizedLabel)) {
    return "danger";
  }

  return "neutral";
};

const StatusBadge = ({ children, tone }: StatusBadgeProps) => {
  const resolvedTone = tone ?? getToneFromLabel(children);

  return (
    <span className={`${styles.badge} ${styles[resolvedTone]}`}>
      {children}
    </span>
  );
};

export default StatusBadge;
