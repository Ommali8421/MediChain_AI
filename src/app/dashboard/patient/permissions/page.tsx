"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doctorPermissions, vaultRecords } from "@/lib/data";
import {
    Shield, UserCheck, UserX, Lock, Unlock,
    ChevronDown, ChevronUp, Plus, AlertTriangle,
    Check, X, Eye, FileText
} from "lucide-react";

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemAnim = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function PermissionsPage() {
    const [expanded, setExpanded] = useState<string | null>("D001");

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <motion.div variants={itemAnim} className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-teal-400" />
                        Permission Center
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Control who can access your encrypted records</p>
                </div>
                <button className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
                    <Plus className="w-4 h-4" />
                    Grant Access
                </button>
            </motion.div>

            {/* Security Notice */}
            <motion.div variants={itemAnim} className="flex items-center gap-3 glass-card p-4 rounded-xl border border-teal-500/20 bg-teal-500/5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                    <div className="text-sm font-semibold dark:text-white text-slate-900">Zero-Trust Access Control</div>
                    <div className="text-xs text-slate-400">
                        Doctors can only decrypt files you explicitly share. Each access is logged immutably.
                    </div>
                </div>
            </motion.div>

            {/* Permission Cards */}
            <div className="space-y-3">
                {doctorPermissions.map((dp) => (
                    <motion.div key={dp.doctorId} variants={itemAnim}>
                        <div
                            className="glass-card glass-card-hover p-4 rounded-2xl cursor-pointer"
                            onClick={() => setExpanded(expanded === dp.doctorId ? null : dp.doctorId)}
                        >
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold ${dp.status === "Active" ? "bg-teal-500/15 text-teal-400" :
                                    dp.status === "Pending" ? "bg-slate-500/15 text-slate-400" :
                                        "bg-red-500/15 text-red-400"
                                    }`}>
                                    {dp.doctorName.split(" ").map(n => n[0]).join("").replace("Dr.", "D")}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm dark:text-white text-slate-900">{dp.doctorName}</span>
                                        <span className={`badge text-[10px] ${dp.status === "Active" ? "badge-active" :
                                            dp.status === "Pending" ? "badge-pending" : "badge-critical"
                                            }`}>
                                            {dp.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                                        <span>{dp.specialty}</span>
                                        <span>·</span>
                                        <span>{dp.hospital}</span>
                                        {dp.grantedDate && (
                                            <>
                                                <span>·</span>
                                                <span>Granted {dp.grantedDate}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="text-sm font-bold dark:text-white text-slate-900">{dp.grantedFiles.length}</div>
                                        <div className="text-[10px] text-slate-500">files</div>
                                    </div>
                                    {expanded === dp.doctorId ? (
                                        <ChevronUp className="w-4 h-4 text-slate-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-slate-400" />
                                    )}
                                </div>
                            </div>

                            {/* Expanded Content */}
                            <AnimatePresence>
                                {expanded === dp.doctorId && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="separator mt-4 pt-4 space-y-3">
                                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accessible Files</div>
                                            {vaultRecords.map((rec) => {
                                                const hasAccess = dp.grantedFiles.includes(rec.id);
                                                return (
                                                    <div key={rec.id} className="row-item flex items-center justify-between py-2 px-3">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                                                            <span className="text-xs dark:text-slate-300 text-slate-600">{rec.name}</span>
                                                            <span className="text-[10px] text-slate-600">· {rec.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {hasAccess ? (
                                                                <div className="flex items-center gap-1 text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">
                                                                    <Unlock className="w-2.5 h-2.5" /> Access Granted
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1 text-[10px] text-slate-500 inner-card px-2 py-0.5 rounded-full">
                                                                    <Lock className="w-2.5 h-2.5" /> No Access
                                                                </div>
                                                            )}
                                                            <button className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${hasAccess ? "bg-red-500/15 hover:bg-red-500/25" : "bg-teal-500/15 hover:bg-teal-500/25"
                                                                }`}>
                                                                {hasAccess
                                                                    ? <X className="w-2.5 h-2.5 text-red-400" />
                                                                    : <Check className="w-2.5 h-2.5 text-teal-400" />
                                                                }
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-2">
                                                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-400 font-semibold hover:bg-teal-500/15 transition-colors">
                                                    <UserCheck className="w-3.5 h-3.5" />
                                                    Grant All Access
                                                </button>
                                                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-semibold hover:bg-red-500/15 transition-colors">
                                                    <UserX className="w-3.5 h-3.5" />
                                                    Revoke All Access
                                                </button>
                                            </div>

                                            {dp.status === "Active" && (
                                                <div className="flex items-center gap-2 text-[10px] text-slate-600 pt-1">
                                                    <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                                    Revoking access will immediately invalidate the doctor's decryption key for these files.
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Audit Log */}
            <motion.div variants={itemAnim} className="glass-card p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-4 h-4 text-teal-400" />
                    <h3 className="text-sm font-semibold dark:text-white text-slate-900">Access Audit Log</h3>
                    <div className="blockchain-badge ml-auto">IPFS Anchored</div>
                </div>
                <div className="space-y-2">
                    {[
                        { action: "Dr. Sarah Chen viewed Annual Blood Panel", time: "Today, 09:15 AM", icon: Eye },
                        { action: "Access granted to Dr. Sarah Chen for Echocardiogram", time: "Feb 21, 2025", icon: Unlock },
                        { action: "Dr. James Patel viewed MRI Brain Scan", time: "Feb 19, 2025", icon: Eye },
                        { action: "Access revoked for HbA1c from Dr. James Patel", time: "Feb 15, 2025", icon: Lock },
                    ].map((log, i) => {
                        const Icon = log.icon;
                        return (
                            <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors">
                                <Icon className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                                <span className="text-xs dark:text-slate-300 text-slate-600 flex-1">{log.action}</span>
                                <span className="text-[10px] text-slate-600">{log.time}</span>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
}
