'use client';

// ============================================
// Enrollment Bar Chart Component
// ============================================

import React from 'react';
import Chart from './Chart';
import { ApexOptions } from 'apexcharts';
import { Course } from '@/types';

interface EnrollmentChartProps {
    courses: Course[];
}

const EnrollmentChart: React.FC<EnrollmentChartProps> = ({ courses }) => {
    const sortedCourses = [...courses]
        .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
        .slice(0, 8);

    const series = [
        {
            name: 'Enrollments',
            data: sortedCourses.map((course) => course.enrollmentCount),
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false,
            },
            fontFamily: 'Inter, sans-serif',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150,
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350,
                },
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 8,
                columnWidth: '60%',
                distributed: true,
                dataLabels: {
                    position: 'top',
                },
            },
        },
        colors: [
            '#3B82F6',
            '#8B5CF6',
            '#06B6D4',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#EC4899',
            '#6366F1',
        ],
        dataLabels: {
            enabled: true,
            formatter: (val: number) => val.toString(),
            offsetY: -20,
            style: {
                fontSize: '12px',
                fontWeight: 600,
                colors: ['#64748b'],
            },
        },
        legend: {
            show: false,
        },
        xaxis: {
            categories: sortedCourses.map((course) => course.code),
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 500,
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
        tooltip: {
            theme: 'light',
            y: {
                formatter: (val: number) => `${val} students`,
            },
            custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                const course = sortedCourses[dataPointIndex];
                return `
          <div class="bg-white px-4 py-3 rounded-lg shadow-xl border border-gray-100">
            <p class="font-semibold text-gray-900">${course.name}</p>
            <p class="text-sm text-gray-500">${course.code}</p>
            <p class="text-sm font-medium text-blue-600 mt-1">${series[seriesIndex][dataPointIndex]} enrolled</p>
          </div>
        `;
            },
        },
        states: {
            hover: {
                filter: {
                    type: 'darken',
                    value: 0.9,
                },
            },
        },
    };

    return (
        <div className="w-full">
            <Chart options={options} series={series} type="bar" height={320} />
        </div>
    );
};

export default EnrollmentChart;
