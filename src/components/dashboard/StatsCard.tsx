'use client';

// ============================================
// Stats Card Component
// ============================================

import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        label: string;
    };
    variant?: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'cyan';
    className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    trend,
    variant = 'blue',
    className,
}) => {
    const gradients = {
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        green: 'from-emerald-500 to-emerald-600',
        orange: 'from-orange-500 to-orange-600',
        red: 'from-red-500 to-red-600',
        cyan: 'from-cyan-500 to-cyan-600',
    };

    const bgLights = {
        blue: 'bg-blue-50',
        purple: 'bg-purple-50',
        green: 'bg-emerald-50',
        orange: 'bg-orange-50',
        red: 'bg-red-50',
        cyan: 'bg-cyan-50',
    };

    const iconColors = {
        blue: 'text-blue-600',
        purple: 'text-purple-600',
        green: 'text-emerald-600',
        orange: 'text-orange-600',
        red: 'text-red-600',
        cyan: 'text-cyan-600',
    };

    const getTrendIcon = () => {
        if (!trend) return null;
        if (trend.value > 0) return <TrendingUp className="h-4 w-4" />;
        if (trend.value < 0) return <TrendingDown className="h-4 w-4" />;
        return <Minus className="h-4 w-4" />;
    };

    const getTrendColor = () => {
        if (!trend) return '';
        if (trend.value > 0) return 'text-emerald-600 bg-emerald-50';
        if (trend.value < 0) return 'text-red-600 bg-red-50';
        return 'text-gray-600 bg-gray-50';
    };

    return (
        <div
            className={cn(
                'relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]',
                className
            )}
        >
            {/* Background Decoration */}
            <div
                className={cn(
                    'absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 bg-gradient-to-br',
                    gradients[variant]
                )}
            />

            <div className="relative flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>

                    {trend && (
                        <div className="flex items-center gap-2 mt-3">
                            <span
                                className={cn(
                                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                                    getTrendColor()
                                )}
                            >
                                {getTrendIcon()}
                                {Math.abs(trend.value)}%
                            </span>
                            <span className="text-xs text-gray-500">{trend.label}</span>
                        </div>
                    )}
                </div>

                <div
                    className={cn(
                        'p-3 rounded-xl',
                        bgLights[variant]
                    )}
                >
                    <div className={iconColors[variant]}>{icon}</div>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
