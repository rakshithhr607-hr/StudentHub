const express = require("express");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==================== CREATE TASK ====================
router.post("/", protect, async (req, res) => {
    try {
        const {
            title,
            description,
            subject,
            priority,
            status,
            dueDate
        } = req.body;

        if (!title || !dueDate) {
            return res.status(400).json({
                message: "Title and due date are required"
            });
        }

        const task = await Task.create({
            title,
            description,
            subject,
            priority,
            status,
            dueDate,
            user: req.userId
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        console.error("Create task error:", error);

        res.status(500).json({
            message: "Server error while creating task"
        });
    }
});

// ==================== GET ALL TASKS ====================
router.get("/", protect, async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.userId
        }).sort({
            dueDate: 1
        });

        res.status(200).json({
            count: tasks.length,
            tasks
        });

    } catch (error) {
        console.error("Get tasks error:", error);

        res.status(500).json({
            message: "Server error while fetching tasks"
        });
    }
});

// ==================== GET ONE TASK ====================
router.get("/:id", protect, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(task);

    } catch (error) {
        console.error("Get task error:", error);

        res.status(500).json({
            message: "Server error while fetching task"
        });
    }
});

// ==================== UPDATE TASK ====================
router.put("/:id", protect, async (req, res) => {
    try {
        const {
            title,
            description,
            subject,
            priority,
            status,
            dueDate
        } = req.body;

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId
            },
            {
                title,
                description,
                subject,
                priority,
                status,
                dueDate
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        console.error("Update task error:", error);

        res.status(500).json({
            message: "Server error while updating task"
        });
    }
});

// ==================== DELETE TASK ====================
router.delete("/:id", protect, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.error("Delete task error:", error);

        res.status(500).json({
            message: "Server error while deleting task"
        });
    }
});

module.exports = router;