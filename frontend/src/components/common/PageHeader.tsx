import type { ReactNode } from "react";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
}

const PageHeader = ({ title, description, actions, meta }: PageHeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        {meta && <div className={styles.meta}>{meta}</div>}
      </div>

      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
};

export default PageHeader;
