import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

const ProjectStatus = () => {
  const navigate = useNavigate();
  const [completedProjects, setCompletedProjects] = useState({});
  const port = "http://localhost:8000"; 

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${port}/projects/business`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const projects = await response.json(); 
        const groupedProjects = projects
          .filter(project => project.status === "Completed")
          .reduce((acc, project) => {
            const businessUnit = project.business_unit;
            if (!acc[businessUnit]) {
              acc[businessUnit] = 0;
            }
            acc[businessUnit]++;
            return acc;
          }, {});

        setCompletedProjects(groupedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      navigate("/");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar handleLogout={handleLogout} />
      <div className="main">
      <button className='bb-button' onClick={()=>navigate('/dashboard')}>Back</button>
        <div style={{marginTop:"-660px"}}>
          <h1 style={{ marginLeft: "80px", marginTop: "80px" }}>Business Unit Status</h1>
          {Object.keys(completedProjects).length > 0 ? (
            <table className="project-table">
              <thead>
                <tr>
                  <th>Business Unit</th>
                  <th>Completed Projects</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(completedProjects).map(([businessUnit, count]) => (
                  <tr key={businessUnit}>
                    <td>{businessUnit}</td>
                    <td>{count}</td>
                    <td>
                    <button onClick={() => navigate(`/project-details1/${businessUnit}`)}>View</button>

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

export default ProjectStatus;
