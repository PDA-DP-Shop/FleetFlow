import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { 
  Users, 
  Trash2, 
  ShieldCheck, 
  Mail, 
  UserCircle, 
  Activity,
  AlertTriangle,
  ChevronRight,
  Shield,
  Briefcase
} from "lucide-react";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user: currentUser } = useAuth();

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/auth/users");
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to retrieve personnel directory");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`AUTHORIZED PERSONNEL ONLY: Are you sure you want to revoke system access for ${name}?`)) return;
        
        try {
            await axios.delete(`http://localhost:5000/api/notifications/user/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8 pb-20">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-brand-emerald/10 rounded-2xl text-brand-emerald ring-1 ring-brand-emerald/30">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">Personnel <span className="text-brand-emerald">Registry</span></h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Enterprise hierarchy and authentication management</p>
                    </div>
                </div>
            </header>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-brand-rose/10 border border-brand-rose/20 text-brand-rose px-6 py-4 rounded-2xl mb-10 flex items-center gap-4"
                >
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-sm font-black uppercase tracking-widest italic">{error}</span>
                </motion.div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 text-slate-700">
                    <div className="w-12 h-12 border-4 border-slate-800 border-t-brand-emerald rounded-full animate-spin mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] font-black italic">Decrypting Directory...</p>
                </div>
            ) : (
                <div className="glass-card overflow-hidden border-white/5 shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.03] border-b border-white/5 uppercase text-[10px] font-black text-slate-500 tracking-[0.2em] italic">
                                <th className="px-8 py-5">Personnel Ident</th>
                                <th className="px-8 py-5">Security Role</th>
                                <th className="px-8 py-5">Access Status</th>
                                <th className="px-8 py-5 text-right">System Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            <AnimatePresence mode="popLayout">
                                {users.filter(u => {
                                    if (currentUser.role === 'CEO') return u.role !== 'CEO' || u.id === currentUser.id;
                                    if (currentUser.role === 'Manager') {
                                        const subordinateRoles = ['Dispatcher', 'Finance', 'Safety Officer'];
                                        return subordinateRoles.includes(u.role);
                                    }
                                    return false;
                                }).map((u) => {
                                    let canDelete = false;
                                    if (currentUser.role === 'CEO' && u.role !== 'CEO') canDelete = true;
                                    if (currentUser.role === 'Manager' && ['Dispatcher', 'Finance', 'Safety Officer'].includes(u.role)) canDelete = true;

                                    return (
                                        <motion.tr 
                                            key={u.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="hover:bg-white/[0.02] transition-all group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-600 ring-1 ring-white/5 group-hover:ring-brand-emerald/30 group-hover:text-brand-emerald transition-all">
                                                        <UserCircle className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white italic uppercase tracking-tight group-hover:text-brand-emerald transition-colors">{u.name}</p>
                                                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                                                            <Mail className="w-3 h-3" /> {u.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-1.5 rounded-lg ${
                                                        u.role === 'CEO' ? 'bg-brand-emerald/10 text-brand-emerald' : 
                                                        u.role === 'Manager' ? 'bg-brand-indigo/10 text-brand-indigo' : 
                                                        'bg-slate-800 text-slate-500'
                                                    }`}>
                                                        {u.role === 'CEO' ? <Shield className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest italic ${
                                                        u.role === 'CEO' ? 'text-brand-emerald' : 
                                                        u.role === 'Manager' ? 'text-brand-indigo' : 
                                                        'text-slate-400'
                                                    }`}>
                                                        {u.role}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                                        u.status === 'Approved' ? 'bg-brand-emerald' : 
                                                        u.status === 'Pending' ? 'bg-brand-amber' : 
                                                        'bg-brand-rose'
                                                    }`} />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest italic ${
                                                        u.status === 'Approved' ? 'text-brand-emerald' : 
                                                        u.status === 'Pending' ? 'text-brand-amber' : 
                                                        'text-brand-rose'
                                                    }`}>
                                                        {u.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {canDelete && (
                                                    <button 
                                                        onClick={() => handleDelete(u.id, u.name)}
                                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-rose/10 text-brand-rose hover:bg-brand-rose/20 ring-1 ring-brand-rose/30 rounded-lg transition-all font-black uppercase tracking-widest text-[9px] group/btn"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                                                        <span>Revoke Access</span>
                                                    </button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
            
            <footer className="mt-16 pt-8 border-t border-white/5 opacity-40">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5 text-slate-800" />
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 italic max-w-sm">Enterprise Personnel Ledger - All access modifications are synchronized with secure auth protocols.</p>
                </div>
            </footer>
        </div>
    );
};

export default UserManagement;
