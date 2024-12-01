import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';
import './editdetails.css';

const EditDetails = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const port = 'http://localhost:8000';

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

  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) {
      alert('Please select a department to delete.');
      return;
    }

    try {
      const response = await fetch(`${port}/user/departments/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department_name: selectedDepartment }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSelectedDepartment('');
        await fetchDepartments(); 
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      navigate('/');
    }
  };


  return (
    <div className="dashboard3">
      <Sidebar handleLogout={handleLogout} />
      <div className="main3">
      <button onClick={()=>navigate('/user/add-details')} style={{marginTop:"20px",marginLeft:"950px"}}>Back</button>
        <h2>Delete Department</h2>
          <select
            className="select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="" disabled>Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept.department_name}>
                {dept.department_name}
              </option>
            ))}
          </select>
          <button
            onClick={handleDeleteDepartment}
            style={{marginLeft:"20px"}}
          >
            Delete Department
          </button>
        </div>
        
      </div>
  );
};

export default EditDetails;
