import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';
import './project.css';

const ProjectManage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchType, setSearchType] = useState('project_name');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;
  const [loading, setLoading] = useState(true);

  const port = 'http://localhost:8000';

  

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      navigate('/');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${port}/project/view`);
      const data = await response.json();
      if (data.success) {
        setProjects(data.project);
        setFilteredProjects(data.project); 
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${port}/project/delete/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          alert('Project deleted successfully');
          fetchProjects();
        } else {
          alert('Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('An error occurred while deleting the project');
      }
    }
  };

  const gotoaddproject = () => {
    navigate('/project/add');
  };
  const gototaskassign=()=>navigate('/project/task/assign');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = projects.filter(project =>
      project[searchType]?.toString().toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredProjects(filtered);
    setCurrentPage(1); 
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const nextPage = () => {
    if (indexOfLastProject < filteredProjects.length) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    fetchProjects();
  }, []);
  
  return (
    <div className="dashboard">
      <Sidebar handleLogout={handleLogout} />
      <div className="main">
        <div className="search-container1">
          <div className="search-form-row">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="search-box"
            >
              <option value="project_name">Project Name</option>
              <option value="client_name">Client Name</option>
              <option value="address">Address</option>
              <option value="department">Department</option>
              <option value="business_unit">Business Unit</option>
              <option value="project_type">Project Type</option>
            </select>
            <input
              type="text"
              placeholder={`Search by ${searchType}`}
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="add-user-button1" onClick={()=>navigate('/project/user/assign')}>Project Assign</button>
            <button className="add-user-button1" onClick={gototaskassign}>Task Assign</button>
            <button className="add-user-button1" onClick={gotoaddproject}>Add Project</button>
          </div>
        </div>
        <div>
          {loading ? (
            <p>Loading projects...</p>
          ) : currentProjects.length > 0 ? (
            <>
              <table className="project-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Project Name</th>
                    <th>Client Name</th>
                    <th>Address</th>
                    <th>Department</th>
                    <th>Business Unit</th>
                    <th>Project Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProjects.map((project, index) => (
                    <tr key={project._id}>
                      <td>{indexOfFirstProject + index + 1}</td>
                      <td>{project.project_name}</td>
                      <td>{project.client_name}</td>
                      <td>{project.address}</td>
                      <td>{project.department}</td>
                      <td>{project.business_unit}</td>
                      <td>{project.project_type}</td>
                      <td>
                        <button className="pedit" onClick={() => navigate(`/project/edit/${project._id}`)}>Edit</button>
                        <button className="delete" onClick={() => deleteProject(project._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <button onClick={nextPage} disabled={indexOfLastProject >= filteredProjects.length}>Next</button>
              </div>
            </>
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectManage;

