'use client';

// ============================================
// Sidebar Navigation Component
// ============================================

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
} from 'lucide-react';

interface NavItem {
    name: string;
    href: string;
    icon: React.ReactNode;
    badge?: string | number;
}

const navItems: NavItem[] = [
    {
        name: 'Dashboard',
        href: '/',
        icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
        name: 'Students',
        href: '/students',
        icon: <Users className="h-5 w-5" />,
    },
    {
        name: 'Courses',
        href: '/courses',
        icon: <BookOpen className="h-5 w-5" />,
    },
    {
        name: 'Faculty',
        href: '/faculty',
        icon: <GraduationCap className="h-5 w-5" />,
    },
    {
        name: 'Reports',
        href: '/reports',
        icon: <FileText className="h-5 w-5" />,
    },
];

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

interface SidebarLinkProps {
    item: NavItem;
    isActive: boolean;
    isCollapsed: boolean;
    onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ item, isActive, isCollapsed, onClick }) => (
    <Link
        href={item.href}
        onClick={onClick}
        className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200',
            isActive
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/30'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        )}
    >
        <span className={cn(isActive ? 'text-white' : 'text-gray-400')}>
            {item.icon}
        </span>
        {!isCollapsed && (
            <>
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                    <span
                        className={cn(
                            'px-2 py-0.5 text-xs font-semibold rounded-full',
                            isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-blue-100 text-blue-600'
                        )}
                    >
                        {item.badge}
                    </span>
                )}
            </>
        )}
    </Link>
);

interface SidebarContentProps {
    isCollapsed: boolean;
    pathname: string;
    onToggle: () => void;
    onItemClick?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ isCollapsed, pathname, onToggle, onItemClick }) => {
    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-gray-200/50">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900">Academic</span>
                            <span className="text-xs text-gray-500 -mt-1">Management</span>
                        </div>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => (
                    <SidebarLink
                        key={item.name}
                        item={item}
                        isActive={isActive(item.href)}
                        isCollapsed={isCollapsed}
                        onClick={onItemClick}
                    />
                ))}
            </nav>

            {/* Collapse Button (Desktop) */}
            <div className="hidden lg:block p-3 border-t border-gray-200/50">
                <button
                    onClick={onToggle}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-5 w-5" />
                    ) : (
                        <>
                            <ChevronLeft className="h-5 w-5" />
                            <span>Collapse</span>
                        </>
                    )}
                </button>
            </div>

            {/* Footer */}
            {!isCollapsed && (
                <div className="p-4 border-t border-gray-200/50">
                    <div className="px-3 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                        <p className="text-xs font-medium text-gray-700">Academic Dashboard</p>
                        <p className="text-xs text-gray-500 mt-0.5">v1.0.0</p>
                    </div>
                </div>
            )}
        </>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
            >
                <Menu className="h-6 w-6 text-gray-600" />
            </button>

            {/* Mobile Sidebar */}
            <div
                className={cn(
                    'lg:hidden fixed inset-0 z-50 transition-opacity duration-300',
                    isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
            >
                <div
                    className="absolute inset-0 bg-black/50"
                    onClick={() => setIsMobileOpen(false)}
                />
                <aside
                    className={cn(
                        'absolute left-0 top-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 flex flex-col',
                        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                    )}
                >
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <SidebarContent
                        isCollapsed={false}
                        pathname={pathname}
                        onToggle={() => setIsMobileOpen(false)}
                        onItemClick={() => setIsMobileOpen(false)}
                    />
                </aside>
            </div>

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    'hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white/80 backdrop-blur-xl border-r border-gray-200/50 transition-all duration-300 z-40',
                    isCollapsed ? 'w-20' : 'w-72'
                )}
            >
                <SidebarContent
                    isCollapsed={isCollapsed}
                    pathname={pathname}
                    onToggle={onToggle}
                />
            </aside>
        </>
    );
};

export default Sidebar;
