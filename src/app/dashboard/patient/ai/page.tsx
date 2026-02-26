"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, AlertCircle, CheckCircle2, Activity, Loader2, Heart } from "lucide-react";

const commonSymptoms = [
    "Headache", "Chest pain", "Shortness of breath", "Fatigue",
    "Dizziness", "Nausea", "Joint pain", "Fever"
];

const mockResponses: Record<string, string> = {
    default: `Based on the symptoms you've described, here's my analysis:

**Assessment:**
Your symptoms suggest a possible tension headache combined with mild dehydration. Given your medical history (hypertension, Type 2 Diabetes), I recommend monitoring closely.

**Key Observations:**
• Headache + fatigue can be related to elevated blood pressure
• Blood glucose fluctuations may contribute to these symptoms
• Possible correlation with your Metformin timing

**Immediate Recommendations:**
1. Check your blood pressure — if >140/90, contact Dr. Sharma
2. Ensure adequate hydration (8+ glasses of water today)
3. Verify your morning Metformin was taken with food

**When to Seek Urgent Care:**
⚠️ If chest tightness or severe dizziness develops, seek immediate care.

*This analysis is AI-generated for informational purposes. Always consult your physician for medical decisions.*`,
};

interface Message {
    role: "user" | "ai";
    content: string;
    timestamp: string;
}

export default function AICompanionPage() {
    const [input, setInput] = useState("");
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "ai",
            content: "Hello! I'm your AI Health Companion powered by Gemini 2.5 Pro. You can describe your symptoms, ask health questions, or tap the quick-select tags below. Remember, I complement — not replace — your doctor's advice.",
            timestamp: "Just now",
        },
    ]);
    const [loading, setLoading] = useState(false);

    const toggleSymptom = (s: string) => {
        setSelectedSymptoms((prev) =>
            prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
        );
    };

    const sendMessage = async () => {
        const text = input || selectedSymptoms.join(", ");
        if (!text.trim()) return;

        const userMsg: Message = { role: "user", content: text, timestamp: "Just now" };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setSelectedSymptoms([]);
        setLoading(true);

        await new Promise((r) => setTimeout(r, 2000));

        const aiMsg: Message = {
            role: "ai",
            content: mockResponses.default,
            timestamp: "Just now",
        };
        setMessages((prev) => [...prev, aiMsg]);
        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-5"
        >
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
                    <Bot className="w-6 h-6 text-teal-400" />
                    AI Companion
                </h2>
                <p className="text-slate-400 text-sm mt-1">Powered by Gemini 2.5 Pro · Symptom Checker & Health Advisor</p>
            </div>

            {/* Banner */}
            <div className="glass-card p-4 rounded-xl border border-teal-500/20 bg-gradient-to-r from-teal-500/5 to-purple-500/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <div className="text-sm font-semibold dark:text-white text-slate-900">Personalized to your health profile</div>
                    <div className="text-xs text-slate-400">AI has access to your medical history for context-aware analysis</div>
                </div>
                <div className="badge badge-active text-[10px] ml-auto flex-shrink-0">Gemini 2.5 Pro</div>
            </div>

            {/* Chat Window */}
            <div className="glass-card rounded-2xl overflow-hidden flex flex-col" style={{ height: "480px" }}>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${msg.role === "ai"
                                ? "bg-gradient-to-br from-teal-500 to-blue-600"
                                : "bg-gradient-to-br from-purple-500 to-pink-500"
                                }`}>
                                {msg.role === "ai" ? (
                                    <Bot className="w-4 h-4 text-white" />
                                ) : (
                                    <Heart className="w-4 h-4 text-white" />
                                )}
                            </div>

                            {/* Bubble */}
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${msg.role === "ai"
                                ? "glass-card dark:text-slate-200 text-slate-700 rounded-tl-md"
                                : "bg-teal-500/20 border border-teal-500/30 dark:text-white text-slate-900 rounded-tr-md"
                                }`}>
                                {msg.content}
                                <div className="text-[10px] text-slate-500 mt-2">{msg.timestamp}</div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Loading */}
                    <AnimatePresence>
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex gap-3"
                            >
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-md flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
                                    <span className="text-xs text-slate-400">Gemini is analyzing your symptoms...</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Quick Symptom Tags */}
                {selectedSymptoms.length > 0 || messages.length <= 1 ? (
                    <div className="px-4 py-2 border-t border-white/5">
                        <div className="text-[10px] text-slate-600 mb-2 uppercase tracking-wider">Quick Select</div>
                        <div className="flex flex-wrap gap-1.5">
                            {commonSymptoms.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => toggleSymptom(s)}
                                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${selectedSymptoms.includes(s)
                                        ? "bg-teal-500/15 border-teal-500/40 text-teal-300"
                                        : "border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-400"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : null}

                {/* Input */}
                <div className="p-4 border-t border-white/5 flex gap-2">
                    <input
                        type="text"
                        placeholder="Describe your symptoms..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        className="glass-input rounded-xl text-sm flex-1"
                    />
                    <motion.button
                        onClick={sendMessage}
                        disabled={loading || (!input.trim() && selectedSymptoms.length === 0)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-shadow"
                    >
                        <Send className="w-4 h-4 text-white" />
                    </motion.button>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-center gap-2 text-xs text-slate-600 px-1">
                <AlertCircle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                AI analysis is for informational purposes only. Always consult your physician before making medical decisions.
            </div>
        </motion.div>
    );
}
