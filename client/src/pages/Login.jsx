import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Truck,
  Activity,
  Globe
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials. Please attempt again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-[#050810]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-indigo/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-emerald/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg p-1 relative z-10"
      >
        <div className="glass-card shadow-2xl p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-indigo/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-brand-indigo/20 transition-all duration-700" />
          
          <div className="text-center mb-12 relative z-10">
            <motion.div 
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="w-24 h-24 mx-auto mb-6 relative"
            >
                <div className="absolute inset-0 bg-brand-indigo/20 blur-2xl rounded-full animate-pulse" />
                <img src="/logo/logo-1.png" alt="FleetFlow Logo" className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
            </motion.div>
            
            <h1 className="text-5xl font-black tracking-tighter italic uppercase text-white mb-2">
              Fleet<span className="text-brand-indigo">Flow</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
                <div className="h-px w-8 bg-white/10" />
                <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black italic">Enterprise Logistics Command</p>
                <div className="h-px w-8 bg-white/10" />
            </div>
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
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-brand-indigo transition-colors flex items-center gap-2">
                <Mail className="w-3 h-3" /> E - Mail
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="input-field pl-4 bg-white/[0.02] border-white/5 focus:bg-white/[0.04]"
                  placeholder="name@enterprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 group">
                <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-focus-within:text-brand-indigo transition-colors flex items-center gap-2">
                        <Lock className="w-3 h-3" /> Password
                    </label>
                    <button type="button" className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors"></button>
                </div>
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

            <button type="submit" className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 bg-linear-to-r from-brand-indigo to-indigo-600 shadow-brand-indigo/30 hover:shadow-brand-indigo/50 hover:scale-[1.02] active:scale-95 transition-all group/btn">
              <span className="font-black uppercase tracking-widest text-sm italic">Sign in</span>
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                Personnel lacking credentials?{" "}
                <Link
                  to="/signup"
                  className="text-brand-indigo hover:text-white transition-colors underline decoration-brand-indigo/30 underline-offset-4 hover:decoration-white"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
        
        {/* Security Badges */}
        <div className="mt-8 flex items-center justify-center gap-8 opacity-20 hover:opacity-40 transition-opacity duration-500">
            <div className="flex items-center gap-2 grayscale brightness-200">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">TLS Encrypted</span>
            </div>
            <div className="flex items-center gap-2 grayscale brightness-200">
                <Globe className="w-4 h-4 text-white" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Global Nodes</span>
            </div>
            <div className="flex items-center gap-2 grayscale brightness-200">
                <Activity className="w-4 h-4 text-white" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">256-Bit RSA</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
