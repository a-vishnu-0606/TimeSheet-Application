import mongoose from "mongoose"

const registerSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        default: "123"
    },
    role:{
        type:String      
    },
    mail:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    business:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    }
    
})

const registermodel=mongoose.model('Users',registerSchema)

export default registermodel