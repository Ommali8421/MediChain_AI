"use client";

import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Shield, Activity, Lock, Database, Globe, Cpu, ArrowRight,
  Server, Fingerprint, ActivitySquare, Brain, Eye
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: [0.21, 0.47, 0.32, 0.98]
      }
    })
  };

  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden text-slate-900 dark:text-white pb-20">
      {/* Background Orbs */}
      <div className="orb orb-teal animate-float opacity-70" />
      <div className="orb orb-blue animate-float opacity-50" style={{ animationDelay: "2s", left: "60%", top: "40%" }} />
      <div className="orb orb-purple animate-float opacity-60" style={{ animationDelay: "4s", left: "20%", top: "70%" }} />

      {/* Navbar */}
      <nav className="relative z-20 w-full px-6 py-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-bold text-[20px] tracking-tight text-slate-900 dark:text-white">MediChain</span>
            <span className="text-teal-500 dark:text-teal-400 font-bold text-[20px]"> AI</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors hidden sm:block"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/login")}
            className="btn-primary flex items-center gap-2 py-2 px-5 text-sm"
          >
            Enter Portal <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-24 pb-32 px-6 text-center max-w-5xl mx-auto">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/20 bg-teal-500/[0.08] text-teal-600 dark:text-teal-400 text-xs font-semibold mb-8"
        >
          <Globe className="w-3.5 h-3.5" />
          The Future of Web3 Healthcare
        </motion.div>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-[56px] md:text-[72px] lg:text-[84px] font-black leading-[1.05] tracking-[-0.04em] mb-8"
        >
          Your Health, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500">
            Decentralized
          </span>
          <br />& Intelligent.
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-12"
        >
          Military-grade encryption meets blockchain immutability.
          Unlock actionable, AI-augmented clinical insights while maintaining 100% ownership of your medical records.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={() => router.push("/login")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-base transition-all shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5"
          >
            Patient Access <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push("/login")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-semibold text-base transition-all hover:bg-slate-50 dark:hover:bg-white/[0.08]"
          >
            <Shield className="w-4 h-4" /> Provider Login
          </button>
        </motion.div>
      </main>

      {/* Feature Showcase Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise-Grade Architecture</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Built from the ground up to guarantee privacy, security, and interoperability across the healthcare ecosystem.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-3xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-6">
              <Lock className="w-6 h-6 text-teal-500" />
            </div>
            <h3 className="text-lg font-bold mb-3">Zero-Knowledge Vault</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Data is AES-256 encrypted directly on your device before transmission. We never hold your keys, meaning we cannot read your data.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 rounded-3xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
              <Database className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold mb-3">IPFS Storage</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Medical files are fragmented and distributed across the InterPlanetary File System, ensuring permanent, tamper-proof availability.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-3xl lg:col-span-1 md:col-span-2"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
              <Brain className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-bold mb-3">Gemini 2.5 Clinical AI</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Advanced multimodal AI analyzes longitudinal health records to flag unseen risks and summarize complex patient histories for doctors instantly.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Smart Gamification Feature Banner */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="glass-card rounded-[2.5rem] p-10 md:p-16 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/[0.05] via-transparent to-rose-500/[0.05]" />
          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-500 font-bold text-xs tracking-wider uppercase">
                New Feature
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">Medi-Streak</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                Never miss a dose again. Our gamified adherence system rewards you for taking medications on time. Track your health journey with beautiful GitHub-style activity heatmaps.
              </p>
              <ul className="space-y-3 pt-4">
                {["Smart Time-Window Reminders", "LeetCode-Style Achievement Badges", "Real-time Doctor Compliance Tracking"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Abstract visual representation */}
            <div className="relative h-[300px] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-2xl p-6">
              <div className="w-full space-y-3">
                <div className="flex gap-2 justify-end mb-4">
                  <div className="w-4 h-4 rounded-sm bg-orange-400" />
                  <div className="w-4 h-4 rounded-sm bg-orange-400/80" />
                  <div className="w-4 h-4 rounded-sm bg-orange-400/40" />
                  <div className="w-4 h-4 rounded-sm bg-orange-400/10 gap flex" />
                </div>
                {/* Fake heatmap grid */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3 w-full opacity-60">
                    {Array.from({ length: 12 }).map((_, j) => {
                      const active = Math.random() > 0.4;
                      return (
                        <motion.div
                          key={j}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: (i * 0.1) + (j * 0.05) }}
                          className={`flex-1 aspect-square rounded-md ${active ? 'bg-orange-400' : 'bg-slate-300 dark:bg-slate-700'}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA & Footer */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-16 pb-12">
        <h2 className="text-3xl font-bold mb-6">Ready to reinvent your health data?</h2>
        <button
          onClick={() => router.push("/login")}
          className="btn-primary py-4 px-10 text-base shadow-xl shadow-teal-500/20"
        >
          Access Your Vault Now
        </button>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mt-24">
          <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> HIPAA Ready</span>
          <span className="flex items-center gap-2"><Fingerprint className="w-4 h-4" /> Biometric Auth</span>
          <span className="flex items-center gap-2"><Server className="w-4 h-4" /> 99.9% Uptime</span>
        </div>
      </div>
    </div>
  );
}
