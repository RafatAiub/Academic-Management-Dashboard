// ============================================
// Academic Management Dashboard - Type Definitions
// ============================================

// Student Types
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  enrollmentDate: string;
  year: number;
  gpa: number;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  address: string;
  avatar: string | null;
  courseIds: number[];
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  enrollmentDate: string;
  year: number;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  address: string;
  courseIds: number[];
}

// Course Types
export interface Course {
  id: number;
  code: string;
  name: string;
  description: string;
  credits: number;
  department: string;
  semester: string;
  schedule: string;
  room: string;
  capacity: number;
  enrollmentCount: number;
  facultyIds: number[];
  status: 'active' | 'inactive' | 'completed';
}

export interface CourseFormData {
  code: string;
  name: string;
  description: string;
  credits: number;
  department: string;
  semester: string;
  schedule: string;
  room: string;
  capacity: number;
  facultyIds: number[];
  status: 'active' | 'inactive' | 'completed';
}

// Faculty Types
export interface Faculty {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  title: string;
  office: string;
  officeHours: string;
  specialization: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  courseIds: number[];
}

export interface FacultyFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  title: string;
  office: string;
  officeHours: string;
  specialization: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  courseIds: number[];
}

// Grade Types
export interface Grade {
  id: number;
  studentId: number;
  courseId: number;
  grade: string;
  score: number;
  semester: string;
  credits: number;
}

export interface GradeFormData {
  studentId: number;
  courseId: number;
  grade: string;
  score: number;
  semester: string;
  credits: number;
}

// Enrollment Types
export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'dropped';
}

export interface EnrollmentHistory {
  id: number;
  courseId: number;
  month: string;
  count: number;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalFaculty: number;
  averageGPA: number;
}

// Filter Types
export interface StudentFilters {
  search: string;
  course: string;
  year: string;
  status: string;
}

export interface CourseFilters {
  search: string;
  department: string;
  semester: string;
}

// Pagination Types
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Chart Data Types
export interface ChartDataPoint {
  x: string;
  y: number;
}

export interface EnrollmentChartData {
  name: string;
  data: ChartDataPoint[];
}

// Bulk Action Types
export interface BulkAssignment {
  studentIds: number[];
  courseId: number;
}

export interface BulkGradeUpdate {
  studentId: number;
  courseId: number;
  grade: string;
  score: number;
}

// Dynamic Form Field Types
export interface DynamicField {
  id: string;
  type: 'text' | 'number' | 'select' | 'date';
  label: string;
  value: string | number;
  options?: { value: string; label: string }[];
}

// Report Types
export interface CourseEnrollmentReport {
  courseId: number;
  courseName: string;
  courseCode: string;
  enrollments: {
    month: string;
    count: number;
  }[];
}

export interface TopStudentReport {
  studentId: number;
  studentName: string;
  gpa: number;
  courseId?: number;
  courseName?: string;
}
