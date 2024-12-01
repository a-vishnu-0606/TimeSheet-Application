import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";
import './projectdetails1.css'

const ProjectDetails1 = () => {
  const { businessUnit } = useParams();
  const [projectDetails, setProjectDetails] = useState([]);
  const navigate = useNavigate();
  const port = "http://localhost:8000";

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`${port}/projects/${businessUnit}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const projects = await response.json();
        setProjectDetails(projects);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [businessUnit]);

  const calculateProjectStats = (projects) => {
    const now = new Date();
    let perDay = 0, perWeek = 0, perMonth = 0, perYear = 0;

    projects.forEach((project) => {
      const updatedDate = new Date(project.updated_at);
      const daysDiff = Math.floor((now - updatedDate) / (1000 * 60 * 60 * 24));
      const weeksDiff = Math.floor(daysDiff / 7);
      const monthsDiff = now.getMonth() - updatedDate.getMonth() + (now.getFullYear() - updatedDate.getFullYear()) * 12;
      const yearsDiff = now.getFullYear() - updatedDate.getFullYear();

      if (daysDiff < 1) perDay++;
      if (weeksDiff < 1) perWeek++;
      if (monthsDiff < 1) perMonth++;
      if (yearsDiff < 1) perYear++;
    });

    return { perDay, perWeek, perMonth, perYear };
  };

  const stats = calculateProjectStats(projectDetails);

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
      <button className='bb-button' onClick={()=>navigate('/dashboard/project-status')}>Back</button>
        <div className="content-container">
          <div className="stats-column">
            <h1>Projects Completed for {businessUnit}</h1>
            <div className="performance-cards">
              <div className="card4">
                <h3>Projects Completed Per Day</h3>
                <p>{stats.perDay}</p>
              </div>
              <div className="card4">
                <h3>Projects Completed Per Week</h3>
                <p>{stats.perWeek}</p>
              </div>
              <div className="card4">
                <h3>Projects Completed Per Month</h3>
                <p>{stats.perMonth}</p>
              </div>
              <div className="card4">
                <h3>Projects Completed Per Year</h3>
                <p>{stats.perYear}</p>
              </div>
            </div>
          </div>
          <div className="details-column">
            <div className="project-details-scroll">
              {projectDetails.length > 0 ? (
                <ul>
                    <h2 style={{marginLeft:"50px"}}>Projects</h2>
                  {projectDetails.map((project) => (
                    <li key={project._id}>
                      <p><span style={{textDecoration:"underline"}}>Project Name</span>: {project.project_name}</p>
                      <p><span style={{textDecoration:"underline"}}>Client Name</span>: {project.client_name}</p>
                      <p><span style={{textDecoration:"underline"}}>Department</span>:  {project.department}</p>
                      <p><span style={{textDecoration:"underline"}}>Completed Date</span>: {new Date(project.updated_at).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No project details found for this business unit.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails1;
