const express = require('express');
const router = express.Router();
const { getVehicles, addVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Apply authentication middleware to all vehicle routes
router.use(authenticateToken);

// All roles can view vehicles
router.get('/', getVehicles);

// Only Manager and Dispatcher can modify vehicles
router.post('/', authorizeRole('Manager', 'Dispatcher'), addVehicle);
router.put('/:id', authorizeRole('Manager', 'Dispatcher'), updateVehicle);
router.delete('/:id', authorizeRole('Manager', 'Dispatcher'), deleteVehicle);

module.exports = router;
