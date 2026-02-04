'use client';

// ============================================
// Select Component
// ============================================

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label?: string;
    error?: string;
    helper?: string;
    options: SelectOption[];
    placeholder?: string;
    onChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, helper, options, placeholder, onChange, id, ...props }, ref) => {
        const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

        const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            onChange?.(e.target.value);
        };

        return (
            <div className="form-group">
                {label && (
                    <label htmlFor={selectId} className="form-label">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        id={selectId}
                        onChange={handleChange}
                        className={cn(
                            'w-full px-4 py-3 text-sm border rounded-lg bg-white transition-all duration-200 appearance-none cursor-pointer',
                            'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
                            'disabled:bg-gray-100 disabled:cursor-not-allowed',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                            className
                        )}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
                {error && <p className="form-error">{error}</p>}
                {helper && !error && <p className="form-helper">{helper}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;
