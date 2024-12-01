import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';

const Analysis = () => {
  const [completedProjects, setCompletedProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/completed-projects')
      .then(response => response.json())
      .then(data => {
        setCompletedProjects(data);
      })
      .catch(error => {
        console.error('Error fetching completed projects:', error);
      });
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      navigate('/'); 
    }
  };


  const viewProjectDetails = (projectId) => {
    navigate(`/project-details/${projectId}`);
  };

  return (
    <div className='dashboard'>
      <Sidebar handleLogout={handleLogout} />
      <div className='main'>
      <button className='bb-button' onClick={()=>navigate('/dashboard')}>Back</button>
        <div className='analysis-body'>
            <h1 style={{marginLeft:"80px"}}>Completed Projects</h1>
            {completedProjects.length > 0 ? (
            <table>
                <thead>
                <tr>
                    <th>Project Name</th>
                    <th>Department</th>
                    <th>Business Unit</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {completedProjects.map((project, index) => (
                    <tr key={index}>
                    <td>{project.project_name}</td>
                    <td>{project.department}</td>
                    <td>{project.business_unit}</td>
                    <td>
                        <button onClick={() => viewProjectDetails(project._id)}>View</button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
            <p>No completed projects found.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default Analysis;
