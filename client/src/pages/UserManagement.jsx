import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user: currentUser } = useAuth();

    const fetchUsers = async () => {
        try {
            // Reusing a logic that fetches all users for management
            // I'll need an endpoint for this or use a query
            const res = await axios.get("http://localhost:5000/api/auth/users");
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load users");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;
        
        try {
            await axios.delete(`http://localhost:5000/api/notifications/user/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert(err.response?.data?.error || "Failed to remove user");
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading user directory...</div>;

    return (
        <div className="p-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">User Management</h1>
                    <p className="text-slate-400 mt-2">View and manage system access for all staff members</p>
                </div>
            </header>

            {error && <div className="bg-brand-rose/20 text-brand-rose p-4 rounded-lg mb-6">{error}</div>}

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 uppercase text-xs font-semibold text-slate-400 tracking-wider">
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.filter(u => {
                            // CEO sees everyone except themselves (usually) or can see everyone
                            if (currentUser.role === 'CEO') return u.role !== 'CEO' || u.id === currentUser.id;
                            
                            // Managers should ONLY see the "other 3" roles
                            if (currentUser.role === 'Manager') {
                                const subordinateRoles = ['Dispatcher', 'Finance', 'Safety Officer'];
                                return subordinateRoles.includes(u.role);
                            }
                            
                            return false;
                        }).map((u) => {
                            // Check if current user has permission to delete this user
                            let canDelete = false;
                            if (currentUser.role === 'CEO' && u.role !== 'CEO') canDelete = true;
                            if (currentUser.role === 'Manager' && ['Dispatcher', 'Finance', 'Safety Officer'].includes(u.role)) canDelete = true;

                            return (
                                <motion.tr 
                                    key={u.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-white/2 transition-colors group"
                                >
                                    <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                                    <td className="px-6 py-4 text-slate-400">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`status-pill ${u.role === 'CEO' ? 'status-available' : u.role === 'Manager' ? 'status-on-trip' : 'status-in-shop'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            u.status === 'Approved' ? 'bg-brand-emerald/10 text-brand-emerald' : 
                                            u.status === 'Pending' ? 'bg-brand-indigo/10 text-brand-indigo' : 
                                            'bg-brand-rose/10 text-brand-rose'
                                        }`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {canDelete && (
                                            <button 
                                                onClick={() => handleDelete(u.id, u.name)}
                                                className="text-brand-rose hover:bg-brand-rose/10 px-3 py-1 rounded transition-colors"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
