'use client';

// ============================================
// Pagination Component
// ============================================

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
    totalItems?: number;
    showPageInfo?: boolean;
    showQuickJumper?: boolean;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    pageSize,
    totalItems,
    showPageInfo = true,
    showQuickJumper = false,
    className,
}) => {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const showPages = 5;
        const halfShow = Math.floor(showPages / 2);

        let start = Math.max(1, currentPage - halfShow);
        let end = Math.min(totalPages, currentPage + halfShow);

        if (currentPage <= halfShow) {
            end = Math.min(totalPages, showPages);
        }
        if (currentPage > totalPages - halfShow) {
            start = Math.max(1, totalPages - showPages + 1);
        }

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    const buttonBaseClass =
        'inline-flex items-center justify-center h-9 min-w-[36px] px-3 text-sm font-medium rounded-lg transition-all duration-200';

    const startItem = (currentPage - 1) * (pageSize || 10) + 1;
    const endItem = Math.min(currentPage * (pageSize || 10), totalItems || 0);

    return (
        <div
            className={cn(
                'flex flex-col sm:flex-row items-center justify-between gap-4',
                className
            )}
        >
            {showPageInfo && totalItems !== undefined && pageSize && (
                <p className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-700">{startItem}</span> to{' '}
                    <span className="font-medium text-gray-700">{endItem}</span> of{' '}
                    <span className="font-medium text-gray-700">{totalItems}</span> results
                </p>
            )}

            <div className="flex items-center gap-1">
                {/* First page */}
                {showQuickJumper && (
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        className={cn(
                            buttonBaseClass,
                            'text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                        aria-label="Go to first page"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </button>
                )}

                {/* Previous page */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={cn(
                        buttonBaseClass,
                        'text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    aria-label="Go to previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page numbers */}
                {pageNumbers.map((page, index) =>
                    typeof page === 'number' ? (
                        <button
                            key={index}
                            onClick={() => onPageChange(page)}
                            className={cn(
                                buttonBaseClass,
                                page === currentPage
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100'
                            )}
                        >
                            {page}
                        </button>
                    ) : (
                        <span
                            key={index}
                            className="inline-flex items-center justify-center h-9 min-w-[36px] text-gray-400"
                        >
                            {page}
                        </span>
                    )
                )}

                {/* Next page */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={cn(
                        buttonBaseClass,
                        'text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    aria-label="Go to next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>

                {/* Last page */}
                {showQuickJumper && (
                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className={cn(
                            buttonBaseClass,
                            'text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                        aria-label="Go to last page"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Pagination;
