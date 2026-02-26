"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Flame, Trophy, Bell, BellOff, Check, Clock,
    TrendingUp, Shield, Pill, ChevronRight,
    Zap, Activity
} from "lucide-react";
import { streakData, todayDoses } from "@/lib/data";
import { getStoredTaken, markDoseTaken, getNotificationsEnabled, setNotificationsEnabled } from "@/lib/streak-store";
import HealthGrid from "@/components/health-grid";

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };


// ── Main Page ────────────────────────────────────────────────────────────────
export default function HealthHubPage() {
    const [taken, setTaken] = useState<string[]>([]);
    const [notifEnabled, setNotifEnabled] = useState(true);
    const [justMarked, setJustMarked] = useState<string | null>(null);

    useEffect(() => {
        const stored = getStoredTaken();
        setTaken(stored.takenIds);
        setNotifEnabled(getNotificationsEnabled());
    }, []);

    function handleMark(doseId: string) {
        const updated = markDoseTaken(doseId);
        setTaken(updated.takenIds);
        setJustMarked(doseId);
        setTimeout(() => setJustMarked(null), 2000);
    }

    function handleNotifToggle() {
        const next = !notifEnabled;
        setNotifEnabled(next);
        setNotificationsEnabled(next);
    }

    const totalTakenToday = todayDoses.filter(d => d.taken || taken.includes(d.id)).length;
    const allTakenToday = totalTakenToday === todayDoses.length;

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5 max-w-5xl mx-auto">

            {/* ── Streak Hero ─────────────────────────────────── */}
            <motion.div variants={item} className="glass-card p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/[0.06] via-teal-500/[0.04] to-transparent" />
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                        {/* Flame */}
                        <motion.div
                            animate={{ scale: [1, 1.06, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-400/10 border border-orange-400/20 flex items-center justify-center flex-shrink-0"
                        >
                            <span className="text-4xl">🔥</span>
                        </motion.div>
                        <div>
                            <div className="section-label mb-0.5">Current streak</div>
                            <div className="text-[48px] font-black tracking-tight dark:text-white text-slate-900 leading-none">
                                {streakData.currentStreak}
                                <span className="text-[18px] font-semibold text-slate-500 ml-2">days</span>
                            </div>
                            <div className="text-[12px] text-slate-500 mt-1">
                                Best: <span className="text-amber-400 font-semibold">{streakData.longestStreak} days</span>
                                &nbsp;·&nbsp; {streakData.totalPerfectDays} perfect days total
                            </div>
                        </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                        {[
                            { label: "30d Score", value: `${streakData.complianceScore30d}%`, color: "text-teal-400", icon: TrendingUp },
                            { label: "Today", value: `${totalTakenToday}/${todayDoses.length}`, color: allTakenToday ? "text-emerald-400" : "text-amber-400", icon: Pill },
                        ].map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div key={i} className="inner-card p-3 text-center">
                                    <Icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                                    <div className={`text-[20px] font-black ${s.color}`}>{s.value}</div>
                                    <div className="text-[10px] text-slate-500">{s.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>

            {/* ── Today's Doses ────────────────────────────────── */}
            <motion.div variants={item} className="glass-card p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="card-title flex items-center gap-2">
                        <Pill className="w-4 h-4 text-teal-400" />
                        Today&apos;s Doses
                    </div>
                    <div className={`badge text-[10px] ${allTakenToday ? "badge-stable" : "badge-monitoring"}`}>
                        {allTakenToday ? "All taken ✓" : `${todayDoses.length - totalTakenToday} pending`}
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                    {todayDoses.map((dose) => {
                        const isTaken = dose.taken || taken.includes(dose.id);
                        const wasJustMarked = justMarked === dose.id;
                        return (
                            <motion.div
                                key={dose.id}
                                layout
                                className={`p-4 rounded-xl border transition-all ${isTaken
                                    ? "bg-emerald-400/[0.06] border-emerald-400/20"
                                    : "row-item"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[11px] font-bold uppercase tracking-wider ${isTaken ? "text-emerald-400" : "text-amber-400"
                                                }`}>{dose.label}</span>
                                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                                <Clock className="w-2.5 h-2.5" />{dose.time}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {dose.meds.map(m => (
                                                <span key={m} className="chip-tag">{m}</span>
                                            ))}
                                        </div>
                                    </div>
                                    {isTaken ? (
                                        <motion.div
                                            initial={wasJustMarked ? { scale: 0.5, opacity: 0 } : false}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="w-8 h-8 rounded-lg bg-emerald-400/15 border border-emerald-400/25 flex items-center justify-center flex-shrink-0"
                                        >
                                            <Check className="w-4 h-4 text-emerald-400" />
                                        </motion.div>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={() => handleMark(dose.id)}
                                            className="px-3 py-1.5 rounded-lg bg-teal-500/15 border border-teal-500/25 text-teal-400 text-[11px] font-semibold hover:bg-teal-500/25 transition-all flex-shrink-0"
                                        >
                                            Mark taken
                                        </motion.button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <AnimatePresence>
                    {allTakenToday && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-4 p-3 rounded-xl bg-emerald-400/[0.08] border border-emerald-400/20 flex items-center gap-3"
                        >
                            <span className="text-2xl">🎉</span>
                            <div>
                                <div className="text-[13px] font-semibold dark:text-white text-slate-900">All doses taken today!</div>
                                <div className="text-[11px] text-slate-500">Your streak continues. Keep it up!</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ── Badges ───────────────────────────────────────── */}
            <motion.div variants={item} className="glass-card p-5 rounded-2xl">
                <div className="card-title flex items-center gap-2 mb-4">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    Achievements
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {streakData.badges.map((badge) => (
                        <motion.div
                            key={badge.id}
                            whileHover={badge.unlocked ? { scale: 1.04 } : undefined}
                            className={`p-4 rounded-xl text-center border transition-all ${badge.unlocked
                                ? "bg-amber-400/[0.08] border-amber-400/25"
                                : "inner-card opacity-50"
                                }`}
                        >
                            <div className={`text-3xl mb-2 ${badge.unlocked ? "" : "grayscale opacity-50"}`}>
                                {badge.emoji}
                            </div>
                            <div className={`text-[11px] font-semibold tracking-tight ${badge.unlocked ? "dark:text-white text-slate-900" : "text-slate-500"}`}>
                                {badge.label}
                            </div>
                            {badge.unlocked ? (
                                <div className="text-[9px] text-amber-400 mt-0.5">Unlocked {badge.unlockedAt}</div>
                            ) : (
                                <div className="text-[9px] text-slate-600 mt-0.5">{badge.days - streakData.currentStreak} days to go</div>
                            )}
                            {badge.unlocked && (
                                <motion.div
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-1.5 h-1.5 rounded-full bg-amber-400 mx-auto mt-1.5"
                                />
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* ── Health Grid ─────────────────────────────────── */}
            <motion.div variants={item} className="glass-card p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="card-title flex items-center gap-2">
                        <Activity className="w-4 h-4 text-teal-400" />
                        12-Month Health Grid
                    </div>
                    <div className="text-[11px] text-slate-500">{streakData.totalPerfectDays} perfect days</div>
                </div>
                <HealthGrid />
            </motion.div>

            {/* ── Settings ────────────────────────────────────── */}
            <motion.div variants={item} className="glass-card p-5 rounded-2xl">
                <div className="card-title flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-teal-400" />
                    Reminder Settings
                </div>
                <div className="space-y-3">
                    {/* Notification toggle */}
                    <div className="flex items-center justify-between p-3 row-item">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${notifEnabled ? "bg-teal-400/15 border border-teal-400/25" : "inner-card"}`}>
                                {notifEnabled ? <Bell className="w-4 h-4 text-teal-400" /> : <BellOff className="w-4 h-4 text-slate-500" />}
                            </div>
                            <div>
                                <div className="text-[13px] font-semibold dark:text-white text-slate-800">Push Notifications</div>
                                <div className="text-[11px] text-slate-500">Browser alerts at each dose window</div>
                            </div>
                        </div>
                        <button
                            onClick={handleNotifToggle}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${notifEnabled ? "bg-teal-500" : "bg-slate-600"}`}
                        >
                            <motion.div
                                layout
                                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                                animate={{ left: notifEnabled ? "calc(100% - 22px)" : "2px" }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                    </div>

                    {/* Dose schedule overview */}
                    {[
                        { label: "Morning dose", time: "08:00 AM", icon: "🌅" },
                        { label: "Afternoon dose", time: "01:00 PM", icon: "☀️" },
                        { label: "Evening dose", time: "08:00 PM", icon: "🌆" },
                        { label: "Night dose", time: "10:00 PM", icon: "🌙" },
                    ].map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-3 row-item">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{r.icon}</span>
                                <span className="text-[13px] dark:text-white text-slate-800">{r.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] text-slate-500 font-mono">{r.time}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                            </div>
                        </div>
                    ))}

                    <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-400/[0.06] border border-blue-400/15 mt-2">
                        <Zap className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-500">
                            Reminders are sent via <strong className="dark:text-slate-300 text-slate-700">Web Push API</strong> through RabbitMQ.
                            Notifications fire 10 min before each dose window opens.
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
