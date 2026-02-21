import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Maintenance = () => {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    vehicle_id: "",
    issue_type: "",
    description: "",
    cost: "",
    service_date: new Date().toISOString().split("T")[0],
  });

  const fetchData = async () => {
    try {
      const [mRes, vRes] = await Promise.all([
        axios.get("http://localhost:5000/api/maintenance"),
        axios.get("http://localhost:5000/api/vehicles"),
      ]);
      setLogs(mRes.data);
      setVehicles(vRes.data);
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
    try {
      await axios.post("http://localhost:5000/api/maintenance", formData);
      setShowModal(false);
      setFormData({
        vehicle_id: "",
        issue_type: "",
        description: "",
        cost: "",
        service_date: new Date().toISOString().split("T")[0],
      });
      fetchData();
    } catch (err) {
      alert("Failed to add maintenance log");
    }
  };

  const markComplete = async (vehicle_id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/maintenance/${vehicle_id}/complete`,
      );
      fetchData();
    } catch (err) {
      alert("Failed to update vehicle status");
    }
  };

  const inShopVehicles = vehicles.filter((v) => v.status === "In Shop");

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Maintenance Logs</h1>
          <p className="text-slate-400 mt-1">
            Track vehicle repairs and service history
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Service Record
        </button>
      </div>

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Active In-Shop Vehicles */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            <h2 className="text-xl font-bold text-white mb-4">
              Currently In Shop
            </h2>
            {inShopVehicles.length === 0 ? (
              <div className="glass-card p-6 text-center text-slate-500">
                No vehicles in shop.
              </div>
            ) : (
              inShopVehicles.map((v) => (
                <div
                  key={v.id}
                  className="glass-card p-4 border-l-4 border-l-brand-amber"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-white">{v.license_plate}</h3>
                    <span className="status-pill status-shop text-[10px] px-2 py-0.5">
                      In Shop
                    </span>
                  </div>
                  <button
                    onClick={() => markComplete(v.id)}
                    className="w-full mt-3 bg-brand-emerald/20 text-brand-emerald hover:bg-brand-emerald hover:text-white py-2 rounded text-sm transition-colors"
                  >
                    Mark Service Complete
                  </button>
                </div>
              ))
            )}
          </motion.div>

          {/* Maintenance History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 glass-card overflow-hidden"
          >
            <h2 className="text-xl font-bold text-white p-6 border-b border-white/10">
              Service History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-300 uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Issue Type</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {logs.map((log, i) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={log.id}
                      className="hover:bg-white/5 transition-colors text-slate-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(log.service_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {log.license_plate}
                      </td>
                      <td className="px-6 py-4">{log.issue_type}</td>
                      <td
                        className="px-6 py-4 text-slate-400 max-w-xs truncate"
                        title={log.description}
                      >
                        {log.description || "-"}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-brand-rose">
                        ${Number(log.cost).toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {logs.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  No maintenance records found.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Maintenance Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              Log Service Record
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-text">Select Vehicle</label>
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
                      {v.license_plate} ({v.status})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text">Issue / Service Type</label>
                <input
                  required
                  type="text"
                  className="input-field"
                  value={formData.issue_type}
                  onChange={(e) =>
                    setFormData({ ...formData, issue_type: e.target.value })
                  }
                  placeholder="e.g. Oil Change, Brake Replacement"
                />
              </div>
              <div>
                <label className="label-text">Description</label>
                <textarea
                  className="input-field min-h-[80px]"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Details of the work done..."
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Cost ($)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: e.target.value })
                    }
                    placeholder="150.00"
                  />
                </div>
                <div>
                  <label className="label-text">Date</label>
                  <input
                    required
                    type="date"
                    className="input-field"
                    value={formData.service_date}
                    onChange={(e) =>
                      setFormData({ ...formData, service_date: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="bg-brand-amber/10 border border-brand-amber/20 p-3 rounded-lg text-xs text-brand-amber mt-2">
                * Note: Saving this will automatically mark the vehicle as "In
                Shop" and prevent it from being dispatched until marked ready.
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary bg-brand-amber hover:bg-amber-600 text-white"
                >
                  Log Maintenance
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
