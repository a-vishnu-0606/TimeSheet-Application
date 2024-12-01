import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import { TbClipboardData } from "react-icons/tb";
import { MdLogout } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import { TbLogs } from "react-icons/tb";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState(''); 
  const [newPassword, setNewPassword] = useState('');
  const [isSaveEnabled, setIsSaveEnabled] = useState(false); 
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setOldPassword(parsedUser.password); 
      setNewPassword(parsedUser.password); 
    } else {
      alert('No user found. Please log in.');
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const handlePasswordChange = async () => {
    try {
      const response = await fetch('http://localhost:8000/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.mail, 
          newPassword: newPassword,
        }),
      });

      if (response.ok) {
        alert('Password updated successfully!');
        setOldPassword(newPassword); 
        setIsSaveEnabled(false); 
      } else {
        alert('Failed to update the password. Please try again.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('An error occurred while updating the password.');
    }
  };

  const handlePasswordInput = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    setIsSaveEnabled(value !== oldPassword);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  if (!user) {
    return null; 
  }

  return (
    <div className='dashboard1'>
      <div className='sidebar1'>
        <ul>
          <br /><br /><br /><br />
          <li onClick={() => navigate('/employee/newlog')}><TbLogs className="icon" /> &nbsp;New Log</li>
          <li onClick={() => navigate('/employee/viewlog')}><TbClipboardData className="icon" /> &nbsp;View Logs</li>
          <li onClick={() => navigate('/employee/profile')}><FaUsers className="icon" /> &nbsp;Profile</li>
        </ul>
        <ul className="logout1">
          <li onClick={handleLogout}>
            <MdLogout /> &nbsp;Logout
          </li>
        </ul>
      </div>

      <div className='main2'>
        <div className="profile-container">
          <h1>Profile</h1>
          <div className="profile-details">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.mail}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Department:</strong> {user.department}</p>
            <p><strong>Business:</strong> {user.business}</p>
            <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
          <div className="password-change">
            <h2>Change Password</h2>
            <div className="password-input-container">
              <input
                type={passwordVisible ? 'text' : 'password'}
                value={newPassword}
                onChange={handlePasswordInput}
                placeholder="Enter new password"
                className="input"
              />
              <span onClick={togglePasswordVisibility} className="show-hide-icon">
                {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            <button
              onClick={handlePasswordChange}
              className="button"
              disabled={!isSaveEnabled} 
            >
              Save Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
