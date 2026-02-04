'use client';

// ============================================
// Popular Courses Component
// ============================================

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Course } from '@/types';
import { Users, BookOpen, Clock, ChevronRight } from 'lucide-react';

interface PopularCoursesProps {
    courses: Course[];
    limit?: number;
}

const PopularCourses: React.FC<PopularCoursesProps> = ({ courses, limit = 5 }) => {
    const sortedCourses = [...courses]
        .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
        .slice(0, limit);

    const getCapacityColor = (enrollment: number, capacity: number) => {
        const percentage = (enrollment / capacity) * 100;
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 70) return 'bg-orange-500';
        if (percentage >= 50) return 'bg-blue-500';
        return 'bg-emerald-500';
    };

    const getDepartmentColor = (department: string) => {
        const colors: Record<string, string> = {
            'Computer Science': 'text-blue-600 bg-blue-50',
            Mathematics: 'text-purple-600 bg-purple-50',
            Physics: 'text-emerald-600 bg-emerald-50',
            English: 'text-orange-600 bg-orange-50',
            Chemistry: 'text-cyan-600 bg-cyan-50',
            Biology: 'text-green-600 bg-green-50',
            Statistics: 'text-indigo-600 bg-indigo-50',
        };
        return colors[department] || 'text-gray-600 bg-gray-50';
    };

    return (
        <div className="space-y-3">
            {sortedCourses.map((course, index) => (
                <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="block p-4 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 group"
                >
                    <div className="flex items-start justify-between gap-4">
                        {/* Course Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span
                                    className={cn(
                                        'px-2 py-0.5 rounded-md text-xs font-semibold',
                                        getDepartmentColor(course.department)
                                    )}
                                >
                                    {course.code}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {course.credits} credits
                                </span>
                            </div>
                            <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                {course.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5" />
                                {course.schedule}
                            </p>
                        </div>

                        {/* Enrollment Status */}
                        <div className="text-right">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Users className="h-4 w-4" />
                                <span className="font-semibold">{course.enrollmentCount}</span>
                                <span className="text-gray-400">/ {course.capacity}</span>
                            </div>
                            <div className="mt-2 w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        'h-full rounded-full transition-all duration-500',
                                        getCapacityColor(course.enrollmentCount, course.capacity)
                                    )}
                                    style={{
                                        width: `${Math.min((course.enrollmentCount / course.capacity) * 100, 100)}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                </Link>
            ))}

            {sortedCourses.length === 0 && (
                <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No courses available</p>
                </div>
            )}
        </div>
    );
};

export default PopularCourses;
