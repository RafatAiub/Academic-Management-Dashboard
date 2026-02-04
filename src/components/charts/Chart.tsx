'use client';

// ============================================
// Chart Wrapper Component for ApexCharts
// ============================================

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full">
            <div className="skeleton h-full w-full" />
        </div>
    ),
});

interface ChartProps {
    options: ApexOptions;
    series: ApexAxisChartSeries | ApexNonAxisChartSeries;
    type: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap';
    height?: number | string;
    width?: number | string;
}

const Chart: React.FC<ChartProps> = ({
    options,
    series,
    type,
    height = 350,
    width = '100%',
}) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <div className="flex items-center justify-center" style={{ height }}>
                <div className="skeleton h-full w-full rounded-lg" />
            </div>
        );
    }

    return (
        <ReactApexChart
            options={options}
            series={series}
            type={type}
            height={height}
            width={width}
        />
    );
};

export default Chart;
