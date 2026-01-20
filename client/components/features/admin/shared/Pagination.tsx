import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

/**
 * Pagination component for navigation through pages of data
 */
export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
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

    return (
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
    );
}
