"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { patientList, vaultRecords, prescriptions, patientCompliance, VAULT_TAGS, type VaultTag, patientTimeline } from "@/lib/data";
import {
    ArrowLeft, FileText, Image as ImageIcon, Activity, Shield,
    Phone, Calendar, Pill, Lock, Unlock, Brain, Eye, Flame, TrendingUp, Tag, X,
    History, CalendarDays, Droplets, AlertTriangle
} from "lucide-react";
import HealthGrid from "@/components/health-grid";
import ActivityHeatmap from "@/components/activity-heatmap";

const iconMap: Record<string, React.ElementType> = {
    "file-text": FileText,
    "image": ImageIcon,
    "activity": Activity,
    "droplets": Droplets,
    "pill": Pill,
    "alert-triangle": AlertTriangle,
};

export default function PatientDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const patient = patientList.find(p => p.id === id);

    if (!patient) {
        return (
            <div className="text-center py-20 text-slate-500">
                Patient not found.
                <button onClick={() => router.back()} className="block mx-auto mt-4 btn-ghost text-sm">Go Back</button>
            </div>
        );
    }

    const patientRecords = vaultRecords.filter(r => r.sharedWith.includes("D001"));
    const patientRx = prescriptions.filter(r => r.patientId === patient.id);
    const compliance = patientCompliance[patient.id] ?? null;
    const [activeTagFilter, setActiveTagFilter] = useState<VaultTag[]>([]);

    // collect tags present in accessible records
    const availableTags = Array.from(new Set(
        patientRecords.flatMap(r => r.tags ?? [])
    )) as VaultTag[];

    const filteredRecords = activeTagFilter.length === 0
        ? patientRecords
        : patientRecords.filter(r => activeTagFilter.every(t => (r.tags ?? []).includes(t)));



    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto">
            {/* Back */}
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Patients
            </button>

            {/* Patient Header */}
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 to-teal-500/5" />
                <div className="relative flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0 ${patient.riskLevel === "High" ? "bg-red-500/15 text-red-300" :
                        patient.riskLevel === "Medium" ? "bg-yellow-500/15 text-yellow-300" :
                            "bg-green-500/15 text-green-300"
                        }`}>
                        {patient.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-xl font-bold dark:text-white text-slate-900">{patient.name}</h2>
                            <span className={`badge text-[10px] ${patient.status === "Critical" ? "badge-critical" : patient.status === "Stable" ? "badge-stable" : "badge-active"}`}>
                                {patient.status}
                            </span>
                        </div>
                        <div className="text-sm text-slate-400 mt-1">{patient.condition}</div>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{patient.phone}</span>
                            <span>Age {patient.age} · DOB {patient.dob}</span>
                            <span>Blood Type: {patient.bloodType}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Next: {patient.nextAppointment}</span>
                        </div>
                    </div>
                    <div>
                        {patient.accessGranted ? (
                            <div className="flex items-center gap-1.5 text-xs text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-full">
                                <Unlock className="w-3 h-3" /> Records Access Granted
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 inner-card border border-black/[0.08] dark:border-white/10 px-3 py-1.5 rounded-full">
                                <Lock className="w-3 h-3" /> No Record Access
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Records */}
                <div className="glass-card p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold dark:text-white text-slate-900 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-teal-400" />
                            Medical Records
                        </h3>
                        <span className="text-xs text-slate-500">{filteredRecords.length}/{patientRecords.length} shown</span>
                    </div>
                    {/* Tag filter */}
                    {availableTags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap mb-3">
                            <Tag className="w-3 h-3 text-slate-500 flex-shrink-0" />
                            {availableTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setActiveTagFilter(prev =>
                                        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                                    )}
                                    className={`text-[10px] px-2 py-0.5 rounded-full border transition-all font-medium ${activeTagFilter.includes(tag)
                                        ? "bg-teal-400/15 border-teal-400/30 text-teal-400"
                                        : "inner-card text-slate-500 hover:border-teal-400/30"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                            {activeTagFilter.length > 0 && (
                                <button onClick={() => setActiveTagFilter([])} className="text-[10px] text-slate-500 flex items-center gap-0.5 hover:text-red-400 transition-colors">
                                    <X className="w-3 h-3" /> clear
                                </button>
                            )}
                        </div>
                    )}
                    <div className="space-y-2">
                        {filteredRecords.map(rec => {
                            const Icon = iconMap[rec.icon] || FileText;
                            return (
                                <div key={rec.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors cursor-pointer group">
                                    <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-4 h-4 text-teal-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-medium dark:text-white text-slate-800 truncate">{rec.name}</div>
                                        <div className="text-[10px] text-slate-500">{rec.type} · {rec.date}</div>
                                        {(rec.tags ?? []).length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {(rec.tags ?? []).map((tag: VaultTag) => (
                                                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-teal-400/10 text-teal-400 border border-teal-400/20">{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <Eye className="w-3.5 h-3.5 text-slate-600 group-hover:text-teal-400 transition-colors flex-shrink-0 mt-1" />
                                </div>
                            );
                        })}
                        {patientRecords.length === 0 && (
                            <div className="text-center py-6 text-slate-600 text-sm">
                                <Lock className="w-6 h-6 mx-auto mb-2 opacity-30" />
                                No records accessible
                            </div>
                        )}
                    </div>
                </div>

                {/* Prescriptions */}
                <div className="glass-card p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold dark:text-white text-slate-900 flex items-center gap-2">
                            <Pill className="w-4 h-4 text-blue-400" />
                            Active Prescriptions
                        </h3>
                        <span className="text-xs text-slate-500">{patientRx.length} scripts</span>
                    </div>
                    <div className="space-y-2">
                        {patientRx.length > 0 ? patientRx.map(rx => (
                            <div key={rx.id} className="row-item p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium dark:text-white text-slate-800">{rx.medication} {rx.dosage}</span>
                                    <span className="badge badge-active text-[10px]">{rx.status}</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">{rx.frequency}</div>
                                {rx.notes && <div className="text-[10px] text-slate-600 mt-1">{rx.notes}</div>}
                            </div>
                        )) : (
                            <div className="text-center py-6 text-slate-600 text-sm">No prescriptions on file</div>
                        )}
                    </div>

                    <button onClick={() => router.push("/dashboard/doctor/ai")} className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 font-semibold hover:bg-purple-500/15 transition-colors">
                        <Brain className="w-3.5 h-3.5" />
                        Run AI Analysis for this Patient
                    </button>
                </div>
            </div>
            {/* ── Compliance & Mini Health Grid ── */}
            {compliance && (
                <div className="glass-card p-5 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-orange-400/10 border border-orange-400/20 flex items-center justify-center">
                            <Flame className="w-3.5 h-3.5 text-orange-400" />
                        </div>
                        <div>
                            <div className="card-title">Medi-Streak Compliance</div>
                            <div className="text-[10px] text-slate-600">Last 30 days · Read-only view</div>
                        </div>
                    </div>

                    {/* Score cards */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {[
                            { label: "Compliance", value: `${compliance.score30d}%`, color: compliance.score30d >= 80 ? "text-emerald-400" : compliance.score30d >= 60 ? "text-amber-400" : "text-red-400", icon: TrendingUp },
                            { label: "Cur. Streak", value: `${compliance.streak}d 🔥`, color: "text-orange-400", icon: Flame },
                            { label: "Best Streak", value: `${compliance.longestStreak}d`, color: "text-amber-400", icon: TrendingUp },
                        ].map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div key={i} className="inner-card p-3 text-center">
                                    <Icon className={`w-3.5 h-3.5 ${s.color} mx-auto mb-1`} />
                                    <div className={`text-[18px] font-black ${s.color}`}>{s.value}</div>
                                    <div className="text-[10px] text-slate-500">{s.label}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Health grid — last 12 weeks */}
                    <div className="section-label mb-2">12-Week Adherence Pattern</div>
                    <HealthGrid days={84} compact />

                </div>
            )}

            {/* ── Medical Timeline & Activity Heatmap ── */}
            <div className="grid lg:grid-cols-2 gap-6">
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
                                        <p className="text-[12px] text-slate-500 leading-relaxed">
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

                {/* Activity Heatmap */}
                <div className="glass-card p-5 rounded-2xl flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold dark:text-white text-slate-900 flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-teal-400" />
                            Overall Medical Activity
                        </h3>
                        <span className="text-[11px] text-slate-500">Last 365 days</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <ActivityHeatmap />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
