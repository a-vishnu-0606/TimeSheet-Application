import mongoose from "mongoose";

const AllocationSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    department: {
        type: String,
        required: true,
    },
    businessUnit: {
        type: String,
        required: true,
    },
    allocatedProjects: [
        {
            project_name: { 
                type: String, 
                required: true 
            },
            task_name: {  
                type: String,
            },
            status: { 
                type: String, 
                enum: ['In Progress', 'Completed'], 
                default: 'In Progress' 
            },
            assigned_at: { 
                type: Date, 
                default: Date.now 
            }
        }
    ],
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    },
});

const AllocationModel = mongoose.model("Allocations", AllocationSchema);

export default AllocationModel;
