'use client';

// ============================================
// Students List Page
// ============================================

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardBody, Button, Input, Select, Table, Pagination, Badge, Modal, useToast } from '@/components/ui';
import { StudentForm } from '@/components/forms';
import { studentService, courseService } from '@/lib/api';
import { Student, Course, StudentFormData } from '@/types';
import { getFullName, getInitials, filterStudents, paginate, getTotalPages, formatDateShort, cn } from '@/lib/utils';
import { exportStudentsToCSV } from '@/lib/exportUtils';
import {
    Search,
    Plus,
    Download,
    Filter,
    Eye,
    Edit,
    Trash2,
    MoreVertical,
    Users,
    X,
} from 'lucide-react';

const PAGE_SIZE = 10;

export default function StudentsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { success, error } = useToast();

    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsData, coursesData] = await Promise.all([
                    studentService.getAll(),
                    courseService.getAll(),
                ]);
                setStudents(studentsData);
                setCourses(coursesData);
            } catch (err) {
                console.error('Error fetching data:', err);
                error('Failed to load students');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Open create modal if action=create in URL
    useEffect(() => {
        if (searchParams.get('action') === 'create') {
            setIsCreateModalOpen(true);
        }
    }, [searchParams]);

    // Filtered and paginated students
    const filteredStudents = useMemo(() => {
        return filterStudents(students, {
            search: searchQuery,
            year: yearFilter ? parseInt(yearFilter, 10) : undefined,
            status: statusFilter || undefined,
            courseId: courseFilter ? parseInt(courseFilter, 10) : undefined,
        });
    }, [students, searchQuery, yearFilter, courseFilter, statusFilter]);

    const totalPages = getTotalPages(filteredStudents.length, PAGE_SIZE);
    const paginatedStudents = paginate(filteredStudents, currentPage, PAGE_SIZE);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, yearFilter, courseFilter, statusFilter]);

    const yearOptions = [
        { value: '', label: 'All Years' },
        { value: '1', label: 'Year 1' },
        { value: '2', label: 'Year 2' },
        { value: '3', label: 'Year 3' },
        { value: '4', label: 'Year 4' },
    ];

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'graduated', label: 'Graduated' },
        { value: 'suspended', label: 'Suspended' },
    ];

    const courseOptions = [
        { value: '', label: 'All Courses' },
        ...courses.map((c) => ({ value: c.id.toString(), label: `${c.code} - ${c.name}` })),
    ];

    const handleCreateStudent = async (data: StudentFormData) => {
        setIsSubmitting(true);
        try {
            const newStudent = await studentService.create(data);
            setStudents((prev) => [...prev, newStudent]);
            setIsCreateModalOpen(false);
            success('Student created successfully');
            router.push('/students');
        } catch (err) {
            console.error('Create student error:', err);
            error('Failed to create student');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateStudent = async (data: StudentFormData) => {
        if (!editingStudent) return;
        setIsSubmitting(true);
        try {
            const updated = await studentService.update(editingStudent.id, data);
            setStudents((prev) =>
                prev.map((s) => (s.id === editingStudent.id ? updated : s))
            );
            setEditingStudent(null);
            success('Student updated successfully');
        } catch (err) {
            console.error('Update student error:', err);
            error('Failed to update student');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteStudent = async () => {
        if (!deletingStudent) return;
        setIsSubmitting(true);
        try {
            await studentService.delete(deletingStudent.id);
            setStudents((prev) => prev.filter((s) => s.id !== deletingStudent.id));
            setDeletingStudent(null);
            success('Student deleted successfully');
        } catch (err) {
            console.error('Delete student error:', err);
            error('Failed to delete student');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExport = () => {
        exportStudentsToCSV(filteredStudents);
        success('Students exported successfully');
    };

    const clearFilters = () => {
        setSearchQuery('');
        setYearFilter('');
        setCourseFilter('');
        setStatusFilter('');
    };

    const hasActiveFilters = searchQuery || yearFilter || courseFilter || statusFilter;

    const getAvatarColor = (index: number) => {
        const colors = [
            'from-blue-500 to-blue-600',
            'from-purple-500 to-purple-600',
            'from-emerald-500 to-emerald-600',
            'from-orange-500 to-orange-600',
            'from-pink-500 to-pink-600',
        ];
        return colors[index % colors.length];
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
            active: 'success',
            inactive: 'default',
            graduated: 'info',
            suspended: 'error',
        };
        return <Badge variant={variants[status] || 'default'} dot>{status}</Badge>;
    };

    const columns = [
        {
            key: 'name',
            header: 'Student',
            render: (_: unknown, student: Student, index: number) => (
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-semibold text-sm',
                            getAvatarColor(index)
                        )}
                    >
                        {getInitials(student.firstName, student.lastName)}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">
                            {getFullName(student.firstName, student.lastName)}
                        </p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'year',
            header: 'Year',
            render: (_: unknown, student: Student) => (
                <span className="font-medium text-gray-600">Year {student.year}</span>
            ),
        },
        {
            key: 'gpa',
            header: 'GPA',
            render: (_: unknown, student: Student) => (
                <span
                    className={cn(
                        'px-2 py-1 rounded-md font-semibold text-sm',
                        student.gpa >= 3.7
                            ? 'bg-emerald-100 text-emerald-700'
                            : student.gpa >= 3.0
                                ? 'bg-blue-100 text-blue-700'
                                : student.gpa >= 2.0
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                    )}
                >
                    {student.gpa.toFixed(2)}
                </span>
            ),
        },
        {
            key: 'courses',
            header: 'Courses',
            render: (_: unknown, student: Student) => (
                <span className="text-gray-600">{student.courseIds.length} enrolled</span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (_: unknown, student: Student) => getStatusBadge(student.status),
        },
        {
            key: 'actions',
            header: '',
            align: 'right' as const,
            render: (_: unknown, student: Student) => (
                <div className="flex items-center gap-2 justify-end">
                    <Link
                        href={`/students/${student.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Eye className="h-4 w-4" />
                    </Link>
                    <button
                        onClick={() => setEditingStudent(student)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setDeletingStudent(student)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Students</h1>
                    <p className="text-gray-500 mt-1">
                        Manage student records and enrollments
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        leftIcon={<Download className="h-4 w-4" />}
                        onClick={handleExport}
                    >
                        Export
                    </Button>
                    <Button
                        leftIcon={<Plus className="h-4 w-4" />}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Add Student
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardBody className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                leftIcon={<Search className="h-5 w-5" />}
                            />
                        </div>

                        {/* Filter Toggle */}
                        <Button
                            variant={showFilters ? 'primary' : 'outline'}
                            leftIcon={<Filter className="h-4 w-4" />}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            Filters
                            {hasActiveFilters && (
                                <span className="ml-2 w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
                                    {[yearFilter, courseFilter, statusFilter].filter(Boolean).length}
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 animate-slideUp">
                            <div className="w-full sm:w-auto sm:min-w-[180px]">
                                <Select
                                    value={yearFilter}
                                    onChange={setYearFilter}
                                    options={yearOptions}
                                    placeholder="Filter by year"
                                />
                            </div>
                            <div className="w-full sm:w-auto sm:min-w-[240px]">
                                <Select
                                    value={courseFilter}
                                    onChange={setCourseFilter}
                                    options={courseOptions}
                                    placeholder="Filter by course"
                                />
                            </div>
                            <div className="w-full sm:w-auto sm:min-w-[180px]">
                                <Select
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    options={statusOptions}
                                    placeholder="Filter by status"
                                />
                            </div>
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    leftIcon={<X className="h-4 w-4" />}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                    Showing {paginatedStudents.length} of {filteredStudents.length} students
                </p>
            </div>

            {/* Students Table */}
            <Card>
                <Table
                    columns={columns}
                    data={paginatedStudents}
                    keyExtractor={(student) => student.id}
                    isLoading={isLoading}
                    emptyMessage="No students found matching your criteria"
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            pageSize={PAGE_SIZE}
                            totalItems={filteredStudents.length}
                        />
                    </div>
                )}
            </Card>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    router.push('/students');
                }}
                title="Add New Student"
                size="lg"
            >
                <StudentForm
                    courses={courses}
                    onSubmit={handleCreateStudent}
                    onCancel={() => {
                        setIsCreateModalOpen(false);
                        router.push('/students');
                    }}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={!!editingStudent}
                onClose={() => setEditingStudent(null)}
                title="Edit Student"
                size="lg"
            >
                {editingStudent && (
                    <StudentForm
                        student={editingStudent}
                        courses={courses}
                        onSubmit={handleUpdateStudent}
                        onCancel={() => setEditingStudent(null)}
                        isLoading={isSubmitting}
                    />
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deletingStudent}
                onClose={() => setDeletingStudent(null)}
                title="Delete Student"
                size="sm"
            >
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <Trash2 className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="text-gray-700 mb-2">
                        Are you sure you want to delete{' '}
                        <strong>
                            {deletingStudent &&
                                getFullName(deletingStudent.firstName, deletingStudent.lastName)}
                        </strong>
                        ?
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={() => setDeletingStudent(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteStudent}
                            isLoading={isSubmitting}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
