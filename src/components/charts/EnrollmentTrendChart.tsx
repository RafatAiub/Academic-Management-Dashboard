'use client';

// ============================================
// Enrollment Trend Chart Component
// ============================================

import React from 'react';
import Chart from './Chart';
import { ApexOptions } from 'apexcharts';
import { EnrollmentHistory, Course } from '@/types';

interface EnrollmentTrendChartProps {
    enrollmentHistory: EnrollmentHistory[];
    courses: Course[];
}

const EnrollmentTrendChart: React.FC<EnrollmentTrendChartProps> = ({
    enrollmentHistory,
    courses,
}) => {
    // Group data by course and month
    const courseMap = new Map(courses.map((c) => [c.id, c]));
    const months = [...new Set(enrollmentHistory.map((e) => e.month))].sort();

    // Get top 4 courses for the trend
    const topCourseIds = [...new Map<number, number>()]
    courses.slice(0, 4).forEach(course => {
        topCourseIds.push(course.id);
    });

    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

    const series = courses.slice(0, 4).map((course, index) => {
        const courseHistory = enrollmentHistory.filter((e) => e.courseId === course.id);
        return {
            name: course.code,
            data: months.map((month) => {
                const entry = courseHistory.find((e) => e.month === month);
                return entry?.count || 0;
            }),
        };
    });

    const options: ApexOptions = {
        chart: {
            type: 'area',
            toolbar: {
                show: false,
            },
            fontFamily: 'Inter, sans-serif',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
            },
            zoom: {
                enabled: false,
            },
        },
        colors: colors,
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 90, 100],
            },
        },
        xaxis: {
            categories: months,
            labels: {
                style: {
                    fontSize: '12px',
                    colors: '#64748b',
                },
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '12px',
                    colors: '#94a3b8',
                },
                formatter: (val: number) => Math.round(val).toString(),
            },
        },
        grid: {
            borderColor: '#e2e8f0',
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '12px',
            fontWeight: 500,
            markers: {
                size: 8,
                strokeWidth: 0,
                offsetX: -4,
            },
            itemMargin: {
                horizontal: 12,
            },
        },
        tooltip: {
            theme: 'light',
            shared: true,
            intersect: false,
            y: {
                formatter: (val: number) => `${val} students`,
            },
        },
    };

    return (
        <div className="w-full">
            <Chart options={options} series={series} type="area" height={320} />
        </div>
    );
};

export default EnrollmentTrendChart;
