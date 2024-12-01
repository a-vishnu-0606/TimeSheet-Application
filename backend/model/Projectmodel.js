import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    project_name: { 
        type: String, 
        required: true 
    },
    client_name: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String 
    },
    department: { 
        type: String, 
        required: true 
    }, 
    business_unit: { 
        type: String, 
        required: true 
    },
    project_type: { 
        type: String, 
        required: true 
    },
    assigned_users: [
        {
            username: { type: String, required: true },
            department: { type: String, required: true },
            business_unit: { type: String, required: true },
            task_name: { type: String, required: true },
        }
    ],
    tasks: [
        { 
            name: { type: String, required: true },
            allocated: { type: String, default: "Not Allocated" },
            status: { type: String, default: "Pending" },
            created_at: { type: Date, default: Date.now },
            updated_at: { type: Date, default: Date.now },
        }
    ],
    estimated_days: {
        type: String
    },
    status: {
        type: String,
        default:"In Progress"
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    }
});

const project_model = mongoose.model('Project', projectSchema);

export default project_model;
