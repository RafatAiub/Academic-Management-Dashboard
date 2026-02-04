'use client';

// ============================================
// Top Students Leaderboard Component
// ============================================

import React from 'react';
import Link from 'next/link';
import { cn, getFullName, getInitials } from '@/lib/utils';
import { Student } from '@/types';
import { Trophy, Medal, Award, ExternalLink } from 'lucide-react';

interface TopStudentsLeaderboardProps {
    students: Student[];
    limit?: number;
}

const TopStudentsLeaderboard: React.FC<TopStudentsLeaderboardProps> = ({
    students,
    limit = 10,
}) => {
    const sortedStudents = [...students]
        .sort((a, b) => b.gpa - a.gpa)
        .slice(0, limit);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                        <Trophy className="h-4 w-4 text-white" />
                    </div>
                );
            case 2:
                return (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-lg shadow-gray-400/30">
                        <Medal className="h-4 w-4 text-white" />
                    </div>
                );
            case 3:
                return (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <Award className="h-4 w-4 text-white" />
                    </div>
                );
            default:
                return (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-500">{rank}</span>
                    </div>
                );
        }
    };

    const getAvatarColors = (index: number) => {
        const colors = [
            'from-blue-500 to-blue-600',
            'from-purple-500 to-purple-600',
            'from-emerald-500 to-emerald-600',
            'from-orange-500 to-orange-600',
            'from-pink-500 to-pink-600',
            'from-cyan-500 to-cyan-600',
            'from-indigo-500 to-indigo-600',
            'from-rose-500 to-rose-600',
            'from-teal-500 to-teal-600',
            'from-amber-500 to-amber-600',
        ];
        return colors[index % colors.length];
    };

    const getGPAColor = (gpa: number) => {
        if (gpa >= 3.9) return 'text-emerald-600 bg-emerald-50';
        if (gpa >= 3.7) return 'text-blue-600 bg-blue-50';
        if (gpa >= 3.5) return 'text-purple-600 bg-purple-50';
        return 'text-gray-600 bg-gray-50';
    };

    return (
        <div className="space-y-2">
            {sortedStudents.map((student, index) => (
                <Link
                    key={student.id}
                    href={`/students/${student.id}`}
                    className={cn(
                        'flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group',
                        'hover:bg-gray-50 hover:shadow-sm',
                        index < 3 && 'bg-gradient-to-r from-gray-50/50 to-transparent'
                    )}
                >
                    {/* Rank */}
                    {getRankIcon(index + 1)}

                    {/* Avatar */}
                    <div
                        className={cn(
                            'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-semibold shadow-md',
                            getAvatarColors(index)
                        )}
                    >
                        {getInitials(student.firstName, student.lastName)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 truncate">
                                {getFullName(student.firstName, student.lastName)}
                            </p>
                            <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-sm text-gray-500">Year {student.year}</p>
                    </div>

                    {/* GPA */}
                    <div
                        className={cn(
                            'px-3 py-1.5 rounded-lg font-semibold text-sm',
                            getGPAColor(student.gpa)
                        )}
                    >
                        {student.gpa.toFixed(2)}
                    </div>
                </Link>
            ))}

            {sortedStudents.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No students data available</p>
                </div>
            )}
        </div>
    );
};

export default TopStudentsLeaderboard;
