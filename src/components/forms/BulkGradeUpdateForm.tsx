'use client';

// ============================================
// Bulk Grade Update Form Component
// ============================================

import React, { useState, useEffect } from 'react';
import { Student, Course, Grade, BulkGradeUpdate } from '@/types';
import { calculateLetterGrade, getFullName } from '@/lib/utils';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { Plus, Trash2, Save } from 'lucide-react';

interface GradeEntry {
    id: string;
    studentId: number;
    score: string;
    grade: string;
}

interface BulkGradeUpdateFormProps {
    students: Student[];
    courses: Course[];
    existingGrades: Grade[];
    onSubmit: (courseId: number, grades: BulkGradeUpdate[]) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const BulkGradeUpdateForm: React.FC<BulkGradeUpdateFormProps> = ({
    students,
    courses,
    existingGrades,
    onSubmit,
    onCancel,
    isLoading = false,
}) => {
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [gradeEntries, setGradeEntries] = useState<GradeEntry[]>([]);

    const courseOptions = courses.map((c) => ({
        value: c.id.toString(),
        label: `${c.code} - ${c.name}`,
    }));

    // Get students enrolled in selected course
    const enrolledStudents = students.filter((s) =>
        s.courseIds.includes(parseInt(selectedCourse, 10))
    );

    // Initialize grade entries when course is selected
    useEffect(() => {
        if (selectedCourse) {
            const courseId = parseInt(selectedCourse, 10);
            const entries: GradeEntry[] = enrolledStudents.map((student, index) => {
                const existingGrade = existingGrades.find(
                    (g) => g.studentId === student.id && g.courseId === courseId
                );
                return {
                    id: `grade-${index}`,
                    studentId: student.id,
                    score: existingGrade?.score.toString() || '',
                    grade: existingGrade?.grade || '',
                };
            });
            setGradeEntries(entries);
        }
    }, [selectedCourse, students, existingGrades]);

    const handleScoreChange = (entryId: string, score: string) => {
        setGradeEntries((prev) =>
            prev.map((entry) => {
                if (entry.id === entryId) {
                    const numScore = parseInt(score, 10);
                    return {
                        ...entry,
                        score,
                        grade: !isNaN(numScore) ? calculateLetterGrade(numScore) : '',
                    };
                }
                return entry;
            })
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourse) return;

        const validGrades: BulkGradeUpdate[] = gradeEntries
            .filter((entry) => entry.score && entry.grade)
            .map((entry) => ({
                studentId: entry.studentId,
                courseId: parseInt(selectedCourse, 10),
                score: parseInt(entry.score, 10),
                grade: entry.grade,
            }));

        if (validGrades.length > 0) {
            await onSubmit(parseInt(selectedCourse, 10), validGrades);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Select
                label="Select Course *"
                value={selectedCourse}
                onChange={setSelectedCourse}
                options={courseOptions}
                placeholder="Choose a course"
            />

            {selectedCourse && (
                <div className="form-group">
                    <label className="form-label">Student Grades</label>

                    {enrolledStudents.length === 0 ? (
                        <div className="p-8 text-center border rounded-lg border-dashed">
                            <p className="text-gray-500">No students enrolled in this course</p>
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                            Student
                                        </th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 w-32">
                                            Score
                                        </th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 w-24">
                                            Grade
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gradeEntries.map((entry) => {
                                        const student = students.find((s) => s.id === entry.studentId);
                                        if (!student) return null;

                                        return (
                                            <tr key={entry.id} className="border-t">
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-gray-900">
                                                        {getFullName(student.firstName, student.lastName)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{student.email}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={entry.score}
                                                        onChange={(e) => handleScoreChange(entry.id, e.target.value)}
                                                        placeholder="0-100"
                                                        className="w-full px-3 py-2 text-sm border rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${entry.grade
                                                            ? entry.grade.startsWith('A')
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : entry.grade.startsWith('B')
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : entry.grade.startsWith('C')
                                                                        ? 'bg-yellow-100 text-yellow-700'
                                                                        : 'bg-red-100 text-red-700'
                                                            : 'bg-gray-100 text-gray-400'
                                                            }`}
                                                    >
                                                        {entry.grade || '-'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <p className="text-sm text-gray-500 mt-2">
                        Enter scores (0-100) to automatically calculate letter grades
                    </p>
                </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={!selectedCourse || gradeEntries.filter((e) => e.score).length === 0}
                    leftIcon={<Save className="h-4 w-4" />}
                >
                    Save All Grades
                </Button>
            </div>
        </form>
    );
};

export default BulkGradeUpdateForm;
