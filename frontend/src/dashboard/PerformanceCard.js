import React from 'react';
import { Line } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'; 
import './performancecard1.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PerformanceCard = ({ user }) => {
  const chartData = {
    labels: ['Today', 'This Week', 'This Month', 'This Year'],
    datasets: [
      {
        label: 'Completed Tasks',
        data: [
          user.completedTasksPerDay,
          user.completedTasksPerWeek,
          user.completedTasksPerMonth,
          user.completedTasksPerYear
        ],
        fill: false,
        borderColor: 'rgb(75, 192, 192)', 
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Completed Tasks Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="performance-cards-container">
      <div className="performance-cards">
        <div className="card4">
          <h3>Completed Tasks Today</h3>
          <p>{user.completedTasksPerDay}</p>
        </div>
        <div className="card4">
          <h3>Completed Tasks This Week</h3>
          <p>{user.completedTasksPerWeek}</p>
        </div>
        <div className="card4">
          <h3>Completed Tasks This Month</h3>
          <p>{user.completedTasksPerMonth}</p>
        </div>
        <div className="card4">
          <h3>Completed Tasks This Year</h3>
          <p>{user.completedTasksPerYear}</p>
        </div>
      </div>

      <div className="performance-graph">
        <br></br>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PerformanceCard;
