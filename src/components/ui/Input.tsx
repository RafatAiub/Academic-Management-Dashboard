'use client';

// ============================================
// Input Component
// ============================================

import React, { useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helper?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helper, leftIcon, rightIcon, id, ...props }, ref) => {
        const generatedId = useId();
        const inputId = id || generatedId;

        return (
            <div className="form-group">
                {label && (
                    <label htmlFor={inputId} className="form-label">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            'w-full px-4 py-3 text-sm border rounded-lg bg-white transition-all duration-200',
                            'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
                            'placeholder:text-gray-400',
                            'disabled:bg-gray-100 disabled:cursor-not-allowed',
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && <p className="form-error">{error}</p>}
                {helper && !error && <p className="form-helper">{helper}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
