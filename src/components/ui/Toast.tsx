'use client';

// ============================================
// Toast Notification Component
// ============================================

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (toast: Omit<Toast, 'id'>) => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 11);
        const newToast: Toast = { ...toast, id };
        setToasts((prev) => [...prev, newToast]);

        const duration = toast.duration ?? 5000;
        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
    }, [removeToast]);

    const success = useCallback(
        (title: string, message?: string) => showToast({ type: 'success', title, message }),
        [showToast]
    );

    const error = useCallback(
        (title: string, message?: string) => showToast({ type: 'error', title, message }),
        [showToast]
    );

    const warning = useCallback(
        (title: string, message?: string) => showToast({ type: 'warning', title, message }),
        [showToast]
    );

    const info = useCallback(
        (title: string, message?: string) => showToast({ type: 'info', title, message }),
        [showToast]
    );

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
            {children}
            {isMounted &&
                createPortal(
                    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
                        {toasts.map((toast) => (
                            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                        ))}
                    </div>,
                    document.body
                )}
        </ToastContext.Provider>
    );
};

interface ToastItemProps {
    toast: Toast;
    onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
    const icons = {
        success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
        error: <AlertCircle className="h-5 w-5 text-red-500" />,
        warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
    };

    const backgrounds = {
        success: 'bg-emerald-50 border-emerald-200',
        error: 'bg-red-50 border-red-200',
        warning: 'bg-amber-50 border-amber-200',
        info: 'bg-blue-50 border-blue-200',
    };

    return (
        <div
            className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-slideInLeft',
                'bg-white',
                backgrounds[toast.type]
            )}
        >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{toast.title}</p>
                {toast.message && (
                    <p className="text-sm text-gray-600 mt-0.5">{toast.message}</p>
                )}
            </div>
            <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default ToastProvider;
