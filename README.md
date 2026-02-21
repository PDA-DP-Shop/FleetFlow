# FleetFlow - Logistics Management System 🏎️📊🦾

FleetFlow is a state-of-the-art modular Logistics and Fleet Management Platform designed for real-time tracking, financial oversight, and operational efficiency. It provides enterprise-level tools for managers and dispatchers to maintain full control over their fleet assets, driver staff, and financial health.

## 🚀 Key Features

- **Command Center (Dashboard)**: At-a-glance fleet oversight with real-time KPIs, active fleet status, and recent trip tracking.
- **Analytics & ROI**: Detailed performance metrics including total revenue, operating costs, net profit, and ROI calculations with visual data charts.
- **Fleet Registry**: Complete asset management for physical vehicles, tracking license plates, capacity, odometer readings, and status.
- **Driver Staff Management**: Manage driver records, track license compliance, and safety scores.
- **Trip Dispatcher**: efficient workflow for moving goods, assigning vehicles and drivers, and tracking trip lifecycles.
- **Maintenance Logs**: Track vehicle repairs, service history, and "In Shop" status to prevent faulty dispatches.
- **Finance (Fuel & Expenses)**: Log fuel refills, tolls, and miscellaneous costs with direct linkage to specific trips.
- **Professional PDF Export**: Generate print-ready, high-contrast PDF reports for all major modules (Dashboard, Finance, Analytics, etc.) with custom company branding and digital signatures.
- **Real-time Synchronization**: Powered by Socket.io for instant updates across the platform when fleet or trip status changes.

## 🛠️ Technology Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion (Animations), Recharts (Data Viz)
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Real-time**: Socket.io
- **Styling**: Vanilla CSS + Tailwind CSS

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v16.x or higher)
- MySQL Server
- npm or yarn

### 1. Database Setup

Create a MySQL database and run the schema provided in `server/db_schema.sql`.

### 2. Server Configuration

```bash
cd server
npm install
# Configure your .env file with DATABASE_URL and JWT_SECRET
npm run dev
```

### 3. Client Configuration

```bash
cd client
npm install
npm run dev
```

## 🔐 Credentials & Workflow

### Initial Setup

1. **CEO Account**:
   - **Email**: `FleetFlow@gmail.com`
   - **Password**: `FleetFlow@admin`
2. **Manager Onboarding**:
   - Go to `/signup` and create a Manager account.
   - Log in as the CEO to approve the Manager request in the 'Approvals & Requests' section.
   - Once approved, the Manager can access the Command Center.

## 📄 Reporting & Documentation

The system supports professional PDF exporting. Click the **"Export PDF"** button on any dashboard to generate clean, A4-optimized reports for stakeholder meetings or record-keeping.

---

_Built for Advanced Agentic Coding by Antigravity_
