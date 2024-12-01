import express from 'express'
import connect from './db.js';
import User from './model/Registermodel.js'
import Project from './model/Projectmodel.js'
import Departmentmodel from './model/Departmentmodel.js';
import AllocationModel from './model/ProjectAllocationmodel.js';
import LogData from './model/LogDatamodel.js';
import moment from 'moment/moment.js';
import cors from 'cors';
import expressRateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

const PORT=8000

const app=express();
app.use(express.json());
app.use(cors());
connect()

const rateLimiter = expressRateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/user', rateLimiter);

app.get('/user/roles', async (req, res) => {
    try {
        const users = await User.find();
        const roleCounts = {};

        users.forEach(user => {
            const role = user.role || 'unknown'; 
            roleCounts[role] = (roleCounts[role] || 0) + 1;
        });

        const roleArray = Object.entries(roleCounts).map(([role, count]) => ({
            role,
            count
        }));

        return res.status(200).json({
            success: true,
            data: roleArray
        });
    } catch (error) {
        console.error("Error fetching user roles:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching user roles"
        });
    }
});



app.post('/user', async(req,res)=>{
    const {name,password}=req.body;

    try {
        const user= await User.findOne({mail:name});
        if(!user){
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        if(user.password!==password){
            return res.status(401).json({ 
                success: false, 
                message: 'Password wrong' 
            });
        }
        res.status(200).json({
            success: true,
            message: "Login success",
            user
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
})

app.delete('/user/departments/delete', async (req, res) => {
  const { department_name } = req.body;

  if (!department_name) {
    return res.status(400).json({ error: 'Department name is required' });
  }

  try {
    const result = await Departmentmodel.deleteOne({ department_name });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.status(200).json({ message: 'Department deleted successfully.' });
  } catch (err) {
    console.error('Error deleting department:', err);
    res.status(500).json({ error: 'Error deleting department' });
  }
});

function generateRandomPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}


app.post('/user/new', async (req, res) => {
  const { name, mail, phone, department, business, role } = req.body;

  const randomPassword = generateRandomPassword();
  const secretKey = 'b1abc29263dd920c15a535cd1f816e08741a138d852d87832748baf5d561bfe4cba7bce9b2639ca9c5c26a1c39df902f121b9b242e1b75f3dd697a077a13caca1fed8b641350f8b3feae31f1e357f7c50e9f2952a3f0dc964eca56d27f2db6a1af7b9d94c85d69603bb975d59ab58ba45f7130374703daac93b3f49e289fcecae43e0fc02e8c8dcc8913d18bba22ee5f633f982817434e886f0a055249081e45e2351ab9fcf033f6d7cc472031abfebe3666ffec38da304797f7c9fcf7117927280c80c4fcf36d15e671373a0357a83b6dcab004d564fe6cd5fb804e7e0b330fc18b2f6d9024a9786dcef4ea56646c3f4c9eb027a293b201e5820318ec19b49071157cdd19e1049732df4f5c49b38a42355e177ba9630a6536993d31e5b02ec97cf93fa99feb374d7f7999cb146390709e6bb40f944d68efe317a72aed222104c937e5706af6c4479146bd5c6c31dc599b85fbab11f0044ed374f2f8f6cedd248a753d3d49d8a6ef22dfc57be166abe2d5408ad39e69da60dedc66e5b685fdbb89ea5e9d6ead81718f8c6b9c99310f3400df690d6278ae45886953aea295ac1dbe683153861b20dc52316073a7807f75866b5d73f2ba8cd209360648f114b0ea6fda1d457a5067f3020f097e0fd6f1c9b2419837fe341fa4ffcbf171b14ce10012d912c0b8abb835f5d0896edf980ea43d89da1fc45ac5a4942a89d3545441d7'; // Make sure to use a strong and secure secret key.
  const token = jwt.sign({ email: mail }, secretKey, { expiresIn: '1h' }); 

  try {
    const newUser = new User({ name, mail, phone, department, business, role, password: randomPassword });
    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '953621104060@ritrjpm.ac.in',
        pass: 'Vis06@uz'
      }
    });

    const verificationLink = `http://localhost:3000/reset-password?token=${token}`;

    const mailOptions = {
      from: '953621104060@ritrjpm.ac.in',
      to: mail,
      subject: 'TimeSheet Application - Account Verification',
      text: `Hi ${name},\n\nYour account has been successfully created.\n\nClick the link below to verify your email and set your password:\n\n${verificationLink}\n\nThis link will expire in 1 hour.\n\nThank you!`      
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully and email sent!"
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
});

app.post('/user/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  const secretKey = 'b1abc29263dd920c15a535cd1f816e08741a138d852d87832748baf5d561bfe4cba7bce9b2639ca9c5c26a1c39df902f121b9b242e1b75f3dd697a077a13caca1fed8b641350f8b3feae31f1e357f7c50e9f2952a3f0dc964eca56d27f2db6a1af7b9d94c85d69603bb975d59ab58ba45f7130374703daac93b3f49e289fcecae43e0fc02e8c8dcc8913d18bba22ee5f633f982817434e886f0a055249081e45e2351ab9fcf033f6d7cc472031abfebe3666ffec38da304797f7c9fcf7117927280c80c4fcf36d15e671373a0357a83b6dcab004d564fe6cd5fb804e7e0b330fc18b2f6d9024a9786dcef4ea56646c3f4c9eb027a293b201e5820318ec19b49071157cdd19e1049732df4f5c49b38a42355e177ba9630a6536993d31e5b02ec97cf93fa99feb374d7f7999cb146390709e6bb40f944d68efe317a72aed222104c937e5706af6c4479146bd5c6c31dc599b85fbab11f0044ed374f2f8f6cedd248a753d3d49d8a6ef22dfc57be166abe2d5408ad39e69da60dedc66e5b685fdbb89ea5e9d6ead81718f8c6b9c99310f3400df690d6278ae45886953aea295ac1dbe683153861b20dc52316073a7807f75866b5d73f2ba8cd209360648f114b0ea6fda1d457a5067f3020f097e0fd6f1c9b2419837fe341fa4ffcbf171b14ce10012d912c0b8abb835f5d0896edf980ea43d89da1fc45ac5a4942a89d3545441d7';

  try {
    const decoded = jwt.verify(token, secretKey);
    const userEmail = decoded.email;
    const user = await User.findOne({ mail: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.password = newPassword;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '953621104060@ritrjpm.ac.in',
        pass: 'Vis06@uz'
      }
    });


    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Account Successfully Verified',
      text: 'Your account has been successfully created. You can now begin using the time sheet application to manage and track your time efficiently.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(200).json({ success: true, message: 'Password reset successful and confirmation email sent' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});


app.get('/user/view', async(req,res)=>{
    try {
        const user= await User.find();
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
})

app.delete('/user/delete/:id',async(req,res)=>{
    const user=await User.findByIdAndDelete(req.params.id);

    if(!user){
        return res.status(404).json({
            success:false,
            message:"user not found"
        })
    }

    res.status(200).json({
        success:true,
        message:"User deleted",
    })

})

app.get('/user/:id',async(req,res)=>{
    const user=await User.findById(req.params.id)
    res.status(201).json({
        success:true,
        user
    })
})

app.put('/project/edit/:id',async(req,res)=>{
    let user =await Project.findById(req.params.id)
    if(!user){
        return res.status(404).json({
            success:false,
            message:"Product not Found"
        })
    }

    user = await Project.findByIdAndUpdate(user,req.body,{new:true,runValidators:true})

    res.status(201).json({
        success:true,
    })
})

app.put('/user/update/:id',async(req,res)=>{
    let user =await User.findById(req.params.id)
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not Found"
        })
    }

    user = await User.findByIdAndUpdate(user,req.body,{new:true,runValidators:true})

    res.status(201).json({
        success:true,
    })
})

app.post('/project/new', async (req, res) => {
    const { project_name, client_name, address, department, business_unit, project_type, estimated_days } = req.body;
    try {
      const newProject = new Project({ project_name, client_name, address, department, business_unit, project_type, estimated_days });
      await newProject.save();
      res.status(201).json({
        success: true,
        message: "Project created successfully"
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message
      });
    }
  });

  app.get('/project/view',async(req,res)=>{
    const project = await Project.find();
    res.status(200).json({
        success: true,
        project
    })
  })

  app.get('/project/view/:id',async(req,res)=>{
    const project = await Project.findById(req.params.id);
    res.status(200).json({
        success: true,
        project
    })
  })

  app.delete('/project/delete/:id',async(req,res)=>{
    const user=await Project.findByIdAndDelete(req.params.id);

    if(!user){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }

    res.status(200).json({
        success:true,
        message:"Product deleted",
    })

})

app.get('/departments/name', async (req, res) => {
  try {
    const departments = await Departmentmodel.find({}, { department_name: 1 });
    res.status(200).json({ department: departments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

app.get('/user/departments/:name/business-units', async (req, res) => {
  const { name } = req.params;
  try {
    const department = await Departmentmodel.findOne({ department_name: name }, { business_units: 1 });
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.status(200).json({ business_units: department.business_units });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch business units' });
  }
});


app.post('/project/add-task', async (req, res) => {
    const { projectName, task, allocated, status } = req.body;
  
    if (!projectName || !task) {
      return res.status(400).json({ message: 'Project name and task are required' });
    }
  
    try {
      const project = await Project.findOne({ project_name: projectName });
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      const newTask = {
        name: task,
        allocated: allocated,
        status: status,
        created_at: new Date(),
        updated_at: new Date(),
      };
      project.tasks.push(newTask);
  
      await project.save();
  
      return res.status(200).json({ message: 'Task added successfully', project });
    } catch (error) {
      console.error('Error adding task:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/project/get-tasks', async (req, res) => {
    const { projectName } = req.body;
  
    try {
      const project = await Project.findOne({ project_name: projectName });
      if (project) {
        res.status(200).json({ success:true,tasks: project.tasks });
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error });
    }
  });
  
  app.post('/project/delete-task', async (req, res) => {
    const { projectName, task } = req.body;
  
    try {
      const project = await Project.findOne({ project_name: projectName });
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      project.tasks = project.tasks.filter((t) => t.name !== task);
      await project.save();
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Failed to delete task' });
    }
  });

  app.post('/project/update-task', async (req, res) => {
    const { projectName, oldTask, newTask } = req.body;
  
    try {
      const updatedProject = await Project.findOneAndUpdate(
        { project_name: projectName, "tasks.name": oldTask },
        { $set: { "tasks.$.name": newTask, "tasks.$.updated_at": new Date() } },
        { new: true }
      );
  
      if (!updatedProject) {
        return res.status(404).json({ message: 'Project or task not found' });
      }
  
      res.status(200).json({ message: 'Task updated successfully', updatedProject });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Failed to update task', error });
    }
  });
  
  app.post('/user/departments', async (req, res) => {
    const { department_name } = req.body;
    try {
      if (!department_name) {
        return res.status(400).json({ error: "Department name is required" });
      }
      const newDepartment = new Departmentmodel({ department_name });
      await newDepartment.save();
      res.status(201).json({ message: "Department added successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/user/departments/name', async (req, res) => {
    
      const department= await Departmentmodel.find();
      res.status(201).json({ 
        success:true,
        department 
      });
    
  });
  
  app.post('/user/departments/add-unit', async (req, res) => {
    const { department_name, business_unit } = req.body;
  
    if (!department_name || !business_unit) {
      return res.status(400).json({ error: 'Both department_name and business_unit are required.' });
    }
  
    try {
      const updatedDepartment = await Departmentmodel.findOneAndUpdate(
        { department_name }, 
        { $addToSet: { business_units: business_unit } },
        { new: true } 
      );
  
      if (!updatedDepartment) {
        return res.status(404).json({ error: 'Department not found.' });
      }
  
      res.status(200).json({
        message: 'Business Unit added successfully!',
        updatedDepartment,
      });
    } catch (error) {
      console.error('Error updating department:', error);
      res.status(500).json({ error: 'An error occurred while updating the department.' });
    }
  });
  

  app.get("/projects/distinct-names", async (req, res) => {
    try {
      const distinctNames = await Project.distinct("project_name");
      res.json(distinctNames);
    } catch (error) {
      res.status(500).json({ message: "Error fetching project names", error });
    }
  });

  app.get("/projects/:projectName/departments", async (req, res) => {
    const { projectName } = req.params;
    try {
      const distinctDepartments = await Project
        .find({ project_name: projectName })
        .distinct("department");
      res.json(distinctDepartments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching departments", error });
    }
  });
  
  app.get('/departments/:department/business-units', async (req, res) => {
    try {
      const department = await Departmentmodel.findOne({ department_name: req.params.department });
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      res.json(department.business_units);
    } catch (error) {
      res.status(500).json({ message: "Error fetching business units" });
    }
  });

  app.get('/users1', async (req, res) => {
    const { department, business } = req.query;
  
    try {
      const users = await User.find({ department, business });
      res.json(users);
    } catch (error) {
      res.status(500).send("Error fetching users");
    }
  });

  app.post('/project/user/allocate', async (req, res) => {
    const { username, department, businessUnit, project, task } = req.body;

    try {
        const existingUser = await AllocationModel.findOne({ username, department, businessUnit });

        if (existingUser) {
            const projectAlreadyAllocated = existingUser.allocatedProjects.some(p => p.project_name === project && p.task_name === task);
            if (!projectAlreadyAllocated) {
                existingUser.allocatedProjects.push({
                    project_name: project,
                    task_name: task,
                    assigned_at: Date.now(),
                });
                await existingUser.save();
            }
        } else {
            const newAllocation = new AllocationModel({
                username,
                department,
                businessUnit,
                allocatedProjects: [{
                    project_name: project,
                    task_name: task,
                    assigned_at: Date.now(),
                }],
            });
            await newAllocation.save();
        }

        const projectToUpdate = await Project.findOne({ project_name: project });
        if (projectToUpdate) {
            const taskToUpdate = projectToUpdate.tasks.find(t => t.name === task);
            if (taskToUpdate && taskToUpdate.allocated === "Not Allocated") {
                taskToUpdate.allocated = "Allocated";
                taskToUpdate.status = "In Progress";
                taskToUpdate.updated_at = new Date();
            }

            const userAlreadyAssigned = projectToUpdate.assigned_users.some(user =>
                user.username === username &&
                user.department === department &&
                user.business_unit === businessUnit &&
                user.task_name === task
            );
            if (!userAlreadyAssigned) {
                projectToUpdate.assigned_users.push({
                    username,
                    department,
                    business_unit: businessUnit,
                    task_name: task,
                });
            }

            await projectToUpdate.save();
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});



app.get('/projects/:projectName/tasks', async (req, res) => {
  const { projectName } = req.params;

  try {
    const project = await Project.findOne({ project_name: projectName });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const unallocatedTasks = project.tasks.filter(task => task.allocated === "Not Allocated");

    res.json(unallocatedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});


app.get('/projects/:projectName/assigned-users', async (req, res) => {
  const { projectName } = req.params;

  try {
    const project = await Project.findOne({ project_name: projectName });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project.assigned_users);
  } catch (error) {
    console.error('Error fetching assigned users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/projects/:projectname/assigned-users/:username/:task', async (req, res) => {
  const { projectname, username, task } = req.params;

  try {
    const project = await Project.findOne({ project_name: projectname });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const userIndex = project.assigned_users.findIndex(
      (user) => user.username === username && user.task_name === task
    );
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: "User or task not found in the project" });
    }

    project.assigned_users.splice(userIndex, 1);
    await project.save();

    const allocation = await AllocationModel.findOne({ username });
    if (!allocation) {
      return res.status(404).json({ success: false, message: "User allocation not found" });
    }

    allocation.allocatedProjects = allocation.allocatedProjects.filter(
      (project) => project.project_name !== projectname || project.task_name !== task
    );
    await allocation.save();

    res.status(200).json({ success: true, message: "Assignment deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting assignment" });
  }
});





//employee

app.post("/employee/allocations/projectnames", async (req, res) => {
  try {
      const { username, department, businessUnit } = req.body;

      const allocation = await AllocationModel.findOne({
          username,
          department,
          businessUnit
      });

      if (allocation) {
          res.status(200).json({ allocatedProjects: allocation.allocatedProjects });
      } else {
          res.status(404).json({ message: "No projects found" });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
});

app.post('/employee/allocations/tasks', async (req, res) => {
  const { project_name, username, department, business } = req.body;

  try {
    const allocation = await AllocationModel.findOne({
      username,
      department,
      business,
      'allocatedProjects.project_name': project_name,
    });

    if (allocation) {
      const tasks = allocation.allocatedProjects
        .filter((project) => project.project_name === project_name)
        .map((project) => ({
          task_name: project.task_name,
          status: project.status,
        }))
        .filter((task) => task.status === 'In Progress');

      res.status(200).json({ tasks });
    } else {
      res.status(404).json({ tasks: [] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});



app.post('/employee/log/add', async (req, res) => {
  try {
      const {
          userName,
          department,
          business,
          projectName,
          task,
          comments,
          status,
          hours,
          date
      } = req.body;

      const newLog = new LogData({
          userName,
          department,
          business,
          projectName,
          task,
          comments,
          status,
          hours,
          date
      });

      await newLog.save();

      res.status(200).json({ message: 'Log added successfully' });
  } catch (error) {
      console.error('Error saving log:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.get('/employee/logs', async (req, res) => {
  try {
    const logs = await LogData.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching logs' });
  }
});

app.post('/employee/allocations/update-status', async (req, res) => {
  try {
    const { username, projectName, taskName, status } = req.body;

    if (!username || !projectName || !taskName || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const allocation = await AllocationModel.findOneAndUpdate(
      { username, "allocatedProjects.project_name": projectName, "allocatedProjects.task_name": taskName },
      { $set: { "allocatedProjects.$.status": status } },
      { new: true }
    );

    if (!allocation) {
      return res.status(404).json({ error: 'Allocation or task not found' });
    }

    const projectUpdate = await Project.findOneAndUpdate(
      { project_name: projectName, "tasks.name": taskName },
      {$set: { 
        "tasks.$.status": status, 
        "tasks.$.updated_at": new Date(), 
        "updated_at": new Date() 
      } },
      { new: true }
    );

    if (!projectUpdate) {
      return res.status(404).json({ error: 'Project or task not found in project model' });
    }

    res.status(200).json({ message: 'Status updated successfully', allocation });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// app.get('/user/logs/performance', async (req, res) => {
//   try {
//     const performanceData = await LogData.aggregate([
//       {
//         $group: {
//           _id: { department: "$department", business: "$business", userName: "$userName" },
//           completedTasks: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } }
//         }
//       },
//       {
//         $project: {
//           department: "$_id.department",
//           business: "$_id.business",
//           userName: "$_id.userName",
//           completedTasks: 1,
//           _id: 0
//         }
//       }
//     ]);

//     res.status(200).json(performanceData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch performance data' });
//   }
// });

app.get('/user/tasks/:userName', async (req, res) => {
  try {
    const { userName } = req.params;

    const tasks = await LogData.find(
      { userName, status: 'Completed' },
      'task' 
    ).exec();

    const taskNames = tasks.map((task) => task.task);

    res.json(taskNames);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});



app.get('/user/logs/performance', async (req, res) => {
  try {
    const today = moment().startOf('day'); 
    const startOfWeek = moment().startOf('week'); 
    const startOfMonth = moment().startOf('month'); 
    const startOfYear = moment().startOf('year'); 

    const performanceData = await LogData.aggregate([
      {
        $match: { status: 'Completed' }, 
      },
      {
        $group: {
          _id: { userName: "$userName", department: "$department", business: "$business" },
          tasksPerDay: {
            $sum: {
              $cond: [
                { $gte: ["$date", today.toDate()] }, 
                1,
                0,
              ],
            },
          },
          tasksPerWeek: {
            $sum: {
              $cond: [
                { $gte: ["$date", startOfWeek.toDate()] }, 
                1,
                0,
              ],
            },
          },
          tasksPerMonth: {
            $sum: {
              $cond: [
                { $gte: ["$date", startOfMonth.toDate()] }, 
                1,
                0,
              ],
            },
          },
          tasksPerYear: {
            $sum: {
              $cond: [
                { $gte: ["$date", startOfYear.toDate()] }, 
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          userName: "$_id.userName",
          department: "$_id.department",
          business: "$_id.business",
          completedTasksPerDay: "$tasksPerDay",
          completedTasksPerWeek: "$tasksPerWeek",
          completedTasksPerMonth: "$tasksPerMonth",
          completedTasksPerYear: "$tasksPerYear",
          _id: 0,
        },
      },
    ]);

    res.json(performanceData);
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({ error: 'Failed to fetch performance data' });
  }
});

app.get('/projects/task-status', async (req, res) => {
  try {
    const projects = await Project.find({});

    const filteredProjects = projects.map(project => {
      const completedTasks = project.tasks.filter(task => task.status === 'Completed');
      const counts = {
        completedTasksPerDay: 0,
        completedTasksPerWeek: 0,
        completedTasksPerMonth: 0,
        completedTasksPerYear: 0
      };

      const now = new Date();
      completedTasks.forEach(task => {
        const updatedAt = new Date(task.updated_at);
      
        const diffInMs = now - updatedAt;
        
        const oneDay = 1000 * 60 * 60 * 24;

        const oneWeek = oneDay * 7;

        const oneMonth = oneDay * 30;

        const oneYear = oneDay * 365;

        if (diffInMs <= oneDay) counts.completedTasksPerDay++;
        if (diffInMs <= oneWeek) counts.completedTasksPerWeek++;
        if (diffInMs <= oneMonth) counts.completedTasksPerMonth++;
        if (diffInMs <= oneYear) counts.completedTasksPerYear++;
      });

      return {
        project_name: project.project_name,
        client_name: project.client_name,
        tasks: completedTasks,
        completedTasksPerDay: counts.completedTasksPerDay,
        completedTasksPerWeek: counts.completedTasksPerWeek,
        completedTasksPerMonth: counts.completedTasksPerMonth,
        completedTasksPerYear: counts.completedTasksPerYear
      };
    });

    res.json(filteredProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

app.get('/check-project-status', async (req, res) => {
  try {
    const projects = await Project.find({});

    for (const project of projects) {
      const allTasksCompleted = project.tasks.length > 0 && project.tasks.every(task => task.status === 'Completed');

      if (allTasksCompleted) {
        project.status = 'Completed';
        await project.save();
      }
    }

    res.status(200).json({ success: true, message: 'Projects updated successfully' });
  } catch (error) {
    console.error('Error checking and updating project status:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/completed-projects', async (req, res) => {
  try {
    const completedProjects = await Project.find({ status: 'Completed' }, 'project_name department business_unit');
    res.status(200).json(completedProjects);
  } catch (error) {
    console.error('Error fetching completed projects:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/project/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/logs', async (req, res) => {
  try {
    const { projectName, department, business } = req.query;
    const logs = await LogData.find({ 
      projectName,
      department,
      business
    });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching log data:', error);
    res.status(500).send('Server Error');
  }
});


app.get('/projects/business', async (req, res) => {
  try {
      const projects = await Project.find({});
      res.json(projects);
  } catch (error) {
      res.status(500).send(error.message);
  }
});

app.get('/projects/:businessUnit', async (req, res) => {
  const { businessUnit } = req.params;

  try {
    const projects = await Project.find({ 
      business_unit: businessUnit,
      status: 'Completed' 
    });

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No completed projects found for this business unit' });
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/update-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).send({ message: 'Email and new password are required.' });
  }

  try {
    const user = await User.findOne({ mail: email });

    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }
    user.password = newPassword;
    await user.save();

    res.status(200).send({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).send({ message: 'Failed to update password.', error: error.message });
  }
});


app.listen(PORT,()=>{
    console.log(`Port is listening ${PORT}`)
})