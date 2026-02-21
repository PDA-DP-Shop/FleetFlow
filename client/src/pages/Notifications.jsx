import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

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
            setError("Failed to load notifications");
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
            alert(err.response?.data?.error || "Action failed");
        }
    };

    const handleDismiss = async (notificationId) => {
        try {
            await axios.put(`http://localhost:5000/api/notifications/read/${notificationId}`);
            setNotifications(notifications.filter(n => n.id !== notificationId));
        } catch (err) {
            alert("Failed to dismiss notification");
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading requests...</div>;

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Approvals & Requests</h1>
                <p className="text-slate-400 mt-2">Manage access requests from new staff members</p>
            </header>

            {error && <div className="bg-brand-rose/20 text-brand-rose p-4 rounded-lg mb-6">{error}</div>}

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="glass-card p-12 text-center text-slate-400">
                        <div className="mb-4 opacity-20">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <p>No pending registration requests at this time.</p>
                    </div>
                ) : (
                    notifications.map((n) => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className={`status-pill ${n.sender_role === 'Manager' ? 'status-available' : 'status-in-shop'}`}>
                                        {n.sender_role}
                                    </span>
                                    <h3 className="font-semibold text-white text-lg">{n.sender_name}</h3>
                                </div>
                                <p className="text-slate-400">{n.sender_email}</p>
                                <p className="text-slate-500 text-sm mt-2 italic">{n.message}</p>
                            </div>

                            {n.type === 'SIGNUP_REQUEST' ? (
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => handleApproval(n.target_user_id, 'Approved')}
                                        className="flex-1 md:flex-none px-6 py-2 bg-brand-emerald/20 text-brand-emerald hover:bg-brand-emerald/30 border border-brand-emerald/30 rounded-lg transition-colors font-medium"
                                    >
                                        Accept Request
                                    </button>
                                    <button
                                        onClick={() => handleApproval(n.target_user_id, 'Rejected')}
                                        className="flex-1 md:flex-none px-6 py-2 bg-brand-rose/20 text-brand-rose hover:bg-brand-rose/30 border border-brand-rose/30 rounded-lg transition-colors font-medium"
                                    >
                                        Reject
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => handleDismiss(n.id)}
                                        className="flex-1 md:flex-none px-8 py-2 bg-brand-indigo/20 text-brand-indigo hover:bg-brand-indigo/30 border border-brand-indigo/30 rounded-lg transition-colors font-medium"
                                    >
                                        OK
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
