const express = require('express');
const router = express.Router();
const { getFuelLogs, addFuelLog } = require('../controllers/fuelController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', authorizeRole('Manager', 'Finance'), getFuelLogs);
router.post('/', authorizeRole('Manager', 'Finance', 'Dispatcher'), addFuelLog);

module.exports = router;
