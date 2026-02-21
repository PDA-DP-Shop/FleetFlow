const express = require('express');
const router = express.Router();
const { getMaintenanceLogs, addMaintenanceLog, completeMaintenance, deleteMaintenanceLog } = require('../controllers/maintenanceController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getMaintenanceLogs);
router.post('/', authorizeRole('Manager', 'Dispatcher', 'CEO'), addMaintenanceLog);
router.put('/:vehicle_id/complete', authorizeRole('Manager', 'Dispatcher', 'CEO'), completeMaintenance);
router.delete('/:id', authorizeRole('Manager', 'Dispatcher', 'CEO'), deleteMaintenanceLog);

module.exports = router;
