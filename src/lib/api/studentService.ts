// ============================================
// Student API Service
// ============================================

import apiClient from './client';
import { Student, StudentFormData } from '@/types';

const ENDPOINT = '/students';

export const studentService = {
    // Get all students
    getAll: async (): Promise<Student[]> => {
        const response = await apiClient.get<Student[]>(ENDPOINT);
        return response.data;
    },

    // Get student by ID
    getById: async (id: number): Promise<Student> => {
        const response = await apiClient.get<Student>(`${ENDPOINT}/${id}`);
        return response.data;
    },

    // Create new student
    create: async (data: StudentFormData): Promise<Student> => {
        const response = await apiClient.post<Student>(ENDPOINT, {
            ...data,
            gpa: 0,
            avatar: null,
        });
        return response.data;
    },

    // Update student
    update: async (id: number, data: Partial<StudentFormData>): Promise<Student> => {
        const response = await apiClient.patch<Student>(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    // Delete student
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`${ENDPOINT}/${id}`);
    },

    // Search students
    search: async (query: string): Promise<Student[]> => {
        const response = await apiClient.get<Student[]>(`${ENDPOINT}?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    // Get students by course
    getByCourse: async (courseId: number): Promise<Student[]> => {
        const response = await apiClient.get<Student[]>(ENDPOINT);
        const students = response.data;
        return students.filter((student) => student.courseIds.includes(courseId));
    },

    // Get students by year
    getByYear: async (year: number): Promise<Student[]> => {
        const response = await apiClient.get<Student[]>(`${ENDPOINT}?year=${year}`);
        return response.data;
    },

    // Get top students by GPA
    getTopStudents: async (limit: number = 10): Promise<Student[]> => {
        const response = await apiClient.get<Student[]>(`${ENDPOINT}?_sort=gpa&_order=desc&_limit=${limit}`);
        return response.data;
    },

    // Enroll student in course
    enrollInCourse: async (studentId: number, courseId: number): Promise<Student> => {
        const student = await studentService.getById(studentId);
        if (!student.courseIds.includes(courseId)) {
            const updatedCourseIds = [...student.courseIds, courseId];
            return await studentService.update(studentId, { courseIds: updatedCourseIds });
        }
        return student;
    },

    // Remove student from course
    removeFromCourse: async (studentId: number, courseId: number): Promise<Student> => {
        const student = await studentService.getById(studentId);
        const updatedCourseIds = student.courseIds.filter((id) => id !== courseId);
        return await studentService.update(studentId, { courseIds: updatedCourseIds });
    },
};

export default studentService;
