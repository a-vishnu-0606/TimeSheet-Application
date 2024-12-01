import React, { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';
import PerformanceCard from './PerformanceCard';

const EmployeePerformance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const port = 'http://localhost:8000';

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await fetch(`${port}/user/logs/performance`);
        const data = await response.json();
        setPerformanceData(data);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    fetchPerformanceData();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      navigate('/');
    }
  };

  const handleViewClick = (user) => {
    setSelectedUser(user);
  };

  const handleBackClick = () => {
    setSelectedUser(null);
  };

  const handleBackToList = () => {
    navigate('/dashboard');
  };

  const handleEyeClick = async (userName) => {
    try {
      const response = await fetch(`${port}/user/tasks/${userName}`);
      const data = await response.json();
      setTasks(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTasks([]);
  };

  return (
    <div className='dashboard'>
      <Sidebar handleLogout={handleLogout} />

      <div className='main'>
        {selectedUser ? (
          <>
            <button className='bttn' onClick={handleBackClick}>Back</button>
            <PerformanceCard user={selectedUser} />
          </>
        ) : (
          <>
            <button className='bttn1' onClick={handleBackToList}>Back</button>
            <h1 style={{ marginLeft: "80px" }}>Employee Performance</h1>
            <div className="performance-list">
              {performanceData.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Department</th>
                      <th>Business Unit</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.map((data, index) => (
                      <tr key={index}>
                        <td>{data.userName}</td>
                        <td>{data.department}</td>
                        <td>{data.business}</td>
                        <td>
                          <button onClick={() => handleViewClick(data)}>View</button>
                          <FaEye
                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                            onClick={() => handleEyeClick(data.userName)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No performance data available.</p>
              )}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 style={{ marginBottom: "20px" }}>Task Details</h2>
            <div className="scrollable-content" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <div key={index} className="task-item">
                    <p><strong>Task:</strong> {task}</p>
                    <hr />
                  </div>
                ))
              ) : (
                <p>No tasks available.</p>
              )}
            </div>
            <button onClick={closeModal} className="cancel-btn1">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePerformance;
