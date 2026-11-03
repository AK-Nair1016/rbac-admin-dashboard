import Button from "./Button";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

const getPageNumbers = (
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number
) => {
  const pages: number[] = [];
  let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let end = start + maxVisiblePages - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxVisiblePages + 1);
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) => {
  const safeTotalPages = Math.max(1, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <Button
        variant="secondary"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>

      <div className={styles.pages}>
        {getPageNumbers(currentPage, safeTotalPages, maxVisiblePages).map(
          (page) => (
            <Button
              key={page}
              variant={page === currentPage ? "primary" : "secondary"}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          )
        )}
      </div>

      <Button
        variant="secondary"
        disabled={currentPage === safeTotalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </nav>
  );
};

export default Pagination;
