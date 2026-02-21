const db = require('../config/db');

// @route   GET /api/maintenance
// @desc    Get all maintenance logs
const getMaintenanceLogs = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT m.*, v.license_plate 
            FROM maintenance m
            LEFT JOIN vehicles v ON m.vehicle_id = v.id
            ORDER BY m.service_date DESC, m.id DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST /api/maintenance
// @desc    Add maintenance log & update vehicle
const addMaintenanceLog = async (req, res) => {
    const { vehicle_id, issue_type, description, cost, service_date } = req.body;

    try {
        await db.query('BEGIN');

        const newLog = await db.query(
            'INSERT INTO maintenance (vehicle_id, issue_type, description, cost, service_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [vehicle_id, issue_type, description, cost, service_date]
        );

        // Auto Logic: Update vehicle status to 'In Shop'
        await db.query("UPDATE vehicles SET status = 'In Shop' WHERE id = $1", [vehicle_id]);

        await db.query('COMMIT');
        res.status(201).json(newLog.rows[0]);
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/maintenance/:vehicle_id/complete
// @desc    Mark maintenance complete and set vehicle Available
const completeMaintenance = async (req, res) => {
    const { vehicle_id } = req.params;

    try {
        await db.query("UPDATE vehicles SET status = 'Available' WHERE id = $1", [vehicle_id]);
        res.json({ message: 'Vehicle is now Available' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/maintenance/:id
// @desc    Delete a maintenance log
const deleteMaintenanceLog = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM maintenance WHERE id = $1 RETURNING *', [id]);
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
    getMaintenanceLogs,
    addMaintenanceLog,
    completeMaintenance,
    deleteMaintenanceLog
};
