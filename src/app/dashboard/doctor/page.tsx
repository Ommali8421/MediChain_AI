"use client";

import { motion } from "framer-motion";
import { doctorProfile, patientList, prescriptions, aiInsights } from "@/lib/data";
import {
    Stethoscope, Users, FileEdit, AlertTriangle, Activity,
    Calendar, TrendingUp, Brain, Clock, ArrowRight, Star
} from "lucide-react";

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function DoctorDashboard() {
    const criticalPatients = patientList.filter((p) => p.riskLevel === "High");
    const todayPatients = patientList.slice(0, 4);

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5 max-w-7xl mx-auto">
            {/* Welcome Banner */}
            <motion.div variants={item} className="glass-card p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.08] to-teal-500/[0.04]" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <div className="section-label mb-1">Clinical dashboard</div>
                        <h2 className="text-[20px] font-bold dark:text-white text-slate-900 tracking-tight">
                            {doctorProfile.name}
                        </h2>
                        <p className="text-[13px] text-slate-500 mt-1">
                            {doctorProfile.specialty} · {doctorProfile.hospital} · {doctorProfile.experience} experience
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < Math.floor(doctorProfile.rating) ? "text-amber-400 fill-amber-400" : "text-slate-700"}`} />
                            ))}
                            <span className="text-[11px] text-slate-500 ml-1">{doctorProfile.rating} · License {doctorProfile.license}</span>
                        </div>
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-2">
                        <div className="text-[28px] font-black text-blue-400 tracking-tight">{doctorProfile.patientsToday}</div>
                        <div className="text-[11px] text-slate-500">Patients today</div>
                        <span className="badge badge-active text-[10px]">3 upcoming</span>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "Total Patients", value: patientList.length, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", accent: "#60a5fa" },
                    { label: "Critical Cases", value: criticalPatients.length, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", accent: "#f87171" },
                    { label: "Active Rx", value: prescriptions.length, icon: FileEdit, color: "text-teal-400", bg: "bg-teal-400/10", border: "border-teal-400/20", accent: "#2dd4bf" },
                    { label: "AI Alerts", value: aiInsights.filter(a => a.severity === "high").length, icon: Brain, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", accent: "#c084fc" },
                ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <motion.div key={i} className="glass-card p-4 rounded-xl" style={{ position: "relative" }}>
                            <div className="stat-accent-line" style={{ background: `linear-gradient(90deg, ${s.accent}40, transparent)` }} />
                            <div className={`w-8 h-8 rounded-lg ${s.bg} border ${s.border} flex items-center justify-center mb-3`}>
                                <Icon className={`w-4 h-4 ${s.color}`} />
                            </div>
                            <div className="metric-value">{s.value}</div>
                            <div className="metric-label mt-0.5">{s.label}</div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-4">
                {/* Today's Patients */}
                <motion.div variants={item} className="lg:col-span-2 glass-card p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="card-title flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            Today&apos;s Patients
                        </div>
                        <button className="text-[12px] text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1">
                            View all <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {todayPatients.map((p) => (
                            <motion.div
                                key={p.id}
                                whileHover={{ x: 3 }}
                                className="flex items-center gap-3 p-3 row-item row-item-blue cursor-pointer"
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${p.riskLevel === "High" ? "bg-red-400/12 text-red-300" :
                                    p.riskLevel === "Medium" ? "bg-amber-400/12 text-amber-300" :
                                        "bg-emerald-400/12 text-emerald-300"
                                    }`}>
                                    {p.name.split(" ").map((n: string) => n[0]).join("")}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[13px] font-semibold dark:text-white text-slate-800 truncate tracking-tight">{p.name}</div>
                                    <div className="text-[11px] text-slate-500 truncate">{p.condition}</div>
                                </div>
                                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                    <span className={`badge text-[10px] ${p.status === "Critical" ? "badge-critical" :
                                        p.status === "Active" ? "badge-active" :
                                            p.status === "Stable" ? "badge-stable" : "badge-monitoring"
                                        }`}>{p.status}</span>
                                    <span className={`text-[10px] ${p.accessGranted ? "text-teal-400" : "text-slate-600"}`}>
                                        {p.accessGranted ? "🔓 Access" : "🔒 No access"}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* AI Alerts Panel */}
                <motion.div variants={item} className="glass-card p-5 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-purple-400/10 border border-purple-400/20 flex items-center justify-center">
                            <Brain className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <div>
                            <div className="card-title">AI Alert Panel</div>
                            <div className="text-[10px] text-slate-600">Gemini 2.5 Pro</div>
                        </div>
                        <div className="badge badge-critical text-[10px] ml-auto animate-pulse">Live</div>
                    </div>
                    <div className="space-y-2.5">
                        {aiInsights.map((insight, i) => (
                            <div
                                key={i}
                                className={`p-3 rounded-xl border ${insight.severity === "high"
                                    ? "bg-red-400/[0.06] border-red-400/20"
                                    : "bg-amber-400/[0.06] border-amber-400/20"
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className={`w-3.5 h-3.5 flex-shrink-0 ${insight.severity === "high" ? "text-red-400" : "text-amber-400"}`} />
                                    <span className="text-[12px] font-semibold dark:text-white text-slate-800">
                                        {patientList.find(p => p.id === insight.patientId)?.name}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {insight.flags.map((f) => (
                                        <span key={f} className={`text-[10px] px-1.5 py-0.5 rounded-full border ${insight.severity === "high"
                                            ? "bg-red-500/10 border-red-500/20 text-red-300"
                                            : "bg-amber-500/10 border-amber-500/20 text-amber-300"
                                            }`}>{f}</span>
                                    ))}
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{insight.insight}</p>
                                <button className="text-[10px] text-teal-400 mt-1.5 hover:text-teal-300 transition-colors">Review patient →</button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.05]">
                        <div className="section-label mb-2">System</div>
                        {[
                            { label: "RabbitMQ Queue", status: "Healthy", ok: true },
                            { label: "FastAPI Service", status: "Running", ok: true },
                            { label: "Gemini API", status: "Connected", ok: true },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center justify-between py-1.5">
                                <span className="text-[11px] text-slate-600">{s.label}</span>
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${s.ok ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                                    <span className={`text-[10px] font-semibold ${s.ok ? "text-emerald-400" : "text-red-400"}`}>{s.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
