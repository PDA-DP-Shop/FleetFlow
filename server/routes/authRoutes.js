const express = require('express');
const router = express.Router();
const { login, signup, getMe } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/login', login);
router.post('/signup', signup);

// Private route -> Get current user
router.get('/me', authenticateToken, getMe);

module.exports = router;
