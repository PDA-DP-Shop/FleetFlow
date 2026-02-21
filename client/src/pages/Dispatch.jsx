import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Trash2, 
  CheckCircle, 
  Search, 
  Navigation, 
  Truck, 
  User, 
  Weight, 
  IndianRupee,
  MapPin,
  ArrowRight,
  ClipboardList,
  Clock,
  ShieldCheck,
  AlertCircle,
  Filter
} from "lucide-react";

const Dispatch = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
    if (!confirm("Confirm successful completion of this industrial transit?")) return;
    try {
      await axios.put(`http://localhost:5000/api/trips/${id}/complete`);
      fetchData();
    } catch (err) {
      alert("Failed to complete trip");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Purge this operational record from the command history?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/trips/${id}`);
      fetchData();
    } catch (err) {
      alert("Failed to delete trip record");
    }
  };

  const filteredTrips = trips.filter(t => 
    t.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.driver_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.license_plate?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-brand-indigo rounded-full" />
            <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">
              Trip <span className="text-brand-indigo">Dispatcher</span>
            </h1>
          </div>
          <p className="text-slate-400 font-medium">Coordinate unit allocation and real-time mission deployment</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="glass-card px-4 py-2 border-white/5 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Command Center Online</span>
            </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20 text-slate-500 font-black uppercase tracking-[0.2em] text-xs">
          Synchronizing mission data...
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Dispatch Control Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-1"
          >
            <div className="glass-card p-8 border-t-4 border-t-brand-indigo sticky top-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-brand-indigo/10 rounded-lg text-brand-indigo">
                    <Send className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Initiate Mission</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="label-text">Resource Allocation (Vehicle)</label>
                  <div className="relative group">
                    <Truck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-indigo transition-colors" />
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
                          {v.license_plate} (Max: {v.max_capacity}kg)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="label-text">Operator Assignment (Driver)</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-indigo transition-colors" />
                    <select
                      required
                      className="input-field pl-12 appearance-none"
                      value={formData.driver_id}
                      onChange={(e) =>
                        setFormData({ ...formData, driver_id: e.target.value })
                      }
                    >
                      <option value="">-- Choose Operator --</option>
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id} className="bg-slate-900">
                          {d.name} (Score: {d.safety_score}%)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="label-text">Mission Trajectory (Route)</label>
                    <div className="flex flex-col gap-3">
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-indigo transition-colors" />
                            <input
                            required
                            type="text"
                            className="input-field pl-12"
                            value={formData.origin}
                            onChange={(e) =>
                                setFormData({ ...formData, origin: e.target.value })
                            }
                            placeholder="Origin Terminal"
                            />
                        </div>
                        <div className="relative group">
                            <ArrowRight className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-indigo transition-colors" />
                            <input
                            required
                            type="text"
                            className="input-field pl-12"
                            value={formData.destination}
                            onChange={(e) =>
                                setFormData({ ...formData, destination: e.target.value })
                            }
                            placeholder="Destination Terminal"
                            />
                        </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="label-text">Payload (kg)</label>
                    <div className="relative group">
                      <Weight className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-indigo transition-colors" />
                      <input
                        required
                        type="number"
                        className="input-field pl-12"
                        value={formData.cargo_weight}
                        onChange={(e) =>
                          setFormData({ ...formData, cargo_weight: e.target.value })
                        }
                        placeholder="2500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="label-text">Revenue Index</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">₹</div>
                      <input
                        required
                        type="number"
                        className="input-field pl-10"
                        value={formData.estimated_revenue}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            estimated_revenue: e.target.value,
                          })
                        }
                        placeholder="5200"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full mt-6 py-4 flex items-center justify-center gap-3 bg-linear-to-r from-brand-indigo to-indigo-600 shadow-brand-indigo/30 hover:scale-[1.02] active:scale-95 transition-all">
                  <Send className="w-5 h-5" />
                  <span className="font-black uppercase tracking-widest text-sm">Execute Dispatch</span>
                </button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-3 text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-brand-emerald" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Protocol Integrity Validated</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                      <Clock className="w-4 h-4 text-brand-amber" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Real-time Telemetry Active</span>
                  </div>
              </div>
            </div>
          </motion.div>

          {/* Active Trip Board */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-3 space-y-6"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-indigo transition-colors" />
                    <input 
                        type="text"
                        placeholder="Filter active missions..."
                        className="input-field pl-12 focus:ring-brand-indigo/50 focus:border-brand-indigo/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="ml-auto text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                    {filteredTrips.length} Operational Missions
                </div>
            </div>

            <div className="glass-card overflow-hidden">
              <div className="flex items-center gap-3 p-6 border-b border-white/5">
                <ClipboardList className="w-5 h-5 text-slate-500" />
                <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Active Operation Board</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="table-header">Mission ID</th>
                      <th className="table-header">Route Trajectory</th>
                      <th className="table-header">Personnel & Unit</th>
                      <th className="table-header">Operational Status</th>
                      <th className="table-header text-right">Directives</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTrips.map((t, i) => (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={t.id}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                              <span className="font-black text-white font-mono text-xs">TRP-{t.id}</span>
                              <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Manifest ID</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:scale-110 transition-transform">
                                <Navigation className="w-4 h-4 text-brand-indigo" />
                            </div>
                            <div>
                                <div className="font-black text-white text-sm tracking-tight italic uppercase">
                                {t.origin} <span className="text-brand-indigo">→</span> {t.destination}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">
                                <Weight className="w-3 h-3" /> {t.cargo_weight}kg Payload
                                </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 font-bold text-white text-xs uppercase">
                                <User className="w-3 h-3 text-slate-500" /> {t.driver_name}
                            </div>
                            <div className="flex items-center gap-2 text-brand-emerald text-[10px] font-black uppercase tracking-widest">
                                <Truck className="w-3 h-3" /> {t.license_plate}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`status-pill ${t.status === "Completed" ? "status-available" : t.status === "Dispatched" ? "status-trip" : "bg-slate-700"} group-hover:scale-105 transition-transform`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right no-print">
                            <div className="flex justify-end items-center gap-3">
                                {t.status === "Dispatched" && (
                                    <button
                                        onClick={() => completeTrip(t.id)}
                                        className="flex items-center gap-2 bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-brand-emerald/20 hover:border-transparent group/btn"
                                    >
                                        <CheckCircle className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                                        Complete
                                    </button>
                                )}
                                {(user?.role === "Manager" || user?.role === "CEO") && (
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        className="p-2 rounded-lg bg-brand-rose/10 text-brand-rose hover:bg-brand-rose hover:text-white transition-all border border-transparent"
                                        title="Purge Command Log"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {filteredTrips.length === 0 && (
                  <div className="p-16 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                      <AlertCircle className="w-8 h-8 text-slate-700" />
                    </div>
                    <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">No mission parameters detected in filter</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dispatch;
