from odoo import models, fields, api, exceptions

class FleetVehicleLogServices(models.Model):
    _inherit = 'fleet.vehicle.log.services'

    @api.model
    def create(self, vals):
        service = super(FleetVehicleLogServices, self).create(vals)
        if service.vehicle_id:
            service.vehicle_id.current_status = 'in_shop'
        return service

    def write(self, vals):
        res = super(FleetVehicleLogServices, self).write(vals)
        for service in self:
            # If the repair state changes to 'done' (or similar logic), we can restore the status
            if service.state == 'done' and service.vehicle_id.current_status == 'in_shop':
                service.vehicle_id.current_status = 'available'
        return res
