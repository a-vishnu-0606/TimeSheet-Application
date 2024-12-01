import mongoose from "mongoose";

const connect=()=>{
    mongoose.connect("mongodb+srv://Vishnu:vishnu2004@cluster0.udtx6ae.mongodb.net/TimeSheet")
    .then(()=>{
        console.log("Database connected")
    })
    .catch((err)=>{
        console.log(err)
    })
}

export default connect