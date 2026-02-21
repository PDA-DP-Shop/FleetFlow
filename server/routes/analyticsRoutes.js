const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', authorizeRole('Manager', 'Finance', 'CEO'), getAnalytics);

module.exports = router;
