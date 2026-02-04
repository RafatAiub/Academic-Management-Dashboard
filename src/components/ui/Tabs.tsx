'use client';

// ============================================
// Tabs Component
// ============================================

import React from 'react';
import { cn } from '@/lib/utils';

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: string | number;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
    variant?: 'default' | 'pills' | 'underline';
    fullWidth?: boolean;
    className?: string;
}

const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onChange,
    variant = 'default',
    fullWidth = false,
    className,
}) => {
    const containerStyles = {
        default: 'bg-gray-100 p-1 rounded-xl',
        pills: 'gap-2',
        underline: 'border-b border-gray-200',
    };

    const tabStyles = {
        default: (isActive: boolean) =>
            cn(
                'px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
            ),
        pills: (isActive: boolean) =>
            cn(
                'px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-200',
                isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            ),
        underline: (isActive: boolean) =>
            cn(
                'px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all duration-200',
                isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ),
    };

    return (
        <div
            className={cn(
                'flex',
                fullWidth && 'w-full',
                containerStyles[variant],
                className
            )}
        >
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            'flex items-center justify-center gap-2',
                            fullWidth && 'flex-1',
                            tabStyles[variant](isActive)
                        )}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {tab.badge !== undefined && (
                            <span
                                className={cn(
                                    'px-1.5 py-0.5 text-xs font-semibold rounded-full',
                                    isActive
                                        ? variant === 'pills'
                                            ? 'bg-white/20 text-white'
                                            : 'bg-blue-100 text-blue-600'
                                        : 'bg-gray-200 text-gray-600'
                                )}
                            >
                                {tab.badge}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default Tabs;
