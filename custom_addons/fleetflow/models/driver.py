from odoo import models, fields, api, exceptions
from datetime import date

class HrEmployeeExtended(models.Model):
    _inherit = 'hr.employee'

    license_expiry_date = fields.Date(string="License Expiry Date", tracking=True)
    duty_status = fields.Selection([
        ('on_duty', 'On Duty'),
        ('off_duty', 'Off Duty'),
        ('suspended', 'Suspended'),
        ('unassigned', 'Available'), # Usually Off Duty or Available
    ], string="Duty Status", default='unassigned', tracking=True)
    
    trip_completion_rate = fields.Float(string="Completed Trips Rate (%)", compute="_compute_safety_metrics")
    safety_score = fields.Float(string="Safety Score", compute="_compute_safety_metrics")

    # In actual deployment, these should compute from related Trip models/metrics
    @api.depends('duty_status')
    def _compute_safety_metrics(self):
        for rec in self:
            rec.trip_completion_rate = 100.0  # Placeholder 
            rec.safety_score = 95.0           # Placeholder
