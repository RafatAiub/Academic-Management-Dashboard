'use client';

// ============================================
// Student Profile Page
// ============================================

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardBody, CardFooter, Button, Badge, Modal, useToast, PageLoading } from '@/components/ui';
import { StudentForm, GradeForm } from '@/components/forms';
import { studentService, courseService, gradeService } from '@/lib/api';
import { Student, Course, Grade, StudentFormData, GradeFormData } from '@/types';
import { getFullName, getInitials, formatDate, getGradeColor, getGPAClassification, cn } from '@/lib/utils';
import {
    ArrowLeft,
    Edit,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BookOpen,
    TrendingUp,
    GraduationCap,
    Plus,
    Award,
} from 'lucide-react';

export default function StudentProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { success, error } = useToast();

    const studentId = parseInt(params.id as string, 10);

    const [student, setStudent] = useState<Student | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentData, allCoursesData, gradesData] = await Promise.all([
                    studentService.getById(studentId),
                    courseService.getAll(),
                    gradeService.getByStudent(studentId),
                ]);

                setStudent(studentData);
                setAllCourses(allCoursesData);
                setGrades(gradesData);

                // Get enrolled courses
                const enrolledCourses = allCoursesData.filter((c) =>
                    studentData.courseIds.includes(c.id)
                );
                setCourses(enrolledCourses);
            } catch (err) {
                console.error('Error fetching student:', err);
                error('Failed to load student profile');
                router.push('/students');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [studentId, router]);

    const handleUpdateStudent = async (data: StudentFormData) => {
        if (!student) return;
        setIsSubmitting(true);
        try {
            const updated = await studentService.update(student.id, data);
            setStudent(updated);

            // Update enrolled courses
            const enrolledCourses = allCourses.filter((c) =>
                data.courseIds.includes(c.id)
            );
            setCourses(enrolledCourses);

            setIsEditModalOpen(false);
            success('Student updated successfully');
        } catch (err) {
            error('Failed to update student');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddGrade = async (data: GradeFormData) => {
        setIsSubmitting(true);
        try {
            const newGrade = await gradeService.create(data);
            setGrades((prev) => [...prev, newGrade]);
            setIsGradeModalOpen(false);
            success('Grade added successfully');
        } catch (err) {
            error('Failed to add grade');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <PageLoading message="Loading student profile..." />;
    }

    if (!student) {
        return null;
    }

    const gpaClassification = getGPAClassification(student.gpa);
    const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);

    const getAvatarGradient = () => {
        const gradients = [
            'from-blue-500 to-blue-600',
            'from-purple-500 to-purple-600',
            'from-emerald-500 to-emerald-600',
            'from-orange-500 to-orange-600',
            'from-pink-500 to-pink-600',
        ];
        return gradients[student.id % gradients.length];
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/students"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
                    <p className="text-gray-500">View and manage student information</p>
                </div>
                <Button
                    variant="outline"
                    leftIcon={<Edit className="h-4 w-4" />}
                    onClick={() => setIsEditModalOpen(true)}
                >
                    Edit Profile
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Info */}
                    <Card>
                        <CardBody className="text-center">
                            <div
                                className={cn(
                                    'w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-3xl font-bold shadow-lg',
                                    getAvatarGradient()
                                )}
                            >
                                {getInitials(student.firstName, student.lastName)}
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-gray-900">
                                {getFullName(student.firstName, student.lastName)}
                            </h2>
                            <p className="text-gray-500">{student.email}</p>
                            <div className="mt-3">
                                <Badge
                                    variant={student.status === 'active' ? 'success' : 'default'}
                                    dot
                                >
                                    {student.status}
                                </Badge>
                            </div>

                            {/* GPA Card */}
                            <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                                <div className="text-4xl font-bold text-gray-900">
                                    {student.gpa.toFixed(2)}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Current GPA</p>
                                <p className="text-xs text-blue-600 font-medium mt-1">
                                    {gpaClassification}
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Contact Info */}
                    <Card>
                        <CardHeader title="Contact Information" />
                        <CardBody className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium text-gray-900">{student.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <Phone className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium text-gray-900">{student.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <MapPin className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-medium text-gray-900">{student.address}</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Academic Info */}
                    <Card>
                        <CardHeader title="Academic Information" />
                        <CardBody className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <GraduationCap className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Year</p>
                                    <p className="font-medium text-gray-900">Year {student.year}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-cyan-50 rounded-lg">
                                    <Calendar className="h-5 w-5 text-cyan-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Enrolled</p>
                                    <p className="font-medium text-gray-900">
                                        {formatDate(student.enrollmentDate)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-50 rounded-lg">
                                    <Award className="h-5 w-5 text-pink-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Credits</p>
                                    <p className="font-medium text-gray-900">{totalCredits} credits</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column - Courses & Grades */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Enrolled Courses */}
                    <Card>
                        <CardHeader
                            title="Enrolled Courses"
                            subtitle={`${courses.length} courses`}
                            action={
                                <Button
                                    size="sm"
                                    variant="outline"
                                    leftIcon={<Plus className="h-4 w-4" />}
                                    onClick={() => setIsEditModalOpen(true)}
                                >
                                    Add Course
                                </Button>
                            }
                        />
                        <CardBody className="p-0">
                            {courses.length === 0 ? (
                                <div className="p-8 text-center">
                                    <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                    <p className="text-gray-500">No courses enrolled</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {courses.map((course) => {
                                        const grade = grades.find((g) => g.courseId === course.id);
                                        return (
                                            <div
                                                key={course.id}
                                                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                                        <BookOpen className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={`/courses/${course.id}`}
                                                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                                        >
                                                            {course.name}
                                                        </Link>
                                                        <p className="text-sm text-gray-500">
                                                            {course.code} • {course.credits} credits
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {grade ? (
                                                        <div>
                                                            <span
                                                                className={cn(
                                                                    'px-3 py-1 rounded-full text-sm font-semibold',
                                                                    getGradeColor(grade.grade)
                                                                )}
                                                            >
                                                                {grade.grade}
                                                            </span>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                Score: {grade.score}/100
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">
                                                            No grade yet
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Grades History */}
                    <Card>
                        <CardHeader
                            title="Grade History"
                            subtitle="All recorded grades"
                            action={
                                <Button
                                    size="sm"
                                    leftIcon={<Plus className="h-4 w-4" />}
                                    onClick={() => setIsGradeModalOpen(true)}
                                >
                                    Add Grade
                                </Button>
                            }
                        />
                        <CardBody className="p-0">
                            {grades.length === 0 ? (
                                <div className="p-8 text-center">
                                    <TrendingUp className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                    <p className="text-gray-500">No grades recorded</p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                                Course
                                            </th>
                                            <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
                                                Score
                                            </th>
                                            <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
                                                Grade
                                            </th>
                                            <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
                                                Credits
                                            </th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                                Semester
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {grades.map((grade) => {
                                            const course = allCourses.find((c) => c.id === grade.courseId);
                                            return (
                                                <tr key={grade.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium text-gray-900">
                                                            {course?.name || 'Unknown Course'}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{course?.code}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-center font-medium text-gray-700">
                                                        {grade.score}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span
                                                            className={cn(
                                                                'px-2 py-1 rounded-md text-sm font-semibold',
                                                                getGradeColor(grade.grade)
                                                            )}
                                                        >
                                                            {grade.grade}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-gray-600">
                                                        {grade.credits}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">{grade.semester}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Student"
                size="lg"
            >
                <StudentForm
                    student={student}
                    courses={allCourses}
                    onSubmit={handleUpdateStudent}
                    onCancel={() => setIsEditModalOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Add Grade Modal */}
            <Modal
                isOpen={isGradeModalOpen}
                onClose={() => setIsGradeModalOpen(false)}
                title="Add Grade"
                size="md"
            >
                <GradeForm
                    students={[student]}
                    courses={courses}
                    defaultStudentId={student.id}
                    onSubmit={handleAddGrade}
                    onCancel={() => setIsGradeModalOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>
        </DashboardLayout>
    );
}
