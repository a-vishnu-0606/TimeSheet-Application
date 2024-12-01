import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement } from 'chart.js';
import './projectdetails.css'

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement);

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [totalHours, setTotalHours] = useState('0 hr 0 min');
  const [plannedHours, setPlannedHours] = useState(0);

  const calculateTotalHours = useCallback((logs) => {
    let totalHoursInMinutes = 0;

    logs.forEach(log => {
      const match = log.hours.match(/(\d+)\s*hr\s*(\d+)\s*min/);
      if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        totalHoursInMinutes += (hours * 60) + minutes;
      }
    });

    const totalHoursFinal = Math.floor(totalHoursInMinutes / 60);
    const totalMinutesFinal = totalHoursInMinutes % 60;
    setTotalHours(`${totalHoursFinal} hr ${totalMinutesFinal} min`);
    setPlannedHours(project.estimated_days * 24);
  }, [project]);

  useEffect(() => {
    fetch(`http://localhost:8000/project/${projectId}`)
      .then(response => response.json())
      .then(data => {
        setProject(data);
      })
      .catch(error => {
        console.error('Error fetching project details:', error);
      });
  }, [projectId]);

  useEffect(() => {
    if (project) {
      fetch(`http://localhost:8000/logs?projectName=${project.project_name}&department=${project.department}&business=${project.business_unit}`)
        .then(response => response.json())
        .then(data => {
          calculateTotalHours(data);
        })
        .catch(error => {
          console.error('Error fetching log data:', error);
        });
    }
  }, [project, calculateTotalHours]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      navigate('/'); 
    }
  };


  const barData = {
    labels: ['Planned vs Actual Hours'],
    datasets: [
      {
        label: 'Planned Hours',
        data: [plannedHours],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Actual Hours',
        data: [parseInt(totalHours.split(' ')[0]) || 0], 
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['Planned Hours', 'Actual Hours'],
    datasets: [
      {
        data: [plannedHours, parseInt(totalHours.split(' ')[0]) || 0], 
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  return (
    <div className='dashboard'>
      <Sidebar handleLogout={handleLogout} />
      <div className='main5'>
      <button className='bb-button' onClick={()=>navigate('/dashboard/analysis')}>Back</button>
        <div className='content'>
          <div className='left-column1'>
            <div className='project-info'>
              <h1 style={{marginLeft:"20px"}}>Project Details</h1>
              {project ? (
                <>
                  <p><strong>Project Name:</strong> {project.project_name}</p>
                  <p><strong>Department:</strong> {project.department}</p>
                  <p><strong>Business Unit:</strong> {project.business_unit}</p>
                  <p><strong>Estimated Days:</strong> {project.estimated_days} days</p>
                  <p><strong>Estimated Total Hours:</strong> {project.estimated_days * 24} hr</p>
                  <p><strong>Total Hours of Log Data:</strong> {totalHours}</p>
                </>
              ) : (
                <p>Loading project details...</p>
              )}
            </div>
            <div className='chart-container1'>
              <h3>Pie Chart (Hours Distribution)</h3>
              <Pie data={pieData} options={{ responsive: true }} />
            </div>
          </div>
          <div className='right-column1'>
            <div className='chart-container2'>
              <h3>Bar Chart (Planned vs Actual Hours)</h3>
              <Bar data={barData} height={250} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
