import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Search, 
  Calendar, 
  Fuel, 
  Receipt, 
  Wallet, 
  ArrowUpRight,
  X,
  Printer,
  FileText,
  CreditCard,
  Navigation
} from "lucide-react";

const Finance = () => {
  const { user } = useAuth();
  const [fuelLogs, setFuelLogs] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleDelete = async (id) => {
    if (window.confirm("Purge this financial entry from the ledger?")) {
      try {
        await axios.delete(`http://localhost:5000/api/fuel/${id}`);
        fetchData();
      } catch (err) {
        alert("Failed to delete log");
      }
    }
  };

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

  const filteredLogs = fuelLogs.filter(log => 
    (log.origin && log.origin.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.destination && log.destination.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.license_plate && log.license_plate.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 pb-12">
      {/* Print Header */}
      <div className="print-header">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo/logo-1.png" alt="FleetFlow" className="w-16 h-16" />
            <div>
              <h1 className="text-2xl font-bold text-black uppercase italic">Expense Ledger</h1>
              <p className="text-sm text-slate-600">Operations Financial Audit</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-black">Date: {new Date().toLocaleDateString()}</p>
            <p className="text-xs text-slate-500">Authorized: {user?.name}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 no-print">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-brand-rose rounded-full" />
            <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">
              Fuel <span className="text-brand-rose">& Expenses</span>
            </h1>
          </div>
          <p className="text-slate-400 font-medium">Monitor operational costs and fuel resource allocation</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            className="btn-secondary flex items-center gap-2 group flex-1 md:flex-none justify-center"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm">Export</span>
          </button>
          <button 
            className="btn-primary flex items-center gap-2 group flex-1 md:flex-none justify-center bg-linear-to-r from-brand-rose to-red-600 hover:from-red-500 hover:to-red-700 shadow-brand-rose/20 hover:shadow-brand-rose/40" 
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-bold">Log Expenditure</span>
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center no-print">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-rose transition-colors" />
          <input 
            type="text"
            placeholder="Search by trip or vehicle..."
            className="input-field pl-12 focus:ring-brand-rose/50 focus:border-brand-rose/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5">
          {filteredLogs.length} Transaction Entries
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20 text-slate-500 font-black uppercase tracking-[0.2em] text-xs">
          Calculating fiscal logs...
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="table-header">Timestamp</th>
                  <th className="table-header">Operation Instance</th>
                  <th className="table-header text-right">Resource (L)</th>
                  <th className="table-header text-right">Fuel Cost</th>
                  <th className="table-header text-right">Misc Duty</th>
                  <th className="table-header text-right">Total Opex</th>
                  <th className="table-header text-right">Interaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((log, i) => {
                  const total = parseFloat(log.fuel_cost) + parseFloat(log.misc_expense);
                  return (
                    <motion.tr
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={log.id}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 font-bold text-white">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            {new Date(log.log_date).toLocaleDateString()}
                          </div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Registered On</div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {log.trip_id ? (
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <Navigation className="w-5 h-5 text-brand-indigo" />
                            </div>
                            <div>
                              <div className="font-black text-white text-sm tracking-tight italic uppercase">
                                {log.origin} <span className="text-brand-rose">→</span> {log.destination}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                                <CreditCard className="w-3 h-3 text-brand-emerald" /> {log.license_plate} · ID: #{log.trip_id}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-600 font-bold uppercase tracking-widest text-[10px] italic">Independent Entry</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="font-black text-white tabular-nums flex items-center justify-end gap-2">
                           {log.liters} <span className="text-[10px] text-slate-500">L</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="font-black text-brand-rose/80 tabular-nums">₹{parseFloat(log.fuel_cost).toLocaleString()}</div>
                        <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Resource Cost</div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="font-black text-brand-amber/80 tabular-nums">₹{parseFloat(log.misc_expense).toLocaleString()}</div>
                        <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Auxiliary Space</div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="font-black text-white text-base tabular-nums">₹{total.toLocaleString()}</div>
                        <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Aggregate Flow</div>
                      </td>
                      <td className="px-6 py-5 text-right no-print">
                        {(user?.role === "Manager" || user?.role === "CEO") && (
                          <button
                            onClick={() => handleDelete(log.id)}
                            className="p-2 rounded-lg bg-brand-rose/10 text-brand-rose hover:bg-brand-rose hover:text-white transition-all border border-transparent"
                            title="Remove Transaction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            {filteredLogs.length === 0 && (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <Receipt className="w-8 h-8 text-slate-700" />
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Fiscal records are currently sanitized</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Log Expense Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-card p-8 w-full max-w-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-rose/10 blur-3xl rounded-full -mr-16 -mt-16" />
              
              <div className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-rose/10 rounded-xl text-brand-rose">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white italic uppercase">Expense Audit</h2>
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Manual Fiscal Entry</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="label-text">Select Operation Instance (Trip)</label>
                  <div className="relative group">
                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-rose transition-colors" />
                    <select
                      required
                      className="input-field pl-12 appearance-none"
                      value={formData.trip_id}
                      onChange={(e) =>
                        setFormData({ ...formData, trip_id: e.target.value })
                      }
                    >
                      <option value="">-- Choose Trip Context --</option>
                      {trips.map((t) => (
                        <option key={t.id} value={t.id} className="bg-slate-900">
                          TRP-{t.id} ({t.license_plate}) - {t.origin} to {t.destination}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="label-text">Resource Volume (Liters)</label>
                    <div className="relative group">
                      <Fuel className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-rose transition-colors" />
                      <input
                        required
                        type="number"
                        step="0.1"
                        className="input-field pl-12"
                        value={formData.liters}
                        onChange={(e) =>
                          setFormData({ ...formData, liters: e.target.value })
                        }
                        placeholder="45.5"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="label-text">Fuel Opex (₹)</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">₹</div>
                      <input
                        required
                        type="number"
                        step="0.01"
                        className="input-field pl-10"
                        value={formData.fuel_cost}
                        onChange={(e) =>
                          setFormData({ ...formData, fuel_cost: e.target.value })
                        }
                        placeholder="6500.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="label-text">Misc Expenditure (₹)</label>
                    <div className="relative group">
                      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-rose transition-colors" />
                      <input
                        type="number"
                        step="0.01"
                        className="input-field pl-12"
                        value={formData.misc_expense}
                        onChange={(e) =>
                          setFormData({ ...formData, misc_expense: e.target.value })
                        }
                        placeholder="0.00 (Tolls/Taxes)"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="label-text">Fiscal Date</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-rose transition-colors" />
                      <input
                        required
                        type="date"
                        className="input-field pl-12"
                        value={formData.log_date}
                        onChange={(e) =>
                          setFormData({ ...formData, log_date: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button
                    type="button"
                    className="btn-secondary flex-1"
                    onClick={() => setShowModal(false)}
                  >
                    Abort Audit
                  </button>
                  <button type="submit" className="btn-primary flex-1 bg-linear-to-r from-brand-rose to-red-600">
                    Finalize Transaction
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div className="print-footer">
        <p>FleetFlow Enterprise Logistics Platform - Automated Financial Expense Audit - Page 1 of 1</p>
        <p className="text-[8px] mt-1 border-t pt-1 italic opacity-50">Confidential Fiscal Record - Property of FleetFlow Finance Division</p>
      </div>
    </div>
  );
};

export default Finance;
