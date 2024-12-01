import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';
import './taskassign.css';

const TaskAssign = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState('');
  const [updatedTask, setUpdatedTask] = useState('');
  const port = "http://localhost:8000";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${port}/project/view`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data.project);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      navigate('/');
    }
  };

  const gotoproject = () => navigate('/project');

  const handleProjectChange = async (e) => {
    const projectName = e.target.value;
    setSelectedProject(projectName);

    if (projectName) {
      try {
        const response = await fetch(`${port}/project/get-tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectName,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks((prevTasks) => ({
          ...prevTasks,
          [projectName]: data.tasks.map((task) => task.name),
        }));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
  };

  const handleAddTask = async () => {
    if (!newTask || !selectedProject) return;

    setTasks((prevTasks) => ({
      ...prevTasks,
      [selectedProject]: [...(prevTasks[selectedProject] || []), newTask],
    }));
    setNewTask('');

    try {
      const response = await fetch(`${port}/project/add-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName: selectedProject,
          task: newTask,
          allocated: "Not Allocated",
          status: "In Progress"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      await response.json();
      alert('Task Added Successfully');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskToDelete) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the task "${taskToDelete}" for the project "${selectedProject}"?`);

    if (confirmDelete) {
      try {
        const response = await fetch(`${port}/project/delete-task`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectName: selectedProject,
            task: taskToDelete,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete task');
        }

        setTasks((prevTasks) => ({
          ...prevTasks,
          [selectedProject]: prevTasks[selectedProject].filter((task) => task !== taskToDelete),
        }));

        alert('Task deleted successfully');
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setUpdatedTask(task);
    setIsEditing(true);
  };

  const handleUpdateTask = async () => {
    if (!updatedTask.trim()) {
      alert('Task field cannot be empty.');
      return;
    }
    try {
      const response = await fetch(`${port}/project/update-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName: selectedProject,
          oldTask: editingTask,
          newTask: updatedTask,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      setTasks((prevTasks) => ({
        ...prevTasks,
        [selectedProject]: prevTasks[selectedProject].map((task) => (task === editingTask ? updatedTask : task)),
      }));

      setIsEditing(false);
      alert('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  const gotoassign=()=> {
    setNewTask('');
    setSelectedProject('');
    navigate('/project/task/assign');
  }

  return (
    <div className="dashboard">
      <Sidebar handleLogout={handleLogout} />
      
      <div className="main1">
        
        <div className="left-column">
          <div className="project-selection project-dropdown">
            <h3>Choose a Project</h3>
            <select value={selectedProject} onChange={handleProjectChange}>
              <option value="" disabled>Choose a project</option>
              {projects.map((project) => (
                <option key={project._id} value={project.project_name}>
                  {DOMPurify.sanitize(project.project_name)} 
                </option>
              ))}
            </select>
          </div>

          <div className="task-input add-task-card">
            <h3>Enter the task for {selectedProject || '...'}</h3>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(DOMPurify.sanitize(e.target.value))} 
              placeholder="Enter task"
            />
            <div className="buttons">
              <button className="update1" onClick={handleAddTask}>Add Task</button>
              <button style={{backgroundColor:"grey"}} onClick={gotoassign}>
                Cancel
              </button>
            </div>
          </div>
          <button onClick={gotoproject} style={{marginTop:"120px",marginLeft:"500px"}}>Back</button>
        </div>
        <div className="right-column">
          <div className="task-list-card">
            <h3>Tasks for {selectedProject || '...'}</h3>
            <div className="task-list">
              {tasks[selectedProject]?.length ? (
                tasks[selectedProject].map((task, index) => (
                  <div key={index} className="task-item">
                    <p className="task-content">{DOMPurify.sanitize(task)}</p>
                    <div className="task-actions">
                      <FaEdit className="icon edit-icon" onClick={() => handleEditTask(task)} />
                      <FaTrash className="icon delete-icon" onClick={() => handleDeleteTask(task)} />
                    </div>
                  </div>
                ))
              ) : (
                <p>No tasks available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="popup">
          <div className="popup-content">
            <h3>Edit Task</h3>
            <input
              type="text"
              value={updatedTask}
              onChange={(e) => setUpdatedTask(DOMPurify.sanitize(e.target.value))} 
            />
            <div className="popup-buttons">
              <button className="update1" onClick={handleUpdateTask}>Update</button>
              <button className="cancel" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskAssign;
