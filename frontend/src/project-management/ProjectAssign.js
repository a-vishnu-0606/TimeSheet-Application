import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';
import Sidebar from '../Sidebar'
import { useNavigate } from 'react-router-dom';
import './projectassign.css';

const ProjectAssign = () => {
  const navigate = useNavigate();
  const port = "http://localhost:8000";
  const [projectNames, setProjectNames] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [businessUnits, setBusinessUnits] = useState([]);
  const [tasks, setTasks] = useState([]); 
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTask, setSelectedTask] = useState(""); 
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null); 
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate('/');
    }
  };

  const gotoproject = () => navigate('/project');

  useEffect(() => {
    const fetchProjectNames = async () => {
      try {
        const response = await fetch(`${port}/projects/distinct-names`);
        const data = await response.json();
        setProjectNames(data);
      } catch (error) {
        console.error("Error fetching project names:", error);
      }
    };
    fetchProjectNames();
  }, []);

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      if (selectedProject) {
        try {
          const response = await fetch(`${port}/projects/${selectedProject}/assigned-users`);
          const data = await response.json();
          setAssignedUsers(data);
        } catch (error) {
          console.error("Error fetching assigned users:", error);
        }
      } else {
        setAssignedUsers([]);
      }
    };
    fetchAssignedUsers();
  }, [selectedProject]);


  useEffect(() => {
    const fetchDepartments = async () => {
      if (selectedProject) {
        try {
          const response = await fetch(`${port}/projects/${selectedProject}/departments`);
          const data = await response.json();
          setDepartments(data);
        } catch (error) {
          console.error("Error fetching departments:", error);
        }
      } else {
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, [selectedProject]);

  useEffect(() => {
    const fetchBusinessUnits = async () => {
      if (selectedDepartment) {
        try {
          const response = await fetch(`${port}/departments/${selectedDepartment}/business-units`);
          const data = await response.json();
          setBusinessUnits(data);
        } catch (error) {
          console.error("Error fetching business units:", error);
        }
      } else {
        setBusinessUnits([]);
      }
    };
    fetchBusinessUnits();
  }, [selectedDepartment]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (selectedDepartment && selectedBusinessUnit) {
        try {
          const response = await fetch(`${port}/users1?department=${selectedDepartment}&business=${selectedBusinessUnit}`);
          const data = await response.json();
          if (data.length === 0) {
            alert("No users found corresponding to your selected department and business unit.");
            setSelectedProject('');
            setSelectedDepartment('');
            setSelectedBusinessUnit('');
            setUsers([]);
            navigate('/project/user/assign');
          } else {
            setUsers(data);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      } else {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [selectedDepartment, selectedBusinessUnit, navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (selectedProject) {
        try {
          const response = await fetch(`${port}/projects/${selectedProject}/tasks`);
          const data = await response.json();
          setTasks(data);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      } else {
        setTasks([]);
      }
    };
    fetchTasks();
  }, [selectedProject]);

  const handleAllocate = async () => {
    if (!selectedUser || !selectedDepartment || !selectedBusinessUnit || !selectedProject || !selectedTask) {
      alert("Please select all fields.");
      return;
    }
    try {
      const response = await fetch(`${port}/project/user/allocate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: selectedUser,
          department: selectedDepartment,
          businessUnit: selectedBusinessUnit,
          project: selectedProject,
          task: selectedTask, 
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert("Project allocated successfully!");
        setSelectedProject("");
        setSelectedDepartment("");
        setSelectedBusinessUnit("");
        setSelectedUser("");
        setSelectedTask(""); 
        setUsers([]);
        setDepartments([]);
        setBusinessUnits([]);
        setTasks([]); 
      } else {
        alert("Error in allocation: " + result.message);
      }
    } catch (error) {
      console.error("Error allocating project:", error);
    }
  };

  const handleDelete = async (username, task) => {
    if (window.confirm(`Are you sure you want to delete the assignment for ${username} and task ${task}?`)) {
      try {
        const response = await fetch(`${port}/projects/${selectedProject}/assigned-users/${username}/${task}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (result.success) {
          alert("Assignment deleted successfully!");
          const updatedResponse = await fetch(`${port}/projects/${selectedProject}/assigned-users`);
          const updatedUsers = await updatedResponse.json();
          setAssignedUsers(updatedUsers);
        } else {
          alert("Error deleting assignment: " + result.message);
        }
      } catch (error) {
        console.error("Error deleting assignment:", error);
      }
    }
  };
  const handleViewDetails = (user) => {
    setSelectedUserDetails(user); 
    setIsPopupVisible(true); 
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false); 
    setSelectedUserDetails(null);
  };
  
 
  const handlecancel=()=>{
        setSelectedProject("");
        setSelectedDepartment("");
        setSelectedBusinessUnit("");
        setSelectedUser("");
        setSelectedTask(""); 
        setUsers([]);
        setDepartments([]);
        setBusinessUnits([]);
        setTasks([]); 
  }
  return (
    <div className="dashboard">
      <Sidebar handleLogout={handleLogout} />
      <div className="main1">
        <div className="left-column">
          <div className="task-input add-task-card">
            <h3 style={{marginTop:"-3px"}}>Select a Project</h3>
            <select
              style={{ width: "100%", padding: "10px" }}
              onChange={(e) => setSelectedProject(e.target.value)}
              value={selectedProject}
            >
              <option value="">Select a Project</option>
              {projectNames.map((name, index) => (
                <option key={index} value={name}>{name}</option>
              ))}
            </select>
            <h3 style={{marginTop:"-3px"}}>Select Department</h3>
            <select
              style={{ width: "100%", padding: "10px" }}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              value={selectedDepartment}
            >
              <option value="">Select a Department</option>
              {departments.map((department, index) => (
                <option key={index} value={department}>{department}</option>
              ))}
            </select>
            <h3 style={{marginTop:"-3px"}}>Select Business Unit</h3>
            <select
              style={{ width: "100%", padding: "10px" }}
              onChange={(e) => setSelectedBusinessUnit(e.target.value)}
              value={selectedBusinessUnit}
            >
              <option value="">Select a Business Unit</option>
              {businessUnits.map((unit, index) => (
                <option key={index} value={unit}>{unit}</option>
              ))}
            </select>

            <h3 style={{marginTop:"-3px"}}>Select User</h3>
            <select
              style={{ width: "100%", padding: "10px" }}
              onChange={(e) => setSelectedUser(e.target.value)}
              value={selectedUser}
            >
              <option value="">Select a User</option>
              {users.map((user, index) => (
                <option key={index} value={user.name}>{user.name}</option>
              ))}
            </select>
            <h3 style={{marginTop:"-3px"}}>Select Task</h3>
            <select
              style={{ width: "100%", padding: "10px" }}
              onChange={(e) => setSelectedTask(e.target.value)}
              value={selectedTask}
            >
              <option value="">Select a Task</option>
              {tasks.map((task, index) => (
                <option key={index} value={task.name}>{task.name}</option>
              ))}
            </select>
            <br></br>
            <button onClick={handleAllocate} style={{ marginTop:"5px",backgroundColor: "rgb(124, 160, 114)"}}>
              Allocate
            </button>
            <button onClick={handlecancel} style={{ marginLeft:"10px", backgroundColor:"grey"}}>
              Cancel
            </button>
          </div>
          <button onClick={gotoproject} style={{marginTop:"20px",marginLeft:"500px"}}>Back</button>
        </div>
        <div className="right-column">
          <div className="task-list-card">
            <h3>Assigned Users for {selectedProject || '...'}</h3>
            <div className="task-list">
              {assignedUsers.length > 0 ? (
                assignedUsers.map((user, index) => (
                  <div key={index} className="task-item">
                    <p className="task-content">{user.username}</p>
                    <div className="task-actions">
                      <FaEye
                        className="icon view-icon"
                        style={{marginLeft:"10px"}}
                        onClick={() => handleViewDetails(user)} 
                      />
                      <FaTrash
                        className="icon delete-icon"
                        onClick={() => handleDelete(user.username, user.task_name)} 
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>No users assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {isPopupVisible && selectedUserDetails && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3 style={{marginLeft:"150px",textDecoration:"underline"}}>User Details</h3>
            <p><strong>Username:</strong> {selectedUserDetails.username}</p>
            <p><strong>Department:</strong> {selectedUserDetails.department}</p>
            <p><strong>Business Unit:</strong> {selectedUserDetails.business_unit}</p>
            <p><strong>Task Name:</strong> {selectedUserDetails.task_name}</p>
            <button onClick={handleClosePopup} className="popup-close-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAssign;
