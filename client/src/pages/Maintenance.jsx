import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wrench, 
  Trash2, 
  CheckCircle2, 
  Search, 

  AlertTriangle,
  Calendar,
  IndianRupee,
  Plus,
  X,
  Printer,
  FileText,
  Truck,
  ClipboardList,
  History,
  Activity
} from "lucide-react";

const Maintenance = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleDelete = async (id) => {
    if (window.confirm("Purge this maintenance record from the history?")) {
      try {
        await axios.delete(`http://localhost:5000/api/maintenance/${id}`);
        fetchData();
      } catch (err) {
        alert("Failed to delete record");
      }
    }
  };

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
  
  const filteredLogs = logs.filter(log => 
    log.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.issue_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 pb-12">
      {/* Print Header */}
      <div className="print-header">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo/logo-1.png" alt="FleetFlow" className="w-16 h-16" />
            <div>
              <h1 className="text-2xl font-bold text-black uppercase italic">Service Registry</h1>
              <p className="text-sm text-slate-600">Vehicular Compliance & Repair Audit</p>
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
            <div className="w-2 h-8 bg-brand-amber rounded-full" />
            <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">
              Service <span className="text-brand-amber">Registry</span>
            </h1>
          </div>
          <p className="text-slate-400 font-medium">Coordinate repairs and maintain fleet operational readiness</p>
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
            className="btn-primary flex items-center gap-2 group flex-1 md:flex-none justify-center bg-linear-to-r from-brand-amber to-amber-600 hover:from-amber-500 hover:to-amber-700 shadow-brand-amber/20 hover:shadow-brand-amber/40" 
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-bold">New Service Record</span>
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center no-print">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-amber transition-colors" />
          <input 
            type="text"
            placeholder="Search by plate or service type..."
            className="input-field pl-12 focus:ring-brand-amber/50 focus:border-brand-amber/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5">
          {filteredLogs.length} Maintenance Cycles Tracked
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20 text-slate-500 font-black uppercase tracking-[0.2em] text-xs">
          Scanning vehicle diagnostics...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Active In-Shop Vehicles Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="flex items-center gap-3 px-2">
              <Activity className="w-5 h-5 text-brand-amber animate-pulse" />
              <h2 className="text-lg font-black text-white italic uppercase">Bays Occupied</h2>
              <span className="ml-auto bg-brand-amber/20 text-brand-amber text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-amber/30">
                {inShopVehicles.length}
              </span>
            </div>
            
            <div className="space-y-4">
              {inShopVehicles.length === 0 ? (
                <div className="glass-card p-8 text-center border-dashed border-white/5">
                  <CheckCircle2 className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">All Units Operational</p>
                </div>
              ) : (
                inShopVehicles.map((v) => (
                  <motion.div
                    key={v.id}
                    layoutId={`vehicle-${v.id}`}
                    className="glass-card p-5 border-l-4 border-l-brand-amber group hover:bg-white/[0.05] transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-black text-white text-lg tracking-tight italic uppercase group-hover:text-brand-amber transition-colors">{v.license_plate}</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Repair Bay</p>
                      </div>
                      <div className="p-2 bg-brand-amber/10 rounded-lg text-brand-amber">
                        <Wrench className="w-4 h-4" />
                      </div>
                    </div>
                    <button
                      onClick={() => markComplete(v.id)}
                      className="w-full flex items-center justify-center gap-2 bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald hover:text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-brand-emerald/20 hover:border-transparent group/btn"
                    >
                      <CheckCircle2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      Restore to Duty
                    </button>
                  </motion.div>
                ))
              )}
            </div>
            
            <div className="glass-card p-5 bg-linear-to-br from-white/[0.03] to-white/[0.01]">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Service Statistics</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                        <span className="text-slate-400">Avg. Repair Time</span>
                        <span className="text-white tracking-widest">3.2 Days</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-amber w-[65%]" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                        <span className="text-slate-400">Shop Efficiency</span>
                        <span className="text-white tracking-widest">92%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-emerald w-[92%]" />
                    </div>
                </div>
            </div>
          </motion.div>

          {/* Maintenance History Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 glass-card overflow-hidden h-fit"
          >
            <div className="flex items-center gap-3 p-6 border-b border-white/5">
              <History className="w-5 h-5 text-slate-500" />
              <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Service Log History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="table-header">Date</th>
                    <th className="table-header">Unit Identification</th>
                    <th className="table-header">Protocol Type</th>
                    <th className="table-header">Work Order Summary</th>
                    <th className="table-header text-right">Opex (₹)</th>
                    <th className="table-header text-right">Directives</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLogs.map((log, i) => (
                    <motion.tr
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={log.id}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-xs">{new Date(log.service_date).toLocaleDateString()}</span>
                            <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Audit Stamp</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-brand-amber border border-white/10 group-hover:scale-110 transition-transform">
                                <Truck className="w-4 h-4" />
                            </div>
                            <span className="font-black text-white text-sm tracking-tight italic uppercase underline decoration-brand-amber/30 underline-offset-4">{log.license_plate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md border border-white/5 group-hover:bg-brand-amber/10 group-hover:text-brand-amber transition-colors">
                          {log.issue_type}
                        </span>
                      </td>
                      <td
                        className="px-6 py-5 text-slate-400 text-xs italic max-w-xs truncate"
                        title={log.description}
                      >
                        {log.description || <span className="text-slate-700 not-italic">NO DATA</span>}
                      </td>
                      <td className="px-6 py-5 text-right flex flex-col items-end">
                        <span className="font-black text-brand-rose tabular-nums text-sm group-hover:scale-105 transition-transform origin-right">
                            ₹{Number(log.cost).toLocaleString()}
                        </span>
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Maintenance Burn</span>
                      </td>
                      <td className="px-6 py-5 text-right no-print">
                        {(user?.role === "Manager" || user?.role === "CEO") && (
                          <button
                            onClick={() => handleDelete(log.id)}
                            className="p-2 rounded-lg bg-brand-rose/10 text-brand-rose hover:bg-brand-rose hover:text-white transition-all border border-transparent shadow-lg shadow-brand-rose/5"
                            title="Purge Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredLogs.length === 0 && (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <ClipboardList className="w-8 h-8 text-slate-700" />
                  </div>
                  <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">No personnel actions found in database</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Maintenance Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-card p-8 w-full max-w-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/10 blur-3xl rounded-full -mr-16 -mt-16" />
              
              <div className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-amber/10 rounded-xl text-brand-amber">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white italic uppercase">Vehicle Triage</h2>
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Maintenance Admission Log</p>
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
                  <label className="label-text">Admit Unit (Vehicle Selection)</label>
                  <div className="relative group">
                    <Truck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-amber transition-colors" />
                    <select
                      required
                      className="input-field pl-12 appearance-none"
                      value={formData.vehicle_id}
                      onChange={(e) =>
                        setFormData({ ...formData, vehicle_id: e.target.value })
                      }
                    >
                      <option value="">-- Choose Unit --</option>
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id} className="bg-slate-900">
                          {v.license_plate} — Status: {v.status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="label-text">Protocol / Issue Definition</label>
                  <div className="relative group">
                    <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-amber transition-colors" />
                    <input
                      required
                      type="text"
                      className="input-field pl-12"
                      value={formData.issue_type}
                      onChange={(e) =>
                        setFormData({ ...formData, issue_type: e.target.value })
                      }
                      placeholder="e.g. Drivetrain Recalibration, Fluid Exchange"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="label-text">Work Directive Summary</label>
                  <textarea
                    className="input-field min-h-[100px] resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Log technical specifics and structural observations..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="label-text">Service Expenditure (₹)</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">₹</div>
                      <input
                        required
                        type="number"
                        step="0.01"
                        className="input-field pl-10"
                        value={formData.cost}
                        onChange={(e) =>
                          setFormData({ ...formData, cost: e.target.value })
                        }
                        placeholder="1500.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="label-text">Admission Date</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-amber transition-colors" />
                      <input
                        required
                        type="date"
                        className="input-field pl-12"
                        value={formData.service_date}
                        onChange={(e) =>
                          setFormData({ ...formData, service_date: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-brand-amber/10 border border-brand-amber/20 p-4 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand-amber" />
                  <AlertTriangle className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" />
                  <p className="text-[10px] text-brand-amber font-bold leading-relaxed uppercase tracking-widest">
                    SYSTEM OVERRIDE: SUBMITTING THIS RECORD WILL IMMEDIATELY CLASSIFY UNIT AS "IN SHOP". ALL PENDING DISPATCHES WILL BE RESTRICTED.
                  </p>
                </div>

                <div className="flex gap-4 mt-10">
                  <button
                    type="button"
                    className="btn-secondary flex-1"
                    onClick={() => setShowModal(false)}
                  >
                    Abort Admission
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 bg-linear-to-r from-brand-amber to-amber-600 shadow-brand-amber/20"
                  >
                    Finalize Admission
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div className="print-footer">
        <p>FleetFlow Enterprise Logistics Platform - Maintenance Diagnostics Registry - Page 1 of 1</p>
        <p className="text-[8px] mt-1 border-t pt-1 italic opacity-50">Operational Continuity Protocol - Restricted Service Hierarchy</p>
      </div>
    </div>
  );
};

export default Maintenance;
