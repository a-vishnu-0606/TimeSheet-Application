import React, { useState, useEffect } from 'react';
import './dashboard.css';
import Sidebar from '../Sidebar';
import { CgPerformance } from "react-icons/cg";
import { GoRocket } from "react-icons/go";
import { GrAnalytics } from "react-icons/gr";
import { FaProjectDiagram } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const port = "http://localhost:8000";
  const [roleCounts, setRoleCounts] = useState({ admin: 0, user: 0 });

  useEffect(() => {
    const fetchRoleCounts = async () => {
      try {
        const response = await fetch(`${port}/user/roles`);
        const data = await response.json();

        if (data.success) {
          const adminCount = data.data.find(role => role.role === 'admin')?.count || 0;
          const userCount = data.data.find(role => role.role === 'user')?.count || 0;

          setRoleCounts({ admin: adminCount, user: userCount });
        }
      } catch (error) {
        console.error("Error fetching role counts:", error);
      }
    };

    fetchRoleCounts();
  }, []);

  useEffect(() => {
    const checkAndUpdateProjectStatus = async () => {
      try {
        const response = await fetch(`${port}/check-project-status`);
        const data = await response.json();

        if (data.success) {
          console.log('Project status updated successfully');
        } else {
          console.error('Failed to update project status');
        }
      } catch (error) {
        console.error('Error checking and updating project status:', error);
      }
    };

    checkAndUpdateProjectStatus();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <div className='dashboard'>
      <Sidebar handleLogout={handleLogout} />
      <div className='main'>
        <div className="cards">
          <div className="card-admin">
            <h2 style={{ marginLeft: "-820px" }}>Welcome !! </h2>
            <p>This application is used to track and manage the time employees spend on various tasks and projects. It helps organizations monitor work hours, improve productivity, and streamline payroll and billing processes.</p>
            <p><span style={{ textDecoration: "underline" }}>Admin</span>: {roleCounts.admin} &nbsp;&nbsp;&nbsp; <span style={{ textDecoration: "underline" }}>Users</span>: {roleCounts.user}</p>
          </div>
        </div>
        <div className='cards'>
          <div className="card card-performance" onClick={() => navigate('/dashboard/employee-performance')} style={{ cursor: "pointer" }}>
            <CgPerformance className="card-icon" />
            <h2>Employee Performance</h2>
          </div>
          <div className="card card-task-status" onClick={() => navigate('/dashboard/task-status')} style={{ cursor: "pointer" }}>
            <GoRocket className="card-icon" />
            <h2>Task Status</h2>
          </div>
        </div>
        <div className='cards'>
          <div className="card card-project-status" onClick={() => navigate('/dashboard/project-status')} style={{ cursor: "pointer" }}>
            <FaProjectDiagram className="card-icon" />
            <h2>Project Status</h2>
          </div>
          <div className="card card-analysis" onClick={() => navigate('/dashboard/analysis')} style={{ cursor: "pointer" }}>
            <GrAnalytics className="card-icon" />
            <h2>Analysis</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
