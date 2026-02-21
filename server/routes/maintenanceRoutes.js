const express = require('express');
const router = express.Router();
const { getMaintenanceLogs, addMaintenanceLog, completeMaintenance } = require('../controllers/maintenanceController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getMaintenanceLogs);
router.post('/', authorizeRole('Manager', 'Dispatcher'), addMaintenanceLog);
router.put('/:vehicle_id/complete', authorizeRole('Manager', 'Dispatcher'), completeMaintenance);

module.exports = router;
