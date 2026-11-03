import type { InputHTMLAttributes } from "react";
import styles from "./TextInput.module.css";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const TextInput = ({ label, error, id, className = "", ...props }: TextInputProps) => {
  const inputId = id ?? props.name;

  return (
    <label className={styles.field} htmlFor={inputId}>
      {label && <span className={styles.label}>{label}</span>}
      <input
        id={inputId}
        className={`${styles.input} ${error ? styles.invalid : ""} ${className}`}
        aria-invalid={error ? "true" : undefined}
        {...props}
      />
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
};

export default TextInput;
