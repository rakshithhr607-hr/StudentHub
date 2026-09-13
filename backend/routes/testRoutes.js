const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Protected test route
router.get("/protected", protect, (req, res) => {
    res.json({
        message: "You have access to the protected route!",
        userId: req.userId
    });
});

module.exports = router;