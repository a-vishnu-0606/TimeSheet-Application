import React, { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';
import PerformanceCard1 from './PerformanceCard1';

const TaskStatus = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const [selectedTasks, setSelectedTasks] = useState([]);
  const navigate = useNavigate();
  const port = 'http://localhost:8000';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${port}/projects/task-status`);
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      navigate('/');
    }
  };


  const handleViewClick = (project) => {
    setSelectedProject(project);
  };

  const handleBackClick = () => {
    setSelectedProject(null);
  };

  const handleBackToList = () => {
    navigate('/dashboard');
  };

  const handleEyeClick = (project) => {
    const completedTasks = project.tasks.filter(task => task.status === 'Completed');
    setSelectedTasks(completedTasks); 
    setShowModal(true); 
  };

  const closeModal = () => {
    setShowModal(false); 
    setSelectedTasks([]);
  };

  return (
    <div className='dashboard'>
      <Sidebar handleLogout={handleLogout} />

      <div className='main'>
        {selectedProject ? (
          <>
            <button className='bttn' onClick={handleBackClick}>Back</button>
            <PerformanceCard1 project={selectedProject} />
          </>
        ) : (
          <>
            <button className='bttn1' onClick={handleBackToList}>Back</button>
            <h1 style={{ marginLeft: "80px", marginTop: "20px" }}>Task Status</h1>
            <div className="performance-list">
              {projects.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Client Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, index) => (
                      project.tasks.length > 0 && (
                        project.tasks.some(task => task.status === 'Completed') && (
                          <tr key={index}>
                            <td>{project.project_name}</td>
                            <td>{project.client_name}</td>
                            <td>
                              <button onClick={() => handleViewClick(project)}>View</button>
                              <FaEye
                                style={{ cursor: 'pointer', marginLeft: '20px' }}
                                onClick={() => handleEyeClick(project)} 
                              />
                            </td>
                          </tr>
                        )
                      )
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No completed tasks found.</p>
              )}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 style={{marginBottom:"30px"}}>Task Details</h2>
            {selectedTasks.length > 0 ? (
              selectedTasks.map((task, index) => (
                <div key={index} className="task-detail">
                  <p><strong>Task Name:</strong> {task.name}</p>
                  <div className="scrollable-content">
                    <p>{task.details}</p> 
                  </div>
                  <hr />
                </div>
              ))
            ) : (
              <p>No completed tasks for this project.</p>
            )}
            <button onClick={closeModal} className="cancel-btn1">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskStatus;
