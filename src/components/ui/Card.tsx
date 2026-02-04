'use client';

// ============================================
// Card Component
// ============================================

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'gradient' | 'glass';
    hover?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
}

type CardBodyProps = React.HTMLAttributes<HTMLDivElement>;

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', hover = true, children, ...props }, ref) => {
        const variants = {
            default: 'bg-white border border-gray-200',
            gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200',
            glass: 'bg-white/80 backdrop-blur-lg border border-white/20',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-xl shadow-sm transition-all duration-300',
                    variants[variant],
                    hover && 'hover:shadow-md',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, title, subtitle, action, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'px-6 py-4 border-b border-gray-100 flex items-center justify-between',
                    className
                )}
                {...props}
            >
                {children || (
                    <>
                        <div>
                            {title && (
                                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                            )}
                            {subtitle && (
                                <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
                            )}
                        </div>
                        {action && <div>{action}</div>}
                    </>
                )}
            </div>
        );
    }
);

CardHeader.displayName = 'CardHeader';

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div ref={ref} className={cn('p-6', className)} {...props}>
                {children}
            </div>
        );
    }
);

CardBody.displayName = 'CardBody';

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardBody, CardFooter };
export default Card;
