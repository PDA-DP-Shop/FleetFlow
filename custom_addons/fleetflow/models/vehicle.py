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
    
    # Example logic for maintenance
    # To be extended dynamically via 'fleet.vehicle.log.services' later
