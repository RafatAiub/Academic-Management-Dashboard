// ============================================
// Course API Service
// ============================================

import apiClient from './client';
import { Course, CourseFormData } from '@/types';

const ENDPOINT = '/courses';

export const courseService = {
    // Get all courses
    getAll: async (): Promise<Course[]> => {
        const response = await apiClient.get<Course[]>(ENDPOINT);
        return response.data;
    },

    // Get course by ID
    getById: async (id: number): Promise<Course> => {
        const response = await apiClient.get<Course>(`${ENDPOINT}/${id}`);
        return response.data;
    },

    // Create new course
    create: async (data: CourseFormData): Promise<Course> => {
        const response = await apiClient.post<Course>(ENDPOINT, {
            ...data,
            enrollmentCount: 0,
        });
        return response.data;
    },

    // Update course
    update: async (id: number, data: Partial<CourseFormData>): Promise<Course> => {
        const response = await apiClient.patch<Course>(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    // Delete course
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`${ENDPOINT}/${id}`);
    },

    // Search courses
    search: async (query: string): Promise<Course[]> => {
        const response = await apiClient.get<Course[]>(`${ENDPOINT}?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    // Get courses by department
    getByDepartment: async (department: string): Promise<Course[]> => {
        const response = await apiClient.get<Course[]>(`${ENDPOINT}?department=${encodeURIComponent(department)}`);
        return response.data;
    },

    // Get most popular courses (by enrollment)
    getPopularCourses: async (limit: number = 10): Promise<Course[]> => {
        const response = await apiClient.get<Course[]>(`${ENDPOINT}?_sort=enrollmentCount&_order=desc&_limit=${limit}`);
        return response.data;
    },

    // Update enrollment count
    updateEnrollmentCount: async (id: number, count: number): Promise<Course> => {
        return await courseService.update(id, { enrollmentCount: count } as Partial<CourseFormData>);
    },

    // Add faculty to course
    addFaculty: async (courseId: number, facultyId: number): Promise<Course> => {
        const course = await courseService.getById(courseId);
        if (!course.facultyIds.includes(facultyId)) {
            const updatedFacultyIds = [...course.facultyIds, facultyId];
            return await courseService.update(courseId, { facultyIds: updatedFacultyIds });
        }
        return course;
    },

    // Remove faculty from course
    removeFaculty: async (courseId: number, facultyId: number): Promise<Course> => {
        const course = await courseService.getById(courseId);
        const updatedFacultyIds = course.facultyIds.filter((id) => id !== facultyId);
        return await courseService.update(courseId, { facultyIds: updatedFacultyIds });
    },
};

export default courseService;
