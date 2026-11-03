import type { ReactNode } from "react";
import { X } from "lucide-react";
import styles from "./FeedbackBanner.module.css";

type FeedbackTone = "success" | "danger" | "info";

interface FeedbackBannerProps {
  message: ReactNode;
  tone?: FeedbackTone;
  onDismiss?: () => void;
}

const FeedbackBanner = ({
  message,
  tone = "info",
  onDismiss,
}: FeedbackBannerProps) => {
  return (
    <div className={`${styles.banner} ${styles[tone]}`} role="status">
      <span>{message}</span>
      {onDismiss && (
        <button
          aria-label="Dismiss message"
          className={styles.dismiss}
          onClick={onDismiss}
          type="button"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default FeedbackBanner;
