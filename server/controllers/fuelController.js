const db = require('../config/db');

// @route   GET /api/fuel
// @desc    Get all fuel and expense logs
const getFuelLogs = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT f.*, t.origin, t.destination, v.license_plate
            FROM fuel_logs f
            LEFT JOIN trips t ON f.trip_id = t.id
            LEFT JOIN vehicles v ON t.vehicle_id = v.id
            ORDER BY f.log_date DESC, f.id DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST /api/fuel
// @desc    Add a fuel/expense log
const addFuelLog = async (req, res) => {
    const { trip_id, liters, fuel_cost, misc_expense, log_date } = req.body;

    try {
        const newLog = await db.query(
            'INSERT INTO fuel_logs (trip_id, liters, fuel_cost, misc_expense, log_date) VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE)) RETURNING *',
            [trip_id, liters, fuel_cost, misc_expense || 0, log_date]
        );
        res.status(201).json(newLog.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/fuel/:id
// @desc    Delete a fuel/expense log
const deleteFuelLog = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM fuel_logs WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Log not found' });
        }
        res.json({ message: 'Log removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getFuelLogs,
    addFuelLog,
    deleteFuelLog
};
