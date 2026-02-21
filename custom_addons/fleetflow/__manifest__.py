{
    'name': 'FleetFlow',
    'version': '1.0',
    'category': 'Human Resources/Fleet',
    'summary': 'Optimize the lifecycle of a delivery fleet, monitor driver safety, and track financial performance.',
    'description': """
        FleetFlow: Modular Fleet & Logistics Management System
        Objective: To replace inefficient, manual logbooks with a centralized, rule-based digital hub.
    """,
    'author': 'Devansh',
    'depends': ['base', 'fleet', 'hr'],
    'data': [
        'security/ir.model.access.csv',
        'views/trip_views.xml',
        'views/vehicle_views.xml',
        'views/driver_views.xml',
        'views/menu_views.xml',
    ],
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}
