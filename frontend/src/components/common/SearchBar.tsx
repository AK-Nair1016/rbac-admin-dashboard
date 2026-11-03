import { Search, X } from "lucide-react";
import Button from "./Button";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  onClear?: () => void;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "Search...",
}: SearchBarProps) => {
  return (
    <div className={styles.searchBar}>
      <label className={styles.inputWrap}>
        <Search size={18} aria-hidden="true" />
        <span className={styles.srOnly}>Search</span>
        <input
          className={styles.input}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearch?.();
            }
          }}
        />
      </label>

      {value && onClear && (
        <Button variant="ghost" onClick={onClear} aria-label="Clear search">
          <X size={16} />
        </Button>
      )}

      {onSearch && (
        <Button variant="secondary" onClick={onSearch}>
          Search
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
