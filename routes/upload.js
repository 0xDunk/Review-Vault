const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// مكان حفظ الصور
var uploadDir = path.join(__dirname, '..', 'uploads');

// لو المجلد مش موجود اعمله
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// إعدادات multer
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        var ext = path.extname(file.originalname);
        var name = Date.now() + ext;
        cb(null, name);
    }
});

var upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: function(req, file, cb) {
        var allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        var ext = path.extname(file.originalname).toLowerCase();

        if (allowed.indexOf(ext) !== -1) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// POST /api/upload — رفع صورة واحدة
router.post('/', upload.single('image'), function(req, res) {
    if (!req.file) {
        return res.json({ success: false, message: 'No file uploaded' });
    }

    var imagePath = '/uploads/' + req.file.filename;

    res.json({
        success: true,
        message: 'Image uploaded',
        image: imagePath
    });
});

module.exports = router;