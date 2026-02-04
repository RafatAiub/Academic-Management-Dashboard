// ============================================
// Export Utilities for CSV Generation
// ============================================

import { Student, Course, Grade } from '@/types';
import { getFullName } from './utils';

/**
 * Convert data to CSV string
 */
function convertToCSV(headers: string[], rows: string[][]): string {
    const escape = (value: string | number | boolean): string => {
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const headerRow = headers.map(escape).join(',');
    const dataRows = rows.map((row) => row.map(escape).join(',')).join('\n');

    return `${headerRow}\n${dataRows}`;
}

/**
 * Download CSV file
 */
function downloadCSV(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

/**
 * Export students to CSV
 */
export function exportStudentsToCSV(students: Student[]): void {
    const headers = [
        'ID',
        'First Name',
        'Last Name',
        'Email',
        'Phone',
        'Date of Birth',
        'Enrollment Date',
        'Year',
        'GPA',
        'Status',
        'Address',
        'Enrolled Courses',
    ];

    const rows = students.map((student) => [
        String(student.id),
        student.firstName,
        student.lastName,
        student.email,
        student.phone,
        student.dateOfBirth,
        student.enrollmentDate,
        String(student.year),
        student.gpa.toFixed(2),
        student.status,
        student.address,
        student.courseIds.join('; '),
    ]);

    const csv = convertToCSV(headers, rows);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csv, `students_report_${timestamp}`);
}

/**
 * Export courses to CSV
 */
export function exportCoursesToCSV(courses: Course[]): void {
    const headers = [
        'ID',
        'Code',
        'Name',
        'Description',
        'Credits',
        'Department',
        'Semester',
        'Schedule',
        'Room',
        'Capacity',
        'Enrollment Count',
        'Fill Rate (%)',
        'Status',
        'Faculty IDs',
    ];

    const rows = courses.map((course) => [
        String(course.id),
        course.code,
        course.name,
        course.description,
        String(course.credits),
        course.department,
        course.semester,
        course.schedule,
        course.room,
        String(course.capacity),
        String(course.enrollmentCount),
        ((course.enrollmentCount / course.capacity) * 100).toFixed(1),
        course.status,
        course.facultyIds.join('; '),
    ]);

    const csv = convertToCSV(headers, rows);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csv, `courses_report_${timestamp}`);
}

/**
 * Export grades to CSV with student and course names
 */
export function exportGradesToCSV(
    grades: Grade[],
    students: Student[],
    courses: Course[]
): void {
    const headers = [
        'ID',
        'Student ID',
        'Student Name',
        'Course ID',
        'Course Code',
        'Course Name',
        'Score',
        'Grade',
        'Credits',
        'Semester',
    ];

    const rows = grades.map((grade) => {
        const student = students.find((s) => s.id === grade.studentId);
        const course = courses.find((c) => c.id === grade.courseId);

        return [
            String(grade.id),
            String(grade.studentId),
            student ? getFullName(student.firstName, student.lastName) : 'Unknown',
            String(grade.courseId),
            course?.code || 'Unknown',
            course?.name || 'Unknown',
            String(grade.score),
            grade.grade,
            String(grade.credits),
            grade.semester,
        ];
    });

    const csv = convertToCSV(headers, rows);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csv, `grades_report_${timestamp}`);
}

/**
 * Export full academic report
 */
export function exportFullReportToCSV(
    students: Student[],
    courses: Course[],
    grades: Grade[]
): void {
    const headers = [
        'Student ID',
        'Student Name',
        'Email',
        'Year',
        'GPA',
        'Status',
        'Course Code',
        'Course Name',
        'Department',
        'Score',
        'Grade',
        'Credits',
        'Semester',
    ];

    const rows: string[][] = [];

    students.forEach((student) => {
        const studentGrades = grades.filter((g) => g.studentId === student.id);

        if (studentGrades.length === 0) {
            rows.push([
                String(student.id),
                getFullName(student.firstName, student.lastName),
                student.email,
                String(student.year),
                student.gpa.toFixed(2),
                student.status,
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ]);
        } else {
            studentGrades.forEach((grade) => {
                const course = courses.find((c) => c.id === grade.courseId);
                rows.push([
                    String(student.id),
                    getFullName(student.firstName, student.lastName),
                    student.email,
                    String(student.year),
                    student.gpa.toFixed(2),
                    student.status,
                    course?.code || '',
                    course?.name || '',
                    course?.department || '',
                    String(grade.score),
                    grade.grade,
                    String(grade.credits),
                    grade.semester,
                ]);
            });
        }
    });

    const csv = convertToCSV(headers, rows);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csv, `full_academic_report_${timestamp}`);
}
