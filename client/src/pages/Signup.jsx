import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

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

  // Prevent signed-in users from accessing signup
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
      setError(err.response?.data?.error || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-brand-navy">
      {/* Background elements (matching Login) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-indigo/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-emerald/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <img src="/logo/logo-1.png" alt="FleetFlow Logo" className="w-20 h-20 mx-auto mb-4 object-contain" style={{ width: "100px", height: "100px" }} />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-brand-indigo to-brand-emerald">
            FleetFlow
          </h1>
          <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest font-semibold">Logistics Management System</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-brand-rose/10 border border-brand-rose/20 text-brand-rose px-4 py-3 rounded-xl mb-6 text-sm"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald px-4 py-3 rounded-xl mb-6 text-sm text-center"
          >
            <div className="text-lg font-bold mb-1">Request Received</div>
            {success}
            <div className="mt-4">
              <Link to="/login" className="btn-primary inline-block px-6 py-2">
                Go to Login
              </Link>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Full Name</label>
            <input
              type="text"
              required
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="label-text">Email Address</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="xyz@fleetflow.com"
            />
          </div>
          <div>
            <label className="label-text">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="input-field pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.046m4.596-4.596A9.964 9.964 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.017 10.017 0 01-1.39 3.748m-4.076 2.314A6 6 0 0115 15.111m-2.828-2.828L3 3m3.357 3.357A3 3 0 0012 15a3 3 0 002.938-2.062M11.25 11.25l-.25.25" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="label-text">Role</label>
            <select
              className="input-field"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Manager">Manager</option>
              <option value="Dispatcher">Dispatcher</option>
              <option value="Finance">Finance</option>
              <option value="Safety Officer">Safety Officer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 py-3"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-brand-indigo hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
