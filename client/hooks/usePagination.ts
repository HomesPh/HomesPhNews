import { useState } from "react";

interface UsePaginationProps {
  totalPages: number;
}

/**
 * Hook for handling pagination state and logic
 * @param totalPages - Maximum number of pages
 * @returns Data for Pagination component
 */
export default function usePagination({ totalPages }: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Handles page change
   * @param page - Page number to change to
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    // Constants
    totalPages,

    // State
    currentPage,

    // Actions
    handlePageChange,
  };
}