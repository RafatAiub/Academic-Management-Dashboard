'use client';

// ============================================
// Faculty Panel Page
// ============================================

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardBody, Button, Input, Select, Table, Pagination, Badge, Modal, Tabs, useToast } from '@/components/ui';
import { BulkAssignmentForm, BulkGradeUpdateForm, GradeForm } from '@/components/forms';
import { facultyService, studentService, courseService, gradeService } from '@/lib/api';
import { Faculty, Student, Course, Grade, GradeFormData, BulkGradeUpdate } from '@/types';
import { getFullName, getInitials, cn, paginate, getTotalPages } from '@/lib/utils';
import {
    Search,
    Users,
    BookOpen,
    Award,
    GraduationCap,
    Plus,
    Edit,
    UserPlus,
    ClipboardList,
    PlusCircle,
} from 'lucide-react';

const PAGE_SIZE = 8;

export default function FacultyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { success, error } = useToast();

    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal states
    const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);
    const [isBulkGradeOpen, setIsBulkGradeOpen] = useState(false);
    const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);

    // Active tab
    const [activeTab, setActiveTab] = useState('faculty');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [facultyData, studentsData, coursesData, gradesData] = await Promise.all([
                    facultyService.getAll(),
                    studentService.getAll(),
                    courseService.getAll(),
                    gradeService.getAll(),
                ]);
                setFaculty(facultyData);
                setStudents(studentsData);
                setCourses(coursesData);
                setGrades(gradesData);
            } catch {
                error('Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'grades') {
            setActiveTab('grades');
        }
    }, [searchParams]);

    // Filtered faculty
    const filteredFaculty = useMemo(() => {
        return faculty.filter((member) => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const fullName = getFullName(member.firstName, member.lastName).toLowerCase();
                if (!fullName.includes(query) && !member.email.toLowerCase().includes(query)) {
                    return false;
                }
            }
            if (departmentFilter && member.department !== departmentFilter) {
                return false;
            }
            return true;
        });
    }, [faculty, searchQuery, departmentFilter]);

    const totalPages = getTotalPages(filteredFaculty.length, PAGE_SIZE);
    const paginatedFaculty = paginate(filteredFaculty, currentPage, PAGE_SIZE);

    const departments = [...new Set(faculty.map((f) => f.department))];
    const departmentOptions = [
        { value: '', label: 'All Departments' },
        ...departments.map((d) => ({ value: d, label: d })),
    ];

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

    const handleBulkAssign = async (studentIds: number[], courseId: number) => {
        setIsSubmitting(true);
        try {
            // Update each student's course list (optimistic update)
            const updatedStudents = students.map((student) => {
                if (studentIds.includes(student.id) && !student.courseIds.includes(courseId)) {
                    return { ...student, courseIds: [...student.courseIds, courseId] };
                }
                return student;
            });
            setStudents(updatedStudents);

            // Also update course enrollment count
            const updatedCourses = courses.map((course) => {
                if (course.id === courseId) {
                    return {
                        ...course,
                        enrollmentCount: course.enrollmentCount + studentIds.length,
                    };
                }
                return course;
            });
            setCourses(updatedCourses);

            setIsBulkAssignOpen(false);
            success(`${studentIds.length} students assigned successfully`);
        } catch {
            error('Failed to assign students');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBulkGradeUpdate = async (courseId: number, gradeUpdates: BulkGradeUpdate[]) => {
        setIsSubmitting(true);
        try {
            // Update grades (optimistic update)
            const updatedGrades = [...grades];

            for (const update of gradeUpdates) {
                const existingIndex = updatedGrades.findIndex(
                    (g) => g.studentId === update.studentId && g.courseId === update.courseId
                );

                if (existingIndex >= 0) {
                    updatedGrades[existingIndex] = {
                        ...updatedGrades[existingIndex],
                        score: update.score,
                        grade: update.grade,
                    };
                } else {
                    const newGrade: Grade = {
                        id: Date.now() + Math.random(),
                        studentId: update.studentId,
                        courseId: update.courseId,
                        grade: update.grade,
                        score: update.score,
                        semester: 'Fall 2024',
                        credits: courses.find((c) => c.id === update.courseId)?.credits || 3,
                    };
                    updatedGrades.push(newGrade);
                }
            }

            setGrades(updatedGrades);
            setIsBulkGradeOpen(false);
            success(`${gradeUpdates.length} grades updated successfully`);
        } catch {
            error('Failed to update grades');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddGrade = async (data: GradeFormData) => {
        setIsSubmitting(true);
        try {
            const newGrade = await gradeService.create(data);
            setGrades((prev) => [...prev, newGrade]);
            setIsAddGradeOpen(false);
            success('Grade added successfully');
        } catch {
            error('Failed to add grade');
        } finally {
            setIsSubmitting(false);
        }
    };

    const facultyColumns = [
        {
            key: 'name',
            header: 'Faculty Member',
            render: (_: unknown, member: Faculty, index: number) => (
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-semibold shadow-md',
                            getAvatarColor(index)
                        )}
                    >
                        {getInitials(member.firstName, member.lastName)}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">
                            {getFullName(member.firstName, member.lastName)}
                        </p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'title',
            header: 'Title',
            render: (_: unknown, member: Faculty) => (
                <span className="text-gray-700">{member.title}</span>
            ),
        },
        {
            key: 'department',
            header: 'Department',
            render: (_: unknown, member: Faculty) => (
                <Badge variant="default">{member.department}</Badge>
            ),
        },
        {
            key: 'courses',
            header: 'Assigned Courses',
            render: (_: unknown, member: Faculty) => (
                <span className="text-gray-600">{member.courseIds.length} course(s)</span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (_: unknown, member: Faculty) => (
                <Badge variant={member.status === 'active' ? 'success' : 'default'} dot>
                    {member.status}
                </Badge>
            ),
        },
    ];

    const tabs = [
        { id: 'faculty', label: 'Faculty Members', icon: <GraduationCap className="h-4 w-4" /> },
        { id: 'assignments', label: 'Course Assignments', icon: <BookOpen className="h-4 w-4" /> },
        { id: 'grades', label: 'Grade Management', icon: <Award className="h-4 w-4" /> },
    ];

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Faculty Panel</h1>
                    <p className="text-gray-500 mt-1">
                        Manage faculty, assignments, and grades
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'faculty' && (
                    <>
                        {/* Faculty Filters */}
                        <Card className="mb-6">
                            <CardBody className="p-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Search faculty..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            leftIcon={<Search className="h-5 w-5" />}
                                        />
                                    </div>
                                    <div className="w-full sm:w-48">
                                        <Select
                                            value={departmentFilter}
                                            onChange={setDepartmentFilter}
                                            options={departmentOptions}
                                        />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Faculty Table */}
                        <Card>
                            <Table
                                columns={facultyColumns}
                                data={paginatedFaculty}
                                keyExtractor={(member) => member.id}
                                isLoading={isLoading}
                                emptyMessage="No faculty members found"
                            />
                            {totalPages > 1 && (
                                <div className="px-6 py-4 border-t">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                        pageSize={PAGE_SIZE}
                                        totalItems={filteredFaculty.length}
                                    />
                                </div>
                            )}
                        </Card>
                    </>
                )}

                {activeTab === 'assignments' && (
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader
                                title="Bulk Student Assignment"
                                subtitle="Assign multiple students to a course at once"
                            />
                            <CardBody>
                                <p className="text-gray-600 mb-4">
                                    Use the bulk assignment feature to quickly enroll multiple students
                                    into a course. This is useful for batch enrollments at the start
                                    of a semester.
                                </p>
                                <Button
                                    leftIcon={<UserPlus className="h-4 w-4" />}
                                    onClick={() => setIsBulkAssignOpen(true)}
                                >
                                    Bulk Assign Students
                                </Button>
                            </CardBody>
                        </Card>

                        {/* Course Assignments Overview */}
                        <Card>
                            <CardHeader
                                title="Course Assignments"
                                subtitle="Current course enrollment status"
                            />
                            <CardBody className="p-0">
                                <div className="divide-y">
                                    {courses.slice(0, 6).map((course, index) => {
                                        const capacityPercentage = (course.enrollmentCount / course.capacity) * 100;
                                        return (
                                            <div
                                                key={course.id}
                                                className="flex items-center justify-between p-4 hover:bg-gray-50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={cn(
                                                            'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white',
                                                            getAvatarColor(index)
                                                        )}
                                                    >
                                                        <BookOpen className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{course.name}</p>
                                                        <p className="text-sm text-gray-500">{course.code}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-gray-400" />
                                                        <span className="font-medium text-gray-700">
                                                            {course.enrollmentCount} / {course.capacity}
                                                        </span>
                                                    </div>
                                                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                                                        <div
                                                            className={cn(
                                                                'h-full rounded-full',
                                                                capacityPercentage >= 90
                                                                    ? 'bg-red-500'
                                                                    : capacityPercentage >= 70
                                                                        ? 'bg-orange-500'
                                                                        : 'bg-blue-500'
                                                            )}
                                                            style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                )}

                {activeTab === 'grades' && (
                    <div className="space-y-6">
                        {/* Grade Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader
                                    title="Add Individual Grade"
                                    subtitle="Add a grade for a single student"
                                />
                                <CardBody>
                                    <p className="text-gray-600 mb-4">
                                        Add or update a grade for a specific student in a course.
                                    </p>
                                    <Button
                                        leftIcon={<PlusCircle className="h-4 w-4" />}
                                        onClick={() => setIsAddGradeOpen(true)}
                                    >
                                        Add Grade
                                    </Button>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardHeader
                                    title="Bulk Grade Update"
                                    subtitle="Update grades for multiple students"
                                />
                                <CardBody>
                                    <p className="text-gray-600 mb-4">
                                        Efficiently update grades for all students enrolled in a course.
                                    </p>
                                    <Button
                                        variant="secondary"
                                        leftIcon={<ClipboardList className="h-4 w-4" />}
                                        onClick={() => setIsBulkGradeOpen(true)}
                                    >
                                        Bulk Update Grades
                                    </Button>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Recent Grades */}
                        <Card>
                            <CardHeader
                                title="Recent Grades"
                                subtitle="Latest grade entries"
                            />
                            <CardBody className="p-0">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                                Student
                                            </th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                                Course
                                            </th>
                                            <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
                                                Score
                                            </th>
                                            <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
                                                Grade
                                            </th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                                Semester
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {grades.slice(0, 10).map((grade) => {
                                            const student = students.find((s) => s.id === grade.studentId);
                                            const course = courses.find((c) => c.id === grade.courseId);
                                            return (
                                                <tr key={grade.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium text-gray-900">
                                                            {student
                                                                ? getFullName(student.firstName, student.lastName)
                                                                : 'Unknown'}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className="text-gray-700">{course?.name || 'Unknown'}</p>
                                                        <p className="text-sm text-gray-500">{course?.code}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-center font-medium text-gray-700">
                                                        {grade.score}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span
                                                            className={cn(
                                                                'px-2 py-1 rounded-md text-sm font-semibold',
                                                                grade.grade.startsWith('A')
                                                                    ? 'bg-emerald-100 text-emerald-700'
                                                                    : grade.grade.startsWith('B')
                                                                        ? 'bg-blue-100 text-blue-700'
                                                                        : grade.grade.startsWith('C')
                                                                            ? 'bg-yellow-100 text-yellow-700'
                                                                            : 'bg-red-100 text-red-700'
                                                            )}
                                                        >
                                                            {grade.grade}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">{grade.semester}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </CardBody>
                        </Card>
                    </div>
                )}
            </div>

            {/* Bulk Assignment Modal */}
            <Modal
                isOpen={isBulkAssignOpen}
                onClose={() => setIsBulkAssignOpen(false)}
                title="Bulk Student Assignment"
                size="lg"
            >
                <BulkAssignmentForm
                    students={students}
                    courses={courses}
                    onSubmit={handleBulkAssign}
                    onCancel={() => setIsBulkAssignOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Bulk Grade Modal */}
            <Modal
                isOpen={isBulkGradeOpen}
                onClose={() => setIsBulkGradeOpen(false)}
                title="Bulk Grade Update"
                size="lg"
            >
                <BulkGradeUpdateForm
                    students={students}
                    courses={courses}
                    existingGrades={grades}
                    onSubmit={handleBulkGradeUpdate}
                    onCancel={() => setIsBulkGradeOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Add Grade Modal */}
            <Modal
                isOpen={isAddGradeOpen}
                onClose={() => setIsAddGradeOpen(false)}
                title="Add Grade"
                size="md"
            >
                <GradeForm
                    students={students}
                    courses={courses}
                    onSubmit={handleAddGrade}
                    onCancel={() => setIsAddGradeOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>
        </DashboardLayout>
    );
}
