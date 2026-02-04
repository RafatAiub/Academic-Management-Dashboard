'use client';

// ============================================
// Student Form Component
// ============================================

import React, { useState, useEffect } from 'react';
import { Student, StudentFormData, Course } from '@/types';
import { isValidEmail, isValidPhone } from '@/lib/utils';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import DynamicFormField from './DynamicFormField';

interface StudentFormProps {
    student?: Student;
    courses: Course[];
    onSubmit: (data: StudentFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    enrollmentDate?: string;
    address?: string;
    year?: string;
}

const StudentForm: React.FC<StudentFormProps> = ({
    student,
    courses,
    onSubmit,
    onCancel,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<StudentFormData>({
        firstName: student?.firstName || '',
        lastName: student?.lastName || '',
        email: student?.email || '',
        phone: student?.phone || '',
        dateOfBirth: student?.dateOfBirth || '',
        enrollmentDate: student?.enrollmentDate || new Date().toISOString().split('T')[0],
        year: student?.year || 1,
        status: student?.status || 'active',
        address: student?.address || '',
        courseIds: student?.courseIds || [],
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [courseSelections, setCourseSelections] = useState<{ id: string; value: string }[]>(
        student?.courseIds.map((id, index) => ({ id: `course-${index}`, value: id.toString() })) || []
    );

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'graduated', label: 'Graduated' },
        { value: 'suspended', label: 'Suspended' },
    ];

    const yearOptions = [
        { value: '1', label: 'Year 1' },
        { value: '2', label: 'Year 2' },
        { value: '3', label: 'Year 3' },
        { value: '4', label: 'Year 4' },
    ];

    const courseOptions = courses.map((course) => ({
        value: course.id.toString(),
        label: `${course.code} - ${course.name}`,
    }));

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (formData.phone && !isValidPhone(formData.phone)) {
            newErrors.phone = 'Invalid phone format';
        }

        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required';
        }

        if (!formData.enrollmentDate) {
            newErrors.enrollmentDate = 'Enrollment date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof StudentFormData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleCourseChange = (values: { id: string; value: string }[]) => {
        setCourseSelections(values);
        const courseIds = values
            .filter((v) => v.value)
            .map((v) => parseInt(v.value, 10));
        setFormData((prev) => ({ ...prev, courseIds }));
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
                    label="First Name *"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    error={errors.firstName}
                    placeholder="Enter first name"
                />
                <Input
                    label="Last Name *"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    error={errors.lastName}
                    placeholder="Enter last name"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Email *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                    placeholder="student@university.edu"
                />
                <Input
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    error={errors.phone}
                    placeholder="+1-555-0100"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Date of Birth *"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    error={errors.dateOfBirth}
                />
                <Input
                    label="Enrollment Date *"
                    type="date"
                    value={formData.enrollmentDate}
                    onChange={(e) => handleChange('enrollmentDate', e.target.value)}
                    error={errors.enrollmentDate}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Year"
                    value={formData.year.toString()}
                    onChange={(value) => handleChange('year', parseInt(value, 10))}
                    options={yearOptions}
                />
                <Select
                    label="Status"
                    value={formData.status}
                    onChange={(value) => handleChange('status', value as StudentFormData['status'])}
                    options={statusOptions}
                />
            </div>

            <Input
                label="Address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                error={errors.address}
                placeholder="Enter full address"
            />

            <DynamicFormField
                label="Enrolled Courses"
                values={courseSelections}
                onChange={handleCourseChange}
                fieldConfig={{
                    type: 'select',
                    options: courseOptions,
                    placeholder: 'Select a course',
                }}
                addButtonLabel="Add Course"
                maxFields={8}
                helper="Add courses the student is enrolled in"
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {student ? 'Update Student' : 'Create Student'}
                </Button>
            </div>
        </form>
    );
};

export default StudentForm;
