import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';

const ViewUserLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5;
  const navigate = useNavigate();
  const port = 'http://localhost:8000';

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${port}/employee/logs`);
      const data = await response.json();
      if (response.ok) {
        setLogs(data);
      } else {
        console.error('Failed to fetch logs');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const filterLogs = useCallback(() => {
    const now = new Date();
    let filtered = logs;

    if (selectedFilter === 'Day') {
      filtered = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.toDateString() === now.toDateString();
      });
    } else if (selectedFilter === 'Week') {
      const startOfWeek = new Date();
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      filtered = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= startOfWeek && logDate <= endOfWeek;
      });
    } else if (selectedFilter === 'Month') {
      filtered = logs.filter(log => {
        const logDate = new Date(log.date);
        return (
          logDate.getMonth() === now.getMonth() &&
          logDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (selectedFilter === 'Year') {
      filtered = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getFullYear() === now.getFullYear();
      });
    }

    setFilteredLogs(filtered);
  }, [logs, selectedFilter]);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [filterLogs]);

  

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const openPopup = log => {
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

  const handleFilterChange = event => {
    setSelectedFilter(event.target.value);
    setCurrentPage(1); 
  };

  return (
    <div className="dashboard">
      <Sidebar handleLogout={handleLogout} />

      <div className="main">
        <h1 style={{ marginLeft: '80px', marginTop: '80px' }}>View User Logs</h1>

        <div className="filter">
          <label htmlFor="filter">Filter by:</label>
          <select id="filter" value={selectedFilter} onChange={handleFilterChange}>
            <option value="All">All</option>
            <option value="Day">Today</option>
            <option value="Week">This Week</option>
            <option value="Month">This Month</option>
            <option value="Year">This Year</option>
          </select>
        </div>

        {filteredLogs.length === 0 ? (
          <p>No log data found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>User Name</th>
                <th>Project Name</th>
                <th>Task</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map((log, index) => (
                <tr key={log._id}>
                  <td>{indexOfFirstLog + index + 1}</td>
                  <td>{log.userName}</td>
                  <td>{log.projectName}</td>
                  <td>{log.task}</td>
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
              <h2 style={{ textDecoration: 'underline' }}>Project Details</h2>
              <p>
                <strong>User Name:</strong> {selectedLog.userName}
              </p>
              <p>
                <strong>Department:</strong> {selectedLog.department}
              </p>
              <p>
                <strong>Business:</strong> {selectedLog.business}
              </p>
              <p>
                <strong>Project Name:</strong> {selectedLog.projectName}
              </p>
              <p>
                <strong>Task:</strong> {selectedLog.task}
              </p>
              <p>
                <strong>Comments:</strong> {selectedLog.comments}
              </p>
              <p>
                <strong>Status:</strong> {selectedLog.status}
              </p>
              <p>
                <strong>Hours:</strong> {selectedLog.hours}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(selectedLog.date).toLocaleString()}
              </p>
              <button className="close" onClick={closePopup}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <button onClick={nextPage} disabled={indexOfLastLog >= filteredLogs.length}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserLogs;
