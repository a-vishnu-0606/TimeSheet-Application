import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar'
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify'; 
import './projectadd.css';

const AddProject = () => {
  const navigate = useNavigate();
  const port = "http://localhost:8000";

  const [formData, setFormData] = useState({
    project_name: '',
    client_name: '',
    address: '',
    department: '',
    business_unit: '',
    project_type: '',
    estimated_days: '' 
  });
  
  const [departments, setDepartments] = useState([]);
  const [businessUnits, setBusinessUnits] = useState([]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${port}/user/departments/name`);
      const data = await response.json();
      if (response.ok) {
        setDepartments(data.department);
      } else {
        console.error("Error fetching departments:", data.error);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchBusinessUnits = async (selectedDepartment) => {
    try {
      const response = await fetch(`${port}/user/departments/${selectedDepartment}/business-units`);
      const data = await response.json();
      if (response.ok) {
        setBusinessUnits(data.business_units);
      } else {
        console.error("Error fetching business units:", data.error);
      }
    } catch (error) {
      console.error("Error fetching business units:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: DOMPurify.sanitize(value) 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { project_name, client_name, address, department, business_unit, project_type, estimated_days } = formData;
  
    if (!project_name || !client_name || !department || !business_unit || !project_type || !estimated_days) {
      alert("All fields are required!");
      return;
    }
  
    try {
      const response = await fetch(`${port}/project/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project_name, client_name, address, department, business_unit, project_type, estimated_days }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert("Project added successfully!");
        setFormData({
          project_name: '',
          client_name: '',
          address: '',
          department: '',
          business_unit: '',
          project_type: '',
          estimated_days: '' 
        });
        navigate('/project');
      } else {
        alert("Invalid details. Please try again.");
      }
    } catch (error) {
      alert('Failed to connect to the server.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (formData.department) {
      fetchBusinessUnits(formData.department);
    } else {
      setBusinessUnits([]);
    }
  }, [formData.department]);

  const gotoproject = () => {
    navigate('/project');
  };
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      navigate('/');
    }
  };

  return (
    <div className='dashboard'>
      
      <Sidebar handleLogout={handleLogout} />
      <div className='main'>
        <form onSubmit={handleSubmit} className='project-form'>
          <div className="form-row">
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                name="project_name"
                value={formData.project_name}
                onChange={handleChange}
                placeholder='Enter Project name'
                required
              />
            </div>
            <div className="form-group">
              <label>Client Name</label>
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                placeholder='Enter Client name'
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder='Enter address'
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select
                required
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value=''>Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.department_name}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Business Unit</label>
              <select
                required
                name="business_unit"
                value={formData.business_unit}
                onChange={handleChange}
              >
                <option value=''>Select Business Unit</option>
                {businessUnits.map((unit, index) => (
                  <option key={index} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Project Type</label>
              <input
                type="text"
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
                placeholder='Enter Project Type'
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Estimated Days</label>
              <input
                type="text"
                name="estimated_days"
                value={formData.estimated_days}
                onChange={handleChange}
                placeholder="Enter estimated days"
                required
              />
            </div>
          </div>

          <br />
          <div className="form-buttons">
            <button className="update" type="submit">
              Add Project
            </button>
            <button style={{ backgroundColor: "grey" }} type="button" onClick={gotoproject}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
