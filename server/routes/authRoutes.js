const express = require('express');
const router = express.Router();
const { login, signup, getMe, getUsers } = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Public routes
router.post('/login', login);
router.post('/signup', signup);

// Private routes
router.get('/me', authenticateToken, getMe);
router.get('/users', authenticateToken, authorizeRole('CEO', 'Manager'), getUsers);

module.exports = router;
