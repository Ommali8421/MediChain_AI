"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { patientList } from "@/lib/data";
import {
    Users, Search, Filter, ChevronRight,
    AlertTriangle, ArrowRight, Phone, Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";

const RISK_COLORS: Record<string, string> = {
    High: "badge-critical",
    Medium: "badge-monitoring",
    Low: "badge-stable",
};

const STATUS_COLORS: Record<string, string> = {
    Critical: "badge-critical",
    Active: "badge-active",
    Stable: "badge-stable",
    Monitoring: "badge-monitoring",
};

export default function PatientsPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"All" | "Critical" | "Active" | "Stable">("All");
    const router = useRouter();

    const filtered = patientList.filter((p) => {
        const matchSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.condition.toLowerCase().includes(search.toLowerCase()) ||
            p.id.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "All" || p.status === filter;
        return matchSearch && matchFilter;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-7xl mx-auto"
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-400" />
                        Patient List
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">{patientList.length} patients · {patientList.filter(p => p.accessGranted).length} with record access</p>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by name, condition, or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="glass-input pl-9 text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    {(["All", "Critical", "Active", "Stable"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filter === f
                                    ? "bg-blue-500/15 border border-blue-500/30 text-blue-300"
                                    : "btn-ghost"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Patient Cards */}
            <div className="space-y-3">
                {filtered.map((p, i) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ x: 4 }}
                        className="glass-card glass-card-hover p-4 rounded-2xl cursor-pointer"
                        onClick={() => router.push(`/dashboard/doctor/patients/${p.id}`)}
                    >
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${p.riskLevel === "High" ? "bg-red-500/15 text-red-300" :
                                    p.riskLevel === "Medium" ? "bg-yellow-500/15 text-yellow-300" :
                                        "bg-green-500/15 text-green-300"
                                }`}>
                                {p.name.split(" ").map(n => n[0]).join("")}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold dark:text-white text-slate-900">{p.name}</span>
                                    <span className="text-xs text-slate-500">#{p.id}</span>
                                    <span className={`badge text-[10px] ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                                    <span className={`badge text-[10px] ${RISK_COLORS[p.riskLevel]}`}>
                                        {p.riskLevel === "High" && <AlertTriangle className="w-2.5 h-2.5" />}
                                        {p.riskLevel} Risk
                                    </span>
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5 truncate">{p.condition}</div>
                                <div className="flex items-center gap-4 mt-1.5 text-[11px] text-slate-600">
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-3 h-3" /> {p.phone}
                                    </span>
                                    <span>Age {p.age} · {p.bloodType}</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> Next: {p.nextAppointment}
                                    </span>
                                </div>
                            </div>

                            {/* Right side */}
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <div className={`text-[10px] px-2 py-1 rounded-full ${p.accessGranted
                                        ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                                        : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                                    }`}>
                                    {p.accessGranted ? "🔓 Records Access" : "🔒 No Access"}
                                </div>
                                <div className="text-xs text-slate-500">Last visit: {p.lastVisit}</div>
                                <ChevronRight className="w-4 h-4 text-slate-600" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>No patients match your search</p>
                </div>
            )}
        </motion.div>
    );
}
