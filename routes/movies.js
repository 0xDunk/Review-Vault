const express = require("express");
const db = require("../config/db");

const router = express.Router();

// POST /api/movies — إضافة فيلم جديد
router.post("/", async function(req, res) {
    try {
        var title = (req.body.title || "").trim();
        var description = (req.body.description || "").trim();
        var type = (req.body.type || "").trim();
        var genre = (req.body.genre || "").trim();
        var year = (req.body.year || "").trim();
        var duration = (req.body.duration || "").trim();
        var rating = parseFloat(req.body.rating) || 0;
        var image = (req.body.image || "").trim();

        // تحقق
        if (!title) {
            return res.json({ success: false, message: "Title is required" });
        }

        if (!type) {
            return res.json({ success: false, message: "Type is required" });
        }

        var validTypes = ["Movie", "Series", "Anime"];
        if (validTypes.indexOf(type) === -1) {
            return res.json({ success: false, message: "Type must be Movie, Series, or Anime" });
        }

        if (rating < 0 || rating > 10) {
            return res.json({ success: false, message: "Rating must be between 0 and 10" });
        }

        await db.query(
            "INSERT INTO movies (title, description, type, genre, year, duration, rating, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [title, description, type, genre, year, duration, rating, image]
        );

        res.json({ success: true, message: "Movie added successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server error" });
    }
});

// GET /api/movies — جلب كل الأفلام
router.get("/", async function(req, res) {
    try {
        var movies = await db.query("SELECT * FROM movies ORDER BY created_at DESC");
        res.json({ success: true, movies: movies });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server error" });
    }
});

module.exports = router;