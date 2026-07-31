const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/review');
const uploadRoutes = require('./routes/upload');
const moviesRoutes = require('./routes/movies');


const app = express();
const PORT = process.env.PORT || 3000;
const frontendPath = path.join(__dirname, '..', 'Frontend');

app.use(express.json());
app.use(cors());
app.use(express.static(frontendPath));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/movies', moviesRoutes);

// صور مرفوعة متاحة للفرونت
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// الصفحة الرئيسية
app.get('/', function(req, res) {
    res.sendFile(path.join(frontendPath, 'home.html'));
});

// معالج أخطاء عام: أي خطأ يهرب من أي route (زي multer) يرجع JSON مش HTML
app.use(function(err, req, res, next) {
    console.error(err);
    res.status(400).json({
        success: false,
        message: err.message || 'Something went wrong'
    });
});

app.listen(PORT, function() {
    console.log('Server running on http://localhost:' + PORT);
});