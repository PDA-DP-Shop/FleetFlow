import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Power, 
  Search, 
  Truck, 
  MapPin, 
  Weight, 
  Gauge,
  X,
  FileText,
  Printer
} from "lucide-react";

const Vehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this vehicle from the registry?")) {
      try {
        await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
        fetchVehicles();
      } catch (err) {
        alert("Failed to delete vehicle");
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Available": return "status-available";
      case "On Trip": return "status-trip";
      case "In Shop": return "status-shop";
      case "Out of Service": return "status-out";
      default: return "bg-slate-700 text-white";
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.region && v.region.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 pb-12">
      {/* Print Header */}
      <div className="print-header">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo/logo-1.png" alt="FleetFlow" className="w-16 h-16" />
            <div>
              <h1 className="text-2xl font-bold text-black uppercase italic">Fleet Registry</h1>
              <p className="text-sm text-slate-600">Enterprise Asset Inventory</p>
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
            <div className="w-2 h-8 bg-brand-indigo rounded-full" />
            <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">
              Asset <span className="text-brand-indigo">Inventory</span>
            </h1>
          </div>
          <p className="text-slate-400 font-medium">Manage enterprise fleet and regional allocations</p>
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
            className="btn-primary flex items-center gap-2 group flex-1 md:flex-none justify-center" 
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-sm font-bold">New Vehicle</span>
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center no-print">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-indigo transition-colors" />
          <input 
            type="text"
            placeholder="Search by license or region..."
            className="input-field pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5">
          {filteredVehicles.length} Total Assets Listed
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20 text-slate-500 font-black uppercase tracking-[0.2em] text-xs">
          Scanning fleet database...
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
                  <th className="table-header">Vehicle Details</th>
                  <th className="table-header">Allocation</th>
                  <th className="table-header">Performance</th>
                  <th className="table-header text-center">Operational Status</th>
                  <th className="table-header text-right">Interaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredVehicles.map((v, i) => (
                  <motion.tr
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={v.id}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Truck className="w-5 h-5 text-brand-indigo" />
                        </div>
                        <div>
                          <div className="font-black text-white text-lg tracking-tight italic uppercase">{v.license_plate}</div>
                          <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Asset ID: #{v.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-300 font-bold">
                        <MapPin className="w-4 h-4 text-brand-rose" />
                        {v.region || "Unassigned"}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">Operating District</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-white">
                          <Weight className="w-3 h-3 text-slate-500" />
                          {Number(v.max_capacity).toLocaleString()} kg
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-white">
                          <Gauge className="w-3 h-3 text-slate-500" />
                          {Number(v.odometer).toLocaleString()} km
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`status-pill ${getStatusClass(v.status)} inline-block`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 no-print">
                      <div className="flex justify-end items-center gap-2">
                        {v.status !== "On Trip" && v.status !== "In Shop" && (
                          <button
                            onClick={() => toggleStatus(v.id, v.status)}
                            className={`p-2 rounded-lg transition-all border border-transparent ${
                              v.status === 'Out of Service' 
                                ? 'bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald/20' 
                                : 'bg-brand-amber/10 text-brand-amber hover:bg-brand-amber/20'
                            }`}
                            title={v.status === 'Out of Service' ? 'Restore to service' : 'Decommission'}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        )}
                        {(user?.role === "Manager" || user?.role === "CEO") && (
                          <button
                            onClick={() => handleDelete(v.id)}
                            className="p-2 rounded-lg bg-brand-rose/10 text-brand-rose hover:bg-brand-rose hover:text-white transition-all border border-transparent"
                            title="Purge from registry"
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
            {filteredVehicles.length === 0 && (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <Search className="w-8 h-8 text-slate-700" />
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">No matching assets found in the district</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Add Vehicle Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-card p-8 w-full max-w-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-indigo/10 blur-3xl rounded-full -mr-16 -mt-16" />
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-indigo/10 rounded-xl text-brand-indigo">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white italic uppercase">Register Asset</h2>
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">New Vehicle Allocation</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label-text">License Plate</label>
                    <input
                      required
                      type="text"
                      className="input-field uppercase italic font-bold tracking-widest focus:ring-brand-indigo"
                      value={formData.license_plate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          license_plate: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="e.g. MH-12-AX-0001"
                    />
                  </div>
                  <div>
                    <label className="label-text">Operating District / Region</label>
                    <input
                      required
                      type="text"
                      className="input-field"
                      value={formData.region}
                      onChange={(e) =>
                        setFormData({ ...formData, region: e.target.value })
                      }
                      placeholder="e.g. WEST DISTRICT"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="label-text">Max Payload (kg)</label>
                    <div className="relative">
                      <Weight className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        required
                        type="number"
                        className="input-field pl-12"
                        value={formData.max_capacity}
                        onChange={(e) =>
                          setFormData({ ...formData, max_capacity: e.target.value })
                        }
                        placeholder="5000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-text">Acquisition Cost (₹)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">₹</div>
                      <input
                        required
                        type="number"
                        className="input-field pl-10"
                        value={formData.acquisition_cost}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            acquisition_cost: e.target.value,
                          })
                        }
                        placeholder="45,00,000"
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
                    Abort Registry
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Finalize Registration
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div className="print-footer">
        <p>FleetFlow Enterprise Logistics Platform - Automated Fleet Asset Registry Audit - Page 1 of 1</p>
        <p className="text-[8px] mt-1 border-t pt-1 italic opacity-50">Confidential Property of FleetFlow Global Operations</p>
      </div>
    </div>
  );
};

export default Vehicles;
