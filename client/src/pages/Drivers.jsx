import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, 
  Trash2, 
  Ban, 
  CheckCircle, 
  Search, 
  User, 
  CreditCard, 
  Calendar,
  X,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Printer,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

const Drivers = () => {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    license_number: "",
    license_expiry: "",
  });

  const fetchDrivers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/drivers");
      setDrivers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Purge this driver from the active duty records?")) {
      try {
        await axios.delete(`http://localhost:5000/api/drivers/${id}`);
        fetchDrivers();
      } catch (err) {
        alert("Failed to delete driver");
      }
    }
  };

  const handleSuspend = async (id, currentStatus) => {
    const newStatus = currentStatus === "Suspended" ? "Off Duty" : "Suspended";
    const driver = drivers.find((d) => d.id === id);
    try {
      await axios.put(`http://localhost:5000/api/drivers/${id}`, {
        ...driver,
        status: newStatus,
      });
      fetchDrivers();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/drivers", formData);
      setShowModal(false);
      setFormData({ name: "", license_number: "", license_expiry: "" });
      fetchDrivers();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add driver");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "On Duty"
        ? "Off Duty"
        : currentStatus === "Off Duty"
          ? "On Duty"
          : currentStatus;
    if (newStatus === currentStatus) return;

    try {
      const driver = drivers.find((d) => d.id === id);
      await axios.put(`http://localhost:5000/api/drivers/${id}`, {
        ...driver,
        status: newStatus,
      });
      fetchDrivers();
    } catch (err) {
      console.error(err);
    }
  };

  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.license_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 pb-12">
      {/* Print Header */}
      <div className="print-header">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo/logo-1.png" alt="FleetFlow" className="w-16 h-16" />
            <div>
              <h1 className="text-2xl font-bold text-black uppercase italic">Staff Registry</h1>
              <p className="text-sm text-slate-600">Personnel Compliance Report</p>
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
            <div className="w-2 h-8 bg-brand-emerald rounded-full" />
            <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">
              Staff <span className="text-brand-emerald">Registry</span>
            </h1>
          </div>
          <p className="text-slate-400 font-medium">Manage driver credentials and safety compliance</p>
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
            className="btn-primary flex items-center gap-2 group flex-1 md:flex-none justify-center bg-linear-to-r from-brand-emerald to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 shadow-brand-emerald/20 hover:shadow-brand-emerald/40" 
            onClick={() => setShowModal(true)}
          >
            <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-bold">Enlist Driver</span>
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center no-print">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-emerald transition-colors" />
          <input 
            type="text"
            placeholder="Search by name or license..."
            className="input-field pl-12 focus:ring-brand-emerald/50 focus:border-brand-emerald/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5">
          {filteredDrivers.length} Registered Operators
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20 text-slate-500 font-black uppercase tracking-[0.2em] text-xs">
          Accessing personnel files...
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
                  <th className="table-header">Officer Details</th>
                  <th className="table-header text-center">Duty Status</th>
                  <th className="table-header">Credential Integrity</th>
                  <th className="table-header">Safety Index</th>
                  <th className="table-header text-right">Directives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDrivers.map((d, i) => {
                  const expired = isExpired(d.license_expiry);
                  return (
                    <motion.tr
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={d.id}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                            <User className="w-5 h-5 text-brand-emerald" />
                            {d.safety_score > 90 && (
                              <div className="absolute top-0 right-0 w-3 h-3 bg-brand-indigo rounded-bl-lg" />
                            )}
                          </div>
                          <div>
                            <div className="font-black text-white text-lg tracking-tight italic uppercase">{d.name}</div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                              <CreditCard className="w-3 h-3" /> {d.license_number}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`status-pill ${d.status === "On Duty" ? "status-available" : d.status === "On Trip" ? "status-trip" : d.status === "Suspended" ? "status-suspended" : "status-out"}`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5">
                          {expired ? (
                            <div className="flex items-center gap-2 text-brand-rose font-bold text-[10px] uppercase bg-brand-rose/10 px-2 py-1 rounded-md border border-brand-rose/20 w-fit animate-pulse">
                              <Ban className="w-3 h-3" /> License Terminated
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-brand-emerald text-[10px] font-bold uppercase tracking-wider">
                              <CheckCircle className="w-3 h-3" /> Valid til {new Date(d.license_expiry).toLocaleDateString()}
                            </div>
                          )}
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Compliance Check</div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center w-full max-w-[120px]">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</span>
                            <span className={`text-xs font-black ${d.safety_score > 80 ? "text-brand-emerald" : d.safety_score > 50 ? "text-brand-amber" : "text-brand-rose"}`}>
                              {d.safety_score}%
                            </span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-1.5 max-w-[120px] overflow-hidden border border-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${d.safety_score}%` }}
                              className={`h-full rounded-full ${d.safety_score > 80 ? "bg-brand-emerald shadow-[0_0_10px_rgba(16,185,129,0.5)]" : d.safety_score > 50 ? "bg-brand-amber" : "bg-brand-rose"}`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right no-print">
                        <div className="flex justify-end items-center gap-2">
                          {(d.status === "On Duty" || d.status === "Off Duty") && (
                            <button
                              onClick={() => toggleStatus(d.id, d.status)}
                              className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-transparent"
                              title="Toggle Duty"
                            >
                              {d.status === "On Duty" ? <ToggleRight className="w-5 h-5 text-brand-emerald" /> : <ToggleLeft className="w-5 h-5" />}
                            </button>
                          )}
                          {(user?.role === "Manager" || user?.role === "CEO") && (
                            <>
                              {d.status !== "On Trip" && (
                                <button
                                  onClick={() => handleSuspend(d.id, d.status)}
                                  className={`p-2 rounded-lg border border-transparent transition-all ${
                                    d.status === "Suspended" 
                                      ? "bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald/20" 
                                      : "bg-brand-amber/10 text-brand-amber hover:bg-brand-amber"
                                  }`}
                                  title={d.status === "Suspended" ? "Reinstate Agent" : "Suspend Agent"}
                                >
                                  {d.status === "Suspended" ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(d.id)}
                                className="p-2 rounded-lg bg-brand-rose/10 text-brand-rose hover:bg-brand-rose hover:text-white transition-all border border-transparent"
                                title="Remove Credentials"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            {filteredDrivers.length === 0 && (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <Search className="w-8 h-8 text-slate-700" />
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">No personnel records match the query</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Add Driver Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-card p-8 w-full max-w-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-emerald/10 blur-3xl rounded-full -mr-16 -mt-16" />
              
              <div className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-emerald/10 rounded-xl text-brand-emerald">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white italic uppercase">Enlist Personnel</h2>
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">New Operator Onboarding</p>
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
                  <label className="label-text">Officer Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-emerald transition-colors" />
                    <input
                      required
                      type="text"
                      className="input-field pl-12"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Johnathan Silver"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="label-text">Protocol Identification (License #)</label>
                    <div className="relative group">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-emerald transition-colors" />
                      <input
                        required
                        type="text"
                        className="input-field pl-12"
                        value={formData.license_number}
                        onChange={(e) =>
                          setFormData({ ...formData, license_number: e.target.value })
                        }
                        placeholder="DL-XXXXXXXX"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="label-text">Expiry Threshold</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-emerald transition-colors" />
                      <input
                        required
                        type="date"
                        className="input-field pl-12"
                        value={formData.license_expiry}
                        onChange={(e) =>
                          setFormData({ ...formData, license_expiry: e.target.value })
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
                    Abort Onboarding
                  </button>
                  <button type="submit" className="btn-primary flex-1 bg-linear-to-r from-brand-emerald to-emerald-600">
                    Finalize Induction
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div className="print-footer">
        <p>FleetFlow Enterprise Logistics Platform - Operational Staff Registry Audit - Page 1 of 1</p>
        <p className="text-[8px] mt-1 border-t pt-1 italic opacity-50">Confidential Personnel Record - Access Restricted to Command Level</p>
      </div>
    </div>
  );
};

export default Drivers;
