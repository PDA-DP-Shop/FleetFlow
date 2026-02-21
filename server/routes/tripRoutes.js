const express = require('express');
const router = express.Router();
const { getTrips, addTrip, completeTrip, deleteTrip } = require('../controllers/tripController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getTrips);
router.post('/', authorizeRole('Manager', 'Dispatcher', 'CEO'), addTrip);
router.put('/:id/complete', authorizeRole('Manager', 'Dispatcher', 'CEO'), completeTrip);
router.delete('/:id', authorizeRole('Manager', 'Dispatcher', 'CEO'), deleteTrip);

module.exports = router;
