'use client';

// ============================================
// Grade Form Component
// ============================================

import React, { useState } from 'react';
import { Grade, GradeFormData, Student, Course } from '@/types';
import { calculateLetterGrade } from '@/lib/utils';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface GradeFormProps {
    grade?: Grade;
    students: Student[];
    courses: Course[];
    defaultStudentId?: number;
    defaultCourseId?: number;
    onSubmit: (data: GradeFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

interface FormErrors {
    studentId?: string;
    courseId?: string;
    score?: string;
}

const GradeForm: React.FC<GradeFormProps> = ({
    grade,
    students,
    courses,
    defaultStudentId,
    defaultCourseId,
    onSubmit,
    onCancel,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<GradeFormData>({
        studentId: grade?.studentId || defaultStudentId || 0,
        courseId: grade?.courseId || defaultCourseId || 0,
        grade: grade?.grade || '',
        score: grade?.score || 0,
        semester: grade?.semester || 'Fall 2024',
        credits: grade?.credits || 4,
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const studentOptions = students.map((s) => ({
        value: s.id.toString(),
        label: `${s.firstName} ${s.lastName}`,
    }));

    const courseOptions = courses.map((c) => ({
        value: c.id.toString(),
        label: `${c.code} - ${c.name}`,
    }));

    const gradeOptions = [
        { value: 'A+', label: 'A+' },
        { value: 'A', label: 'A' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B', label: 'B' },
        { value: 'B-', label: 'B-' },
        { value: 'C+', label: 'C+' },
        { value: 'C', label: 'C' },
        { value: 'C-', label: 'C-' },
        { value: 'D+', label: 'D+' },
        { value: 'D', label: 'D' },
        { value: 'D-', label: 'D-' },
        { value: 'F', label: 'F' },
    ];

    const semesterOptions = [
        { value: 'Fall 2024', label: 'Fall 2024' },
        { value: 'Spring 2025', label: 'Spring 2025' },
        { value: 'Summer 2025', label: 'Summer 2025' },
    ];

    const creditOptions = [
        { value: '1', label: '1 Credit' },
        { value: '2', label: '2 Credits' },
        { value: '3', label: '3 Credits' },
        { value: '4', label: '4 Credits' },
        { value: '5', label: '5 Credits' },
    ];

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.studentId) {
            newErrors.studentId = 'Student is required';
        }

        if (!formData.courseId) {
            newErrors.courseId = 'Course is required';
        }

        if (formData.score < 0 || formData.score > 100) {
            newErrors.score = 'Score must be between 0 and 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof GradeFormData, value: string | number) => {
        let newValue = value;
        let newGrade = formData.grade;

        // Auto-calculate letter grade when score changes
        if (field === 'score') {
            const score = typeof value === 'string' ? parseInt(value, 10) : value;
            if (!isNaN(score)) {
                newGrade = calculateLetterGrade(score);
                newValue = score;
            }
        }

        setFormData((prev) => ({
            ...prev,
            [field]: newValue,
            ...(field === 'score' ? { grade: newGrade } : {}),
        }));

        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            await onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Student *"
                    value={formData.studentId.toString()}
                    onChange={(value) => handleChange('studentId', parseInt(value, 10))}
                    options={studentOptions}
                    placeholder="Select student"
                    error={errors.studentId}
                    disabled={!!defaultStudentId}
                />
                <Select
                    label="Course *"
                    value={formData.courseId.toString()}
                    onChange={(value) => handleChange('courseId', parseInt(value, 10))}
                    options={courseOptions}
                    placeholder="Select course"
                    error={errors.courseId}
                    disabled={!!defaultCourseId}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Score (0-100) *"
                    type="number"
                    value={formData.score.toString()}
                    onChange={(e) => handleChange('score', e.target.value)}
                    error={errors.score}
                    placeholder="Enter score"
                />
                <Select
                    label="Letter Grade"
                    value={formData.grade}
                    onChange={(value) => handleChange('grade', value)}
                    options={gradeOptions}
                    placeholder="Select grade"
                />
                <Select
                    label="Credits"
                    value={formData.credits.toString()}
                    onChange={(value) => handleChange('credits', parseInt(value, 10))}
                    options={creditOptions}
                />
            </div>

            <Select
                label="Semester"
                value={formData.semester}
                onChange={(value) => handleChange('semester', value)}
                options={semesterOptions}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {grade ? 'Update Grade' : 'Add Grade'}
                </Button>
            </div>
        </form>
    );
};

export default GradeForm;
