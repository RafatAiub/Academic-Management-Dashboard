'use client';

// ============================================
// Courses List Page
// ============================================

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardBody, Button, Input, Select, Table, Pagination, Badge, Modal, useToast } from '@/components/ui';
import { CourseForm } from '@/components/forms';
import { courseService, facultyService } from '@/lib/api';
import { Course, Faculty, CourseFormData } from '@/types';
import { cn, paginate, getTotalPages } from '@/lib/utils';
import { exportCoursesToCSV } from '@/lib/exportUtils';
import {
    Search,
    Plus,
    Download,
    Filter,
    Eye,
    Edit,
    Trash2,
    BookOpen,
    Users,
    Clock,
    X,
} from 'lucide-react';

const PAGE_SIZE = 10;

export default function CoursesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { success, error } = useToast();

    const [courses, setCourses] = useState<Course[]>([]);
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesData, facultyData] = await Promise.all([
                    courseService.getAll(),
                    facultyService.getAll(),
                ]);
                setCourses(coursesData);
                setFaculty(facultyData);
            } catch {
                error('Failed to load courses');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Open create modal if action=create in URL
    useEffect(() => {
        if (searchParams.get('action') === 'create') {
            setIsCreateModalOpen(true);
        }
    }, [searchParams]);

    // Filtered courses
    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (
                    !course.name.toLowerCase().includes(query) &&
                    !course.code.toLowerCase().includes(query)
                ) {
                    return false;
                }
            }

            // Department filter
            if (departmentFilter && course.department !== departmentFilter) {
                return false;
            }

            // Semester filter
            if (semesterFilter && course.semester !== semesterFilter) {
                return false;
            }

            return true;
        });
    }, [courses, searchQuery, departmentFilter, semesterFilter]);

    const totalPages = getTotalPages(filteredCourses.length, PAGE_SIZE);
    const paginatedCourses = paginate(filteredCourses, currentPage, PAGE_SIZE);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, departmentFilter, semesterFilter]);

    // Get unique departments and semesters
    const departments = [...new Set(courses.map((c) => c.department))];
    const semesters = [...new Set(courses.map((c) => c.semester))];

    const departmentOptions = [
        { value: '', label: 'All Departments' },
        ...departments.map((d) => ({ value: d, label: d })),
    ];

    const semesterOptions = [
        { value: '', label: 'All Semesters' },
        ...semesters.map((s) => ({ value: s, label: s })),
    ];

    const handleCreateCourse = async (data: CourseFormData) => {
        setIsSubmitting(true);
        try {
            const newCourse = await courseService.create(data);
            setCourses((prev) => [...prev, newCourse]);
            setIsCreateModalOpen(false);
            success('Course created successfully');
            router.push('/courses');
        } catch {
            error('Failed to create course');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateCourse = async (data: CourseFormData) => {
        if (!editingCourse) return;
        setIsSubmitting(true);
        try {
            const updated = await courseService.update(editingCourse.id, data);
            setCourses((prev) =>
                prev.map((c) => (c.id === editingCourse.id ? updated : c))
            );
            setEditingCourse(null);
            success('Course updated successfully');
        } catch {
            error('Failed to update course');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCourse = async () => {
        if (!deletingCourse) return;
        setIsSubmitting(true);
        try {
            await courseService.delete(deletingCourse.id);
            setCourses((prev) => prev.filter((c) => c.id !== deletingCourse.id));
            setDeletingCourse(null);
            success('Course deleted successfully');
        } catch {
            error('Failed to delete course');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExport = () => {
        exportCoursesToCSV(filteredCourses);
        success('Courses exported successfully');
    };

    const clearFilters = () => {
        setSearchQuery('');
        setDepartmentFilter('');
        setSemesterFilter('');
    };

    const hasActiveFilters = searchQuery || departmentFilter || semesterFilter;

    const getDepartmentColor = (department: string) => {
        const colors: Record<string, string> = {
            'Computer Science': 'from-blue-500 to-blue-600',
            Mathematics: 'from-purple-500 to-purple-600',
            Physics: 'from-emerald-500 to-emerald-600',
            English: 'from-orange-500 to-orange-600',
            Chemistry: 'from-cyan-500 to-cyan-600',
            Biology: 'from-green-500 to-green-600',
            Statistics: 'from-indigo-500 to-indigo-600',
        };
        return colors[department] || 'from-gray-500 to-gray-600';
    };

    const getCapacityStatus = (enrollment: number, capacity: number) => {
        const percentage = (enrollment / capacity) * 100;
        if (percentage >= 90) return { color: 'bg-red-500', text: 'Almost Full' };
        if (percentage >= 70) return { color: 'bg-orange-500', text: 'Filling Up' };
        if (percentage >= 50) return { color: 'bg-blue-500', text: 'Available' };
        return { color: 'bg-emerald-500', text: 'Open' };
    };

    const getFacultyNames = (facultyIds: number[]) => {
        return facultyIds
            .map((id) => {
                const member = faculty.find((f) => f.id === id);
                return member ? `${member.firstName} ${member.lastName}` : '';
            })
            .filter(Boolean)
            .join(', ');
    };

    const columns = [
        {
            key: 'course',
            header: 'Course',
            render: (_: unknown, course: Course) => (
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg',
                            getDepartmentColor(course.department)
                        )}
                    >
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                        <Link
                            href={`/courses/${course.id}`}
                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                            {course.name}
                        </Link>
                        <p className="text-sm text-gray-500">{course.code}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'department',
            header: 'Department',
            render: (_: unknown, course: Course) => (
                <Badge variant="default">{course.department}</Badge>
            ),
        },
        {
            key: 'faculty',
            header: 'Faculty',
            render: (_: unknown, course: Course) => (
                <span className="text-gray-600 text-sm">
                    {getFacultyNames(course.facultyIds) || 'Not assigned'}
                </span>
            ),
        },
        {
            key: 'enrollment',
            header: 'Enrollment',
            render: (_: unknown, course: Course) => {
                const status = getCapacityStatus(course.enrollmentCount, course.capacity);
                return (
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-700">
                                {course.enrollmentCount} / {course.capacity}
                            </span>
                        </div>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={cn('h-full rounded-full transition-all', status.color)}
                                style={{
                                    width: `${Math.min((course.enrollmentCount / course.capacity) * 100, 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'status',
            header: 'Status',
            render: (_: unknown, course: Course) => (
                <Badge
                    variant={
                        course.status === 'active'
                            ? 'success'
                            : course.status === 'completed'
                                ? 'info'
                                : 'default'
                    }
                    dot
                >
                    {course.status}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: '',
            align: 'right' as const,
            render: (_: unknown, course: Course) => (
                <div className="flex items-center gap-2 justify-end">
                    <Link
                        href={`/courses/${course.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Eye className="h-4 w-4" />
                    </Link>
                    <button
                        onClick={() => setEditingCourse(course)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setDeletingCourse(course)}
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
                    <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
                    <p className="text-gray-500 mt-1">
                        Manage course offerings and assignments
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
                        Add Course
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardBody className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by name or code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                leftIcon={<Search className="h-5 w-5" />}
                            />
                        </div>
                        <Button
                            variant={showFilters ? 'primary' : 'outline'}
                            leftIcon={<Filter className="h-4 w-4" />}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            Filters
                            {hasActiveFilters && (
                                <span className="ml-2 w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
                                    {[departmentFilter, semesterFilter].filter(Boolean).length}
                                </span>
                            )}
                        </Button>
                    </div>

                    {showFilters && (
                        <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 animate-slideUp">
                            <div className="w-full sm:w-auto sm:min-w-[200px]">
                                <Select
                                    value={departmentFilter}
                                    onChange={setDepartmentFilter}
                                    options={departmentOptions}
                                    placeholder="Filter by department"
                                />
                            </div>
                            <div className="w-full sm:w-auto sm:min-w-[180px]">
                                <Select
                                    value={semesterFilter}
                                    onChange={setSemesterFilter}
                                    options={semesterOptions}
                                    placeholder="Filter by semester"
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
                    Showing {paginatedCourses.length} of {filteredCourses.length} courses
                </p>
            </div>

            {/* Courses Table */}
            <Card>
                <Table
                    columns={columns}
                    data={paginatedCourses}
                    keyExtractor={(course) => course.id}
                    isLoading={isLoading}
                    emptyMessage="No courses found matching your criteria"
                />

                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            pageSize={PAGE_SIZE}
                            totalItems={filteredCourses.length}
                        />
                    </div>
                )}
            </Card>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    router.push('/courses');
                }}
                title="Add New Course"
                size="lg"
            >
                <CourseForm
                    faculty={faculty}
                    onSubmit={handleCreateCourse}
                    onCancel={() => {
                        setIsCreateModalOpen(false);
                        router.push('/courses');
                    }}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={!!editingCourse}
                onClose={() => setEditingCourse(null)}
                title="Edit Course"
                size="lg"
            >
                {editingCourse && (
                    <CourseForm
                        course={editingCourse}
                        faculty={faculty}
                        onSubmit={handleUpdateCourse}
                        onCancel={() => setEditingCourse(null)}
                        isLoading={isSubmitting}
                    />
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={!!deletingCourse}
                onClose={() => setDeletingCourse(null)}
                title="Delete Course"
                size="sm"
            >
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <Trash2 className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="text-gray-700 mb-2">
                        Are you sure you want to delete{' '}
                        <strong>{deletingCourse?.name}</strong>?
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={() => setDeletingCourse(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteCourse}
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
