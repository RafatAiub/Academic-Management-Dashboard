// ============================================
// Enrollment API Service
// ============================================

import apiClient from './client';
import { Enrollment, EnrollmentHistory } from '@/types';

const ENROLLMENT_ENDPOINT = '/enrollments';
const HISTORY_ENDPOINT = '/enrollmentHistory';

export const enrollmentService = {
    // Get all enrollments
    getAll: async (): Promise<Enrollment[]> => {
        const response = await apiClient.get<Enrollment[]>(ENROLLMENT_ENDPOINT);
        return response.data;
    },

    // Get enrollment by ID
    getById: async (id: number): Promise<Enrollment> => {
        const response = await apiClient.get<Enrollment>(`${ENROLLMENT_ENDPOINT}/${id}`);
        return response.data;
    },

    // Create new enrollment
    create: async (data: Omit<Enrollment, 'id'>): Promise<Enrollment> => {
        const response = await apiClient.post<Enrollment>(ENROLLMENT_ENDPOINT, data);
        return response.data;
    },

    // Update enrollment
    update: async (id: number, data: Partial<Enrollment>): Promise<Enrollment> => {
        const response = await apiClient.patch<Enrollment>(`${ENROLLMENT_ENDPOINT}/${id}`, data);
        return response.data;
    },

    // Delete enrollment
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`${ENROLLMENT_ENDPOINT}/${id}`);
    },

    // Get enrollments by student
    getByStudent: async (studentId: number): Promise<Enrollment[]> => {
        const response = await apiClient.get<Enrollment[]>(`${ENROLLMENT_ENDPOINT}?studentId=${studentId}`);
        return response.data;
    },

    // Get enrollments by course
    getByCourse: async (courseId: number): Promise<Enrollment[]> => {
        const response = await apiClient.get<Enrollment[]>(`${ENROLLMENT_ENDPOINT}?courseId=${courseId}`);
        return response.data;
    },

    // Get enrollment history
    getHistory: async (): Promise<EnrollmentHistory[]> => {
        const response = await apiClient.get<EnrollmentHistory[]>(HISTORY_ENDPOINT);
        return response.data;
    },

    // Get enrollment history by course
    getHistoryByCourse: async (courseId: number): Promise<EnrollmentHistory[]> => {
        const response = await apiClient.get<EnrollmentHistory[]>(`${HISTORY_ENDPOINT}?courseId=${courseId}`);
        return response.data;
    },

    // Bulk enroll students in course
    bulkEnroll: async (studentIds: number[], courseId: number): Promise<Enrollment[]> => {
        const today = new Date().toISOString().split('T')[0];
        const promises = studentIds.map((studentId) =>
            enrollmentService.create({
                studentId,
                courseId,
                enrollmentDate: today,
                status: 'active',
            })
        );
        return await Promise.all(promises);
    },

    // Check if student is enrolled in course
    isEnrolled: async (studentId: number, courseId: number): Promise<boolean> => {
        const response = await apiClient.get<Enrollment[]>(
            `${ENROLLMENT_ENDPOINT}?studentId=${studentId}&courseId=${courseId}&status=active`
        );
        return response.data.length > 0;
    },
};

export default enrollmentService;
