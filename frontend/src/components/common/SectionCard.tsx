import type { ReactNode } from "react";
import styles from "./SectionCard.module.css";

interface SectionCardProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
  className?: string;
}

const SectionCard = ({
  children,
  title,
  actions,
  className = "",
}: SectionCardProps) => {
  return (
    <section className={`${styles.card} ${className}`}>
      {(title || actions) && (
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
};

export default SectionCard;
