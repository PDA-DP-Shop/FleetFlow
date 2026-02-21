const express = require('express');
const router = express.Router();
const { getNotifications, approveUser, deleteUser, markNotificationRead } = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

// All routes here are protected
router.use(authenticateToken);

// Only CEO and Manager can access these routes
router.get('/', getNotifications);
router.put('/approve/:id', approveUser);
router.delete('/user/:id', deleteUser);
router.put('/read/:id', markNotificationRead);

module.exports = router;
