import mongoose from "mongoose"

const DepartmentSchema= new mongoose.Schema({
    
    department_name: { 
        type: String,
        required: true, 
        unique: true 
    }, 
    business_units: [
        {
          
        }
    ],       
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    }
    
})

const Departmentmodel=mongoose.model('Departments',DepartmentSchema)

export default Departmentmodel



