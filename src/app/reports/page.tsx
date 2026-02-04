'use client';

// ============================================
// Reports Page
// ============================================

import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardBody, Button, Select, Tabs, useToast } from '@/components/ui';
import { EnrollmentChart, EnrollmentTrendChart, GPADistributionChart } from '@/components/charts';
import { studentService, courseService, gradeService, enrollmentService } from '@/lib/api';
import { Student, Course, Grade, EnrollmentHistory } from '@/types';
import { getFullName, getGradeColor, cn } from '@/lib/utils';
import { exportStudentsToCSV, exportCoursesToCSV, exportGradesToCSV, exportFullReportToCSV } from '@/lib/exportUtils';
import {
    Download,
    FileSpreadsheet,
    TrendingUp,
    Users,
    Award,
    BarChart3,
    PieChart,
    Calendar,
} from 'lucide-react';

export default function ReportsPage() {
    const { success, error } = useToast();

    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [enrollmentHistory, setEnrollmentHistory] = useState<EnrollmentHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsData, coursesData, gradesData, historyData] = await Promise.all([
                    studentService.getAll(),
                    courseService.getAll(),
                    gradeService.getAll(),
                    enrollmentService.getHistory(),
                ]);
                setStudents(studentsData);
                setCourses(coursesData);
                setGrades(gradesData);
                setEnrollmentHistory(historyData);
            } catch (err) {
                console.error('Error fetching data:', err);
                error('Failed to load reports');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter options
    const courseOptions = [
        { value: '', label: 'All Courses' },
        ...courses.map((c) => ({ value: c.id.toString(), label: `${c.code} - ${c.name}` })),
    ];

    const semesterOptions = [
        { value: '', label: 'All Semesters' },
        { value: 'Fall 2024', label: 'Fall 2024' },
        { value: 'Spring 2025', label: 'Spring 2025' },
        { value: 'Summer 2025', label: 'Summer 2025' },
    ];

    // Filtered data based on selected course
    const filteredGrades = useMemo(() => {
        return grades.filter((g) => {
            if (selectedCourse && g.courseId !== parseInt(selectedCourse, 10)) {
                return false;
            }
            if (selectedSemester && g.semester !== selectedSemester) {
                return false;
            }
            return true;
        });
    }, [grades, selectedCourse, selectedSemester]);

    // Top performers per course
    const topPerformers = useMemo(() => {
        const performersByCourse: Map<number, Student[]> = new Map();

        courses.forEach((course) => {
            const courseGrades = grades.filter((g) => g.courseId === course.id);
            const sortedGrades = courseGrades.sort((a, b) => b.score - a.score).slice(0, 5);
            const topStudents = sortedGrades
                .map((g) => students.find((s) => s.id === g.studentId))
                .filter(Boolean) as Student[];
            performersByCourse.set(course.id, topStudents);
        });

        return performersByCourse;
    }, [courses, grades, students]);

    // Overall statistics
    const stats = useMemo(() => {
        const totalStudents = students.length;
        const totalCourses = courses.length;
        const totalEnrollments = students.reduce((sum, s) => sum + s.courseIds.length, 0);
        const averageGPA = students.length > 0
            ? students.reduce((sum, s) => sum + s.gpa, 0) / students.length
            : 0;
        const averageScore = filteredGrades.length > 0
            ? filteredGrades.reduce((sum, g) => sum + g.score, 0) / filteredGrades.length
            : 0;

        return {
            totalStudents,
            totalCourses,
            totalEnrollments,
            averageGPA: averageGPA.toFixed(2),
            averageScore: averageScore.toFixed(1),
            totalGrades: filteredGrades.length,
        };
    }, [students, courses, filteredGrades]);

    // Export handlers
    const handleExportStudents = () => {
        exportStudentsToCSV(students);
        success('Student report exported');
    };

    const handleExportCourses = () => {
        exportCoursesToCSV(courses);
        success('Course report exported');
    };

    const handleExportGrades = () => {
        exportGradesToCSV(filteredGrades, students, courses);
        success('Grade report exported');
    };

    const handleExportFullReport = () => {
        exportFullReportToCSV(students, courses, grades);
        success('Full report exported');
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
        { id: 'enrollments', label: 'Enrollments', icon: <Users className="h-4 w-4" /> },
        { id: 'performance', label: 'Performance', icon: <Award className="h-4 w-4" /> },
        { id: 'export', label: 'Export Data', icon: <Download className="h-4 w-4" /> },
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

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading reports...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                    <p className="text-gray-500 mt-1">
                        View analytics and export academic data
                    </p>
                </div>
                <Button
                    leftIcon={<FileSpreadsheet className="h-4 w-4" />}
                    onClick={handleExportFullReport}
                >
                    Export Full Report
                </Button>
            </div>

            {/* Tabs */}
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.totalStudents}
                                        </p>
                                        <p className="text-sm text-gray-500">Total Students</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <BarChart3 className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.totalCourses}
                                        </p>
                                        <p className="text-sm text-gray-500">Total Courses</p>
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
                                            {stats.averageGPA}
                                        </p>
                                        <p className="text-sm text-gray-500">Average GPA</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Award className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.totalEnrollments}
                                        </p>
                                        <p className="text-sm text-gray-500">Enrollments</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader title="Course Enrollments" />
                                <CardBody>
                                    <EnrollmentChart courses={courses} />
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader title="GPA Distribution" />
                                <CardBody>
                                    <GPADistributionChart students={students} />
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'enrollments' && (
                    <div className="space-y-6">
                        {/* Enrollment Trend Chart */}
                        <Card>
                            <CardHeader
                                title="Enrollment Trends Over Time"
                                subtitle="Track course enrollment patterns"
                            />
                            <CardBody>
                                <EnrollmentTrendChart
                                    enrollmentHistory={enrollmentHistory}
                                    courses={courses}
                                />
                            </CardBody>
                        </Card>

                        {/* Course Enrollment Table */}
                        <Card>
                            <CardHeader
                                title="Course Enrollment Summary"
                                action={
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        leftIcon={<Download className="h-4 w-4" />}
                                        onClick={handleExportCourses}
                                    >
                                        Export
                                    </Button>
                                }
                            />
                            <CardBody className="p-0">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                                Course
                                            </th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                                Department
                                            </th>
                                            <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
                                                Enrolled
                                            </th>
                                            <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
                                                Capacity
                                            </th>
                                            <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
                                                Fill Rate
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {courses.map((course) => {
                                            const fillRate = (course.enrollmentCount / course.capacity) * 100;
                                            return (
                                                <tr key={course.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium text-gray-900">{course.name}</p>
                                                        <p className="text-sm text-gray-500">{course.code}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">
                                                        {course.department}
                                                    </td>
                                                    <td className="px-4 py-3 text-center font-medium text-gray-700">
                                                        {course.enrollmentCount}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-gray-600">
                                                        {course.capacity}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className={cn(
                                                                        'h-full rounded-full',
                                                                        fillRate >= 90
                                                                            ? 'bg-red-500'
                                                                            : fillRate >= 70
                                                                                ? 'bg-orange-500'
                                                                                : 'bg-emerald-500'
                                                                    )}
                                                                    style={{ width: `${Math.min(fillRate, 100)}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-600 w-12">
                                                                {fillRate.toFixed(0)}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </CardBody>
                        </Card>
                    </div>
                )}

                {activeTab === 'performance' && (
                    <div className="space-y-6">
                        {/* Filters */}
                        <Card>
                            <CardBody className="p-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <Select
                                            value={selectedCourse}
                                            onChange={setSelectedCourse}
                                            options={courseOptions}
                                            placeholder="Select course"
                                        />
                                    </div>
                                    <div className="w-full sm:w-48">
                                        <Select
                                            value={selectedSemester}
                                            onChange={setSelectedSemester}
                                            options={semesterOptions}
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        leftIcon={<Download className="h-4 w-4" />}
                                        onClick={handleExportGrades}
                                    >
                                        Export Grades
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Performance Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100">
                                <p className="text-sm font-medium text-emerald-700">Average Score</p>
                                <p className="text-3xl font-bold text-emerald-900">{stats.averageScore}%</p>
                            </Card>
                            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
                                <p className="text-sm font-medium text-blue-700">Total Grades</p>
                                <p className="text-3xl font-bold text-blue-900">{stats.totalGrades}</p>
                            </Card>
                            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
                                <p className="text-sm font-medium text-purple-700">Courses Graded</p>
                                <p className="text-3xl font-bold text-purple-900">
                                    {new Set(filteredGrades.map((g) => g.courseId)).size}
                                </p>
                            </Card>
                        </div>

                        {/* Top Performers by Course */}
                        <Card>
                            <CardHeader
                                title="Top Performers by Course"
                                subtitle="Best performing students in each course"
                            />
                            <CardBody className="p-0">
                                <div className="divide-y">
                                    {courses.slice(0, 5).map((course) => {
                                        const performers = topPerformers.get(course.id) || [];
                                        const courseGrades = grades.filter((g) => g.courseId === course.id);

                                        return (
                                            <div key={course.id} className="p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{course.name}</h4>
                                                        <p className="text-sm text-gray-500">{course.code}</p>
                                                    </div>
                                                    <span className="text-sm text-gray-400">
                                                        {courseGrades.length} grades recorded
                                                    </span>
                                                </div>
                                                {performers.length > 0 ? (
                                                    <div className="flex flex-wrap gap-3">
                                                        {performers.slice(0, 3).map((student, index) => {
                                                            const grade = courseGrades.find((g) => g.studentId === student.id);
                                                            return (
                                                                <div
                                                                    key={student.id}
                                                                    className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
                                                                >
                                                                    <div
                                                                        className={cn(
                                                                            'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xs font-semibold',
                                                                            getAvatarColor(index)
                                                                        )}
                                                                    >
                                                                        {index + 1}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-900">
                                                                            {getFullName(student.firstName, student.lastName)}
                                                                        </p>
                                                                        {grade && (
                                                                            <span
                                                                                className={cn(
                                                                                    'text-xs font-semibold',
                                                                                    getGradeColor(grade.grade).replace('bg-', 'text-').replace('-100', '-600')
                                                                                )}
                                                                            >
                                                                                {grade.grade} ({grade.score})
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-400">No grades recorded</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                )}

                {activeTab === 'export' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardBody className="p-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                                    <Users className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Student Report</h3>
                                <p className="text-gray-600 mb-4">
                                    Export comprehensive student data including personal info, GPA, and enrollment status.
                                </p>
                                <Button
                                    variant="outline"
                                    leftIcon={<Download className="h-4 w-4" />}
                                    onClick={handleExportStudents}
                                >
                                    Export Students CSV
                                </Button>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody className="p-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                                    <BarChart3 className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Course Report</h3>
                                <p className="text-gray-600 mb-4">
                                    Export course data including enrollment numbers, capacity, and assigned faculty.
                                </p>
                                <Button
                                    variant="outline"
                                    leftIcon={<Download className="h-4 w-4" />}
                                    onClick={handleExportCourses}
                                >
                                    Export Courses CSV
                                </Button>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody className="p-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4">
                                    <Award className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Grade Report</h3>
                                <p className="text-gray-600 mb-4">
                                    Export all grades with student and course information for analysis.
                                </p>
                                <Button
                                    variant="outline"
                                    leftIcon={<Download className="h-4 w-4" />}
                                    onClick={handleExportGrades}
                                >
                                    Export Grades CSV
                                </Button>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody className="p-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4">
                                    <FileSpreadsheet className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Full Academic Report</h3>
                                <p className="text-gray-600 mb-4">
                                    Export a comprehensive report with all students, courses, and grades combined.
                                </p>
                                <Button
                                    leftIcon={<Download className="h-4 w-4" />}
                                    onClick={handleExportFullReport}
                                >
                                    Export Full Report CSV
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
