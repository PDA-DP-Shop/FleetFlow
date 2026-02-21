from odoo import models, fields, api, exceptions
from odoo.exceptions import ValidationError
from datetime import date

class FleetTrip(models.Model):
    _name = 'fleetflow.trip'
    _description = 'Fleet Trip Details'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(string='Trip Reference', required=True, copy=False, readonly=True, index=True, default='New')

    vehicle_id = fields.Many2one('fleet.vehicle', string='Assigned Vehicle', required=True, domain=[('current_status', '=', 'available')])
    driver_id = fields.Many2one('hr.employee', string='Assigned Driver', required=True, domain=[('duty_status', 'in', ['unassigned', 'off_duty'])])
    
    cargo_weight = fields.Float(string="Cargo Weight (kg)", required=True)
    revenue = fields.Float(string="Trip Revenue", tracking=True)
    state = fields.Selection([
        ('draft', 'Draft'),
        ('dispatched', 'Dispatched'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ], string='Status', default='draft', track_visibility='onchange')

    start_date = fields.Datetime("Dispatch Date")
    end_date = fields.Datetime("Completion Date")
    final_odometer = fields.Float("Final Odometer")

    @api.model
    def create(self, vals):
        if vals.get('name', 'New') == 'New':
            vals['name'] = self.env['ir.sequence'].next_by_code('fleetflow.trip') or 'New'
        return super(FleetTrip, self).create(vals)

    @api.constrains('cargo_weight', 'vehicle_id')
    def _check_cargo_capacity(self):
        for record in self:
            if record.cargo_weight > record.vehicle_id.max_load_capacity:
                raise ValidationError("Cargo Weight cannot exceed the Max Load Capacity of the assigned vehicle ({} kg).".format(record.vehicle_id.max_load_capacity))

    @api.constrains('driver_id')
    def _check_driver_license(self):
        for record in self:
            if record.driver_id.license_expiry_date and record.driver_id.license_expiry_date < date.today():
                raise ValidationError("Cannot assign a driver with an expired license.")

    def action_dispatch(self):
        for record in self:
            record.state = 'dispatched'
            record.vehicle_id.current_status = 'on_trip'
            record.driver_id.duty_status = 'on_duty'
            record.start_date = fields.Datetime.now()
            
    def action_complete(self):
        for record in self:
            record.state = 'completed'
            record.vehicle_id.current_status = 'available'
            record.driver_id.duty_status = 'unassigned'
            record.end_date = fields.Datetime.now()
            if record.final_odometer:
                # Assuming Odoo Fleet tracks odometers implicitly if linked
                self.env['fleet.vehicle.odometer'].create({
                    'value': record.final_odometer,
                    'vehicle_id': record.vehicle_id.id,
                })

    def action_cancel(self):
        for record in self:
            record.state = 'cancelled'
            if record.vehicle_id.current_status == 'on_trip':
                record.vehicle_id.current_status = 'available'
            if record.driver_id.duty_status == 'on_duty':
                record.driver_id.duty_status = 'unassigned'
