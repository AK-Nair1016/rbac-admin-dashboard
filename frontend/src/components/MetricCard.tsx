import styles from "./MetricCard.module.css";

interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

const MetricCard = ({ label, value, hint }: MetricCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  );
};

export default MetricCard;
