const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, course, year } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            course,
            year
        });

        res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                course: user.course,
                year: user.year
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: error.message || "Server error during registration"
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        console.log("LOGIN REQUEST RECEIVED");

        const { email, password } = req.body;

        console.log("Email received:", email);

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        console.log("User found:", !!user);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        console.log("Stored password exists:", !!user.password);

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        console.log("Password correct:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "JWT_SECRET is missing from backend .env"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                course: user.course,
                year: user.year
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            message: error.message || "Server error during login"
        });
    }
});

module.exports = router;