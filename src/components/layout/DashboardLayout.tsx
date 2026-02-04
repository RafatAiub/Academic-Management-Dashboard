'use client';

// ============================================
// Dashboard Layout Component
// ============================================

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar */}
            <Sidebar
                isCollapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Header */}
            <Header sidebarCollapsed={sidebarCollapsed} />

            {/* Main Content */}
            <main
                className={cn(
                    'pt-16 min-h-screen transition-all duration-300',
                    sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
                )}
            >
                <div className="p-4 lg:p-6">{children}</div>
            </main>
        </div>
    );
};

export default DashboardLayout;
