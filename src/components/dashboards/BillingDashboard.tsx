"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, AlertCircle, Clock, Zap, Star, Shield, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Subscription {
    plan: string;
    status: string;
    current_period_end: string;
}

export function BillingDashboard() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const response = await fetch("/api/user/subscription");
                const data = await response.json();
                setSubscription(data);
            } catch (error) {
                console.error("Failed to fetch subscription:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscription();
    }, []);

    const plans = [
        { name: "Free", icon: Shield, color: "slate" },
        { name: "Pro", icon: Zap, color: "blue" },
        { name: "Enterprise", icon: Star, color: "purple" }
    ];

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="text-blue-500 animate-spin" size={32} />
            </div>
        );
    }

    const currentPlan = plans.find(p => p.name === (subscription?.plan || "Free")) || plans[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">Subscription & Billing</h1>
                <p className="text-slate-400">Manage your plan, payment methods, and billing history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-3xl border border-slate-800/60 bg-slate-950/20 backdrop-blur-sm col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Plan</h3>
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-2 rounded-xl border",
                                    currentPlan.color === "blue" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                                        currentPlan.color === "purple" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                                            "bg-slate-800 border-slate-700 text-slate-400"
                                )}>
                                    <currentPlan.icon size={20} />
                                </div>
                                <span className="text-2xl font-bold text-white">{currentPlan.name} Plan</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                subscription?.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-500 border border-slate-700"
                            )}>
                                {subscription?.status || "Inactive"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                            <div className="text-slate-400">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Next Renewal</p>
                                <p className="text-sm font-bold text-slate-200">
                                    {subscription?.current_period_end
                                        ? new Date(subscription.current_period_end).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => window.location.href = "/#pricing"}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20"
                            >
                                {subscription?.plan === "Free" ? "Upgrade Plan" : "Change Plan"}
                            </button>
                            <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-2xl text-sm font-bold transition-all border border-slate-700">
                                Billing Portal
                            </button>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-slate-800/60 bg-slate-950/20 backdrop-blur-sm space-y-6">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Usage Limit</h3>
                    <div className="space-y-5">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-400">Asset Nodes</span>
                                <span className="text-xs font-mono text-white">5 / {subscription?.plan === "Free" ? "5" : "∞"}</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-blue-500 h-full w-[100%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-400">AI Analysis</span>
                                <span className="text-xs font-mono text-white">2 / {subscription?.plan === "Free" ? "5" : "∞"}</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[40%]"></div>
                            </div>
                        </div>
                    </div>

                    {subscription?.plan === "Free" && (
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <div className="flex items-center gap-2 text-blue-400 mb-2">
                                <AlertCircle size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Limit Reached</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                You have used all available asset nodes on the Free plan. Upgrade to Pro for unlimited nodes.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="glass-card rounded-3xl border border-slate-800/60 bg-slate-950/20 overflow-hidden">
                <div className="p-6 border-b border-slate-800/60">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Invoices</h3>
                </div>
                <div className="divide-y divide-slate-800/40">
                    <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-500">
                                <CreditCard size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Pro Plan - March 2026</p>
                                <p className="text-[10px] text-slate-500 font-mono">INV-2026-001</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-white">$29.00</p>
                            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Paid</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
