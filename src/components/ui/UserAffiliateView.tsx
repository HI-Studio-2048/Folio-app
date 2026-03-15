"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Gift, Link2, Copy, Check, Users, DollarSign,
    TrendingUp, Wallet, ArrowUpRight, Shield, Star,
    ChevronRight, Sparkles, Send, Clock, CircleDot
} from "lucide-react";
import { cn } from "@/lib/utils";

export function UserAffiliateView() {
    const [affiliate, setAffiliate] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoining, setIsJoining] = useState(false);
    const [copied, setCopied] = useState(false);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/user/affiliate");
            if (res.ok) {
                const data = await res.json();
                setAffiliate(data);
            }
        } catch (e) {
            console.error("Failed to fetch affiliate profile", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleJoin = async () => {
        setIsJoining(true);
        try {
            const res = await fetch("/api/user/affiliate", { method: "POST" });
            if (res.ok) {
                const data = await res.json();
                setAffiliate(data);
            }
        } catch (e) {
            console.error("Failed to join", e);
        } finally {
            setIsJoining(false);
        }
    };

    const copyLink = () => {
        if (!affiliate) return;
        const link = `https://follio.app/signup?ref=${affiliate.ref_code}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading Affiliate Dashboard...</p>
            </div>
        );
    }

    if (!affiliate) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-3xl border border-slate-700/50 p-12 text-center space-y-8 relative overflow-hidden"
                >
                    {/* Decorative bits */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-xl shadow-purple-500/20 mb-4">
                        <Gift size={40} className="text-white" />
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-4xl font-outfit font-black text-white leading-tight">
                            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Partner Program</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto">
                            Share Follio with your network and earn ongoing commissions. Help others track their visual wealth while building your own.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                        <BenefitCard
                            icon={DollarSign}
                            title="30% Recurring"
                            desc="Receive 30% of every subscription for as long as they stay subscribed."
                        />
                        <BenefitCard
                            icon={Users}
                            title="Build Your Team"
                            desc="Earn a 10% bonus on top of the earnings of any partner you refer to Follio."
                        />
                        <BenefitCard
                            icon={Wallet}
                            title="Monthly Payouts"
                            desc="Quick payouts via PayPal or Stripe once you hit the $50 threshold."
                        />
                    </div>

                    <div className="pt-8">
                        <button
                            onClick={handleJoin}
                            disabled={isJoining}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-5 rounded-2xl text-lg font-black shadow-2xl shadow-purple-600/30 transition-all flex items-center gap-3 mx-auto active:scale-95 disabled:opacity-50"
                        >
                            {isJoining ? "Preparing your account..." : <><Sparkles size={24} /> Become a Partner Today</>}
                        </button>
                        <p className="text-slate-600 text-[10px] mt-4 uppercase tracking-[0.2em] font-bold">No application fee · Instant activation</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Stats calculations
    const stats = [
        { label: "Total Earned", value: `$${(affiliate.total_earned || 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-400" },
        { label: "Pending Payout", value: `$${(affiliate.pending_payout || 0).toLocaleString()}`, icon: Wallet, color: "text-blue-400" },
        { label: "Total Clicks", value: (affiliate.total_clicks || 0).toLocaleString(), icon: TrendingUp, color: "text-purple-400" },
        { label: "Sales Count", value: (affiliate.total_conversions || 0).toString(), icon: Users, color: "text-amber-400" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-8 pb-12"
        >
            {/* Header / Top Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-purple-400 uppercase tracking-widest">
                            Affiliate Dashboard
                        </div>
                        {affiliate.tier === 'elite' && (
                            <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                                <Star size={10} fill="currentColor" /> Elite
                            </div>
                        )}
                    </div>
                    <h1 className="text-3xl font-outfit font-black text-white">Your Affiliate Dashboard</h1>
                    <p className="text-slate-500 text-sm">Managing your referrals and earnings</p>
                </div>

                {/* Referral Card */}
                <div className="glass-card rounded-2xl border border-slate-700/50 p-1.5 flex flex-col sm:flex-row items-center gap-3 min-w-0 md:w-fit">
                    <div className="px-4 py-3 bg-slate-950/40 rounded-xl border border-slate-800/60 font-mono text-sm text-purple-400 truncate max-w-xs">
                        follio.app/signup?ref={affiliate.ref_code}
                    </div>
                    <button
                        onClick={copyLink}
                        className={cn(
                            "w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                            copied ? "bg-emerald-600 text-white" : "bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-600/10"
                        )}
                    >
                        {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Link</>}
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 relative group hover:border-slate-700 transition-all shadow-lg"
                    >
                        <div className={cn("w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center", stat.color)}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black text-white font-mono">{stat.value}</h3>
                        </div>
                        <div className="absolute top-4 right-4 text-slate-800 group-hover:text-slate-700 transition-colors">
                            <stat.icon size={32} strokeWidth={1} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main: Conversion History */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-outfit font-bold text-white flex items-center gap-2">
                        <Clock size={20} className="text-blue-400" /> Recent Conversions
                    </h2>

                    <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/60">
                        {affiliate.conversions && affiliate.conversions.length > 0 ? (
                            affiliate.conversions.map((conv: any, i: number) => (
                                <div key={i} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                                            <CircleDot size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Sale Confirmed</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Ref: SUB-{conv.id.slice(0, 5).toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-emerald-400 font-bold mb-0.5">+${conv.commission_earned.toFixed(2)}</div>
                                        <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{new Date(conv.created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-16 text-center space-y-4">
                                <div className="p-4 rounded-full bg-slate-900 border border-slate-800 w-fit mx-auto text-slate-600">
                                    <TrendingUp size={32} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-300 font-bold">No conversions yet</p>
                                    <p className="text-slate-500 text-xs">Share your link to start earning commissions!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Program Info */}
                <div className="space-y-6">
                    <h2 className="text-xl font-outfit font-bold text-white flex items-center gap-2">
                        <Shield size={20} className="text-purple-400" /> Program Details
                    </h2>

                    <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Commission Tier</h3>
                            <div className="p-4 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-white capitalize">{affiliate.tier} Level</p>
                                    <p className="text-[10px] text-purple-400 font-bold mt-0.5">{affiliate.commission_pct}% DIRECT CUT</p>
                                </div>
                                <Shield className="text-purple-500" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Partner Benefits</h3>
                            <BenefitMini icon={Check} text="Recurring lifetime payments" />
                            <BenefitMini icon={Check} text="24/7 conversion tracking" />
                            <BenefitMini icon={Check} text="10% Partner Team commissions" />
                            <BenefitMini icon={Check} text="Direct partner support" />
                        </div>

                        <div className="pt-4 border-t border-slate-800/60">
                            <p className="text-[10px] text-slate-500 leading-relaxed text-center italic">
                                Earnings are paid monthly once a balance of $50 is reached.
                            </p>
                        </div>
                    </div>

                    {/* Support Box */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-500/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Sparkles size={64} className="text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Need Marketing Assets?</h3>
                        <p className="text-blue-100/80 text-xs leading-relaxed mb-4">
                            Get access to banners, social templates, and branding kits to help you refer more users.
                        </p>
                        <button className="w-full py-2 bg-white text-blue-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                            Access Partner Kit <ArrowUpRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function BenefitCard({ icon: Icon, title, desc }: any) {
    return (
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/60 text-center space-y-3">
            <div className="mx-auto w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-purple-400">
                <Icon size={20} />
            </div>
            <h3 className="text-white font-bold">{title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
        </div>
    );
}

function BenefitMini({ icon: Icon, text }: any) {
    return (
        <div className="flex items-center gap-3 text-xs text-slate-300">
            <div className="p-1 rounded bg-emerald-500/10 text-emerald-500">
                <Icon size={12} />
            </div>
            {text}
        </div>
    );
}
