'use client';

// ============================================
// Table Component
// ============================================

import React from 'react';
import { cn } from '@/lib/utils';

export interface Column<T> {
    key: string;
    header: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
    render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (row: T) => string | number;
    onRowClick?: (row: T) => void;
    isLoading?: boolean;
    emptyMessage?: string;
    className?: string;
    stickyHeader?: boolean;
}

function Table<T extends object>({
    columns,
    data,
    keyExtractor,
    onRowClick,
    isLoading = false,
    emptyMessage = 'No data available',
    className,
    stickyHeader = false,
}: TableProps<T>) {
    const alignClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    };

    if (isLoading) {
        return (
            <div className={cn('table-container', className)}>
                <table className="table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key} style={{ width: column.width }}>
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, i) => (
                            <tr key={i}>
                                {columns.map((column) => (
                                    <td key={column.key}>
                                        <div className="skeleton h-5 w-full" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className={cn('table-container', className)}>
                <div className="p-12 text-center">
                    <div className="text-gray-400 mb-2">
                        <svg
                            className="mx-auto h-12 w-12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                        </svg>
                    </div>
                    <p className="text-gray-500 font-medium">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('table-container', className)}>
            <table className="table">
                <thead className={stickyHeader ? 'sticky top-0 z-10' : ''}>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={alignClasses[column.align || 'left']}
                                style={{ width: column.width }}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr
                            key={keyExtractor(row)}
                            onClick={() => onRowClick?.(row)}
                            className={cn(
                                onRowClick && 'cursor-pointer hover:bg-blue-50'
                            )}
                        >
                            {columns.map((column) => (
                                <td
                                    key={column.key}
                                    className={alignClasses[column.align || 'left']}
                                >
                                    {column.render
                                        ? column.render((row as Record<string, unknown>)[column.key], row, index)
                                        : String((row as Record<string, unknown>)[column.key] ?? '')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;

