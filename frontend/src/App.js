import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './login-register/login'
import DashBoard from './dashboard/dashboard'
//import Viewusers from './user-management/viewusers'
import UserManage from './user-management/UserManage'
import Addusers from './user-management/addusers'
import EditUser from './user-management/EditUser'
import ProjectManage from './project-management/ProjectManage'
import AddProject from './project-management/AddProject'
import EditProject from './project-management/EditProject'
import TaskAssign from './project-management/TaskAssign'
import AddDetails from './user-management/adddetails'
import ProjectAssign from './project-management/ProjectAssign'
import NewLog from './employee/NewLog'
import ViewLog from './employee/ViewLog'
import ViewUserLogs from './Logs/ViewUserLogs'
import EditDetails from './user-management/EditDetails'
import EmployeePerformance from './dashboard/EmployeePerformance'
import TaskStatus from './dashboard/TaskStatus'
import ProjectStatus from './dashboard/ProjectStatus'
import Analysis from './dashboard/Analysis'
import ProjectDetails from './dashboard/ProjectDetails';
import ProjectDetails1 from './dashboard/ProjectDetails1'
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './login-register/ResetPassword';
import Profile from './employee/Profile'
import Profile1 from './dashboard/Profile1'

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/dashboard' element={<ProtectedRoute><DashBoard/></ProtectedRoute>}/>
            <Route path='/dashboard/employee-performance' element={<ProtectedRoute><EmployeePerformance/></ProtectedRoute>}/>
            <Route path='/dashboard/task-status' element={<ProtectedRoute><TaskStatus/></ProtectedRoute>}/>
            <Route path='/dashboard/project-status' element={<ProtectedRoute><ProjectStatus/></ProtectedRoute>}/>
            <Route path="/project-details1/:businessUnit" element={<ProtectedRoute><ProjectDetails1 /></ProtectedRoute>} />
            <Route path='/dashboard/analysis' element={<ProtectedRoute><Analysis/></ProtectedRoute>}/>
            <Route path="/project-details/:projectId" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
            <Route path='/user' element={<ProtectedRoute><UserManage/></ProtectedRoute>}/>
            <Route path='/user/add' element={<ProtectedRoute><Addusers/></ProtectedRoute>}/>
            <Route path="/user/edit/:id" element={<ProtectedRoute><EditUser /></ProtectedRoute>} />
            <Route path="/user/add-details" element={<ProtectedRoute><AddDetails/></ProtectedRoute>}/>
            <Route path='/user/edit-details' element={<ProtectedRoute><EditDetails/></ProtectedRoute>}/>
            <Route path='/project' element={<ProtectedRoute><ProjectManage/></ProtectedRoute>}/>
            <Route path='/project/add' element={<ProtectedRoute><AddProject/></ProtectedRoute>}/>
            <Route path='/project/edit/:id' element={<ProtectedRoute><EditProject/></ProtectedRoute>}/>
            <Route path='/project/task/assign' element={<ProtectedRoute><TaskAssign/></ProtectedRoute>}/>
            <Route path='/project/user/assign' element={<ProtectedRoute><ProjectAssign/></ProtectedRoute>}/>
            <Route path='/employee/newlog' element={<ProtectedRoute><NewLog/></ProtectedRoute>}/>
            <Route path='/employee/viewlog' element={<ProtectedRoute><ViewLog/></ProtectedRoute>}/>
            <Route path='/admin/user/logs' element={<ProtectedRoute><ViewUserLogs/></ProtectedRoute>}/>
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/employee/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute><Profile1 /></ProtectedRoute>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
