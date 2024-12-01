import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar'
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './adddetails.css';

const AddDetails = () => {
  const navigate = useNavigate();
  const port = "http://localhost:8000";

  const [department, setDepartment] = useState('');
  const [department1, setDepartment1] = useState('');
  const [departments, setDepartments] = useState([]);
  const [businessUnit, setBusinessUnit] = useState('');

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${port}/user/departments/name`);
      const data = await response.json();
      if (response.ok) {
        setDepartments(data.department);
      } else {
        console.error(`Error fetching departments: ${data.error}`);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddDepartment = async () => {
    const sanitizedDepartment = DOMPurify.sanitize(department);
    if (!sanitizedDepartment.trim()) {
      alert("Department name cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${port}/user/departments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department_name: sanitizedDepartment }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setDepartment('');
        await fetchDepartments();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleAddBusinessUnit = async () => {
    const sanitizedBusinessUnit = DOMPurify.sanitize(businessUnit);
    if (!sanitizedBusinessUnit.trim()) {
      alert('Business Unit cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`${port}/user/departments/add-unit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department_name: department1, business_unit: sanitizedBusinessUnit }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setBusinessUnit('');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    setDepartment('');
  };

  const handleCancel1 = () => {
    setDepartment1('');
    setBusinessUnit('');
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
        <button onClick={() => navigate('/user/edit-details')} style={{ marginLeft: "990px", marginTop: "80px" }}>Delete</button>
        <div className='card1'>
          <div className='row'>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Enter Department"
            />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={handleAddDepartment} className="add-btn">Add Department</button>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
        </div>
        <div className='card2'>
          <div className='row'>
            <select className='select' onChange={(e) => setDepartment1(e.target.value)} value={department1}>
              <option value='' disabled>Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept.department_name}>
                  {dept.department_name}
                </option>
              ))}
            </select>
            &nbsp;&nbsp;
            <input
              type='text'
              value={businessUnit}
              onChange={(e) => setBusinessUnit(e.target.value)}
              placeholder='Enter Business Unit'
            />
          </div>
          <br />
          <div className='row'>
            <button onClick={handleAddBusinessUnit} className='add-btn'>
              Add Business Unit
            </button>
            <button onClick={handleCancel1} className='cancel-btn'>
              Cancel
            </button>
          </div>
        </div>
        <button onClick={() => navigate('/user')} style={{ marginTop: "100px", marginLeft: "500px" }}>Back</button>
      </div>
    </div>
  );
};

export default AddDetails;
