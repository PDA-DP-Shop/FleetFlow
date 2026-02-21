import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Finance = () => {
  const [fuelLogs, setFuelLogs] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    trip_id: "",
    liters: "",
    fuel_cost: "",
    misc_expense: "",
    log_date: new Date().toISOString().split("T")[0],
  });

  const fetchData = async () => {
    try {
      const [fRes, tRes] = await Promise.all([
        axios.get("http://localhost:5000/api/fuel"),
        axios.get("http://localhost:5000/api/trips"),
      ]);
      setFuelLogs(fRes.data);
      // Get last 50 trips for dropdown to avoid massive list
      setTrips(tRes.data.slice(0, 50));
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
      await axios.post("http://localhost:5000/api/fuel", formData);
      setShowModal(false);
      setFormData({
        trip_id: "",
        liters: "",
        fuel_cost: "",
        misc_expense: "",
        log_date: new Date().toISOString().split("T")[0],
      });
      fetchData();
    } catch (err) {
      alert("Failed to add fuel log");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Fuel & Expenses</h1>
          <p className="text-slate-400 mt-1">
            Log fuel refills and miscellaneous trip costs
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Log Expense
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
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Trip Info</th>
                  <th className="px-6 py-4 text-right">Liters</th>
                  <th className="px-6 py-4 text-right">Fuel Cost</th>
                  <th className="px-6 py-4 text-right">Misc Expense</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {fuelLogs.map((log, i) => {
                  const total =
                    parseFloat(log.fuel_cost) + parseFloat(log.misc_expense);
                  return (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={log.id}
                      className="hover:bg-white/5 transition-colors text-slate-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(log.log_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {log.trip_id ? (
                          <div>
                            <div className="font-medium">
                              TRP-{log.trip_id}: {log.origin} →{" "}
                              {log.destination}
                            </div>
                            <div className="text-xs text-brand-emerald">
                              {log.license_plate}
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-500 italic">
                            No trip associated
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        {log.liters} L
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-brand-rose/80">
                        ${log.fuel_cost}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-brand-amber/80">
                        ${log.misc_expense}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-brand-rose">
                        ${total.toFixed(2)}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            {fuelLogs.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No fuel or expense logs found.
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              Log Fuel / Expense
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-text">Select Associated Trip</label>
                <select
                  required
                  className="input-field"
                  value={formData.trip_id}
                  onChange={(e) =>
                    setFormData({ ...formData, trip_id: e.target.value })
                  }
                >
                  <option value="">-- Choose Trip --</option>
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>
                      TRP-{t.id} ({t.license_plate}) - {t.origin} to{" "}
                      {t.destination}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Liters Pumped</label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    className="input-field"
                    value={formData.liters}
                    onChange={(e) =>
                      setFormData({ ...formData, liters: e.target.value })
                    }
                    placeholder="45.5"
                  />
                </div>
                <div>
                  <label className="label-text">Fuel Cost ($)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={formData.fuel_cost}
                    onChange={(e) =>
                      setFormData({ ...formData, fuel_cost: e.target.value })
                    }
                    placeholder="65.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Misc Expense ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={formData.misc_expense}
                    onChange={(e) =>
                      setFormData({ ...formData, misc_expense: e.target.value })
                    }
                    placeholder="0.00 (Tolls, etc.)"
                  />
                </div>
                <div>
                  <label className="label-text">Date</label>
                  <input
                    required
                    type="date"
                    className="input-field"
                    value={formData.log_date}
                    onChange={(e) =>
                      setFormData({ ...formData, log_date: e.target.value })
                    }
                  />
                </div>
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
                  Save Log
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Finance;
