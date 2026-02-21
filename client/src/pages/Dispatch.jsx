import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Dispatch = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    vehicle_id: "",
    driver_id: "",
    cargo_weight: "",
    origin: "",
    destination: "",
    estimated_revenue: "",
  });

  const fetchData = async () => {
    try {
      const [vRes, dRes, tRes] = await Promise.all([
        axios.get("http://localhost:5000/api/vehicles"),
        axios.get("http://localhost:5000/api/drivers"),
        axios.get("http://localhost:5000/api/trips"),
      ]);
      setVehicles(vRes.data.filter((v) => v.status === "Available"));

      // Only On Duty drivers who are not expired
      setDrivers(
        dRes.data.filter(
          (d) =>
            d.status === "On Duty" && new Date(d.license_expiry) >= new Date(),
        ),
      );

      setTrips(tRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend Validation
    const vehicle = vehicles.find(
      (v) => v.id === parseInt(formData.vehicle_id),
    );
    if (vehicle && parseFloat(formData.cargo_weight) > vehicle.max_capacity) {
      alert(
        `Cargo weight exceeds vehicle capacity (${vehicle.max_capacity}kg)`,
      );
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/trips", formData);
      setFormData({
        vehicle_id: "",
        driver_id: "",
        cargo_weight: "",
        origin: "",
        destination: "",
        estimated_revenue: "",
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to dispatch trip");
    }
  };

  const completeTrip = async (id) => {
    if (!confirm("Mark trip as complete?")) return;
    try {
      await axios.put(`http://localhost:5000/api/trips/${id}/complete`);
      fetchData();
    } catch (err) {
      alert("Failed to complete trip");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Trip Dispatcher</h1>
      <p className="text-slate-400 mb-8">
        Assign vehicles, validate cargo, and dispatch trips
      </p>

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Dispatch Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 xl:col-span-1 border-t-4 border-t-brand-indigo"
          >
            <h2 className="text-xl font-bold text-white mb-6">New Dispatch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-text">Select Vehicle (Available)</label>
                <select
                  required
                  className="input-field"
                  value={formData.vehicle_id}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicle_id: e.target.value })
                  }
                >
                  <option value="">-- Choose Vehicle --</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.license_plate} - Cap: {v.max_capacity}kg
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text">
                  Select Driver (Available & Valid)
                </label>
                <select
                  required
                  className="input-field"
                  value={formData.driver_id}
                  onChange={(e) =>
                    setFormData({ ...formData, driver_id: e.target.value })
                  }
                >
                  <option value="">-- Choose Driver --</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} (Score: {d.safety_score})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Origin</label>
                  <input
                    required
                    type="text"
                    className="input-field"
                    value={formData.origin}
                    onChange={(e) =>
                      setFormData({ ...formData, origin: e.target.value })
                    }
                    placeholder="Warehouse A"
                  />
                </div>
                <div>
                  <label className="label-text">Destination</label>
                  <input
                    required
                    type="text"
                    className="input-field"
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData({ ...formData, destination: e.target.value })
                    }
                    placeholder="City Mall"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Cargo Weight (kg)</label>
                  <input
                    required
                    type="number"
                    className="input-field"
                    value={formData.cargo_weight}
                    onChange={(e) =>
                      setFormData({ ...formData, cargo_weight: e.target.value })
                    }
                    placeholder="2000"
                  />
                </div>
                <div>
                  <label className="label-text">Est. Revenue (₹)</label>
                  <input
                    required
                    type="number"
                    className="input-field"
                    value={formData.estimated_revenue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimated_revenue: e.target.value,
                      })
                    }
                    placeholder="1500"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full mt-4 py-3">
                Dispatch Trip
              </button>
            </form>
          </motion.div>

          {/* Active Trips Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 xl:col-span-2"
          >
            <h2 className="text-xl font-bold text-white mb-6">Trip Board</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-300 uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Route</th>
                    <th className="px-6 py-4">Assignment</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {trips.map((t, i) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={t.id}
                      className="hover:bg-white/5 transition-colors text-slate-200"
                    >
                      <td className="px-6 py-4 font-mono text-xs">
                        TRP-{t.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium whitespace-nowrap">
                          {t.origin}{" "}
                          <span className="text-brand-indigo px-1">→</span>{" "}
                          {t.destination}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Cargo: {t.cargo_weight}kg
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{t.driver_name}</div>
                        <div className="text-xs text-brand-emerald">
                          {t.license_plate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`status-pill ${t.status === "Completed" ? "status-available" : t.status === "Dispatched" ? "status-trip" : "bg-slate-700"}`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end items-center gap-2">
                        {t.status === "Dispatched" && (
                          <button
                            onClick={() => completeTrip(t.id)}
                            className="text-white bg-brand-emerald/20 hover:bg-brand-emerald hover:text-white px-3 py-1.5 rounded text-xs transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        {(user?.role === "Manager" || user?.role === "CEO") && (
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-brand-rose hover:text-red-400 transition-colors p-1"
                            title="Remove Trip History"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {trips.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  No trips dispatched yet.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dispatch;
