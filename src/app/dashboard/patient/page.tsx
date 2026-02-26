"use client";

import { motion } from "framer-motion";
import { patientProfile, activeTreatments, medicationSchedule, patientStats, patientTimeline } from "@/lib/data";
import {
    Heart, Activity, Droplets, Wind, Thermometer, Weight,
    TrendingUp, TrendingDown, Brain, Check, Clock, AlertTriangle,
    Image as ImageIcon, Pill, History, CalendarDays
} from "lucide-react";
import ActivityHeatmap from "@/components/activity-heatmap";

const iconMap: Record<string, React.ElementType> = {
    "activity": Activity,
    "droplets": Droplets,
    "image": ImageIcon,
    "pill": Pill,
    "alert-triangle": AlertTriangle,
};

const vitals = [
    { label: "Heart Rate", value: patientStats.heartRate, unit: "bpm", icon: Heart, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", trend: "stable", accent: "#f87171" },
    { label: "Blood Pressure", value: patientStats.bloodPressure, unit: "mmHg", icon: Activity, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", trend: "up", accent: "#fb923c" },
    { label: "Blood Glucose", value: patientStats.glucose, unit: "mg/dL", icon: Droplets, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", trend: "stable", accent: "#60a5fa" },
    { label: "Oxygen Sat.", value: `${patientStats.oxygenSat}%`, unit: "SpO₂", icon: Wind, color: "text-teal-400", bg: "bg-teal-400/10", border: "border-teal-400/20", trend: "stable", accent: "#2dd4bf" },
    { label: "Temperature", value: patientStats.temperature, unit: "°F", icon: Thermometer, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", trend: "stable", accent: "#fbbf24" },
    { label: "Weight", value: `${patientStats.weight}`, unit: "kg", icon: Weight, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", trend: "down", accent: "#c084fc" },
];

const aiInsight = "Based on your latest readings, your blood pressure remains slightly elevated. Blood glucose levels are trending positively. Consider reviewing sodium intake and increasing hydration. Continue current Metformin and Lisinopril schedule.";

export default function PatientDashboard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5 max-w-6xl mx-auto"
        >
            {/* Welcome Banner */}
            <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/[0.08] via-transparent to-blue-500/[0.05]" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <div className="section-label mb-1">Good afternoon</div>
                        <h2 className="text-[20px] font-bold dark:text-white text-slate-900 tracking-tight">
                            {patientProfile.name}
                        </h2>
                        <p className="text-[13px] text-slate-500 mt-1">
                            Last updated: Today at 12:00 PM · {patientProfile.allergies.length} active allergies on record
                        </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-400/[0.08] border border-emerald-400/20">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[12px] font-semibold text-emerald-400">Health Stable</span>
                        </div>
                        <div className="text-right hidden md:block">
                            <div className="text-[11px] text-slate-600">{patientProfile.bloodType}</div>
                            <div className="text-[11px] text-slate-600">{patientProfile.insurance}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vitals Grid */}
            <div>
                <div className="section-label mb-3">Live Vitals</div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                    {vitals.map((v, i) => {
                        const Icon = v.icon;
                        return (
                            <motion.div
                                key={v.label}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="glass-card glass-card-hover p-4 rounded-xl"
                            >
                                {/* Accent top line */}
                                <div className="stat-accent-line" style={{ background: `linear-gradient(90deg, ${v.accent}40, transparent)` }} />
                                <div className={`w-8 h-8 rounded-lg ${v.bg} border ${v.border} flex items-center justify-center mb-3`}>
                                    <Icon className={`w-3.5 h-3.5 ${v.color}`} />
                                </div>
                                <div className="metric-value text-[22px]">{v.value}</div>
                                <div className="metric-label">{v.unit}</div>
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="text-[11px] dark:text-slate-400 text-slate-600 font-medium">{v.label}</div>
                                    {v.trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-amber-400" />}
                                    {v.trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />}
                                    {v.trend === "stable" && <div className="w-3.5 h-0.5 bg-slate-600 rounded-full" />}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-3 gap-5">
                {/* Left col — Active Treatments & Schedule */}
                <div className="space-y-5">
                    {/* Active Treatments */}
                    <div className="glass-card p-5 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="card-title">Active Treatments</div>
                            <span className="badge badge-active text-[10px]">{activeTreatments.length} active</span>
                        </div>
                        <div className="space-y-3">
                            {activeTreatments.map((t) => {
                                const colorMap: Record<string, { bar: string; badge: string; dot: string }> = {
                                    teal: { bar: "from-teal-500 to-cyan-400", badge: "bg-teal-500/10 text-teal-400 border-teal-500/20", dot: "bg-teal-400" },
                                    blue: { bar: "from-blue-500 to-indigo-400", badge: "bg-blue-500/10 text-blue-400 border-blue-500/20", dot: "bg-blue-400" },
                                    purple: { bar: "from-purple-500 to-pink-400", badge: "bg-purple-500/10 text-purple-400 border-purple-500/20", dot: "bg-purple-400" },
                                };
                                const c = colorMap[t.color];
                                return (
                                    <div key={t.id} className="row-item p-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="text-[12.5px] font-semibold dark:text-white text-slate-800 leading-tight">{t.name}</div>
                                                <div className="text-[11px] text-slate-500 mt-0.5">{t.doctor}</div>
                                            </div>
                                            <span className={`badge text-[9px] border flex-shrink-0 ${c.badge}`}>{t.status}</span>
                                        </div>
                                        <div className="mt-2.5 flex flex-wrap gap-1">
                                            {t.medications.map((m, i) => (
                                                <span key={i} className="chip-tag">{m}</span>
                                            ))}
                                        </div>
                                        <div className="mt-3 progress-bar">
                                            <div className={`progress-fill bg-gradient-to-r ${c.bar}`} style={{ width: "65%" }} />
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-[9px] text-slate-600">Started {t.startDate}</span>
                                            <span className="text-[9px] text-slate-600">65% complete</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* AI Insight */}
                    <div className="glass-card p-5 rounded-2xl flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
                                <Brain className="w-3.5 h-3.5 text-purple-400" />
                            </div>
                            <div>
                                <div className="card-title">AI Health Summary</div>
                                <div className="text-[10px] text-slate-600">Gemini 2.5 Pro</div>
                            </div>
                            <div className="ml-auto w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        </div>

                        <div className="flex-1 p-4 ai-insight-box">
                            <p className="text-[12.5px] text-slate-400 leading-[1.75]">{aiInsight}</p>
                        </div>

                        <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-amber-400/[0.05] border border-amber-400/[0.1]">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                            <span className="text-[11px] text-amber-400/80">BP borderline elevated — monitor closely</span>
                        </div>

                        <div className="mt-3 text-[10px] text-slate-700 text-center">
                            AI-generated · Not a medical diagnosis
                        </div>
                    </div>
                </div>

                {/* Right col — Medical Timeline & Heatmap */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Activity Heatmap */}
                    <div className="glass-card p-5 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold dark:text-white text-slate-900 flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-teal-400" />
                                Overall Medical Activity
                            </h3>
                            <span className="text-[11px] text-slate-500">Last 365 days</span>
                        </div>
                        <ActivityHeatmap />
                    </div>

                    {/* Timeline */}
                    <div className="glass-card p-5 rounded-2xl flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold dark:text-white text-slate-900 flex items-center gap-2">
                                <History className="w-4 h-4 text-blue-400" />
                                Patient Medical Timeline
                            </h3>
                            <span className="badge badge-active text-[10px]">{patientTimeline.length} events</span>
                        </div>

                        <div className="relative pl-3 space-y-6 before:absolute before:inset-y-0 before:left-[21px] before:w-px before:bg-slate-200 dark:before:bg-white/[0.08]">
                            {patientTimeline.map(ev => {
                                const Icon = iconMap[ev.icon] || Activity;
                                return (
                                    <div key={ev.id} className="relative flex gap-4 pr-2 group">
                                        <div className="absolute left-[-3px] top-1 w-6 h-6 rounded-full bg-white dark:bg-[#0f172a] border-4 border-slate-100 dark:border-[#0f172a] flex items-center justify-center z-10 transition-colors group-hover:bg-blue-400/20">
                                            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 transition-colors group-hover:bg-blue-400" />
                                        </div>
                                        <div className="ml-10 flex-1">
                                            <div className="flex sm:items-center flex-col sm:flex-row gap-1 sm:gap-3 mb-1">
                                                <h4 className="font-semibold text-[13px] dark:text-white text-slate-900 group-hover:text-blue-400 transition-colors">
                                                    {ev.title}
                                                </h4>
                                                <div className="flex items-center gap-2 text-[10px]">
                                                    <span className="text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded font-medium">{ev.type}</span>
                                                    <span className="text-slate-500">{ev.date}</span>
                                                </div>
                                            </div>
                                            <p className="text-[12px] text-slate-500 leading-relaxed max-w-xl">
                                                {ev.description}
                                            </p>
                                            {(ev.doctor || ev.hospital) && (
                                                <div className="flex gap-3 mt-2 text-[10px] text-slate-400 bg-black/[0.02] dark:bg-white/[0.02] p-2 rounded-lg w-max">
                                                    {ev.doctor && <span>👨‍⚕️ {ev.doctor}</span>}
                                                    {ev.hospital && <span>🏥 {ev.hospital}</span>}
                                                </div>
                                            )}
                                        </div>

                                        <Icon className="hidden sm:block absolute right-0 top-1 w-5 h-5 text-slate-200 dark:text-white/[0.04] group-hover:text-blue-400/20 transition-colors" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
