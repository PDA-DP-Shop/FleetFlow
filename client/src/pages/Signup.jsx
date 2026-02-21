import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Manager");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const { signup, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await signup(name, email, password, role);
      if (res && res.status === "Pending") {
        setSuccess(res.message);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Account initialization failed. System error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#050810]">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-emerald/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-indigo/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg p-1 relative z-10"
      >
        <div className="glass-card shadow-2xl p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-32 h-32 bg-brand-emerald/10 blur-3xl rounded-full -ml-16 -mt-16 group-hover:bg-brand-emerald/20 transition-all duration-700" />
          
          <div className="text-center mb-10 relative z-10">
            <motion.div 
                initial={{ rotate: 10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="w-20 h-20 mx-auto mb-4 relative"
            >
                <div className="absolute inset-0 bg-brand-emerald/20 blur-2xl rounded-full animate-pulse" />
                <img src="/logo/logo-1.png" alt="FleetFlow Logo" className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
            </motion.div>
            
            <h1 className="text-4xl font-black tracking-tighter italic uppercase text-white mb-2">
              Join <span className="text-brand-emerald">FleetFlow</span>
            </h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black italic">Initiate Personnel Admission</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-brand-rose/10 border border-brand-rose/20 text-brand-rose px-4 py-3 rounded-xl mb-8 text-xs font-bold uppercase tracking-widest flex items-center gap-3"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-emerald/10 border border-brand-emerald/20 p-8 rounded-2xl mb-6 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CheckCircle2 className="w-24 h-24 text-brand-emerald" />
                </div>
                <div className="w-16 h-16 bg-brand-emerald/20 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-emerald">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white italic uppercase mb-2">Request Transmitted</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">
                  {success}
                </p>
                <Link to="/login" className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 group/login">
                  <span className="font-black uppercase tracking-widest text-xs">Return to Terminal</span>
                  <ChevronRight className="w-4 h-4 group-hover/login:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-brand-emerald transition-colors flex items-center gap-2">
                    <User className="w-3 h-3" /> Full Personnel Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="input-field pl-4 bg-white/[0.02] border-white/5 focus:bg-white/[0.04]"
                      placeholder="e.g. Commander Shepherd"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-brand-emerald transition-colors flex items-center gap-2">
                    <Mail className="w-3 h-3" /> E - mail
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      className="input-field pl-4 bg-white/[0.02] border-white/5 focus:bg-white/[0.04]"
                      placeholder="identifier@fleetflow.intel"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-brand-emerald transition-colors flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input-field pl-4 pr-12 bg-white/[0.02] border-white/5 focus:bg-white/[0.04]"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-brand-emerald transition-colors flex items-center gap-2">
                    <Briefcase className="w-3 h-3" /> Operational Role Assignment
                  </label>
                  <div className="relative">
                    <select
                      className="input-field pl-4 bg-white/[0.02] border-white/5 focus:bg-white/[0.04] appearance-none cursor-pointer"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="Manager" className="bg-[#0f172a]">Manager</option>
                      <option value="Dispatcher" className="bg-[#0f172a]">Dispatcher</option>
                      <option value="Finance" className="bg-[#0f172a]">Finance</option>
                      <option value="Safety Officer" className="bg-[#0f172a]">Safety Officer</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none rotate-90" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 bg-linear-to-r from-brand-emerald to-emerald-600 shadow-brand-emerald/30 hover:shadow-brand-emerald/50 hover:scale-[1.02] active:scale-95 transition-all group/btn disabled:opacity-50"
                >
                  <span className="font-black uppercase tracking-widest text-sm italic">
                    {loading ? "Transmitting..." : "Sign up"}
                  </span>
                  {!loading && <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />}
                </button>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    Already an authorized operative?{" "}
                    <Link
                      to="/login"
                      className="text-brand-emerald hover:text-white transition-colors underline decoration-brand-emerald/30 underline-offset-4 hover:decoration-white"
                    >
                      Log In
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
