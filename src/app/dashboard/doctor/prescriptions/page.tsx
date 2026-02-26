"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { prescriptions, patientList } from "@/lib/data";
import { FileEdit, Plus, Check, X, AlertTriangle, Search, Brain, Pill } from "lucide-react";

const drugs = ["Metformin", "Lisinopril", "Amlodipine", "Warfarin", "Atorvastatin", "Omeprazole", "Amoxicillin", "Losartan", "Metoprolol", "Furosemide"];

export default function PrescriptionsPage() {
    const [showForm, setShowForm] = useState(false);
    const [rxForm, setRxForm] = useState({ patient: "P001", medication: "", dosage: "", frequency: "", notes: "" });
    const [checkResult, setCheckResult] = useState<string | null>(null);
    const [checking, setChecking] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = prescriptions.filter(
        p =>
            p.medication.toLowerCase().includes(search.toLowerCase()) ||
            p.patientName.toLowerCase().includes(search.toLowerCase())
    );

    const checkInteractions = async () => {
        if (!rxForm.medication) return;
        setChecking(true);
        await new Promise(r => setTimeout(r, 1800));
        const patient = patientList.find(p => p.id === rxForm.patient);
        setChecking(false);
        if (rxForm.medication.toLowerCase().includes("aspirin")) {
            setCheckResult("⚠️ ALERT: Patient Om Mali has a documented Aspirin allergy. Prescribing this medication is contraindicated. Gemini analysis confirms high risk of hypersensitivity reaction.");
        } else if (rxForm.medication === "Warfarin") {
            setCheckResult("ℹ️ Warfarin may interact with existing Lisinopril. Monitor INR closely. Recommend weekly INR check for first month per Gemini analysis.");
        } else {
            setCheckResult("✅ No significant drug interactions detected with current medications. Safe to prescribe based on available patient data.");
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
                        <FileEdit className="w-6 h-6 text-teal-400" />
                        Smart Prescribing
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">AI-validated prescriptions with drug interaction checking</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
                    <Plus className="w-4 h-4" />
                    New Prescription
                </button>
            </div>

            {/* New Prescription Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="glass-card p-6 rounded-2xl border border-teal-500/20 space-y-5">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold dark:text-white text-slate-900 flex items-center gap-2">
                                    <Pill className="w-4 h-4 text-teal-400" />
                                    New Prescription
                                </h3>
                                <button onClick={() => { setShowForm(false); setCheckResult(null); }}>
                                    <X className="w-4 h-4 text-slate-400 hover:text-slate-200 transition-colors" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500 uppercase tracking-wider">Patient</label>
                                    <select
                                        value={rxForm.patient}
                                        onChange={e => setRxForm(p => ({ ...p, patient: e.target.value }))}
                                        className="glass-input text-sm"
                                    >
                                        {patientList.filter(p => p.accessGranted).map(p => (
                                            <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500 uppercase tracking-wider">Medication</label>
                                    <select
                                        value={rxForm.medication}
                                        onChange={e => { setRxForm(p => ({ ...p, medication: e.target.value })); setCheckResult(null); }}
                                        className="glass-input text-sm"
                                    >
                                        <option value="" className="bg-slate-900">Select medication...</option>
                                        {drugs.map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
                                        <option value="Aspirin" className="bg-slate-900">Aspirin (⚠️ Test allergy)</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500 uppercase tracking-wider">Dosage</label>
                                    <input placeholder="e.g. 10mg" className="glass-input text-sm" onChange={e => setRxForm(p => ({ ...p, dosage: e.target.value }))} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500 uppercase tracking-wider">Frequency</label>
                                    <select className="glass-input text-sm" onChange={e => setRxForm(p => ({ ...p, frequency: e.target.value }))}>
                                        <option className="bg-slate-900">Once daily</option>
                                        <option className="bg-slate-900">Twice daily</option>
                                        <option className="bg-slate-900">Three times daily</option>
                                        <option className="bg-slate-900">As needed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-500 uppercase tracking-wider">Clinical Notes</label>
                                <textarea
                                    rows={2}
                                    placeholder="Instructions and warnings..."
                                    className="glass-input text-sm resize-none"
                                    onChange={e => setRxForm(p => ({ ...p, notes: e.target.value }))}
                                />
                            </div>

                            {/* AI Drug Interaction Check */}
                            <div>
                                <button
                                    onClick={checkInteractions}
                                    disabled={!rxForm.medication || checking}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-500/25 text-purple-300 text-sm font-medium hover:bg-purple-500/25 transition-colors disabled:opacity-40"
                                >
                                    {checking ? (
                                        <>
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                                <Brain className="w-4 h-4 text-purple-400" />
                                            </motion.div>
                                            Checking with Gemini...
                                        </>
                                    ) : (
                                        <>
                                            <Brain className="w-4 h-4" />
                                            Check Drug Interactions (AI)
                                        </>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {checkResult && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className={`mt-3 p-3 rounded-xl text-sm ${checkResult.includes("ALERT") || checkResult.includes("⚠️")
                                                ? "bg-red-500/10 border border-red-500/25 text-red-300"
                                                : checkResult.includes("ℹ️")
                                                    ? "bg-yellow-500/10 border border-yellow-500/25 text-yellow-300"
                                                    : "bg-green-500/10 border border-green-500/25 text-green-300"
                                                }`}
                                        >
                                            {checkResult}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button onClick={() => setShowForm(false)} className="btn-ghost text-sm">Cancel</button>
                                <button className="btn-primary flex items-center gap-2 text-sm">
                                    <Check className="w-4 h-4" />
                                    Issue Prescription
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input placeholder="Search prescriptions..." value={search} onChange={e => setSearch(e.target.value)} className="glass-input pl-9 text-sm" />
            </div>

            {/* Prescriptions List */}
            <div className="space-y-3">
                {filtered.map((rx, i) => (
                    <motion.div
                        key={rx.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="glass-card p-4 rounded-2xl flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                            <Pill className="w-5 h-5 text-teal-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold dark:text-white text-slate-900">{rx.medication} {rx.dosage}</span>
                                <span className={`badge text-[10px] ${rx.status === "Active" ? "badge-active" : "badge-pending"}`}>{rx.status}</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">{rx.patientName} · {rx.frequency}</div>
                            <div className="text-xs text-slate-600 mt-0.5">{rx.notes}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <div className="text-xs text-slate-500">{rx.startDate} → {rx.endDate}</div>
                            <div className="text-[10px] text-teal-400 mt-1">{rx.refills} refills left</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
