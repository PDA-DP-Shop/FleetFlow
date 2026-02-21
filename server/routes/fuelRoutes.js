const express = require('express');
const router = express.Router();
const { getFuelLogs, addFuelLog, deleteFuelLog } = require('../controllers/fuelController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', authorizeRole('Manager', 'Finance', 'CEO'), getFuelLogs);
router.post('/', authorizeRole('Manager', 'Finance', 'Dispatcher', 'CEO'), addFuelLog);
router.delete('/:id', authorizeRole('Manager', 'Finance', 'CEO'), deleteFuelLog);

module.exports = router;
