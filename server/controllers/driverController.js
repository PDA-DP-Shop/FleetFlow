const db = require('../config/db');

// @route   GET /api/drivers
// @desc    Get all drivers
const getDrivers = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM drivers ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST /api/drivers
// @desc    Add a new driver
const addDriver = async (req, res) => {
    const { name, license_number, license_expiry, status, safety_score, complaints } = req.body;

    try {
        const newDriver = await db.query(
            'INSERT INTO drivers (name, license_number, license_expiry, status, safety_score, complaints) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, license_number, license_expiry, status || 'On Duty', safety_score || 100, complaints || 0]
        );
        res.status(201).json(newDriver.rows[0]);
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') {
            return res.status(400).json({ error: 'License number already exists' });
        }
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/drivers/:id
// @desc    Update driver
const updateDriver = async (req, res) => {
    const { id } = req.params;
    const { name, license_number, license_expiry, status, safety_score, complaints } = req.body;

    try {
        const result = await db.query(
            'UPDATE drivers SET name = $1, license_number = $2, license_expiry = $3, status = $4, safety_score = $5, complaints = $6 WHERE id = $7 RETURNING *',
            [name, license_number, license_expiry, status, safety_score, complaints, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/drivers/:id
// @desc    Delete a driver
const deleteDriver = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM drivers WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        res.json({ message: 'Driver removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getDrivers,
    addDriver,
    updateDriver,
    deleteDriver
};
