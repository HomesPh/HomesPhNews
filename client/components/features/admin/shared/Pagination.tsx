import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Pagination as PaginationBase,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';

interface PaginationProps {
    // These are received from usePagination hook.
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;

    // These are configurable props.
    maxVisiblePages?: number;
}

/**
 * Pagination component for navigation through pages of data
 */
export default function Pagination({ currentPage, totalPages, onPageChange, maxVisiblePages = 5 }: PaginationProps) {
    // Guard against invalid pagination values
    if (!Number.isFinite(totalPages) || totalPages < 1 || !Number.isFinite(currentPage) || currentPage < 1) {
        return null;
    }

    const getPageNumbers = () => {
        const pages = [];

        // Few pages: show all (e.g., [1, 2, 3, 4])
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Near start: show first 4 + ellipsis + last (e.g., [1, 2, 3, 4, ..., 10])
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
                // Near end: show first + ellipsis + last 4 (e.g., [1, ..., 7, 8, 9, 10])
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
                // Middle: show first + ellipsis + neighbors + ellipsis + last (e.g., [1, ..., 4, 5, 6, ..., 10])
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    /*return (
        <div className="flex items-center justify-between px-5 py-6 border-t border-[#e5e7eb] bg-white">
            <p className="text-[14px] text-[#6b7280] tracking-[-0.5px]">
                Showing page <span className="font-semibold text-[#111827]">{currentPage}</span> of <span className="font-semibold text-[#111827]">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-10 h-10 rounded-[6px] border border-[#d1d5db] transition-all ${currentPage === 1
                        ? 'bg-white text-[#d1d5db] cursor-not-allowed'
                        : 'bg-white text-[#4b5563] hover:bg-gray-50 active:scale-95'
                        }`}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="flex items-center justify-center w-10 h-10 text-[14px] text-[#6b7280]"
                            >
                                ...
                            </span>
                        );
                    }

                    const isActive = currentPage === page;

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={`flex items-center justify-center w-10 h-10 rounded-[6px] text-[14px] font-medium tracking-[-0.5px] transition-all active:scale-95 ${isActive
                                ? 'bg-[#C10007] text-white shadow-sm'
                                : 'bg-white text-[#4b5563] border border-[#d1d5db] hover:bg-gray-50'
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-10 h-10 rounded-[6px] border border-[#d1d5db] transition-all ${currentPage === totalPages
                        ? 'bg-white text-[#d1d5db] cursor-not-allowed'
                        : 'bg-white text-[#4b5563] hover:bg-gray-50 active:scale-95'
                        }`}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );*/

    const handlePrevious = (e: React.MouseEvent) => {
        e.preventDefault();
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <PaginationBase>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={handlePrevious}
                        href="#"
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
                {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                        return (
                            <PaginationEllipsis key={`ellipsis-${index}`} />
                        );
                    }

                    const isActive = currentPage === page;

                    return (
                        <PaginationItem key={page}>
                            <PaginationLink
                                isActive={isActive}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(page as number);
                                }}
                                href="#"
                                className="cursor-pointer"
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                <PaginationItem>
                    <PaginationNext
                        onClick={handleNext}
                        href="#"
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
            </PaginationContent>
        </PaginationBase>
    );
}
