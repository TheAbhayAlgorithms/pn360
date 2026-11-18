'use client';

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function DiagnosticChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? '#333333' : '#E5E7EB';
    const textColor = isDark ? '#9CA3AF' : '#4B5563';

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Round 1', 'Round 2', 'Round 3', 'Round 4'],
        datasets: [
          {
            label: '30 MCQ Technical %',
            data: [58, 68, 73, 80],
            borderColor: '#2196F3',
            backgroundColor: 'transparent',
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: '#2196F3',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            tension: 0, // Crisp 2D straight or flat lines
          },
          {
            label: 'AI Interview %',
            data: [50, 62, 70, 75],
            borderColor: '#4CAF50',
            backgroundColor: 'transparent',
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: '#4CAF50',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            tension: 0,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              font: { family: 'Roboto, sans-serif', size: 12, weight: 'bold' },
              boxWidth: 12,
              usePointStyle: true,
            }
          },
          tooltip: {
            backgroundColor: isDark ? '#242424' : '#1F2937',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            cornerRadius: 4,
            displayColors: true,
            boxShadow: 'none'
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { family: 'Roboto, sans-serif', size: 11 } }
          },
          y: {
            min: 0,
            max: 100,
            grid: { color: gridColor },
            ticks: { color: textColor, font: { family: 'Roboto, sans-serif', size: 11 } }
          }
        }
      }
    });

    const observer = new MutationObserver(() => {
      if (!chartInstance.current) return;
      const darkNow = document.documentElement.getAttribute('data-theme') === 'dark';
      const newGrid = darkNow ? '#333333' : '#E5E7EB';
      const newText = darkNow ? '#9CA3AF' : '#4B5563';

      if (chartInstance.current.options.scales?.x?.grid) chartInstance.current.options.scales.x.grid.color = newGrid;
      if (chartInstance.current.options.scales?.x?.ticks) chartInstance.current.options.scales.x.ticks.color = newText;
      if (chartInstance.current.options.scales?.y?.grid) chartInstance.current.options.scales.y.grid.color = newGrid;
      if (chartInstance.current.options.scales?.y?.ticks) chartInstance.current.options.scales.y.ticks.color = newText;
      if (chartInstance.current.options.plugins?.legend?.labels) chartInstance.current.options.plugins.legend.labels.color = newText;
      chartInstance.current.update();
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      observer.disconnect();
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  return (
    <div style={{ position: 'relative', height: '220px', width: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
