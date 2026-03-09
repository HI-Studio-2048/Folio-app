"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapIcon, BarChart3, ShieldCheck, Home, CheckCircle2, Activity, Building2, TrendingUp, Users } from "lucide-react";
import { useSettings } from "@/components/ui/settings-provider";

const features = [
    { id: "dashboard", label: "Financials", icon: BarChart3 },
    { id: "portfolio", label: "Portfolio Map", icon: MapIcon },
    { id: "pipeline", label: "Acquisitions", icon: ShieldCheck },
    { id: "agents", label: "AI Agents", icon: Users },
];

export function InteractivePreview() {
    const { t } = useSettings();
    const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeatureIndex((prev) => (prev + 1) % features.length);
        }, 6000); // cycle every 6 seconds
        return () => clearInterval(interval);
    }, []);

    const activeFeature = features[activeFeatureIndex];

    return (
        <div className="bg-slate-950 rounded-xl overflow-hidden shadow-inner aspect-video sm:aspect-[21/9] flex flex-col relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 opacity-60"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

            {/* Top Bar inside preview */}
            <div className="h-12 sm:h-14 border-b border-slate-800/60 bg-slate-900/40 relative z-10 flex items-center px-4 justify-between backdrop-blur-md">
                <div className="flex gap-2 items-center">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                    </div>
                </div>

                {/* Feature Tabs */}
                <div className="hidden sm:flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
                    {features.map((f, i) => {
                        const Icon = f.icon;
                        const isActive = i === activeFeatureIndex;
                        return (
                            <button
                                key={f.id}
                                onClick={() => setActiveFeatureIndex(i)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <Icon size={14} />
                                {f.label}
                            </button>
                        );
                    })}
                </div>

                <div className="w-16"></div> {/* spacer */}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative z-10 p-4 sm:p-6 overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {activeFeature.id === "dashboard" && <PreviewFinancials key="dashboard" />}
                    {activeFeature.id === "portfolio" && <PreviewPortfolioMap key="portfolio" />}
                    {activeFeature.id === "pipeline" && <PreviewPipeline key="pipeline" />}
                    {activeFeature.id === "agents" && <PreviewAgents key="agents" />}
                </AnimatePresence>
            </div>

            {/* Overlay Title for Mobile or visual emphasis */}
            <div className="absolute bottom-6 inset-x-0 flex items-center justify-center z-20 pointer-events-none md:hidden">
                <motion.span
                    key={activeFeature.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="px-6 py-2 rounded-full bg-slate-900/90 border border-slate-600/50 text-white font-medium shadow-2xl backdrop-blur-md text-sm"
                >
                    {activeFeature.label} Preview
                </motion.span>
            </div>
        </div>
    );
}

function PreviewFinancials() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full max-w-3xl flex flex-col gap-4"
        >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 shrink-0">
                {[
                    { label: "Portfolio Value", value: "$3.4M", trend: "+5.2%", icon: Building2 },
                    { label: "Net Equity", value: "$1.2M", trend: "+8.1%", icon: TrendingUp },
                    { label: "Total Debt", value: "$2.2M", trend: "-2.4%", icon: Activity },
                    { label: "Cashflow", value: "$14.5k/mo", trend: "+14.5%", icon: BarChart3 },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, type: "spring" }}
                        key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 sm:p-4 shadow-lg backdrop-blur-sm"
                    >
                        <div className="flex justify-between items-start mb-2 hidden sm:flex">
                            <stat.icon size={16} className="text-blue-400" />
                            <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">{stat.trend}</span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-400 font-medium">{stat.label}</p>
                        <h3 className="text-sm sm:text-xl font-bold text-white mt-0.5">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>
            <div className="flex-1 bg-slate-800/40 border border-slate-700/50 rounded-xl relative overflow-hidden flex items-end justify-between p-4 px-6 md:px-10">
                {/* Fake chart bars */}
                {[40, 55, 45, 60, 75, 65, 80, 95].map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.2 + i * 0.05, duration: 0.6, ease: "easeOut" }}
                        className="w-[8%] bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-md opacity-80"
                    ></motion.div>
                ))}
            </div>
        </motion.div>
    );
}

function PreviewPortfolioMap() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full max-w-3xl grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 overflow-hidden"
        >
            {[
                { name: "Oceanview Condo", status: "Active", val: "$450k", color: "text-emerald-400" },
                { name: "Downtown Duplex", status: "Renovation", val: "$620k", color: "text-amber-400" },
                { name: "Suburban Family", status: "Active", val: "$380k", color: "text-emerald-400" },
                { name: "Medical Office", status: "Active", val: "$1.2M", color: "text-emerald-400" },
                { name: "Retail Center", status: "Incoming", val: "$850k", color: "text-purple-400" },
                { name: "Lakehouse", status: "Renovation", val: "$550k", color: "text-amber-400" },
            ].map((prop, i) => (
                <motion.div
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, type: "spring" }}
                    key={i} className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-3 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden group hover:bg-slate-800/70 transition-colors cursor-default"
                >
                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-30 transition-opacity"></div>
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-8 h-8 rounded bg-slate-700/80 flex items-center justify-center">
                                <Home size={14} className="text-slate-400" />
                            </div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md bg-slate-900/50 border border-slate-700 ${prop.color}`}>
                                {prop.status}
                            </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5 truncate">{prop.name}</h4>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1"><MapIcon size={10} /> 123 Main St</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-700/50 flex justify-between items-center">
                        <div className="hidden sm:block">
                            <p className="text-[8px] sm:text-[9px] text-slate-500 uppercase font-medium">Value</p>
                            <p className="text-xs sm:text-sm text-slate-200 font-bold">{prop.val}</p>
                        </div>
                        <div>
                            <p className="text-[8px] sm:text-[9px] text-slate-500 uppercase font-medium">Cashflow</p>
                            <p className="text-xs sm:text-sm text-emerald-400 font-bold">+$1.2k</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

function PreviewPipeline() {
    const columns = [
        { title: "Under Analysis", color: "border-blue-500/30 text-blue-400" },
        { title: "Offer Submitted", color: "border-amber-500/30 text-amber-400" },
        { title: "Under Contract", color: "border-purple-500/30 text-purple-400" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full max-w-4xl flex gap-3 md:gap-4 overflow-hidden"
        >
            {columns.map((col, i) => (
                <div key={i} className="flex-1 bg-slate-900/40 border border-slate-800/50 rounded-xl flex flex-col backdrop-blur-sm">
                    <div className="p-2 sm:p-3 border-b border-slate-800/60 flex justify-between items-center bg-slate-800/30">
                        <span className={`text-[10px] sm:text-xs font-bold rounded-full px-2 py-0.5 border ${col.color}`}>{col.title}</span>
                        <span className="text-[10px] text-slate-500 bg-slate-900/60 px-1.5 py-0.5 rounded-md font-medium">2</span>
                    </div>
                    <div className="p-2 sm:p-3 space-y-2 sm:space-y-3 flex-1 overflow-hidden">
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1, type: "spring" }} className="bg-slate-800/80 border border-slate-700/50 rounded-lg p-2.5 sm:p-3 shadow-md relative overflow-hidden group cursor-grab">
                            <div className="w-1 absolute left-0 top-0 bottom-0 bg-slate-600 group-hover:bg-blue-500 transition-colors"></div>
                            <h4 className="text-[11px] sm:text-xs font-semibold text-white mb-1">Target Property A</h4>
                            <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-slate-400">
                                <span>$450k</span>
                                <span className="text-emerald-400 font-medium">12% Cap</span>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1, type: "spring" }} className="bg-slate-800/80 border border-slate-700/50 rounded-lg p-2.5 sm:p-3 shadow-md relative overflow-hidden group cursor-grab">
                            <div className="w-1 absolute left-0 top-0 bottom-0 bg-slate-600 group-hover:bg-blue-500 transition-colors"></div>
                            <h4 className="text-[11px] sm:text-xs font-semibold text-white mb-1">Target Property B</h4>
                            <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-slate-400">
                                <span>$850k</span>
                                <span className="text-emerald-400 font-medium">9% Cap</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            ))}
        </motion.div>
    );
}

function PreviewAgents() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full max-w-2xl flex flex-col gap-3 justify-center"
        >
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 sm:p-5 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 blur-[40px] rounded-full"></div>
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                        <Activity className="text-white" size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm sm:text-base font-bold text-white">Prospector AgentS</h3>
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20"><CheckCircle2 size={10} /> Active</span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-400 mb-3 max-w-sm">Scraping local MLS and off-market leads matching your 12%+ cap rate criteria.</p>

                        <div className="space-y-2">
                            <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-2.5 flex items-center justify-between">
                                <span className="text-[10px] sm:text-xs text-slate-300 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div> "Found a new multi-family off-market deal in Austin."</span>
                                <span className="text-[9px] text-slate-500 shrink-0">2m ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 sm:p-5 backdrop-blur-sm relative overflow-hidden sm:ml-12">
                <div className="absolute right-0 top-0 w-32 h-32 bg-rose-500/10 blur-[40px] rounded-full"></div>
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
                        <BarChart3 className="text-white" size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm sm:text-base font-bold text-white">Portfolio Manager</h3>
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20"><CheckCircle2 size={10} /> Active</span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-400 mb-3 max-w-sm">Analyzing net cashflows across the portfolio and cross-referencing against operating expenses.</p>

                        <div className="space-y-2">
                            <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-2.5 flex items-center justify-between gap-4">
                                <span className="text-[10px] sm:text-xs text-slate-300 flex items-center gap-2 truncate"><div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div> "Warning: Roof repair at Downtown Duplex exceeded budget by 15%."</span>
                                <span className="text-[9px] text-slate-500 shrink-0">1h ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

