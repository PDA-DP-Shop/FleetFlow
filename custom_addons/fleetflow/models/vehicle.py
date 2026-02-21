from odoo import models, fields, api, exceptions

class FleetVehicleExtended(models.Model):
    _inherit = 'fleet.vehicle'

    max_load_capacity = fields.Float(string="Max Load Capacity (kg)", help="Maximum cargo weight in kilograms", required=True, default=0.0)
    current_status = fields.Selection([
        ('available', 'Available'),
        ('on_trip', 'On Trip'),
        ('in_shop', 'In Shop'),
        ('retired', 'Retired'),
    ], string="Vehicle Status", default='available', tracking=True)
    
    total_maintenance_cost = fields.Float(string="Total Maintenance", compute="_compute_financials")
    total_fuel_cost = fields.Float(string="Total Fuel Cost", compute="_compute_financials")
    total_operational_cost = fields.Float(string="Operational Cost", compute="_compute_financials")
    net_revenue = fields.Float(string="Net Revenue", compute="_compute_financials")
    vehicle_roi = fields.Float(string="Vehicle ROI (%)", compute="_compute_financials")

    def _compute_financials(self):
        for rec in self:
            # Aggregate Maintenance
            services = self.env['fleet.vehicle.log.services'].search([('vehicle_id', '=', rec.id), ('state', '=', 'done')])
            rec.total_maintenance_cost = sum(services.mapped('amount'))
            
            # Aggregate Fuel
            fuels = self.env['fleet.vehicle.log.fuel'].search([('vehicle_id', '=', rec.id)])
            rec.total_fuel_cost = sum(fuels.mapped('amount'))
            
            rec.total_operational_cost = rec.total_maintenance_cost + rec.total_fuel_cost
            
            # Aggregate Revenue
            trips = self.env['fleetflow.trip'].search([('vehicle_id', '=', rec.id), ('state', '=', 'completed')])
            rec.net_revenue = sum(trips.mapped('revenue'))
            
            # Compute ROI
            acquisition = rec.net_value or 1.0 # fallback avoiding division by zero
            rec.vehicle_roi = ((rec.net_revenue - rec.total_operational_cost) / acquisition) * 100.0
