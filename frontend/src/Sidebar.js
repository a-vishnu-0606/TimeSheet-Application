import React from 'react';
import { FaTachometerAlt, FaUsers, FaProjectDiagram, FaTasks,FaUserEdit  } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ handleLogout }) => {
  const navigate = useNavigate();

  const gotodashboard = () => navigate('/dashboard');
  const gotoproject = () => navigate('/project');
  const gotouser = () => navigate('/user');

  return (
    <div className='sidebar'>
      <ul>
        <br />
        <br />
        <li onClick={gotodashboard}>
          <FaTachometerAlt className="icon" /> &nbsp;Dashboard
        </li>
        <li onClick={gotouser}>
          <FaUsers className="icon" /> &nbsp;User Management
        </li>
        <li onClick={gotoproject}>
          <FaProjectDiagram className="icon" /> &nbsp;Project Management
        </li>
        <li onClick={() => navigate('/admin/user/logs')}>
          <FaTasks className="icon" /> &nbsp;View User Logs
        </li>
        <li onClick={() => navigate('/admin/profile')}>
          <FaUserEdit className="icon" /> &nbsp;Profile
        </li>
      </ul>
      <ul className="logout">
        <li onClick={handleLogout}>
          <MdLogout /> &nbsp;Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
