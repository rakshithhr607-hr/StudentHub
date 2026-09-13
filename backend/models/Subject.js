const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Subject name is required"],
            trim: true,
            minlength: [2, "Subject name must be at least 2 characters"]
        },

        faculty: {
            type: String,
            trim: true,
            default: ""
        },

        code: {
            type: String,
            trim: true,
            default: ""
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

module.exports = mongoose.model("Subject", subjectSchema);