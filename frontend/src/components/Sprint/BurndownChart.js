import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { useBurndownChart } from '../../hooks/useBurndownChart';
import '../../styles/burndown.css';

export const BurndownChart = ({ sprintId }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { burndownData, loading, error } = useBurndownChart(sprintId);

  useEffect(() => {
    if (loading || error || !burndownData) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Prepare data for the chart
    const labels = burndownData.idealBurndown.map(point => `Day ${point.day}`);
    const idealData = burndownData.idealBurndown.map(point => point.remainingPoints);
    const actualData = burndownData.actualBurndown.map(point => point.remainingPoints);

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Ideal Burndown',
            data: idealData,
            borderColor: '#4CAF50',
            borderDash: [5, 5],
            fill: false,
            tension: 0.1
          },
          {
            label: 'Actual Burndown',
            data: actualData,
            borderColor: '#2196F3',
            fill: false,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Sprint Burndown Chart',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} points`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Sprint Duration'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Remaining Story Points'
            },
            beginAtZero: true,
            min: 0,
            max: Math.ceil(burndownData.totalStoryPoints * 1.1) // Add 10% padding
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [burndownData, loading, error]);

  if (loading) {
    return (
      <div className="burndown-chart-container loading">
        <div className="loading-spinner"></div>
        <p>Loading burndown chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="burndown-chart-container error">
        <p>Error loading burndown chart: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="burndown-chart-container">
      <div className="burndown-chart-wrapper">
        <canvas ref={chartRef}></canvas>
      </div>
      
      {burndownData && (
        <div className="burndown-stats">
          <div className="stat-item">
            <label>Total Story Points:</label>
            <span>{burndownData.totalStoryPoints}</span>
          </div>
          <div className="stat-item">
            <label>Remaining Points:</label>
            <span>
              {burndownData.actualBurndown[burndownData.actualBurndown.length - 1].remainingPoints}
            </span>
          </div>
          <div className="stat-item">
            <label>Sprint Progress:</label>
            <span>
              {Math.round(
                ((burndownData.totalStoryPoints - burndownData.actualBurndown[burndownData.actualBurndown.length - 1].remainingPoints) /
                burndownData.totalStoryPoints) * 100
              )}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
