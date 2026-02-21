const db = require('../config/db');

// @route   GET /api/trips
// @desc    Get all trips
const getTrips = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT t.*, v.license_plate, d.name as driver_name 
            FROM trips t
            LEFT JOIN vehicles v ON t.vehicle_id = v.id
            LEFT JOIN drivers d ON t.driver_id = d.id
            ORDER BY t.id DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST /api/trips
// @desc    Create a dispatch trip
const addTrip = async (req, res) => {
    const { vehicle_id, driver_id, cargo_weight, origin, destination, estimated_revenue } = req.body;

    try {
        await db.query('BEGIN');

        // Validations
        const vehicleRes = await db.query('SELECT * FROM vehicles WHERE id = $1', [vehicle_id]);
        if (vehicleRes.rows.length === 0) throw new Error('Vehicle not found');
        const vehicle = vehicleRes.rows[0];

        if (vehicle.status !== 'Available') throw new Error('Vehicle is not available');
        if (cargo_weight > vehicle.max_capacity) throw new Error('Cargo exceeds maximum capacity');

        const driverRes = await db.query('SELECT * FROM drivers WHERE id = $1', [driver_id]);
        if (driverRes.rows.length === 0) throw new Error('Driver not found');
        const driver = driverRes.rows[0];

        if (driver.status !== 'On Duty') throw new Error('Driver is not available');
        if (new Date(driver.license_expiry) < new Date()) throw new Error('Driver license expired');

        // Create Trip
        const tripRes = await db.query(
            'INSERT INTO trips (vehicle_id, driver_id, cargo_weight, origin, destination, estimated_revenue, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [vehicle_id, driver_id, cargo_weight, origin, destination, estimated_revenue, 'Dispatched']
        );

        // Update Vehicle Status
        await db.query("UPDATE vehicles SET status = 'On Trip' WHERE id = $1", [vehicle_id]);

        // Update Driver Status
        await db.query("UPDATE drivers SET status = 'On Trip' WHERE id = $1", [driver_id]);

        await db.query('COMMIT');
        
        const trip = tripRes.rows[0];
        
        // Broadcast Real-time Events
        const io = req.app.get('io');
        if (io) {
            io.emit('trip_updated', trip);
            io.emit('vehicle_updated', { id: vehicle_id, status: 'On Trip' });
            io.emit('driver_updated', { id: driver_id, status: 'On Trip' });
        }

        res.status(201).json(trip);
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err.message);
        res.status(400).json({ error: err.message });
    }
};

// @route   PUT /api/trips/:id/complete
// @desc    Complete a trip
const completeTrip = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('BEGIN');
        
        const tripRes = await db.query('SELECT * FROM trips WHERE id = $1', [id]);
        if (tripRes.rows.length === 0) throw new Error('Trip not found');
        const trip = tripRes.rows[0];

        // Update trip status
        await db.query("UPDATE trips SET status = 'Completed', completed_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);

        // Release Vehicle
        if (trip.vehicle_id) {
            await db.query("UPDATE vehicles SET status = 'Available' WHERE id = $1", [trip.vehicle_id]);
        }

        // Release Driver
        if (trip.driver_id) {
            await db.query("UPDATE drivers SET status = 'On Duty' WHERE id = $1", [trip.driver_id]);
        }

        await db.query('COMMIT');
        
        // Broadcast Real-time Events
        const io = req.app.get('io');
        if (io) {
            io.emit('trip_updated', { ...trip, status: 'Completed' });
            if (trip.vehicle_id) io.emit('vehicle_updated', { id: trip.vehicle_id, status: 'Available' });
            if (trip.driver_id) io.emit('driver_updated', { id: trip.driver_id, status: 'On Duty' });
        }

        res.json({ message: 'Trip completed successfully' });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err.message);
        res.status(400).json({ error: err.message });
    }
};

// @route   DELETE /api/trips/:id
// @desc    Delete a trip
const deleteTrip = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM trips WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        res.json({ message: 'Trip removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getTrips,
    addTrip,
    completeTrip,
    deleteTrip
};
