import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    license_plate: "",
    max_capacity: "",
    acquisition_cost: "",
    region: "",
  });

  const fetchVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/vehicles");
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/vehicles", formData);
      setShowModal(false);
      setFormData({
        license_plate: "",
        max_capacity: "",
        acquisition_cost: "",
        region: "",
      });
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add vehicle");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "Out of Service" ? "Available" : "Out of Service";
    try {
      // Find full vehicle
      const vehicle = vehicles.find((v) => v.id === id);
      await axios.put(`http://localhost:5000/api/vehicles/${id}`, {
        ...vehicle,
        status: newStatus,
      });
      fetchVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Available":
        return "status-available";
      case "On Trip":
        return "status-trip";
      case "In Shop":
        return "status-shop";
      case "Out of Service":
        return "status-out";
      default:
        return "bg-slate-700 text-white";
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Fleet Registry</h1>
          <p className="text-slate-400 mt-1">Manage and track your vehicles</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Vehicle
        </button>
      </div>

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">License Plate</th>
                  <th className="px-6 py-4">Region</th>
                  <th className="px-6 py-4">Capacity (kg)</th>
                  <th className="px-6 py-4">Odometer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {vehicles.map((v, i) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={v.id}
                    className="hover:bg-white/5 transition-colors text-slate-200"
                  >
                    <td className="px-6 py-4 font-medium">{v.license_plate}</td>
                    <td className="px-6 py-4">{v.region || "N/A"}</td>
                    <td className="px-6 py-4 font-mono">
                      {Number(v.max_capacity).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {Number(v.odometer).toLocaleString()} km
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`status-pill ${getStatusClass(v.status)}`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {v.status !== "On Trip" && v.status !== "In Shop" && (
                        <button
                          onClick={() => toggleStatus(v.id, v.status)}
                          className="text-xs hover:text-white text-slate-400 underline transition-colors"
                        >
                          Toggle Out of Service
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {vehicles.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No vehicles found. Add one to get started.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              Add New Vehicle
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-text">License Plate</label>
                <input
                  required
                  type="text"
                  className="input-field"
                  value={formData.license_plate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      license_plate: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g. ABC-1234"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Max Capacity (kg)</label>
                  <input
                    required
                    type="number"
                    className="input-field"
                    value={formData.max_capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, max_capacity: e.target.value })
                    }
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="label-text">Acquisition Cost ($)</label>
                  <input
                    required
                    type="number"
                    className="input-field"
                    value={formData.acquisition_cost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        acquisition_cost: e.target.value,
                      })
                    }
                    placeholder="45000"
                  />
                </div>
              </div>
              <div>
                <label className="label-text">Region</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                  placeholder="North Region"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Vehicle
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
