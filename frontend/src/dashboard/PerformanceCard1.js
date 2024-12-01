import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './performancecard.css'; 

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PerformanceCard1 = ({ project }) => {
  const completedTasks = project.tasks.filter(task => task.status === 'Completed');
  const totalCompletedTasks = completedTasks.length;

  const completedTasksPerDay = project.completedTasksPerDay;
  const completedTasksPerWeek = project.completedTasksPerWeek;
  const completedTasksPerMonth = project.completedTasksPerMonth;
  const completedTasksPerYear = project.completedTasksPerYear;

  const chartData = {
    labels: ['Today', 'This Week', 'This Month', 'This Year'],
    datasets: [
      {
        label: 'Completed Tasks',
        data: [completedTasksPerDay, completedTasksPerWeek, completedTasksPerMonth, completedTasksPerYear],
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
        
        <div className="card5">
          <h3>Completed Tasks Today</h3>
          <p>{completedTasksPerDay}</p>
        </div>

        <div className="card5">
          <h3>Completed Tasks This Week</h3>
          <p>{completedTasksPerWeek}</p>
        </div>

        <div className="card5">
          <h3>Completed Tasks This Month</h3>
          <p>{completedTasksPerMonth}</p>
        </div>

        <div className="card5">
          <h3>Completed Tasks This Year</h3>
          <p>{completedTasksPerYear}</p>
        </div>
      </div>

      <div className="performance-graph">
        <Line data={chartData} options={chartOptions} />
        <br></br>
        <br></br>
        <div className="card51">
          <h3>Total Completed Tasks</h3>
          <p>{totalCompletedTasks}</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCard1;
