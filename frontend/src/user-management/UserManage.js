import React, { useEffect, useState } from 'react';
import "./usermanage.css"
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';



const UserManage = () => {
  const navigate=useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchType, setSearchType] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const nextPage = () => {
    if (indexOfLastUser < users.length) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const gotoadd = () => navigate('/user/add');
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      navigate('/'); 
    }
  };
  const port="http://localhost:8000"


  const fetchUsers = async () => {
    try {
      const response = await fetch(`${port}/user/view`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.user);
        setFilteredUsers(data.user);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = users.filter(user =>
      user[searchType]?.toString().toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); 
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to Delete the user?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${port}/user/delete/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          alert("User deleted successfully")
          setUsers(users.filter((user) => user.id !== id));
          fetchUsers() 
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };
  
  
  return (
    <div className='dashboard'>
        <Sidebar handleLogout={handleLogout} />
        <div className='main'>
        <div className="search-container">
            <div className="search-form-row">
              <select className="serach-box" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                <option value="name">Name</option>
                <option value="mail">Email</option>
                <option value="phone">Phone</option>
                <option value="department">Department</option>
                <option value="business">Business</option>
              </select>
              <input
                type="text"
                placeholder={`Search by ${searchType}`}
                value={searchTerm}
                onChange={handleSearch}
              />
              <button
                className="add-user-button"
                onClick={()=>navigate('/user/add-details')}
              >
                Add Department/Business Unit
              </button>
              <button
                onClick={gotoadd}
                className="add-user-button"
              >
                Add User
              </button>
              
            </div>
          </div>

          
          <br></br>
          <br></br>
          <table className="user-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Business</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={index}>
                <td>{indexOfFirstUser + index + 1}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.mail}</td>
                <td>{user.phone}</td>
                <td>{user.department}</td>
                <td>{user.business}</td>
                <td>
                  <button className="edit" onClick={() => navigate(`/user/edit/${user._id}`)}>Edit</button>
                  <button className="delete" style={{marginTop:"5px"}}onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
          <button onClick={nextPage} disabled={indexOfLastUser >= filteredUsers.length}>Next</button>
        </div>
        </div>
    </div>
  )
}

export default UserManage

