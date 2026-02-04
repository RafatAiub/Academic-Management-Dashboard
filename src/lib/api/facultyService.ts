// ============================================
// Faculty API Service
// ============================================

import apiClient from './client';
import { Faculty, FacultyFormData } from '@/types';

const ENDPOINT = '/faculty';

export const facultyService = {
    // Get all faculty members
    getAll: async (): Promise<Faculty[]> => {
        const response = await apiClient.get<Faculty[]>(ENDPOINT);
        return response.data;
    },

    // Get faculty by ID
    getById: async (id: number): Promise<Faculty> => {
        const response = await apiClient.get<Faculty>(`${ENDPOINT}/${id}`);
        return response.data;
    },

    // Create new faculty member
    create: async (data: FacultyFormData): Promise<Faculty> => {
        const response = await apiClient.post<Faculty>(ENDPOINT, data);
        return response.data;
    },

    // Update faculty member
    update: async (id: number, data: Partial<FacultyFormData>): Promise<Faculty> => {
        const response = await apiClient.patch<Faculty>(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    // Delete faculty member
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`${ENDPOINT}/${id}`);
    },

    // Search faculty
    search: async (query: string): Promise<Faculty[]> => {
        const response = await apiClient.get<Faculty[]>(`${ENDPOINT}?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    // Get faculty by department
    getByDepartment: async (department: string): Promise<Faculty[]> => {
        const response = await apiClient.get<Faculty[]>(`${ENDPOINT}?department=${encodeURIComponent(department)}`);
        return response.data;
    },

    // Get faculty by course
    getByCourse: async (courseId: number): Promise<Faculty[]> => {
        const response = await apiClient.get<Faculty[]>(ENDPOINT);
        const faculty = response.data;
        return faculty.filter((f) => f.courseIds.includes(courseId));
    },

    // Assign course to faculty
    assignCourse: async (facultyId: number, courseId: number): Promise<Faculty> => {
        const faculty = await facultyService.getById(facultyId);
        if (!faculty.courseIds.includes(courseId)) {
            const updatedCourseIds = [...faculty.courseIds, courseId];
            return await facultyService.update(facultyId, { courseIds: updatedCourseIds });
        }
        return faculty;
    },

    // Remove course from faculty
    removeCourse: async (facultyId: number, courseId: number): Promise<Faculty> => {
        const faculty = await facultyService.getById(facultyId);
        const updatedCourseIds = faculty.courseIds.filter((id) => id !== courseId);
        return await facultyService.update(facultyId, { courseIds: updatedCourseIds });
    },
};

export default facultyService;
