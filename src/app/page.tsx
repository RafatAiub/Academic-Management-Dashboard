'use client';

// ============================================
// Dashboard Home Page
// ============================================

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { StatsCard, TopStudentsLeaderboard, PopularCourses } from '@/components/dashboard';
import { EnrollmentChart, GPADistributionChart, EnrollmentTrendChart } from '@/components/charts';
import { Card, CardHeader, CardBody, PageLoading } from '@/components/ui';
import { studentService, courseService, facultyService, gradeService, enrollmentService } from '@/lib/api';
import { Student, Course, Faculty, Grade, EnrollmentHistory } from '@/types';
import { calculateAverageGPA } from '@/lib/utils';
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Award,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [enrollmentHistory, setEnrollmentHistory] = useState<EnrollmentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, coursesData, facultyData, gradesData, historyData] = await Promise.all([
          studentService.getAll(),
          courseService.getAll(),
          facultyService.getAll(),
          gradeService.getAll(),
          enrollmentService.getHistory(),
        ]);

        setStudents(studentsData);
        setCourses(coursesData);
        setFaculty(facultyData);
        setGrades(gradesData);
        setEnrollmentHistory(historyData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <PageLoading message="Loading dashboard..." />;
  }

  const averageGPA = calculateAverageGPA(students);
  const activeStudents = students.filter((s) => s.status === 'active').length;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here&apos;s an overview of the academic performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatsCard
          title="Total Students"
          value={students.length}
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 12, label: 'vs last semester' }}
          variant="blue"
        />
        <StatsCard
          title="Active Courses"
          value={courses.filter((c) => c.status === 'active').length}
          icon={<BookOpen className="h-6 w-6" />}
          trend={{ value: 5, label: 'vs last semester' }}
          variant="purple"
        />
        <StatsCard
          title="Faculty Members"
          value={faculty.length}
          icon={<GraduationCap className="h-6 w-6" />}
          variant="green"
        />
        <StatsCard
          title="Average GPA"
          value={averageGPA.toFixed(2)}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 3.2, label: 'improvement' }}
          variant="cyan"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Enrollment Bar Chart */}
        <Card>
          <CardHeader
            title="Course Enrollments"
            subtitle="Students enrolled per course"
            action={
              <Link
                href="/courses"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All
              </Link>
            }
          />
          <CardBody>
            <EnrollmentChart courses={courses} />
          </CardBody>
        </Card>

        {/* GPA Distribution */}
        <Card>
          <CardHeader
            title="GPA Distribution"
            subtitle="Student performance breakdown"
          />
          <CardBody>
            <GPADistributionChart students={students} />
          </CardBody>
        </Card>
      </div>

      {/* Enrollment Trend */}
      <Card className="mb-8">
        <CardHeader
          title="Enrollment Trends"
          subtitle="Course enrollment over time"
          action={
            <Link
              href="/reports"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View Reports
            </Link>
          }
        />
        <CardBody>
          <EnrollmentTrendChart
            enrollmentHistory={enrollmentHistory}
            courses={courses}
          />
        </CardBody>
      </Card>

      {/* Bottom Row - Leaderboard & Popular Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students Leaderboard */}
        <Card>
          <CardHeader
            title="Top Performing Students"
            subtitle="Ranked by GPA"
            action={
              <Link
                href="/students"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All
              </Link>
            }
          />
          <CardBody className="p-4">
            <TopStudentsLeaderboard students={students} limit={8} />
          </CardBody>
        </Card>

        {/* Popular Courses */}
        <Card>
          <CardHeader
            title="Popular Courses"
            subtitle="Sorted by enrollment count"
            action={
              <Link
                href="/courses"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All
              </Link>
            }
          />
          <CardBody className="p-4">
            <PopularCourses courses={courses} limit={5} />
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader
          title="Quick Actions"
          subtitle="Common administrative tasks"
        />
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/students?action=create"
              className="flex flex-col items-center p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">Add Student</span>
            </Link>
            <Link
              href="/courses?action=create"
              className="flex flex-col items-center p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">Add Course</span>
            </Link>
            <Link
              href="/faculty?action=grades"
              className="flex flex-col items-center p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Award className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">Update Grades</span>
            </Link>
            <Link
              href="/reports"
              className="flex flex-col items-center p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">View Reports</span>
            </Link>
          </div>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
}
