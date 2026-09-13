const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            minlength: [2, "Task title must be at least 2 characters"]
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        subject: {
            type: String,
            trim: true,
            default: ""
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        status: {
            type: String,
            enum: ["To Do", "In Progress", "Done"],
            default: "To Do"
        },

        dueDate: {
            type: Date,
            required: [true, "Due date is required"]
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Task", taskSchema);