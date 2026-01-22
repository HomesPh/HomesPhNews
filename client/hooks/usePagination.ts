import { useState } from "react";

interface UsePaginationProps {
  totalPages?: number;
}

/**
 * Hook for handling pagination state and logic
 * @param totalPages - Initial maximum number of pages (can be updated later)
 * @returns Data for Pagination component
 */
export default function usePagination({ totalPages: initialTotalPages = 1 }: UsePaginationProps = {}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  /**
   * Handles page change
   * @param page - Page number to change to
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    // State
    totalPages,
    currentPage,

    // Actions
    handlePageChange,
    setTotalPages,
  };
}