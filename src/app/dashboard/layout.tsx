"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) router.replace("/");
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-mesh flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center animate-pulse-glow">
                        <svg className="w-6 h-6 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    </div>
                    <p className="text-slate-400 text-sm">Loading MediChain...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex h-screen bg-mesh overflow-hidden">
            {/* Background orbs */}
            <div className="orb orb-teal" style={{ opacity: 0.07 }} />
            <div className="orb orb-blue" style={{ opacity: 0.05 }} />

            <Sidebar />

            <div className="flex flex-col flex-1 min-w-0 relative z-10">
                <Topbar />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 lg:p-6 page-enter">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
