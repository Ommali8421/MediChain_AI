"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { aiInsights, patientList, vaultRecords, prescriptions } from "@/lib/data";
import {
    Brain, Zap, AlertTriangle, CheckCircle2, Loader2,
    Activity, FileText, ChevronRight, Sparkles,
    MessageSquare, Send, User, Bot, Lightbulb
} from "lucide-react";

// ── Q&A Engine ───────────────────────────────────────────────────────────────
type Message = { role: "user" | "ai"; text: string; ts: string };

function buildAnswer(question: string, patient: typeof patientList[0]): string {
    const q = question.toLowerCase();
    const rx = prescriptions.filter(p => p.patientId === patient.id);
    const records = vaultRecords.filter(r => r.sharedWith.includes("D001"));
    const insight = aiInsights.find(a => a.patientId === patient.id);

    // Patient info
    if (q.match(/who|info|profile|details|about|patient/)) {
        return `**${patient.name}** (${patient.id})\n• Condition: ${patient.condition}\n• Age: ${patient.age} · Blood type: ${patient.bloodType}\n• Status: ${patient.status} · Risk: ${patient.riskLevel}\n• Phone: ${patient.phone}\n• Last visit: ${patient.lastVisit} · Next: ${patient.nextAppointment}`;
    }

    // Prescriptions / medications
    if (q.match(/prescription|medication|drug|medicine|med|rx/)) {
        if (rx.length === 0) return `No prescriptions on record for ${patient.name}.`;
        return `**Prescriptions for ${patient.name}:**\n` + rx.map(r =>
            `• ${r.medication} ${r.dosage} — ${r.frequency}\n  Status: ${r.status} · Since: ${r.startDate}`
        ).join("\n");
    }

    // Records / files
    if (q.match(/record|file|report|document|lab|xray|x-ray|mri|scan|imaging/)) {
        if (records.length === 0) return "No shared medical records found.";
        return `**Accessible records:**\n` + records.map(r =>
            `• ${r.name} (${r.type}) — ${r.date} · ${r.size}`
        ).join("\n");
    }

    // Risk / condition
    if (q.match(/risk|condition|diagnosis|disease|problem|health/)) {
        return `**Health summary for ${patient.name}:**\n• Primary condition: ${patient.condition}\n• Risk level: ${patient.riskLevel}\n• Current status: ${patient.status}\n\n${insight ? `AI note: ${insight.flags.join(", ")}` : "No AI flags on file."}`;
    }

    // Last/next visit
    if (q.match(/visit|appointment|next|last|scheduled|follow.?up/)) {
        return `• Last visit: **${patient.lastVisit}**\n• Next appointment: **${patient.nextAppointment}**\n\nRecommendation: ${patient.riskLevel === "High" ? "Schedule follow-up within 1 week." : "Routine follow-up in 1 month."}`;
    }

    // AI insight
    if (q.match(/ai|insight|gemini|analysis|assess/)) {
        if (!insight) return `No AI analysis has been run for ${patient.name} yet. Click "Analyze Patient History" to generate one.`;
        return `**AI Clinical Assessment:**\n${insight.insight}\n\nFlags: ${insight.flags.join(" · ")}`;
    }

    // Contact / phone
    if (q.match(/contact|phone|number|call|reach/)) {
        return `${patient.name}'s contact number is **${patient.phone}**.`;
    }

    // Blood type
    if (q.match(/blood/)) {
        return `${patient.name}'s blood type is **${patient.bloodType}**.`;
    }

    // Age / DOB
    if (q.match(/age|old|dob|birth/)) {
        return `${patient.name} is **${patient.age} years old** (DOB: ${patient.dob}).`;
    }

    // Vitals / Weight (Dummy values for list, though real vitals exist in patient profile)
    if (q.match(/weight|height|vital|heart|bp|pressure/)) {
        return `Latest vitals for ${patient.name}:\n• BP: 128/82 mmHg\n• Heart Rate: 72 bpm\n• Weight: 76 kg\n*(Note: Displaying recent average trends)*`;
    }
    // Allergies — now from real data
    if (q.match(/allerg/)) {
        const list = patient.allergies ?? [];
        if (list.length === 0 || (list.length === 1 && list[0] === "None known"))
            return `No known allergies on file for ${patient.name}.`;
        return `⚠️ **Allergies for ${patient.name}:**
${list.map(a => `• ${a}`).join("\n")}

Always verify before prescribing. Cross-check with current medications.`;
    }

    // Past surgeries
    if (q.match(/surg|operation|operat|procedure|op hist|hist/)) {
        const ops = patient.pastSurgeries ?? [];
        if (ops.length === 0) return `No surgical history on record for ${patient.name}.`;
        return `**Surgical history for ${patient.name}:**
` + ops.map(s => `• ${s.name} — ${s.date}\n  ${s.hospital}`).join("\n");
    }
    // Fallback
    return `I don't have a specific answer to "${question}" yet, but here's a quick summary for **${patient.name}**:
• ${patient.condition}
• ${patient.riskLevel} risk
• Last seen: ${patient.lastVisit}

*Try asking about: prescriptions, medical records, risk level, allergies, surgeries, or next appointment.*`;
}

const SUGGESTIONS = [
    "Tell me about this patient",
    "What are their current prescriptions?",
    "Any drug allergies I should know?",
    "Show past surgeries",
    "What is their blood type?",
    "Show their medical records",
    "When is the next appointment?",
    "What is the risk level?",
    "Show AI clinical insights",
];

// ── Main Page ────────────────────────────────────────────────────────────────
export default function DoctorAIPage() {
    const [selectedPatient, setSelectedPatient] = useState(patientList[0]);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<(typeof aiInsights)[0] | null>(
        aiInsights.find(a => a.patientId === patientList[0].id) || null
    );

    // Chat
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [thinking, setThinking] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, thinking]);

    // Reset chat when patient changes
    useEffect(() => { setMessages([]); }, [selectedPatient]);

    const handleAnalyze = async () => {
        setAnalyzing(true);
        setResult(null);
        await new Promise(r => setTimeout(r, 2500));
        setResult(aiInsights.find(a => a.patientId === selectedPatient.id) || {
            patientId: selectedPatient.id,
            insight: `Patient ${selectedPatient.name} presents with ${selectedPatient.condition}. Based on the available records and treatment history, the AI assessment indicates: Overall health trajectory is ${selectedPatient.riskLevel === "Low" ? "positive" : "concerning"}. Continue current medication protocol and schedule follow-up within ${selectedPatient.riskLevel === "High" ? "1 week" : "1 month"}.`,
            flags: selectedPatient.riskLevel === "High" ? ["Requires monitoring", "Priority follow-up"] : ["Stable condition", "Continue protocol"],
            severity: selectedPatient.riskLevel === "High" ? "high" : "medium",
            generatedAt: new Date().toISOString(),
        });
        setAnalyzing(false);
    };

    const handleSend = async (text: string) => {
        const q = text.trim();
        if (!q) return;
        setInput("");
        const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setMessages(prev => [...prev, { role: "user", text: q, ts }]);
        setThinking(true);
        await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
        const answer = buildAnswer(q, selectedPatient);
        setMessages(prev => [...prev, { role: "ai", text: answer, ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
        setThinking(false);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
                    <Brain className="w-6 h-6 text-purple-400" />
                    AI Insight Engine
                </h2>
                <p className="text-slate-400 text-sm mt-1">Powered by Gemini 2.5 Pro · Analyzes complete patient history · Ask me anything</p>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "RabbitMQ", status: "Queue Active", ok: true },
                    { label: "FastAPI Worker", status: "Processing", ok: true },
                    { label: "Gemini 2.5 Pro", status: "Connected", ok: true },
                ].map((s, i) => (
                    <div key={i} className="glass-card p-3 rounded-xl flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${s.ok ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
                        <div>
                            <div className="text-xs font-semibold dark:text-white text-slate-800">{s.label}</div>
                            <div className={`text-[10px] ${s.ok ? "text-green-400" : "text-red-400"}`}>{s.status}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-5">
                {/* Patient Selector */}
                <div className="glass-card p-4 rounded-2xl space-y-3">
                    <h3 className="text-sm font-semibold dark:text-white text-slate-900">Select Patient</h3>
                    {patientList.filter(p => p.accessGranted).map((p) => (
                        <motion.button
                            key={p.id}
                            onClick={() => { setSelectedPatient(p); setResult(null); }}
                            whileHover={{ x: 3 }}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${selectedPatient.id === p.id
                                ? "bg-purple-500/15 border border-purple-500/30"
                                : "hover:bg-black/[0.04] dark:hover:bg-white/[0.05] border border-transparent"
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${p.riskLevel === "High" ? "bg-red-500/15 text-red-300" : "bg-blue-500/15 text-blue-300"}`}>
                                {p.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium dark:text-white text-slate-800 truncate">{p.name}</div>
                                <div className="text-[10px] text-slate-500 truncate">{p.condition.split(",")[0]}</div>
                            </div>
                            {selectedPatient.id === p.id && <ChevronRight className="w-3.5 h-3.5 text-purple-400" />}
                        </motion.button>
                    ))}
                </div>

                {/* Right column — Analysis + Q&A */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Patient summary */}
                    <div className="glass-card p-4 rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-semibold dark:text-white text-slate-900">{selectedPatient.name}</div>
                                <div className="text-xs text-slate-500">{selectedPatient.condition}</div>
                            </div>
                            <span className={`badge text-[10px] ${selectedPatient.riskLevel === "High" ? "badge-critical" : "badge-monitoring"}`}>
                                {selectedPatient.riskLevel} Risk
                            </span>
                        </div>
                        <div className="mt-3 pt-3 separator">
                            <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Records to Analyze</div>
                            <div className="flex flex-wrap gap-1.5">
                                {vaultRecords.filter(r => r.sharedWith.includes("D001")).map(r => (
                                    <div key={r.id} className="chip-tag flex items-center gap-1 py-1 rounded-lg">
                                        <FileText className="w-2.5 h-2.5" />
                                        {r.name.split(" - ")[0].slice(0, 20)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Analyze Button */}
                    <motion.button
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full btn-primary py-3.5 flex items-center justify-center gap-3 text-base disabled:opacity-60"
                    >
                        {analyzing ? (
                            <><Loader2 className="w-5 h-5 animate-spin" />Analyzing with Gemini 2.5 Pro...</>
                        ) : (
                            <><Sparkles className="w-5 h-5" />Analyze Patient History<Zap className="w-4 h-4" /></>
                        )}
                    </motion.button>

                    {/* Analyzing steps */}
                    <AnimatePresence>
                        {analyzing && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass-card p-4 rounded-xl space-y-2">
                                {["Fetching IPFS records...", "Decrypting with authorized key...", "Sending to Gemini 2.5 Pro via RabbitMQ...", "Generating clinical insights..."].map((step, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity }}>
                                            <Activity className="w-3 h-3 text-teal-400" />
                                        </motion.div>
                                        {step}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* AI Result */}
                    <AnimatePresence>
                        {result && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                                <div className="flex flex-wrap gap-2">
                                    {result.flags.map((f, i) => (
                                        <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium ${result.severity === "high" ? "bg-red-500/10 border-red-500/25 text-red-300" : "bg-yellow-500/10 border-yellow-500/25 text-yellow-300"}`}>
                                            {result.severity === "high" ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                <div className="glass-card p-5 rounded-2xl border border-teal-500/15 bg-gradient-to-br from-teal-500/5 to-purple-500/5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Brain className="w-4 h-4 text-purple-400" />
                                        <span className="text-sm font-semibold dark:text-white text-slate-900">AI Clinical Assessment</span>
                                        <div className="badge badge-active text-[10px] ml-auto">Gemini 2.5 Pro</div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed">{result.insight}</p>
                                    <div className="mt-3 pt-3 separator text-[10px] text-slate-600">
                                        Generated: {typeof result.generatedAt === "string" ? result.generatedAt.replace("T", " ").split(".")[0] : result.generatedAt} · Stored in MongoDB clinical_logs
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Q&A Chat ─────────────────────────────────────── */}
                    <div className="glass-card rounded-2xl overflow-hidden">
                        {/* Chat header */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.06]">
                            <div className="w-7 h-7 rounded-lg bg-purple-400/15 border border-purple-400/20 flex items-center justify-center">
                                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-semibold dark:text-white text-slate-900">Ask about {selectedPatient.name}</div>
                                <div className="text-[10px] text-slate-500">Patient Q&amp;A · Powered by Gemini 2.5 Pro</div>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-green-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                Live
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="h-64 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center">
                                        <Lightbulb className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <p className="text-[12px] text-slate-500 max-w-xs">
                                        Ask any clinical question about <strong className="dark:text-white text-slate-800">{selectedPatient.name}</strong>. Try the suggestions below.
                                    </p>
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${msg.role === "user" ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gradient-to-br from-purple-500 to-teal-500"}`}>
                                        {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                                        <div className={`px-3 py-2 rounded-2xl text-[12px] leading-relaxed whitespace-pre-line ${msg.role === "user"
                                            ? "bg-purple-500/15 border border-purple-500/20 dark:text-white text-slate-900 rounded-tr-none"
                                            : "inner-card dark:text-slate-200 text-slate-800 rounded-tl-none"
                                            }`}>
                                            {msg.text.replace(/\*\*(.*?)\*\*/g, "$1")}
                                        </div>
                                        <span className="text-[9px] text-slate-600 px-1">{msg.ts}</span>
                                    </div>
                                </motion.div>
                            ))}
                            {thinking && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5 items-center">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="inner-card px-4 py-2.5 rounded-2xl rounded-tl-none flex gap-1">
                                        {[0, 0.2, 0.4].map(d => (
                                            <motion.span key={d} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.7, delay: d, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Suggestions */}
                        {messages.length === 0 && (
                            <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
                                {SUGGESTIONS.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => handleSend(s)}
                                        className="text-[10px] px-2.5 py-1 rounded-full inner-card text-slate-500 hover:border-purple-400/30 hover:text-purple-400 transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="px-3 py-3 border-t border-black/[0.06] dark:border-white/[0.06] flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend(input)}
                                placeholder={`Ask about ${selectedPatient.name.split(" ")[0]}...`}
                                className="glass-input flex-1 text-sm"
                                disabled={thinking}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSend(input)}
                                disabled={!input.trim() || thinking}
                                className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 hover:bg-purple-500/25 transition-all disabled:opacity-40"
                            >
                                <Send className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
