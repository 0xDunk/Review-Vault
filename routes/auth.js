const express = require("express");
const bycrypt = require("bcryptjs");
const db = require("../config/db");

const router = express.Router();

// Register route

router.post("/register", async function (req, res)  {
    try {
        var username = (req.body.username || "").trim();
        var email = (req.body.email || "").trim();
        var password = (req.body.password || "").trim();

        if (username.length < 6) {
            return res.json({ success: false, message: "Username must be at least 6 characters long" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }

        var existing = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.json({ success: false, message: "Email already exists" });
        }

        var hashedPassword = await bycrypt.hash(password, 10);
        var role = "viewer"; // Default role for new users
        var result = await db.query("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", [username, email, hashedPassword, role]);

        res.json({ success: true, message: "User registered successfully", user: { id: result.insertId, username: username, role: role } });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "server error" });
    }
});

// Login route

router.post("/login", async function (req, res)  {
    try {
        var email = (req.body.email || "").trim();
        var password = (req.body.password || "").trim();
        
        var users = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.json ({ success: false, message: "Invalid email or password" });
        }

        var user = users[0];

        var isPasswordValid = await bycrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json ({ success: false, message: "Invalid email or password" });
        }

        res.json({ success: true, message: "Login successful", user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "server error" });
    }
});

//logout route

router.post("/logout", async function (req, res)  {
    try {
        // Invalidate the user's session or token here (if applicable)
        res.json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "server error" });
    }
});

module.exports = router;