'use client';

// ============================================
// GPA Distribution Chart Component
// ============================================

import React from 'react';
import Chart from './Chart';
import { ApexOptions } from 'apexcharts';
import { Student } from '@/types';

interface GPADistributionChartProps {
    students: Student[];
}

const GPADistributionChart: React.FC<GPADistributionChartProps> = ({ students }) => {
    // Calculate GPA distribution
    const distribution = {
        'A (3.7-4.0)': students.filter((s) => s.gpa >= 3.7).length,
        'B (3.0-3.69)': students.filter((s) => s.gpa >= 3.0 && s.gpa < 3.7).length,
        'C (2.0-2.99)': students.filter((s) => s.gpa >= 2.0 && s.gpa < 3.0).length,
        'D/F (<2.0)': students.filter((s) => s.gpa < 2.0).length,
    };

    const series = Object.values(distribution);
    const labels = Object.keys(distribution);

    const options: ApexOptions = {
        chart: {
            type: 'donut',
            fontFamily: 'Inter, sans-serif',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150,
                },
            },
        },
        labels: labels,
        colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#64748b',
                            offsetY: -10,
                        },
                        value: {
                            show: true,
                            fontSize: '24px',
                            fontWeight: 700,
                            color: '#1e293b',
                            offsetY: 5,
                            formatter: (val: string) => val,
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Total Students',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#64748b',
                            formatter: () => students.length.toString(),
                        },
                    },
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            position: 'bottom',
            fontSize: '13px',
            fontWeight: 500,
            markers: {
                size: 10,
                strokeWidth: 0,
                offsetX: -4,
            },
            itemMargin: {
                horizontal: 16,
                vertical: 8,
            },
        },
        stroke: {
            show: true,
            width: 3,
            colors: ['#ffffff'],
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: (val: number) => `${val} students`,
            },
        },
    };

    return (
        <div className="w-full">
            <Chart options={options} series={series} type="donut" height={320} />
        </div>
    );
};

export default GPADistributionChart;
