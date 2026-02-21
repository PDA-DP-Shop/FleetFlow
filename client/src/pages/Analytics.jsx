import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieChartIcon, 
  Activity, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  Printer,
  Download,
  Calendar,
  IndianRupee,
  Briefcase,
  Layers,
  Zap,
  Clock,
  ShieldCheck
} from "lucide-react";

const Analytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/analytics");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const STATUS_COLORS = {
    Available: "#10B981",
    "On Trip": "#4F46E5",
    "In Shop": "#F59E0B",
    "Out of Service": "#EF4444",
  };

  const netProfit = (stats?.kpis?.totalRevenue || 0) - (stats?.kpis?.totalCosts || 0);

  return (
    <div className="p-8 pb-12">
      {/* Print Header */}
      <div className="print-header">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo/logo-1.png" alt="FleetFlow" className="w-16 h-16" />
            <div>
              <h1 className="text-2xl font-black text-black uppercase italic">Operational Intel</h1>
              <p className="text-sm text-slate-600 font-bold uppercase tracking-widest">Enterprise Performance Audit</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-black uppercase">Report Date: {new Date().toLocaleDateString()}</p>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Authorized Auditor: {user?.name}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 no-print">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-brand-emerald rounded-full" />
            <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">
              Executive <span className="text-brand-emerald">Intel</span>
            </h1>
          </div>
          <p className="text-slate-400 font-medium">Core financial performance and fleet utilization metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="btn-secondary flex items-center gap-2 group"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm">Print Asset</span>
          </button>
          <button className="btn-primary flex items-center gap-2 group bg-linear-to-r from-brand-emerald to-emerald-600 shadow-brand-emerald/20 hover:shadow-brand-emerald/40">
            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Master Export</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20 text-slate-500 font-black uppercase tracking-[0.2em] text-xs">
          Compiling business intelligence...
        </div>
      ) : (
        <>
          {/* Top Level KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border-l-4 border-l-brand-indigo group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-brand-indigo/10 rounded-lg text-brand-indigo ring-1 ring-brand-indigo/30 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-brand-emerald text-[10px] font-black uppercase bg-brand-emerald/10 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> 12%
                </div>
              </div>
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Gross Revenue</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-slate-400 font-bold text-sm">₹</span>
                <span className="text-3xl font-black text-white tracking-tight italic">
                  {stats?.kpis?.totalRevenue?.toLocaleString() || "0"}
                </span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 border-l-4 border-l-brand-rose group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-brand-rose/10 rounded-lg text-brand-rose ring-1 ring-brand-rose/30 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-brand-rose text-[10px] font-black uppercase bg-brand-rose/10 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> 4%
                </div>
              </div>
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Operating Opex</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-slate-400 font-bold text-sm">₹</span>
                <span className="text-3xl font-black text-white tracking-tight italic">
                  {stats?.kpis?.totalCosts?.toLocaleString() || "0"}
                </span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 border-l-4 border-l-brand-emerald group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-brand-emerald/10 rounded-lg text-brand-emerald ring-1 ring-brand-emerald/30 group-hover:scale-110 transition-transform">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-brand-emerald text-[10px] font-black uppercase bg-brand-emerald/10 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" /> 18%
                </div>
              </div>
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Net OIBDA</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-slate-400 font-bold text-sm">₹</span>
                <span className="text-3xl font-black text-brand-emerald tracking-tight italic underline decoration-brand-emerald/30 decoration-4 underline-offset-8">
                  {netProfit.toLocaleString()}
                </span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 border-l-4 border-l-brand-amber group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-brand-amber/10 rounded-lg text-brand-amber ring-1 ring-brand-amber/30 group-hover:scale-110 transition-transform">
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-brand-amber text-[10px] font-black uppercase bg-brand-amber/10 px-2 py-0.5 rounded-full">
                  <Activity className="w-3 h-3" /> Stable
                </div>
              </div>
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Efficiency Yield</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-black text-white tracking-tight italic">
                  {stats?.kpis?.fleetROI}%
                </span>
                <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest ml-1">ROI</span>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Monthly Revenue Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-8 h-[450px] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-indigo/5 blur-[100px] rounded-full -mr-32 -mt-32" />
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-brand-indigo rounded-full" />
                  <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Revenue Trajectory</h2>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Layers className="w-3 h-3" /> Monthly Aggregation
                </div>
              </div>
              
              <div className="h-[75%] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.monthlyRevenue || []}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#475569" 
                      fontSize={10} 
                      fontWeight="bold"
                      tickFormatter={(val) => val.toUpperCase()}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={10} 
                      fontWeight="bold"
                      tickFormatter={(val) => `₹${val/1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                        padding: "12px"
                      }}
                      itemStyle={{ color: "#fff", fontWeight: "bold" }}
                      labelStyle={{ color: "#64748b", textTransform: "uppercase", fontSize: "10px", fontWeight: "900", marginBottom: "4px" }}
                      formatter={(val) => [`₹${val.toLocaleString()}`, "Industrial Revenue"]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#4F46E5" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorRev)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Fleet Status Distribution */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.5 }}
               className="glass-card p-8 h-[450px] flex flex-col group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-emerald/5 blur-[100px] rounded-full -mr-32 -mt-32" />
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-brand-emerald rounded-full" />
                  <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Fleet Integrity</h2>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Clock className="w-3 h-3" /> Real-time Audit
                </div>
              </div>
              
              <div className="flex-1 flex flex-col md:flex-row items-center justify-center relative z-10">
                <div className="w-full md:w-3/5 h-64 md:h-full">
                  {stats?.fleetStatus && stats.fleetStatus.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.fleetStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={8}
                          dataKey="count"
                          nameKey="status"
                          animationDuration={1500}
                        >
                          {stats.fleetStatus.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={STATUS_COLORS[entry.status] || "#94a3b8"}
                              stroke="none"
                              className="focus:outline-none"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "12px",
                            padding: "12px"
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                        <Activity className="w-12 h-12 text-slate-800 animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="w-full md:w-2/5 mt-6 md:mt-0 space-y-4">
                    {stats?.fleetStatus?.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors group/item">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.status] }} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/item:text-white transition-colors">{entry.status}</span>
                            </div>
                            <span className="font-black text-white text-sm italic">{entry.count} Units</span>
                        </div>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 glass-card p-6 border-dashed border-white/5 bg-white/[0.01]"
          >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-brand-emerald/10 flex items-center justify-center text-brand-emerald">
                          <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                          <h4 className="text-white font-black italic uppercase tracking-tight">Audit Confirmation</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">All industrial metrics aligned with enterprise protocols</p>
                      </div>
                  </div>
                  <div className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] max-w-md text-center md:text-right leading-relaxed">
                      THIS DATA IS CLASSIFIED AND SUBJECT TO NON-DISCLOSURE PROTOCOLS. UNAUTHORIZED EXPORT OR TRANSMISSION IS STRICTLY REGULATED BY SYSTEM HIERARCHY.
                  </div>
              </div>
          </motion.div>
        </>
      )}

      <div className="print-footer mt-10">
        <div className="flex justify-between items-end border-t border-black/10 pt-4">
            <div>
                <p className="text-[10px] font-black text-black uppercase tracking-[0.2em]">FleetFlow Logistics Platform</p>
                <p className="text-[8px] text-slate-500 italic mt-0.5">Automated Intelligence Summary - ROI Generation ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
            </div>
            <p className="text-[8px] font-black text-black">INTERNAL USE ONLY - PAGE 1 OF 1</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
