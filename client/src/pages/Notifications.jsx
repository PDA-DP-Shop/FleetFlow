import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Check, 
  X, 
  UserPlus, 
  ShieldAlert, 
  Info, 
  Clock, 
  Mail, 
  ShieldCheck,
  ChevronRight,
  Inbox
} from "lucide-react";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/notifications");
            setNotifications(res.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to synchronize intelligence data");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleApproval = async (id, action) => {
        try {
            await axios.put(`http://localhost:5000/api/notifications/approve/${id}`, { action });
            setNotifications(notifications.filter(n => n.target_user_id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDismiss = async (notificationId) => {
        try {
            await axios.put(`http://localhost:5000/api/notifications/read/${notificationId}`);
            setNotifications(notifications.filter(n => n.id !== notificationId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8 pb-20">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-brand-indigo/10 rounded-2xl text-brand-indigo ring-1 ring-brand-indigo/30">
                        <Bell className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">Access <span className="text-brand-indigo">Control</span></h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Operational clearance and personnel management</p>
                    </div>
                </div>
            </header>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-brand-rose/10 border border-brand-rose/20 text-brand-rose px-6 py-4 rounded-2xl mb-10 flex items-center gap-4"
                >
                    <ShieldAlert className="w-5 h-5" />
                    <span className="text-sm font-black uppercase tracking-widest italic">{error}</span>
                </motion.div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 text-slate-700">
                    <div className="w-12 h-12 border-4 border-slate-800 border-t-brand-indigo rounded-full animate-spin mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] font-black italic">Synchronizing Protocols...</p>
                </div>
            ) : (
                <div className="max-w-4xl space-y-6">
                    <AnimatePresence mode="popLayout">
                        {notifications.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card p-24 text-center border-dashed border-white/5 bg-white/[0.01] relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-brand-indigo/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="relative z-10">
                                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-white/5">
                                        <Inbox className="w-10 h-10 text-slate-800" />
                                    </div>
                                    <h3 className="text-lg font-black text-white italic uppercase tracking-widest mb-2">Zero Pending Directives</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Awaiting new staff admission requests</p>
                                </div>
                            </motion.div>
                        ) : (
                            notifications.map((n) => (
                                <motion.div
                                    key={n.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/[0.04] transition-all duration-300 border-l-4 border-l-brand-indigo"
                                >
                                    <div className="flex items-center gap-6 flex-1">
                                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-brand-indigo ring-1 ring-white/5 group-hover:scale-110 transition-transform">
                                            {n.type === 'SIGNUP_REQUEST' ? <UserPlus className="w-7 h-7" /> : <Info className="w-7 h-7" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-black text-white text-lg italic uppercase tracking-tight">{n.sender_name}</h3>
                                                <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] italic ${
                                                    n.sender_role === 'Manager' ? 'bg-brand-emerald/10 text-brand-emerald ring-1 ring-brand-emerald/20' : 
                                                    n.sender_role === 'Dispatcher' ? 'bg-brand-indigo/10 text-brand-indigo ring-1 ring-brand-indigo/20' : 
                                                    'bg-brand-amber/10 text-brand-amber ring-1 ring-brand-amber/20'
                                                }`}>
                                                    {n.sender_role}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                    <Mail className="w-3 h-3" /> {n.sender_email}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest italic leading-relaxed">
                                                    <ChevronRight className="w-3 h-3 text-brand-indigo" /> {n.message}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-white/5">
                                        {n.type === 'SIGNUP_REQUEST' ? (
                                            <>
                                                <button
                                                    onClick={() => handleApproval(n.target_user_id, 'Approved')}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald/20 ring-1 ring-brand-emerald/30 rounded-xl transition-all font-black uppercase tracking-widest text-[10px] group/btn"
                                                >
                                                    <Check className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                                                    <span>Authorize</span>
                                                </button>
                                                <button
                                                    onClick={() => handleApproval(n.target_user_id, 'Rejected')}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-brand-rose/10 text-brand-rose hover:bg-brand-rose/20 ring-1 ring-brand-rose/30 rounded-xl transition-all font-black uppercase tracking-widest text-[10px] group/btn"
                                                >
                                                    <X className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                                                    <span>Reject</span>
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleDismiss(n.id)}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-3 bg-brand-indigo/10 text-brand-indigo hover:bg-brand-indigo/20 ring-1 ring-brand-indigo/30 rounded-xl transition-all font-black uppercase tracking-widest text-[10px] group/btn"
                                            >
                                                <Check className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                                                <span>Acknowledge</span>
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            )}
            
            <footer className="mt-16 pt-8 border-t border-white/5 opacity-40">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5 text-slate-800" />
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 italic max-w-sm">System Clearance Protocol - All actions logged under executive session audit. UNAUTHORIZED STAFF ADMISSION IS STRICTLY PROHIBITED.</p>
                </div>
            </footer>
        </div>
    );
};

export default Notifications;
