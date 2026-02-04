'use client';

// ============================================
// Course Form Component
// ============================================

import React, { useState } from 'react';
import { Course, CourseFormData, Faculty } from '@/types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import DynamicFormField from './DynamicFormField';

interface CourseFormProps {
    course?: Course;
    faculty: Faculty[];
    onSubmit: (data: CourseFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

interface FormErrors {
    code?: string;
    name?: string;
    description?: string;
    credits?: string;
    department?: string;
    semester?: string;
    schedule?: string;
    room?: string;
    capacity?: string;
}

const CourseForm: React.FC<CourseFormProps> = ({
    course,
    faculty,
    onSubmit,
    onCancel,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<CourseFormData>({
        code: course?.code || '',
        name: course?.name || '',
        description: course?.description || '',
        credits: course?.credits || 3,
        department: course?.department || '',
        semester: course?.semester || 'Fall 2024',
        schedule: course?.schedule || '',
        room: course?.room || '',
        capacity: course?.capacity || 30,
        facultyIds: course?.facultyIds || [],
        status: course?.status || 'active',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [facultySelections, setFacultySelections] = useState<{ id: string; value: string }[]>(
        course?.facultyIds.map((val, index) => ({
            id: `faculty-${index}`,
            value: val.toString(),
        })) || []
    );

    const departmentOptions = [
        { value: 'Computer Science', label: 'Computer Science' },
        { value: 'Mathematics', label: 'Mathematics' },
        { value: 'Physics', label: 'Physics' },
        { value: 'Chemistry', label: 'Chemistry' },
        { value: 'Biology', label: 'Biology' },
        { value: 'English', label: 'English' },
        { value: 'Statistics', label: 'Statistics' },
    ];

    const semesterOptions = [
        { value: 'Fall 2024', label: 'Fall 2024' },
        { value: 'Spring 2025', label: 'Spring 2025' },
        { value: 'Summer 2025', label: 'Summer 2025' },
        { value: 'Fall 2025', label: 'Fall 2025' },
    ];

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'completed', label: 'Completed' },
    ];

    const creditOptions = [
        { value: '1', label: '1 Credit' },
        { value: '2', label: '2 Credits' },
        { value: '3', label: '3 Credits' },
        { value: '4', label: '4 Credits' },
        { value: '5', label: '5 Credits' },
    ];

    const facultyOptions = faculty.map((f) => ({
        value: f.id.toString(),
        label: `${f.firstName} ${f.lastName} - ${f.department}`,
    }));

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.code.trim()) {
            newErrors.code = 'Course code is required';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Course name is required';
        }

        if (!formData.department) {
            newErrors.department = 'Department is required';
        }

        if (!formData.schedule.trim()) {
            newErrors.schedule = 'Schedule is required';
        }

        if (!formData.room.trim()) {
            newErrors.room = 'Room is required';
        }

        if (formData.capacity < 1) {
            newErrors.capacity = 'Capacity must be at least 1';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof CourseFormData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleFacultyChange = (values: { id: string; value: string }[]) => {
        setFacultySelections(values);
        const facultyIds = values
            .filter((v) => v.value)
            .map((v) => parseInt(v.value, 10));
        setFormData((prev) => ({ ...prev, facultyIds }));
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
                <Input
                    label="Course Code *"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value)}
                    error={errors.code}
                    placeholder="e.g., CS101"
                />
                <Select
                    label="Department *"
                    value={formData.department}
                    onChange={(value) => handleChange('department', value)}
                    options={departmentOptions}
                    placeholder="Select department"
                    error={errors.department}
                />
            </div>

            <Input
                label="Course Name *"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                placeholder="Enter course name"
            />

            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 text-sm border rounded-lg bg-white transition-all duration-200 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                    placeholder="Enter course description"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                    label="Credits *"
                    value={formData.credits.toString()}
                    onChange={(value) => handleChange('credits', parseInt(value, 10))}
                    options={creditOptions}
                />
                <Select
                    label="Semester *"
                    value={formData.semester}
                    onChange={(value) => handleChange('semester', value)}
                    options={semesterOptions}
                />
                <Select
                    label="Status"
                    value={formData.status}
                    onChange={(value) => handleChange('status', value as CourseFormData['status'])}
                    options={statusOptions}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Schedule *"
                    value={formData.schedule}
                    onChange={(e) => handleChange('schedule', e.target.value)}
                    error={errors.schedule}
                    placeholder="e.g., Mon/Wed/Fri 9:00 AM - 10:00 AM"
                />
                <Input
                    label="Room *"
                    value={formData.room}
                    onChange={(e) => handleChange('room', e.target.value)}
                    error={errors.room}
                    placeholder="e.g., Science Building 101"
                />
            </div>

            <Input
                label="Capacity *"
                type="number"
                value={formData.capacity.toString()}
                onChange={(e) => handleChange('capacity', parseInt(e.target.value, 10) || 0)}
                error={errors.capacity}
                placeholder="Enter maximum capacity"
            />

            <DynamicFormField
                label="Assigned Faculty"
                values={facultySelections}
                onChange={handleFacultyChange}
                fieldConfig={{
                    type: 'select',
                    options: facultyOptions,
                    placeholder: 'Select faculty member',
                }}
                addButtonLabel="Add Faculty"
                maxFields={5}
                helper="Assign faculty members to this course"
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {course ? 'Update Course' : 'Create Course'}
                </Button>
            </div>
        </form>
    );
};

export default CourseForm;
