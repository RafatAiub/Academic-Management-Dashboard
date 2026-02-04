'use client';

// ============================================
// Course Details Page
// ============================================

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardBody, Button, Badge, Modal, Table, useToast, PageLoading } from '@/components/ui';
import { CourseForm } from '@/components/forms';
import { courseService, facultyService, studentService, gradeService } from '@/lib/api';
import { Course, Faculty, Student, Grade, CourseFormData } from '@/types';
import { getFullName, getInitials, getGradeColor, cn } from '@/lib/utils';
import {
    ArrowLeft,
    Edit,
    BookOpen,
    Users,
    Clock,
    MapPin,
    GraduationCap,
    Calendar,
    TrendingUp,
} from 'lucide-react';

export default function CourseDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { success, error } = useToast();

    const courseId = parseInt(params.id as string, 10);

    const [course, setCourse] = useState<Course | null>(null);
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [allFaculty, setAllFaculty] = useState<Faculty[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseData, allFacultyData, allStudentsData, allGradesData] = await Promise.all([
                    courseService.getById(courseId),
                    facultyService.getAll(),
                    studentService.getAll(),
                    gradeService.getByCourse(courseId),
                ]);

                setCourse(courseData);
                setAllFaculty(allFacultyData);
                setGrades(allGradesData);

                // Get assigned faculty
                const assignedFaculty = allFacultyData.filter((f) =>
                    courseData.facultyIds.includes(f.id)
                );
                setFaculty(assignedFaculty);

                // Get enrolled students
                const enrolledStudents = allStudentsData.filter((s) =>
                    s.courseIds.includes(courseId)
                );
                setStudents(enrolledStudents);
            } catch (err) {
                console.error('Error fetching course:', err);
                error('Failed to load course details');
                router.push('/courses');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [courseId, router]);

    const handleUpdateCourse = async (data: CourseFormData) => {
        if (!course) return;
        setIsSubmitting(true);
        try {
            const updated = await courseService.update(course.id, data);
            setCourse(updated);

            // Update faculty list
            const assignedFaculty = allFaculty.filter((f) =>
                data.facultyIds.includes(f.id)
            );
            setFaculty(assignedFaculty);

            setIsEditModalOpen(false);
            success('Course updated successfully');
        } catch (err) {
            error('Failed to update course');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <PageLoading message="Loading course details..." />;
    }

    if (!course) {
        return null;
    }

    const capacityPercentage = (course.enrollmentCount / course.capacity) * 100;
    const averageScore =
        grades.length > 0
            ? grades.reduce((sum, g) => sum + g.score, 0) / grades.length
            : 0;

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

    const studentColumns = [
        {
            key: 'student',
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
                        <Link
                            href={`/students/${student.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                            {getFullName(student.firstName, student.lastName)}
                        </Link>
                        <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'year',
            header: 'Year',
            render: (_: unknown, student: Student) => (
                <span className="text-gray-600">Year {student.year}</span>
            ),
        },
        {
            key: 'grade',
            header: 'Grade',
            render: (_: unknown, student: Student) => {
                const grade = grades.find((g) => g.studentId === student.id);
                return grade ? (
                    <div>
                        <span
                            className={cn(
                                'px-2 py-1 rounded-md text-sm font-semibold',
                                getGradeColor(grade.grade)
                            )}
                        >
                            {grade.grade}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">Score: {grade.score}</p>
                    </div>
                ) : (
                    <span className="text-gray-400">Not graded</span>
                );
            },
        },
        {
            key: 'gpa',
            header: 'GPA',
            render: (_: unknown, student: Student) => (
                <span className="font-medium text-gray-700">{student.gpa.toFixed(2)}</span>
            ),
        },
    ];

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/courses"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">Course Details</h1>
                    <p className="text-gray-500">View and manage course information</p>
                </div>
                <Button
                    variant="outline"
                    leftIcon={<Edit className="h-4 w-4" />}
                    onClick={() => setIsEditModalOpen(true)}
                >
                    Edit Course
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Course Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Course Card */}
                    <Card>
                        <CardBody className="text-center">
                            <div
                                className={cn(
                                    'w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg',
                                    getDepartmentColor(course.department)
                                )}
                            >
                                <BookOpen className="h-12 w-12" />
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-gray-900">{course.name}</h2>
                            <p className="text-gray-500">{course.code}</p>
                            <div className="mt-3 flex justify-center gap-2">
                                <Badge
                                    variant={course.status === 'active' ? 'success' : 'default'}
                                    dot
                                >
                                    {course.status}
                                </Badge>
                                <Badge variant="info">{course.credits} credits</Badge>
                            </div>

                            {course.description && (
                                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                                    {course.description}
                                </p>
                            )}

                            {/* Enrollment Progress */}
                            <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Enrollment</span>
                                    <span className="text-sm text-gray-500">
                                        {course.enrollmentCount} / {course.capacity}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            'h-full rounded-full transition-all',
                                            capacityPercentage >= 90
                                                ? 'bg-red-500'
                                                : capacityPercentage >= 70
                                                    ? 'bg-orange-500'
                                                    : 'bg-blue-500'
                                        )}
                                        style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {Math.round(capacityPercentage)}% capacity filled
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Schedule */}
                    <Card>
                        <CardHeader title="Schedule" />
                        <CardBody className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Time</p>
                                    <p className="font-medium text-gray-900">{course.schedule}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <MapPin className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Room</p>
                                    <p className="font-medium text-gray-900">{course.room}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <Calendar className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Semester</p>
                                    <p className="font-medium text-gray-900">{course.semester}</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Assigned Faculty */}
                    <Card>
                        <CardHeader
                            title="Assigned Faculty"
                            subtitle={`${faculty.length} instructor(s)`}
                        />
                        <CardBody className="p-0">
                            {faculty.length === 0 ? (
                                <div className="p-6 text-center">
                                    <GraduationCap className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                    <p className="text-gray-500">No faculty assigned</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {faculty.map((member, index) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div
                                                className={cn(
                                                    'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-semibold text-sm',
                                                    getAvatarColor(index)
                                                )}
                                            >
                                                {getInitials(member.firstName, member.lastName)}
                                            </div>
                                            <div>
                                                <Link
                                                    href={`/faculty/${member.id}`}
                                                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                                >
                                                    {getFullName(member.firstName, member.lastName)}
                                                </Link>
                                                <p className="text-sm text-gray-500">{member.title}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column - Statistics & Students */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {students.length}
                                    </p>
                                    <p className="text-sm text-gray-500">Enrolled</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <GraduationCap className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {faculty.length}
                                    </p>
                                    <p className="text-sm text-gray-500">Faculty</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {averageScore.toFixed(1)}
                                    </p>
                                    <p className="text-sm text-gray-500">Avg Score</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {course.credits}
                                    </p>
                                    <p className="text-sm text-gray-500">Credits</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Enrolled Students */}
                    <Card>
                        <CardHeader
                            title="Enrolled Students"
                            subtitle={`${students.length} student(s)`}
                        />
                        <Table
                            columns={studentColumns}
                            data={students}
                            keyExtractor={(student) => student.id}
                            emptyMessage="No students enrolled in this course"
                        />
                    </Card>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Course"
                size="lg"
            >
                <CourseForm
                    course={course}
                    faculty={allFaculty}
                    onSubmit={handleUpdateCourse}
                    onCancel={() => setIsEditModalOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>
        </DashboardLayout>
    );
}
