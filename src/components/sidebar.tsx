"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/components/theme-provider";
import {
    Activity, LayoutDashboard, FolderLock, Users,
    Shield, Bot, FileEdit, LogOut, Sun, Moon,
    Wallet, ChevronLeft, ChevronRight, Stethoscope,
    Settings, HelpCircle, Menu, X, Flame
} from "lucide-react";

const patientNav = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/patient" },
    { label: "Health Hub", icon: Flame, href: "/dashboard/patient/streak" },
    { label: "My Vault", icon: FolderLock, href: "/dashboard/patient/vault" },
    { label: "Permissions", icon: Shield, href: "/dashboard/patient/permissions" },
    { label: "AI Companion", icon: Bot, href: "/dashboard/patient/ai" },
];

const doctorNav = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard/doctor" },
    { label: "Patients", icon: Users, href: "/dashboard/doctor/patients" },
    { label: "AI Engine", icon: Bot, href: "/dashboard/doctor/ai" },
    { label: "Prescriptions", icon: FileEdit, href: "/dashboard/doctor/prescriptions" },
];

const bottomNav = [
    { label: "Settings", icon: Settings, href: "#" },
    { label: "Help & Support", icon: HelpCircle, href: "#" },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = user?.role === "patient" ? patientNav : doctorNav;

    const handleNav = (href: string) => {
        if (href !== "#") router.push(href);
        setMobileOpen(false);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full py-4 px-3 gap-1">
            {/* Logo */}
            <div className={`flex items-center gap-3 px-2 mb-6 mt-1 ${collapsed ? "justify-center" : ""}`}>
                <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
                    <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                {!collapsed && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                        <div className="font-bold text-[15px] leading-tight tracking-tight dark:text-white text-slate-900">
                            MediChain<span className="text-teal-400">AI</span>
                        </div>
                        <div className="text-[9px] font-semibold text-slate-600 uppercase tracking-[0.12em]">Health Portal</div>
                    </motion.div>
                )}
            </div>

            {/* User Profile Card */}
            {!collapsed && (
                <div className="mx-1 mb-4 p-3 profile-card">
                    <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${user?.role === "patient"
                            ? "bg-gradient-to-br from-teal-500 to-cyan-400"
                            : "bg-gradient-to-br from-blue-500 to-indigo-600"
                            }`}>
                            {user?.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[12.5px] font-semibold dark:text-slate-100 text-slate-800 truncate leading-tight">
                                {user?.name?.split(" ").slice(0, 2).join(" ")}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                {user?.role === "patient"
                                    ? <Activity className="w-2.5 h-2.5 text-teal-400" />
                                    : <Stethoscope className="w-2.5 h-2.5 text-blue-400" />
                                }
                                <span className={`text-[10px] font-semibold uppercase tracking-wide ${user?.role === "patient" ? "text-teal-400" : "text-blue-400"
                                    }`}>{user?.role}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 space-y-0.5">
                {!collapsed && (
                    <div className="section-label px-3 mb-2">Navigation</div>
                )}
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/dashboard/patient" &&
                            item.href !== "/dashboard/doctor" &&
                            pathname.startsWith(item.href));
                    return (
                        <motion.button
                            key={item.href}
                            onClick={() => handleNav(item.href)}
                            whileTap={{ scale: 0.98 }}
                            className={`nav-link w-full ${isActive ? "active" : ""} ${collapsed ? "justify-center px-2" : ""}`}
                            title={collapsed ? item.label : ""}
                        >
                            <Icon className={`w-[17px] h-[17px] flex-shrink-0 ${isActive ? "text-teal-400" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                            {!collapsed && <span>{item.label}</span>}
                        </motion.button>
                    );
                })}
            </nav>

            {/* Divider */}
            <div className="divider mx-2 my-1" />

            {/* Bottom Section */}
            <div className="space-y-0.5">
                {!collapsed && bottomNav.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button key={item.label} className="nav-link w-full">
                            <Icon className="w-[17px] h-[17px]" strokeWidth={2} />
                            {item.label}
                        </button>
                    );
                })}

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className={`nav-link w-full ${collapsed ? "justify-center" : ""}`}
                >
                    {theme === "dark"
                        ? <Sun className="w-[17px] h-[17px]" strokeWidth={2} />
                        : <Moon className="w-[17px] h-[17px]" strokeWidth={2} />
                    }
                    {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
                </button>

                {/* Logout */}
                <button
                    onClick={() => { logout(); router.push("/"); }}
                    className={`nav-link w-full text-red-400/80 hover:bg-red-500/8 hover:text-red-400 ${collapsed ? "justify-center" : ""}`}
                >
                    <LogOut className="w-[17px] h-[17px]" strokeWidth={2} />
                    {!collapsed && <span>Sign Out</span>}
                </button>
            </div>

            {/* Wallet */}
            {!collapsed && (
                <div className="mt-2 mx-1 p-2.5 rounded-xl bg-teal-500/[0.06] border border-teal-500/[0.12]">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Wallet className="w-3 h-3 text-teal-400" />
                        <span className="text-[9px] font-bold text-teal-400 uppercase tracking-[0.12em]">Wallet</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-auto" />
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                        {user?.walletAddress?.slice(0, 10)}...{user?.walletAddress?.slice(-6)}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 glass-card flex items-center justify-center rounded-xl"
            >
                {mobileOpen ? <X className="w-4 h-4 dark:text-white text-slate-900" /> : <Menu className="w-4 h-4 dark:text-white text-slate-900" />}
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={() => setMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        className="lg:hidden fixed left-0 top-0 h-full w-64 z-50 sidebar-glass"
                    >
                        <SidebarContent />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.div
                animate={{ width: collapsed ? 64 : 252 }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="hidden lg:block h-full sidebar-glass flex-shrink-0 relative overflow-hidden"
            >
                <SidebarContent />

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-[72px] w-6 h-6 rounded-full glass-card border border-white/10 flex items-center justify-center hover:border-teal-500/40 hover:bg-teal-500/10 transition-all z-10"
                >
                    {collapsed
                        ? <ChevronRight className="w-3 h-3 text-slate-400" />
                        : <ChevronLeft className="w-3 h-3 text-slate-400" />
                    }
                </button>
            </motion.div>
        </>
    );
}
