import type { ReactNode } from "react";
import styles from "./StatCard.module.css";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
}

const StatCard = ({ label, value, hint, icon }: StatCardProps) => {
  return (
    <article className={styles.card}>
      <div className={styles.topLine}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <strong className={styles.value}>{value}</strong>
      {hint && <span className={styles.hint}>{hint}</span>}
    </article>
  );
};

export default StatCard;
