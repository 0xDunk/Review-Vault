const express = require("express");
const db = require("../config/db");

const router = express.Router();

// Get all reviews مع بيانات الفيلم
router.get("/", async function(req, res) {
    try {
        var reviews = await db.query(`
            SELECT reviews.*, users.username, movies.image as movie_image, movies.type as movie_type
            FROM reviews
            JOIN users ON reviews.user_id = users.id
            LEFT JOIN movies ON reviews.movie_title = movies.title
            ORDER BY reviews.created_at DESC
        `);
        res.json({ success: true, reviews: reviews });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server error" });
    }
});

// Post a new review
router.post("/", async function(req, res) {
    try {
        var movietitle = (req.body.movie_title || "").trim();
        var userId = req.body.user_id;
        var description = (req.body.description || "").trim();

        if (!movietitle || !description) {
            return res.json({ success: false, message: "Please fill all fields correctly" });
        }

        if (!userId) {
            return res.json({ success: false, message: "You must be logged in" });
        }

        await db.query(
            "INSERT INTO reviews (movie_title, user_id, description) VALUES (?, ?, ?)",
            [movietitle, userId, description]
        );

        res.json({ success: true, message: "Review published" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server error" });
    }
});

module.exports = router;