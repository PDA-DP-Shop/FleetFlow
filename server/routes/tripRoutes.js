const express = require('express');
const router = express.Router();
const { getTrips, addTrip, completeTrip } = require('../controllers/tripController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getTrips);
router.post('/', authorizeRole('Manager', 'Dispatcher'), addTrip);
router.put('/:id/complete', authorizeRole('Manager', 'Dispatcher'), completeTrip);

module.exports = router;
