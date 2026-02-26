"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { notifications } from "@/lib/data";
import {
    Bell, Search, Wallet, ChevronDown,
    AlertTriangle, CheckCircle2, Info, X, LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";

const iconMap = {
    alert: { Icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-400/10" },
    info: { Icon: Info, color: "text-blue-400", bg: "bg-blue-400/10" },
    success: { Icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
};

export default function Topbar({ title }: { title?: string }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [showNotifs, setShowNotifs] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const unread = notifications.filter((n) => !n.read).length;

    return (
        <div className="topbar-glass h-14 flex items-center justify-between px-5 flex-shrink-0 relative z-30">
            {/* Left: Page title */}
            <div className="flex items-center gap-3 ml-10 lg:ml-0">
                {title && (
                    <motion.h1
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[15px] font-semibold dark:text-white text-slate-900 tracking-tight"
                    >
                        {title}
                    </motion.h1>
                )}
            </div>

            {/* Center: Search */}
            <div className="hidden md:flex items-center gap-2.5 px-3.5 py-2 search-bar cursor-text w-60 group">
                <Search className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Search records, patients..."
                    className="bg-transparent text-sm text-slate-400 placeholder:text-slate-600 outline-none w-full"
                />
                <kbd className="hidden sm:flex text-[9px] text-slate-700 border border-white/[0.08] rounded-md px-1.5 py-0.5 font-mono">⌘K</kbd>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* Wallet Badge */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 wallet-badge">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-slate-500 font-mono tracking-tight">
                        {user?.walletAddress?.slice(0, 6)}...{user?.walletAddress?.slice(-4)}
                    </span>
                    <Wallet className="w-3.5 h-3.5 text-teal-400" />
                </div>

                {/* Notifications */}
                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
                        className="relative w-8 h-8 icon-btn flex items-center justify-center"
                    >
                        <Bell className="w-3.5 h-3.5 text-slate-400" />
                        {unread > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-teal-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30">
                                {unread}
                            </span>
                        )}
                    </motion.button>

                    <AnimatePresence>
                        {showNotifs && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-10 w-80 glass-card shadow-2xl z-50 overflow-hidden"
                            >
                                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                                    <div>
                                        <span className="text-[13px] font-semibold dark:text-white text-slate-900">Notifications</span>
                                        <span className="ml-2 text-[10px] font-bold text-teal-400 bg-teal-400/10 px-1.5 py-0.5 rounded-md">{unread} new</span>
                                    </div>
                                    <button onClick={() => setShowNotifs(false)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors">
                                        <X className="w-3.5 h-3.5 text-slate-500" />
                                    </button>
                                </div>
                                <div className="p-1.5 max-h-72 overflow-y-auto">
                                    {notifications.map((n) => {
                                        const { Icon, color, bg } = iconMap[n.type as keyof typeof iconMap];
                                        return (
                                            <div
                                                key={n.id}
                                                className={`flex gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.04] cursor-pointer ${!n.read ? "bg-teal-500/[0.06]" : ""}`}
                                            >
                                                <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${bg}`}>
                                                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[12px] dark:text-slate-200 text-slate-700 leading-snug">{n.message}</p>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">{n.time}</p>
                                                </div>
                                                {!n.read && <div className="w-1.5 h-1.5 bg-teal-400 rounded-full flex-shrink-0 mt-2" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile */}
                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
                        className="flex items-center gap-2 px-2 py-1.5 profile-btn"
                    >
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white ${user?.role === "patient"
                            ? "bg-gradient-to-br from-teal-500 to-cyan-400"
                            : "bg-gradient-to-br from-blue-500 to-indigo-600"
                            }`}>
                            {user?.avatar}
                        </div>
                        <div className="hidden sm:block text-left">
                            <div className="text-[11px] font-semibold dark:text-white text-slate-800 leading-tight tracking-tight">
                                {user?.name?.split(" ")[0]}
                            </div>
                            <div className={`text-[9px] font-semibold capitalize ${user?.role === "patient" ? "text-teal-400" : "text-blue-400"}`}>
                                {user?.role}
                            </div>
                        </div>
                        <ChevronDown className="w-3 h-3 text-slate-600 hidden sm:block" />
                    </motion.button>

                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-10 w-52 glass-card shadow-2xl z-50 overflow-hidden p-1.5"
                            >
                                <div className="px-3 py-2.5 border-b border-white/[0.06] mb-1">
                                    <div className="text-[13px] font-semibold dark:text-white text-slate-900 tracking-tight">{user?.name}</div>
                                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email}</div>
                                </div>
                                <button className="nav-link w-full text-[12.5px] py-2">Profile Settings</button>
                                <button className="nav-link w-full text-[12.5px] py-2">Security & Keys</button>
                                <div className="divider mx-1 my-1" />
                                <button
                                    onClick={() => { logout(); router.push("/"); }}
                                    className="nav-link w-full text-[12.5px] py-2 text-red-400/80 hover:bg-red-500/8 hover:text-red-400"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Click outside */}
            {(showNotifs || showProfile) && (
                <div className="fixed inset-0 z-40" onClick={() => { setShowNotifs(false); setShowProfile(false); }} />
            )}
        </div>
    );
}
