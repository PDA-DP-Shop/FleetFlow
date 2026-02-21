import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";
import { io } from "socket.io-client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [trips, setTrips] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, tripsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/analytics"),
        axios.get("http://localhost:5000/api/trips"),
      ]);
      setStats(analyticsRes.data);
      // Get 5 most recent trips
      setTrips(tripsRes.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Initialize Socket Connection
    const socket = io("http://localhost:5000");

    // Listen for Realtime Events
    socket.on("trip_updated", (updatedTrip) => {
      // Refresh the entire payload to get recalculated KPIs
      // (a bit heavy, but ensures 100% accuracy for the demo)
      fetchDashboardData();
    });

    socket.on("vehicle_updated", () => {
      fetchDashboardData();
    });

    socket.on("driver_updated", () => {
      fetchDashboardData();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getStatusCount = (statusName) => {
    if (!stats?.fleetStatus) return 0;
    const s = stats.fleetStatus.find((s) => s.status === statusName);
    return s ? s.count : 0;
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-brand-indigo to-brand-emerald">
              Command Center
            </h1>
            <p className="text-slate-400 mt-1">
              Welcome back, {user?.name} ({user?.role})
            </p>
          </div>
          <button
            className="btn-secondary"
            onClick={() => window.location.reload()}
          >
            Refresh Data
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-slate-400 text-sm font-medium">Active Fleet</h3>
          <p className="text-3xl font-bold text-white mt-2">
            {getStatusCount("Available") + getStatusCount("On Trip")}
          </p>
          <div className="mt-2 text-xs text-brand-emerald">
            Available + On Trip
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-slate-400 text-sm font-medium">In Maintenance</h3>
          <p className="text-3xl font-bold text-brand-amber mt-2">
            {getStatusCount("In Shop")}
          </p>
          <div className="mt-2 text-xs text-slate-500">Currently in garage</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-slate-400 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold text-white mt-2">
            ${stats?.kpis?.totalRevenue?.toLocaleString() || "0"}
          </p>
          <div className="mt-2 text-xs text-brand-indigo">
            Completed trips only
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 border-brand-emerald/30"
        >
          <h3 className="text-slate-400 text-sm font-medium">Fleet ROI</h3>
          <p className="text-3xl font-bold text-brand-emerald mt-2">
            {stats?.kpis?.fleetROI || "0"}%
          </p>
          <div className="mt-2 text-xs text-slate-500">Revenue vs Costs</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h2 className="text-xl font-bold text-white mb-6">Monthly Revenue</h2>
          <div className="h-72 w-full">
            {stats?.monthlyRevenue ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyRevenue}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      borderColor: "#334155",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#10B981" }}
                  />
                  <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                Loading chart...
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Trips Table limits to small area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Recent Trips</h2>
          <div className="space-y-4">
            {trips.length === 0 ? (
              <p className="text-slate-500 text-sm">No recent trips.</p>
            ) : (
              trips.map((trip) => (
                <div key={trip.id} className="border-b border-white/5 pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-slate-200">
                      {trip.origin} <span className="text-brand-indigo">→</span>{" "}
                      {trip.destination}
                    </div>
                    <div
                      className={`status-pill ${trip.status === "Completed" ? "status-available" : trip.status === "Dispatched" ? "status-trip" : "bg-slate-700 text-slate-300"}`}
                    >
                      {trip.status}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 flex justify-between mt-2">
                    <span>Vehicle: {trip.license_plate}</span>
                    <span>${trip.estimated_revenue}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
