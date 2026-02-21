const db = require('../config/db');

// @route   GET /api/vehicles
// @desc    Get all vehicles
const getVehicles = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM vehicles ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST /api/vehicles
// @desc    Add a new vehicle
const addVehicle = async (req, res) => {
    const { license_plate, max_capacity, odometer, acquisition_cost, region, status } = req.body;

    // Check role? In middleware we can do authorizeRole('Manager', 'Dispatcher')
    try {
        const newVehicle = await db.query(
            'INSERT INTO vehicles (license_plate, max_capacity, odometer, acquisition_cost, region, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [license_plate, max_capacity, odometer || 0, acquisition_cost, region, status || 'Available']
        );
        res.status(201).json(newVehicle.rows[0]);
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'License plate already exists' });
        }
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/vehicles/:id
// @desc    Update vehicle
const updateVehicle = async (req, res) => {
    const { id } = req.params;
    const { license_plate, max_capacity, odometer, acquisition_cost, region, status } = req.body;

    try {
        const result = await db.query(
            'UPDATE vehicles SET license_plate = $1, max_capacity = $2, odometer = $3, acquisition_cost = $4, region = $5, status = $6 WHERE id = $7 RETURNING *',
            [license_plate, max_capacity, odometer, acquisition_cost, region, status, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/vehicles/:id
// @desc    Delete a vehicle
const deleteVehicle = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle
};
