'use client';

// ============================================
// Bulk Assignment Form Component
// ============================================

import React, { useState } from 'react';
import { Student, Course } from '@/types';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { cn, getFullName } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface BulkAssignmentFormProps {
    students: Student[];
    courses: Course[];
    onSubmit: (studentIds: number[], courseId: number) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const BulkAssignmentForm: React.FC<BulkAssignmentFormProps> = ({
    students,
    courses,
    onSubmit,
    onCancel,
    isLoading = false,
}) => {
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    const courseOptions = courses.map((c) => ({
        value: c.id.toString(),
        label: `${c.code} - ${c.name}`,
    }));

    const filteredStudents = students.filter((student) => {
        const fullName = getFullName(student.firstName, student.lastName).toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
    });

    const toggleStudent = (studentId: number) => {
        const newSelection = new Set(selectedStudents);
        if (newSelection.has(studentId)) {
            newSelection.delete(studentId);
        } else {
            newSelection.add(studentId);
        }
        setSelectedStudents(newSelection);
    };

    const selectAll = () => {
        const allIds = new Set(filteredStudents.map((s) => s.id));
        setSelectedStudents(allIds);
    };

    const deselectAll = () => {
        setSelectedStudents(new Set());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCourse && selectedStudents.size > 0) {
            await onSubmit(Array.from(selectedStudents), parseInt(selectedCourse, 10));
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

            <div className="form-group">
                <div className="flex items-center justify-between mb-3">
                    <label className="form-label mb-0">Select Students *</label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={selectAll}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                            Select All
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                            type="button"
                            onClick={deselectAll}
                            className="text-xs font-medium text-gray-600 hover:text-gray-700"
                        >
                            Deselect All
                        </button>
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 mb-3 text-sm border rounded-lg bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                <div className="border rounded-lg max-h-64 overflow-y-auto">
                    {filteredStudents.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No students found</div>
                    ) : (
                        filteredStudents.map((student) => (
                            <label
                                key={student.id}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 cursor-pointer border-b last:border-b-0 transition-colors',
                                    selectedStudents.has(student.id)
                                        ? 'bg-blue-50'
                                        : 'hover:bg-gray-50'
                                )}
                            >
                                <div
                                    className={cn(
                                        'w-5 h-5 rounded flex items-center justify-center transition-all',
                                        selectedStudents.has(student.id)
                                            ? 'bg-blue-600'
                                            : 'border-2 border-gray-300'
                                    )}
                                >
                                    {selectedStudents.has(student.id) && (
                                        <Check className="h-3 w-3 text-white" />
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={selectedStudents.has(student.id)}
                                    onChange={() => toggleStudent(student.id)}
                                    className="hidden"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                        {getFullName(student.firstName, student.lastName)}
                                    </p>
                                    <p className="text-sm text-gray-500">{student.email}</p>
                                </div>
                                <span className="text-sm text-gray-400">Year {student.year}</span>
                            </label>
                        ))
                    )}
                </div>

                <p className="text-sm text-gray-500 mt-2">
                    {selectedStudents.size} student(s) selected
                </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={!selectedCourse || selectedStudents.size === 0}
                >
                    Assign {selectedStudents.size} Student(s)
                </Button>
            </div>
        </form>
    );
};

export default BulkAssignmentForm;
