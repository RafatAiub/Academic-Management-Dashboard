'use client';

// ============================================
// Header Component
// ============================================

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    Bell,
    Search,
    User,
    LogOut,
    Settings,
    ChevronDown,
} from 'lucide-react';

interface HeaderProps {
    sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed }) => {
    const [showSearch, setShowSearch] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        { id: 1, title: 'New student enrolled', message: 'John Smith enrolled in CS101', time: '5 min ago' },
        { id: 2, title: 'Grade updated', message: 'Emily Johnson received A in Math201', time: '1 hour ago' },
        { id: 3, title: 'Course capacity alert', message: 'Physics 150 is at 93% capacity', time: '2 hours ago' },
    ];

    return (
        <header
            className={cn(
                'fixed top-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 z-30 transition-all duration-300',
                sidebarCollapsed ? 'lg:left-20' : 'lg:left-72',
                'left-0'
            )}
        >
            <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
                {/* Left Section - Search */}
                <div className="flex-1 max-w-xl hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search students, courses, faculty..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>

                {/* Mobile Search Toggle */}
                <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                    <Search className="h-5 w-5" />
                </button>

                {/* Right Section */}
                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowUserMenu(false);
                            }}
                            className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-slideUp">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <p className="font-medium text-sm text-gray-900">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {notification.time}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-2 border-t border-gray-100">
                                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowUserMenu(!showUserMenu);
                                setShowNotifications(false);
                            }}
                            className="flex items-center gap-3 p-1.5 pr-3 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-semibold text-gray-900">Admin User</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
                        </button>

                        {/* User Dropdown */}
                        {showUserMenu && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-slideUp">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="font-semibold text-gray-900">Admin User</p>
                                    <p className="text-sm text-gray-500">admin@university.edu</p>
                                </div>
                                <div className="py-1">
                                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                        <User className="h-4 w-4" />
                                        <span>Profile</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                        <Settings className="h-4 w-4" />
                                        <span>Settings</span>
                                    </button>
                                </div>
                                <div className="border-t border-gray-100 pt-1">
                                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar */}
            {showSearch && (
                <div className="md:hidden absolute top-full left-0 right-0 p-4 bg-white border-b border-gray-200 animate-slideUp">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            autoFocus
                        />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
