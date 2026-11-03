import { SearchBar } from "../common";
import styles from "./EntityFilters.module.css";

interface EntityFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onApply: () => void;
}

const EntityFilters = ({
  search,
  onSearchChange,
  onApply,
}: EntityFiltersProps) => {
  return (
    <form
      className={styles.filters}
      onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
    >
      <SearchBar
        onChange={onSearchChange}
        onSearch={onApply}
        placeholder="Search by entity name..."
        value={search}
      />
    </form>
  );
};

export default EntityFilters;
