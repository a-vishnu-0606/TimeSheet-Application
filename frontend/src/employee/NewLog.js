import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify'; 
import { MdLogout } from 'react-icons/md';
import { TbLogs } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import './dashboard1.css';
import { TbClipboardData } from "react-icons/tb";
import { FaUsers } from 'react-icons/fa';

const NewLog = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [tasks, setTasks] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [comments, setComments] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedTask, setSelectedTask] = useState(''); 
    const [status, setStatus] = useState('');

    const port = "http://localhost:8000";

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserName(user.name);
            fetchAllocatedProjects(user.name, user.department, user.business);
        }
    }, []);

    const fetchAllocatedProjects = async (username, department, businessUnit) => {
        try {
            const response = await fetch(`${port}/employee/allocations/projectnames`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, department, businessUnit }),
            });

            const data = await response.json();
            if (response.ok) {
                const uniqueProjects = Array.from(
                    new Set(data.allocatedProjects.map((project) => project.project_name))
                ).map((project_name) => ({ project_name }));
                setProjects(uniqueProjects);
            } else {
                setProjects([]);
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setLoadingProjects(false);
        }
    };

    const fetchTasksForProject = async (projectName) => {
        setLoadingTasks(true);
        const user = JSON.parse(localStorage.getItem('user')); 
        try {
            const response = await fetch(`${port}/employee/allocations/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    project_name: projectName,
                    username: user.name,
                    department: user.department,
                    businessUnit: user.business,
                }),
            });
    
            const data = await response.json();
            if (response.ok && data.tasks.length > 0) {
                setTasks(data.tasks);
            } else {
                setTasks([]);
            }
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            setTasks([]);
        } finally {
            setLoadingTasks(false);
        }
    };

    const handleProjectChange = (e) => {
        const selected = e.target.value;
        setSelectedProject(selected);
        setTasks([]);
        if (selected) {
            fetchTasksForProject(selected);
        }
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.removeItem('user');
            navigate('/');
        }
    };

    const handleAddLog = async () => {
        if (!selectedProject || !selectedTask || !comments || !startTime || !endTime || !status) {
            alert('Please fill in all the fields');
            return;
        }
    
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const minutesTaken = (end - start) / 1000 / 60;
    
        if (minutesTaken < 0) {
            alert("End time cannot be earlier than start time.");
            return;
        }
    
        const hoursTaken = Math.floor(minutesTaken / 60);
        const remainingMinutes = minutesTaken % 60;
    
        const user = JSON.parse(localStorage.getItem('user'));
    
        const sanitizedComments = DOMPurify.sanitize(comments);

        const logData = {
            userName: user.name,
            department: user.department,
            business: user.business,
            projectName: selectedProject,
            task: selectedTask,
            comments: sanitizedComments,
            status,
            hours: `${hoursTaken} hr ${remainingMinutes} min`,
            date: new Date(),
        };
    
        try {
            const logResponse = await fetch(`${port}/employee/log/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logData),
            });
    
            if (!logResponse.ok) {
                alert('Failed to add log. Please try again.');
                return;
            }
    
            const statusUpdateResponse = await fetch(`${port}/employee/allocations/update-status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.name,
                    projectName: selectedProject,
                    taskName: selectedTask,
                    status,
                }),
            });
    
            if (statusUpdateResponse.ok) {
                alert('Log and status updated successfully!');
                setSelectedProject('');
                setSelectedTask('');
                setComments('');
                setStartTime('');
                setEndTime('');
                setStatus('');
            } else {
                const errorData = await statusUpdateResponse.json();
                alert(`Failed to update task status: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    };
    
    const handlecancel = () => {
        setSelectedProject('');
        setSelectedTask('');
        setComments('');
        setStartTime('');
        setEndTime('');
        setStatus('');
    };

    return (
        <div className='dashboard1'>
            <div className='sidebar1'>
                <ul>
                    <br />
                    <br />
                    <br />
                    <br />
                    <li onClick={()=>navigate('/employee/newlog')}><TbLogs className="icon" /> &nbsp;New Log</li>
                    <li onClick={()=>navigate('/employee/viewlog')}><TbClipboardData  className="icon" /> &nbsp;View Logs</li>
                    <li onClick={() => navigate('/employee/profile')}><FaUsers className="icon" /> &nbsp;Profile</li>
                </ul>
                <ul className="logout1">
                    <li onClick={handleLogout}>
                        <MdLogout /> &nbsp;Logout
                    </li>
                </ul>
            </div>
            <div className='main2'>
                <h1 style={{ marginLeft: "80px" }}>Welcome, {userName}! .. Enter today log...</h1>
                <div className="form-container">
                    {loadingProjects ? (
                        <p>Loading projects...</p>
                    ) : projects.length > 0 ? (
                        <div className="time-container">
                            <div className="time-picker">
                                <label>Select Project:</label>
                                <select
                                    value={selectedProject}
                                    className='select1'
                                    onChange={handleProjectChange}
                                >
                                    <option value="" disabled>Select a project</option>
                                    {projects.map((project, index) => (
                                        <option key={index} value={project.project_name}>
                                            {project.project_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="time-picker">
                                {loadingTasks ? (
                                    <p>Loading tasks...</p>
                                ) : tasks.length > 0 ? (
                                    <div>
                                        <label>Select Task:</label>
                                        <select
                                            value={selectedTask}
                                            className='select1'
                                            onChange={(e) => setSelectedTask(e.target.value)}
                                        >
                                            <option value="" disabled>Select a task</option>
                                            {tasks.map((task, index) => (
                                                <option key={index} value={task.task_name}>
                                                    {task.task_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    selectedProject && <p>No task found</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>No project has been found</p>
                    )}

                    <div className="comments-section">
                        <label>Add Comments:</label>
                        <address>
                            <textarea
                                placeholder="Add comments here"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                            />
                        </address>
                    </div>

                    <div className="time-container1">
                       <div className="time-picker1">
                            <label style={{marginRight:"20px"}}>Status</label>
                            <select
                                value={status}
                                className="select1"
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="" disabled>Select status</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="time-picker1">
                            <label style={{ marginLeft: "40px"}}>Start Time:</label>
                            <input
                                type="time"
                                value={startTime}
                                className='time'
                                style={{ marginLeft: "20px",marginRight:"20px"}}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div className="time-picker1">
                            <label >End Time:</label>
                            <input
                                type="time"
                                value={endTime}
                                className='time'
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                        

                    </div>
                    <div className="form-buttons">
                        <button className="update" style={{ marginLeft: "100px", marginTop: "20px" }} type="button" onClick={handleAddLog}>
                            Add Log
                        </button>
                        <button style={{ backgroundColor: "grey", marginTop: "20px" }} onClick={handlecancel} type="button">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewLog;
