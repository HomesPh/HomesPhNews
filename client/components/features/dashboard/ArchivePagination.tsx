"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Pagination from '@/components/features/admin/shared/Pagination';

interface ArchivePaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function ArchivePagination({ currentPage, totalPages }: ArchivePaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="py-8 border-t border-gray-100 dark:border-gray-800 flex justify-center mt-8">
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
