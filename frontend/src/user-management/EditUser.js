import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import DOMPurify from 'dompurify';
import './edituser.css';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    role: "user",
    mail: "",
    phone: "",
    department: "",
    business: "",
  });
  const port = "http://localhost:8000";

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      navigate('/');
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${port}/user/${id}`);
        const data = await response.json();
        if (data.success) {
          const sanitizedData = {
            ...data.user,
            name: DOMPurify.sanitize(data.user.name),
            mail: DOMPurify.sanitize(data.user.mail),
            phone: DOMPurify.sanitize(data.user.phone),
            department: DOMPurify.sanitize(data.user.department),
            business: DOMPurify.sanitize(data.user.business),
          };
          setUserData(sanitizedData);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: DOMPurify.sanitize(value) });
  };

  const handleUpdate = async () => {
    if (
      !userData.name.trim() ||
      !userData.role.trim() ||
      !userData.mail.trim() ||
      !userData.phone.trim() ||
      !userData.department.trim() ||
      !userData.business.trim()
    ) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await fetch(`${port}/user/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.success) {
        alert("User updated successfully");
        navigate("/user");
      } else {
        alert("Failed to update user:", data.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancel = () => {
    navigate("/user");
  };

  
  return (
    <div className='dashboard'>
      <Sidebar handleLogout={handleLogout} />
      <div className='main'>
        <form className="edit-user-form">
          <div className="form-row">
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
              />
            </label>
            <label>
              Role:
              <select
                className="select3"
                name="role"
                value={userData.role}
                onChange={handleChange}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              Email:
              <input
                type="email"
                name="mail"
                value={userData.mail}
                onChange={handleChange}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Department:
              <input
                type="text"
                name="department"
                value={userData.department}
                onChange={handleChange}
              />
            </label>
            <label>
              Business:
              <input
                type="text"
                name="business"
                value={userData.business}
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

export default EditUser;
