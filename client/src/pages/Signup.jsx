import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          <div className="mx-auto bg-brand-indigo/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-brand-indigo/30">
            <svg
              className="w-8 h-8 text-brand-indigo"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              ></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-brand-indigo to-brand-emerald">
            FleetFlow
          </h1>
          <p className="text-slate-400 mt-2">Intelligent Fleet Management</p>
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
            <input
              type="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
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
