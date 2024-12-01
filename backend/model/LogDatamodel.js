import mongoose from "mongoose"

const logDataSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    business: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'In Progress'
    },
    hours: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const LogData = mongoose.model('LogData', logDataSchema);

export default LogData
