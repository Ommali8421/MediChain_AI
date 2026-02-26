"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Shield, Activity, Lock, Eye, EyeOff, Zap,
  Server, Database, Globe, Cpu, AlertCircle, ArrowRight
} from "lucide-react";

const features = [
  { icon: Shield, label: "End-to-End Encrypted", desc: "AES-256 client-side encryption before data leaves your device", color: "text-teal-400" },
  { icon: Database, label: "IPFS Decentralized", desc: "Your records stored on IPFS — permanent and yours forever", color: "text-blue-400" },
  { icon: Cpu, label: "AI-Powered Insights", desc: "Gemini 2.5 Pro analyses your history for actionable insights", color: "text-purple-400" },
  { icon: Globe, label: "Blockchain Verified", desc: "Tamper-proof audit trail for every access event", color: "text-amber-400" },
];

const DEMO = [
  { role: "Patient", name: "Om Mali", email: "patient@medichain.io", pass: "patient123", color: "teal" },
  { role: "Doctor", name: "Dr. Neel Patil", email: "doctor@medichain.io", pass: "doctor123", color: "blue" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => { if (user) router.replace(`/dashboard/${user.role}`); }, [user, router]);
  useEffect(() => {
    const t = setInterval(() => setActiveFeature((p) => (p + 1) % features.length), 3200);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const ok = login(email, password);
    if (!ok) { setError("Invalid credentials. Use demo credentials below."); setLoading(false); }
  };

  const fillDemo = (idx: number) => { setEmail(DEMO[idx].email); setPassword(DEMO[idx].pass); setError(""); };

  return (
    <div className="min-h-screen bg-mesh flex relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-teal animate-float" />
      <div className="orb orb-blue animate-float" style={{ animationDelay: "2s" }} />
      <div className="orb orb-purple animate-float" style={{ animationDelay: "4s" }} />

      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex flex-col justify-between w-[52%] p-12 relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20 animate-pulse-glow">
            <Activity className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-white font-bold text-[18px] tracking-tight">MediChain</span>
            <span className="text-teal-400 font-bold text-[18px]"> AI</span>
          </div>
          <div className="ml-1 badge badge-active text-[9px] font-bold tracking-wide">BETA</div>
        </div>

        {/* Hero Content */}
        <div className="space-y-10">
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/20 bg-teal-500/[0.08] text-teal-400 text-xs font-semibold"
            >
              <Zap className="w-3 h-3" />
              Gemini 2.5 Pro · IPFS · On-Chain
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[46px] font-black leading-[1.07] tracking-[-0.04em] dark:text-white text-slate-900"
            >
              Your Health,<br />
              <span className="text-teal-400">
                Decentralized
              </span>
              <br />& Intelligent.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-slate-400 text-[16px] leading-relaxed max-w-sm"
            >
              Military-grade encryption meets blockchain immutability. AI-augmented insights for patients and clinicians.
            </motion.p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {features.map((f, i) => {
              const Icon = f.icon;
              const isActive = activeFeature === i;
              return (
                <motion.div
                  key={i}
                  animate={{ scale: isActive ? 1.01 : 1 }}
                  transition={{ duration: 0.3 }}
                  className={`glass-card p-4 rounded-xl transition-all duration-400 ${isActive ? "border-teal-500/30 shadow-teal-500/10" : ""
                    }`}
                  style={isActive ? { boxShadow: "0 0 24px rgba(20,184,166,0.14)" } : {}}
                >
                  <div className={`w-7 h-7 rounded-lg mb-2.5 flex items-center justify-center ${isActive ? "bg-teal-500/15" : "bg-white/[0.04]"}`}>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? f.color : "text-slate-600"}`} />
                  </div>
                  <div className="text-[12.5px] font-semibold dark:text-white text-slate-800 leading-tight">{f.label}</div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">{f.desc}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="flex gap-10">
            {[
              { val: "AES-256", label: "Encryption" },
              { val: "99.9%", label: "Uptime SLA" },
              { val: "HIPAA", label: "Compliant" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-[22px] font-black text-teal-400 tracking-tight">{s.val}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 text-[11px] text-slate-700">
          <span>© 2025 MediChain AI</span>
          <span className="text-slate-800">·</span>
          <span className="hover:text-teal-400 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="text-slate-800">·</span>
          <span className="hover:text-teal-400 cursor-pointer transition-colors">Terms of Use</span>
        </div>
      </motion.div>

      {/* Right Panel — Login */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 flex items-center justify-center p-8 relative z-10"
      >
        <div className="w-full max-w-sm space-y-5">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Activity className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-[18px] tracking-tight">MediChain<span className="text-teal-400"> AI</span></span>
          </div>

          {/* Form Card */}
          <div className="glass-card p-7 space-y-5" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div>
              <h2 className="text-[22px] font-bold dark:text-white text-slate-900 tracking-tight">Welcome back</h2>
              <p className="text-slate-500 text-[13px] mt-1">Sign in to your secure health portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="section-label">Email</label>
                <input
                  type="email"
                  className="glass-input"
                  placeholder="you@medichain.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="section-label">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    className="glass-input pr-12"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-[12.5px]"
                  >
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-1"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full"
                    />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    Secure Sign In
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="demo-divider" />
              <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Demo</span>
              <div className="demo-divider" />
            </div>

            {/* Demo Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              {DEMO.map((d, i) => (
                <motion.button
                  key={i}
                  onClick={() => fillDemo(i)}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 ${i === 0
                    ? "bg-teal-500/[0.07] border-teal-500/20 hover:border-teal-500/40 hover:bg-teal-500/12"
                    : "bg-blue-500/[0.07] border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/12"
                    }`}
                >
                  <div className={`text-[11px] font-bold tracking-wide uppercase mb-1 ${i === 0 ? "text-teal-400" : "text-blue-400"}`}>
                    {d.role}
                  </div>
                  <div className="text-[11px] font-medium dark:text-slate-300 text-slate-700 mb-0.5">{d.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">{d.email}</div>
                </motion.button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-700">
              <Server className="w-3 h-3" />
              <span>All data encrypted end-to-end · No real PHI stored</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
