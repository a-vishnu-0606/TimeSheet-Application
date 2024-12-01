import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import DOMPurify from 'dompurify';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({
    project_name: "",
    client_name: "",
    address: "",
    department: "",
    business_unit: "",
    project_type: "",
    estimated_days: "",
  });
  const port = "http://localhost:8000";


  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      navigate('/');
    }
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`${port}/project/view/${id}`);
        const data = await response.json();
        if (data.success) {
          const sanitizedProject = {
            project_name: DOMPurify.sanitize(data.project.project_name),
            client_name: DOMPurify.sanitize(data.project.client_name),
            address: DOMPurify.sanitize(data.project.address),
            department: DOMPurify.sanitize(data.project.department),
            business_unit: DOMPurify.sanitize(data.project.business_unit),
            project_type: DOMPurify.sanitize(data.project.project_type),
            estimated_days: DOMPurify.sanitize(data.project.estimated_days),
          };
          setProjectData(sanitizedProject);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: DOMPurify.sanitize(value) });
  };

  const handleUpdate = async () => {
    if (
      !projectData.project_name.trim() ||
      !projectData.client_name.trim() ||
      !projectData.address.trim() ||
      !projectData.department.trim() ||
      !projectData.business_unit.trim() ||
      !projectData.project_type.trim() ||
      !projectData.estimated_days.trim()
    ) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await fetch(`${port}/project/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      if (data.success) {
        alert("Project updated successfully");
        navigate("/project");
      } else {
        alert("Failed to update project:", data.message);
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleCancel = () => {
    navigate("/project");
  };

  return (
    <div className='dashboard'>
      <Sidebar handleLogout={handleLogout} />
      <div className='main'>
        <form className="edit-project-form" style={{ marginTop: "80px" }}>
          <div className="form-row">
            <label>
              Project Name:
              <input
                type="text"
                name="project_name"
                value={projectData.project_name}
                onChange={handleChange}
              />
            </label>
            <label>
              Client Name:
              <input
                type="text"
                name="client_name"
                value={projectData.client_name}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={projectData.address}
                onChange={handleChange}
              />
            </label>
            <label>
              Department:
              <input
                type="text"
                name="department"
                value={projectData.department}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Business Unit:
              <input
                type="text"
                name="business_unit"
                value={projectData.business_unit}
                onChange={handleChange}
              />
            </label>
            <label>
              Project Type:
              <input
                type="text"
                name="project_type"
                value={projectData.project_type}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Estimated Days:
              <input
                type="text"
                name="estimated_days"
                value={projectData.estimated_days}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-buttons">
            <button className="update" type="button" onClick={handleUpdate}>
              Update
            </button>
            <button style={{ backgroundColor: "grey" }} type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
