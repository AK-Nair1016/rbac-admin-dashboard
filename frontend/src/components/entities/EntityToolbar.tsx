import { Plus } from "lucide-react";
import { Button } from "../common";
import EntityFilters from "./EntityFilters";
import styles from "./EntityToolbar.module.css";

interface EntityToolbarProps {
  canManage: boolean;
  search: string;
  onCreate: () => void;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}

const EntityToolbar = ({
  canManage,
  search,
  onCreate,
  onSearchChange,
  onSearchSubmit,
}: EntityToolbarProps) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.actions}>
        {canManage && (
          <Button onClick={onCreate}>
            <Plus size={16} aria-hidden="true" />
            New Entity
          </Button>
        )}
      </div>
      <EntityFilters
        search={search}
        onSearchChange={onSearchChange}
        onApply={onSearchSubmit}
      />
    </div>
  );
};

export default EntityToolbar;
