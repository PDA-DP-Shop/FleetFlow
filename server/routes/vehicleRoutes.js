const express = require('express');
const router = express.Router();
const { getVehicles, addVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Apply authentication middleware to all vehicle routes
router.use(authenticateToken);

// All roles can view vehicles
router.get('/', getVehicles);

// Only Manager, Dispatcher, and CEO can modify vehicles
router.post('/', authorizeRole('Manager', 'Dispatcher', 'CEO'), addVehicle);
router.put('/:id', authorizeRole('Manager', 'Dispatcher', 'CEO'), updateVehicle);
router.delete('/:id', authorizeRole('Manager', 'Dispatcher', 'CEO'), deleteVehicle);

module.exports = router;
