const express = require("express");
const Subject = require("../models/Subject");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE SUBJECT
router.post("/", protect, async (req, res) => {
    try {
        const { name, faculty, code } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Subject name is required"
            });
        }

        const existingSubject = await Subject.findOne({
            name: name.trim(),
            user: req.userId
        });

        if (existingSubject) {
            return res.status(409).json({
                message: "This subject already exists"
            });
        }

        const subject = await Subject.create({
            name,
            faculty,
            code,
            user: req.userId
        });

        res.status(201).json({
            message: "Subject created successfully",
            subject
        });

    } catch (error) {
        console.error("Create subject error:", error);

        res.status(500).json({
            message: "Server error while creating subject"
        });
    }
});


// GET ALL SUBJECTS + TASK STATISTICS
router.get("/", protect, async (req, res) => {
    try {
        const subjects = await Subject.find({
            user: req.userId
        }).sort({ name: 1 });

        const subjectsWithStats = await Promise.all(
            subjects.map(async (subject) => {

                const totalTasks = await Task.countDocuments({
                    user: req.userId,
                    subject: subject.name
                });

                const completedTasks = await Task.countDocuments({
                    user: req.userId,
                    subject: subject.name,
                    status: "Done"
                });

                return {
                    ...subject.toObject(),
                    totalTasks,
                    completedTasks
                };
            })
        );

        res.status(200).json({
            count: subjectsWithStats.length,
            subjects: subjectsWithStats
        });

    } catch (error) {
        console.error("Get subjects error:", error);

        res.status(500).json({
            message: "Server error while fetching subjects"
        });
    }
});


// DELETE SUBJECT
router.delete("/:id", protect, async (req, res) => {
    try {
        const subject = await Subject.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        res.status(200).json({
            message: "Subject deleted successfully"
        });

    } catch (error) {
        console.error("Delete subject error:", error);

        res.status(500).json({
            message: "Server error while deleting subject"
        });
    }
});


module.exports = router;