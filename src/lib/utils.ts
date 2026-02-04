// ============================================
// Utility Functions
// ============================================

import { type ClassValue, clsx } from 'clsx';

/**
 * Combines class names using clsx
 */
export function cn(...inputs: ClassValue[]): string {
    return clsx(inputs);
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Format date to short format
 */
export function formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return formatDateShort(dateString);
}

/**
 * Get full name from first and last name
 */
export function getFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`.trim();
}

/**
 * Get initials from first and last name
 */
export function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Calculate average GPA from students array
 */
export function calculateAverageGPA(students: { gpa: number }[]): number {
    if (students.length === 0) return 0;
    const total = students.reduce((sum, student) => sum + student.gpa, 0);
    return total / students.length;
}

/**
 * Get GPA classification
 */
export function getGPAClassification(gpa: number): string {
    if (gpa >= 3.9) return 'Summa Cum Laude';
    if (gpa >= 3.7) return 'Magna Cum Laude';
    if (gpa >= 3.5) return 'Cum Laude';
    if (gpa >= 3.0) return 'Dean\'s List';
    if (gpa >= 2.0) return 'Good Standing';
    return 'Academic Probation';
}

/**
 * Calculate letter grade from score
 */
export function calculateLetterGrade(score: number): string {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 67) return 'D+';
    if (score >= 63) return 'D';
    if (score >= 60) return 'D-';
    return 'F';
}

/**
 * Get grade color class
 */
export function getGradeColor(grade: string): string {
    if (grade.startsWith('A')) return 'bg-emerald-100 text-emerald-700';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone format
 */
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
    return num.toLocaleString('en-US');
}

/**
 * Generate a random ID
 */
export function generateId(): string {
    return Math.random().toString(36).substring(2, 11);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Paginate array
 */
export function paginate<T>(array: T[], page: number, pageSize: number): T[] {
    const start = (page - 1) * pageSize;
    return array.slice(start, start + pageSize);
}

/**
 * Get total pages
 */
export function getTotalPages(totalItems: number, pageSize: number): number {
    return Math.ceil(totalItems / pageSize);
}

/**
 * Sort array by key
 */
export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * Filter students with multiple criteria
 */
export function filterStudents(
    students: Array<{
        firstName: string;
        lastName: string;
        email: string;
        year: number;
        status: string;
        courseIds: number[];
    }>,
    filters: {
        search?: string;
        year?: number;
        status?: string;
        courseId?: number;
    }
): typeof students {
    return students.filter((student) => {
        // Search filter
        if (filters.search) {
            const query = filters.search.toLowerCase();
            const fullName = getFullName(student.firstName, student.lastName).toLowerCase();
            if (!fullName.includes(query) && !student.email.toLowerCase().includes(query)) {
                return false;
            }
        }

        // Year filter
        if (filters.year && student.year !== filters.year) {
            return false;
        }

        // Status filter
        if (filters.status && student.status !== filters.status) {
            return false;
        }

        // Course filter
        if (filters.courseId && !student.courseIds.includes(filters.courseId)) {
            return false;
        }

        return true;
    });
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((result, item) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {} as Record<string, T[]>);
}

/**
 * Calculate GPA from grades
 */
export function calculateGPAFromGrades(
    grades: Array<{ grade: string; credits: number }>
): number {
    const gradePoints: Record<string, number> = {
        'A+': 4.0,
        'A': 4.0,
        'A-': 3.7,
        'B+': 3.3,
        'B': 3.0,
        'B-': 2.7,
        'C+': 2.3,
        'C': 2.0,
        'C-': 1.7,
        'D+': 1.3,
        'D': 1.0,
        'D-': 0.7,
        'F': 0.0,
    };

    if (grades.length === 0) return 0;

    let totalPoints = 0;
    let totalCredits = 0;

    grades.forEach((grade) => {
        const points = gradePoints[grade.grade] ?? 0;
        totalPoints += points * grade.credits;
        totalCredits += grade.credits;
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

/**
 * Sleep function for delays
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
