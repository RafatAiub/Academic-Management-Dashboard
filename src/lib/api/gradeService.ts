// ============================================
// Grade API Service
// ============================================

import apiClient from './client';
import { Grade, GradeFormData } from '@/types';

const ENDPOINT = '/grades';

export const gradeService = {
    // Get all grades
    getAll: async (): Promise<Grade[]> => {
        const response = await apiClient.get<Grade[]>(ENDPOINT);
        return response.data;
    },

    // Get grade by ID
    getById: async (id: number): Promise<Grade> => {
        const response = await apiClient.get<Grade>(`${ENDPOINT}/${id}`);
        return response.data;
    },

    // Create new grade
    create: async (data: GradeFormData): Promise<Grade> => {
        const response = await apiClient.post<Grade>(ENDPOINT, data);
        return response.data;
    },

    // Update grade
    update: async (id: number, data: Partial<GradeFormData>): Promise<Grade> => {
        const response = await apiClient.patch<Grade>(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    // Delete grade
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`${ENDPOINT}/${id}`);
    },

    // Get grades by student
    getByStudent: async (studentId: number): Promise<Grade[]> => {
        const response = await apiClient.get<Grade[]>(`${ENDPOINT}?studentId=${studentId}`);
        return response.data;
    },

    // Get grades by course
    getByCourse: async (courseId: number): Promise<Grade[]> => {
        const response = await apiClient.get<Grade[]>(`${ENDPOINT}?courseId=${courseId}`);
        return response.data;
    },

    // Get grade by student and course
    getByStudentAndCourse: async (studentId: number, courseId: number): Promise<Grade | null> => {
        const response = await apiClient.get<Grade[]>(`${ENDPOINT}?studentId=${studentId}&courseId=${courseId}`);
        return response.data[0] || null;
    },

    // Calculate GPA for student
    calculateGPA: async (studentId: number): Promise<number> => {
        const grades = await gradeService.getByStudent(studentId);
        if (grades.length === 0) return 0;

        const gradePoints: Record<string, number> = {
            'A+': 4.0, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D+': 1.3, 'D': 1.0, 'D-': 0.7,
            'F': 0.0,
        };

        let totalPoints = 0;
        let totalCredits = 0;

        grades.forEach((grade) => {
            const points = gradePoints[grade.grade] || 0;
            totalPoints += points * grade.credits;
            totalCredits += grade.credits;
        });

        return totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
    },

    // Bulk update grades
    bulkUpdate: async (updates: { id: number; data: Partial<GradeFormData> }[]): Promise<Grade[]> => {
        const promises = updates.map(({ id, data }) => gradeService.update(id, data));
        return await Promise.all(promises);
    },

    // Bulk create grades
    bulkCreate: async (grades: GradeFormData[]): Promise<Grade[]> => {
        const promises = grades.map((grade) => gradeService.create(grade));
        return await Promise.all(promises);
    },

    // Get top performers by course
    getTopPerformersByCourse: async (courseId: number, limit: number = 5): Promise<Grade[]> => {
        const response = await apiClient.get<Grade[]>(
            `${ENDPOINT}?courseId=${courseId}&_sort=score&_order=desc&_limit=${limit}`
        );
        return response.data;
    },
};

export default gradeService;
