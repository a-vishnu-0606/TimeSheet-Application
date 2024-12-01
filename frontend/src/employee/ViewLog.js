import { TbClipboardData } from "react-icons/tb";
import React, { useState, useEffect, useCallback } from 'react';
import { MdLogout } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { TbLogs } from "react-icons/tb";
import { FaUsers } from 'react-icons/fa';

const ViewLog = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]); // Filtered logs state
  const [selectedLog, setSelectedLog] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // Filter criteria state
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5;
  const navigate = useNavigate();
  const port = 'http://localhost:8000';

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      fetchLogs(user.name);
    }
  }, []);

  

  const fetchLogs = async (userName) => {
    try {
      const response = await fetch(`${port}/employee/logs`);
      const data = await response.json();
      if (response.ok) {
        const userLogs = data.filter(log => log.userName === userName);
        setLogs(userLogs);
      } else {
        console.error("Failed to fetch logs");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const applyFilter = useCallback(() => {
    const now = new Date();
    let filtered;

    if (filter === 'day') {
      filtered = logs.filter(log => new Date(log.date).toDateString() === now.toDateString());
    } else if (filter === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      filtered = logs.filter(log => new Date(log.date) > weekAgo);
    } else if (filter === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      filtered = logs.filter(log => new Date(log.date) > monthAgo);
    } else if (filter === 'year') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      filtered = logs.filter(log => new Date(log.date) > yearAgo);
    } else {
      filtered = logs;
    }

    setFilteredLogs(filtered);
  }, [logs, filter]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const openPopup = (log) => {
    setSelectedLog(log);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedLog(null);
  };

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  const nextPage = () => {
    if (indexOfLastLog < filteredLogs.length) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

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
        <h1 style={{ marginLeft: "80px" }}>Log Data</h1>

        <div className="filter">
          <label>Filter by:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {filteredLogs.length === 0 ? (
          <p>No log data found for the selected filter.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Project Name</th>
                <th>Task</th>
                <th>Total Hours</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map((log, index) => (
                <tr key={log._id}>
                  <td>{indexOfFirstLog + index + 1}</td>
                  <td>{log.projectName}</td>
                  <td>{log.task}</td>
                  <td>{log.hours}</td>
                  <td>
                    <button onClick={() => openPopup(log)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isPopupOpen && selectedLog && (
          <div className="popup">
            <div className="popup-content">
              <h2 style={{ textDecoration: "underline" }}>Project Details</h2>
              <p><strong>User Name:</strong> {selectedLog.userName}</p>
              <p><strong>Department:</strong> {selectedLog.department}</p>
              <p><strong>Business:</strong> {selectedLog.business}</p>
              <p><strong>Project Name:</strong> {selectedLog.projectName}</p>
              <p><strong>Task:</strong> {selectedLog.task}</p>
              <p><strong>Comments:</strong> {selectedLog.comments}</p>
              <p><strong>Status:</strong> {selectedLog.status}</p>
              <p><strong>Hours:</strong> {selectedLog.hours}</p>
              <p><strong>Date:</strong> {new Date(selectedLog.date).toLocaleString()}</p>
              <button className="close" onClick={closePopup}>Cancel</button>
            </div>
          </div>
        )}

        <div className="pagination1">
          <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
          <button onClick={nextPage} disabled={indexOfLastLog >= filteredLogs.length}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default ViewLog;
