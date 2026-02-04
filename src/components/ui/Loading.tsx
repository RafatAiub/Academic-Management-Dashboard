'use client';

// ============================================
// Loading Spinner Component
// ============================================

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    className,
}) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    };

    return (
        <div className={cn('flex items-center justify-center', className)}>
            <div
                className={cn(
                    'rounded-full border-2 border-gray-200 border-t-blue-600 animate-spin',
                    sizes[size]
                )}
            />
        </div>
    );
};

// Full Page Loading
interface PageLoadingProps {
    message?: string;
}

const PageLoading: React.FC<PageLoadingProps> = ({ message = 'Loading...' }) => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-blue-200 animate-pulse" />
                <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>
            <p className="mt-4 text-gray-600 font-medium animate-pulse">{message}</p>
        </div>
    );
};

// Skeleton Loading
interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({
    className,
    variant = 'rectangular',
    width,
    height,
}) => {
    const variantClasses = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    return (
        <div
            className={cn(
                'skeleton',
                variantClasses[variant],
                className
            )}
            style={{
                width: width,
                height: height || (variant === 'text' ? '1em' : undefined),
            }}
        />
    );
};

export { LoadingSpinner, PageLoading, Skeleton };
export default LoadingSpinner;
