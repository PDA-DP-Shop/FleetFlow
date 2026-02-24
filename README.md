# FleetFlow – Enterprise Fleet & Logistics Management System

FleetFlow is a full-stack logistics and fleet management platform designed to provide real-time operational control, financial analytics, and asset tracking for transportation businesses.

It enables organizations to monitor vehicles, manage drivers, dispatch trips, track expenses, calculate ROI, and generate professional reports.

---

## Overview

FleetFlow is built as a modular enterprise-ready SaaS-style system with:

- Real-time synchronization
- Role-based access control
- Financial analytics & ROI tracking
- Maintenance logging
- Trip lifecycle management
- Professional PDF report exporting

This project demonstrates full-stack architecture, real-time communication, database integration, and scalable system design.

---

## Key Features

### Command Center Dashboard
- Real-time KPIs
- Active fleet status
- Revenue & cost overview
- Recent trip monitoring

### Fleet Registry
- Vehicle asset management
- License tracking
- Odometer records
- Capacity & availability status

### Driver Management
- Driver records
- License compliance
- Safety score tracking

### Trip Dispatcher
- Trip creation workflow
- Driver & vehicle assignment
- Trip lifecycle tracking
- Status updates

### Maintenance Logs
- Service history
- Repair tracking
- "In Shop" vehicle control

### Finance Module
- Fuel logs
- Toll & expense tracking
- Trip-linked cost allocation
- Profitability tracking

### Analytics & ROI
- Revenue calculation
- Operating cost monitoring
- Net profit tracking
- ROI visualization (charts)

### Real-Time Updates
- Socket.io synchronization
- Live status updates across users

### Professional PDF Export
- A4 optimized reports
- Dashboard export
- Financial summaries
- Custom branding support

---

## Technology Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- Recharts
- Vanilla CSS

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Real-Time Layer
- Socket.io

---

## Full Project Structure

```
FleetFlow/
│
├── client/                                # React Frontend Application
│   │
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/                    # Reusable UI Components
│   │   │   ├── DashboardCards.jsx
│   │   │   ├── Charts.jsx
│   │   │   ├── Tables.jsx
│   │   │   └── Modals.jsx
│   │   │
│   │   ├── pages/                         # Main Pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Fleet.jsx
│   │   │   ├── Drivers.jsx
│   │   │   ├── Trips.jsx
│   │   │   ├── Maintenance.jsx
│   │   │   ├── Finance.jsx
│   │   │   └── Analytics.jsx
│   │   │
│   │   ├── layouts/                       # Layout wrappers
│   │   ├── context/                       # Global state management
│   │   ├── services/                      # API communication
│   │   ├── utils/                         # Helper utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── config files (Vite / Webpack etc.)
│
├── server/                                # Backend Application
│   │
│   ├── controllers/                       # Business logic handlers
│   ├── routes/                            # API endpoints
│   ├── models/                            # Database models
│   ├── middleware/                        # Authentication & validation
│   ├── socket/                            # Socket.io configuration
│   ├── db_schema.sql                      # MySQL schema
│   ├── app.js / server.js
│   ├── package.json
│   └── .env
│
├── README.md
└── Root configuration files (if any)
```

---

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MySQL Server
- npm or yarn

---

### 1️⃣ Database Setup

Create a MySQL database and execute:

```
server/db_schema.sql
```

---

### 2️⃣ Backend Setup

```
cd server
npm install
```

Create `.env` file:

```
DATABASE_URL=your_mysql_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Frontend Setup

```
cd client
npm install
npm run dev
```

---

## Authentication Workflow

### Default CEO Account

Email:
```
FleetFlow@gmail.com
```

Password:
```
FleetFlow@admin
```

Managers must sign up and be approved by CEO before accessing the system.

---

## System Capabilities Demonstrated

- Full-stack architecture
- RESTful API design
- Real-time communication
- Role-based authorization
- Financial analytics modeling
- Enterprise dashboard design
- Scalable modular structure

---

## Future Enhancements

- GPS integration
- Cloud deployment
- Multi-tenant architecture
- Advanced analytics engine
- SaaS subscription model
- Mobile application version

---

## Developer

Devansh Patel  
Full Stack Developer  
GitHub: https://github.com/PDA-DP-Shop  

---

FleetFlow represents a scalable logistics SaaS architecture built with structured engineering, real-time synchronization, and enterprise-grade operational modeling.

© 2026 FleetFlow. All rights reserved.
