const express = require('express');
const router = express.Router();
const { getDrivers, addDriver, updateDriver, deleteDriver } = require('../controllers/driverController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getDrivers);
// Only Manager, Dispatcher, and Safety Officer can modify drivers
router.post('/', authorizeRole('Manager', 'Dispatcher', 'Safety Officer'), addDriver);
router.put('/:id', authorizeRole('Manager', 'Dispatcher', 'Safety Officer'), updateDriver);
router.delete('/:id', authorizeRole('Manager', 'Safety Officer'), deleteDriver);

module.exports = router;
