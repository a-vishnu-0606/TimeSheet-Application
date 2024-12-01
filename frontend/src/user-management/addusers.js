import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import DOMPurify from 'dompurify';
import './adduser.css';

const Addusers = () => {
  const port = "http://localhost:8000";
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [businessUnit, setBusinessUnit] = useState('');
  const [role, setRole] = useState('user');
  const [departments, setDepartments] = useState([]);
  const [businessUnits, setBusinessUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

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

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (department) {
      fetchBusinessUnits(department);
    } else {
      setBusinessUnits([]);
    }
  }, [department]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !mail || !phone || !department || !businessUnit) {
      alert("All fields are required!");
      return;
    }

    setIsLoading(true); 

    const sanitizedName = sanitizeInput(name);
    const sanitizedMail = sanitizeInput(mail);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedDepartment = sanitizeInput(department);
    const sanitizedBusinessUnit = sanitizeInput(businessUnit);
    const sanitizedRole = sanitizeInput(role);

    try {
      const response = await fetch(`${port}/user/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sanitizedName,
          mail: sanitizedMail,
          phone: sanitizedPhone,
          department: sanitizedDepartment,
          business: sanitizedBusinessUnit,
          role: sanitizedRole,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Successfully added");
        setName('');
        setMail('');
        setPhone('');
        setDepartment('');
        setBusinessUnit('');
        setRole('admin');
        navigate('/user');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to connect to the server.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/user");
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
        <form onSubmit={handleSubmit} className='user'>
          <div className="form-row">
            <div className="form-group">
              <label>Enter UserName (Max 20 characters): </label>
              <input
                type='text'
                maxLength={20}
                required
                value={name}
                onChange={(e) => { setName(e.target.value); }}
                placeholder='Enter Username'
              />
            </div>
            <div className="form-group">
              <label>Enter Mail id (Max 30 characters): </label>
              <input
                type='email'
                maxLength={30}
                required
                value={mail}
                onChange={(e) => { setMail(e.target.value); }}
                placeholder='Enter Email id'
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Enter Phone no (Max 15 digits): </label>
              <input
                type='tel'
                maxLength={15}
                required
                value={phone}
                onChange={(e) => { setPhone(e.target.value); }}
                placeholder='Enter Phone no'
              />
            </div>
            <div className="form-group">
              <label>Enter Department: </label>
              <select
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
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
              <label>Enter Business unit: </label>
              <select
                required
                value={businessUnit}
                onChange={(e) => setBusinessUnit(e.target.value)}
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
              <label>Enter Role: </label>
              <select
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
          <div className="form-buttons">
            {isLoading ? (
              <div className="loading-indicator">Loading...</div>
            ) : (
              <>
                <button className="update" type="submit">
                  Add User
                </button>
                <button style={{ backgroundColor: "grey" }} type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addusers;
