const express = require('express');
const router = express.Router();
const { getDrivers, addDriver, updateDriver, deleteDriver } = require('../controllers/driverController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getDrivers);
// Only Manager, Dispatcher, Safety Officer, and CEO can modify drivers
router.post('/', authorizeRole('Manager', 'Dispatcher', 'Safety Officer', 'CEO'), addDriver);
router.put('/:id', authorizeRole('Manager', 'Dispatcher', 'Safety Officer', 'CEO'), updateDriver);
router.delete('/:id', authorizeRole('Manager', 'Safety Officer', 'CEO'), deleteDriver);

module.exports = router;
