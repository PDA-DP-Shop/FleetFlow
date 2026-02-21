const db = require('../config/db');

// @route   GET /api/analytics
// @desc    Get dashboard analytics (KPIs, Charts data)
const getAnalytics = async (req, res) => {
    try {
        // 1. Fleet Status Breakdown
        const fleetStatusRes = await db.query(`
            SELECT status, COUNT(*) as count 
            FROM vehicles 
            GROUP BY status
        `);

        // 2. Monthly Revenue vs Costs (Current Year)
        // Since PostgreSQL doesn't have a simple way to combine without complex joins, we do it in parallel
        const tripsRevenue = await db.query(`
            SELECT EXTRACT(MONTH FROM created_at) as month, SUM(estimated_revenue) as revenue
            FROM trips
            WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
            GROUP BY month ORDER BY month
        `);

        // 3. Fuel efficiency & ROI overall logic
        // Total Distance = (we don't have distance column, but we have Revenue & Odometer. We can just simulate distance or use odometer aggregates).
        // Let's calculate total fuel cost, total maintenance cost, total revenue
        const totalRev = await db.query("SELECT SUM(estimated_revenue) as total FROM trips WHERE status='Completed'");
        const totalFuel = await db.query("SELECT SUM(fuel_cost) as total FROM fuel_logs");
        const totalMaint = await db.query("SELECT SUM(cost) as total FROM maintenance");
        const acqCost = await db.query("SELECT SUM(acquisition_cost) as total FROM vehicles");

        const revenue = parseFloat(totalRev.rows[0].total) || 0;
        const fuel = parseFloat(totalFuel.rows[0].total) || 0;
        const maintenance = parseFloat(totalMaint.rows[0].total) || 0;
        const acquisition = parseFloat(acqCost.rows[0].total) || 1; // avoid div by 0

        const roi = ((revenue - (fuel + maintenance)) / acquisition) * 100;

        // Fuel Efficiency: Let's assume some odometer difference. For simplicity, we can just grab total liters and mock distance based on revenue
        const totalLiters = await db.query("SELECT SUM(liters) as total FROM fuel_logs");
        const liters = parseFloat(totalLiters.rows[0].total) || 0;
        
        res.json({
            fleetStatus: fleetStatusRes.rows,
            monthlyRevenue: tripsRevenue.rows,
            kpis: {
                totalRevenue: revenue,
                totalCosts: fuel + maintenance,
                fleetROI: roi.toFixed(2),
                totalLiters: liters
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getAnalytics
};
