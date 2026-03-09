"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Bot, Settings, Coffee, Search, Activity, Sparkles, Lock, Check, Zap, Globe, ArrowRight
} from "lucide-react";
import { useSettings } from "@/components/ui/settings-provider";
import { cn } from "@/lib/utils";
import { AgentConfigModal } from "@/components/ui/agents/AgentConfigModal";
import { AgentFlowBuilder } from "@/components/ui/agents/AgentFlowBuilder";

export function AgentsDashboard() {
    const { t } = useSettings();
    const [isPro, setIsPro] = useState(false); // Global Pro state would normally come from a provider/user context
    const [configuringAgent, setConfiguringAgent] = useState<{ id: string, name: string } | null>(null);
    const [activeAgents, setActiveAgents] = useState<Record<string, boolean>>({
        prospector: true,
        portfolioManager: true,
        coffeeGirl: true
    });

    const toggleAgent = (agent: string) => {
        setActiveAgents(prev => ({
            ...prev,
            [agent]: !prev[agent]
        }));
    };

    const agents = [
        {
            id: "prospector",
            name: t("agentProspector"),
            description: t("agentProspectorDesc"),
            icon: Search,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        {
            id: "portfolioManager",
            name: t("agentPortfolioManager"),
            description: t("agentPortfolioManagerDesc"),
            icon: Activity,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20"
        },
        {
            id: "coffeeGirl",
            name: t("agentCoffeeGirl"),
            description: t("agentCoffeeGirlDesc"),
            icon: Coffee,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20"
        }
    ];

    return (
        <motion.div
            key="agents"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-6xl mx-auto pb-12 w-full relative min-h-[600px]"
        >
            {/* Header stays visible to tease the feature */}
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-3xl font-outfit font-bold text-white">{t("aiAgents")}</h1>
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-[10px] font-bold text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg shadow-orange-500/20">PRO</span>
                    </div>
                    <p className="text-slate-400">{t("collaboratorsSubtext")}</p>
                </div>
            </div>

            {/* Content Container - Blurred if not Pro */}
            <div className={cn("relative transition-all duration-700", !isPro && "blur-xl pointer-events-none select-none opacity-40")}>
                <div className="space-y-12">
                    {/* AI Agents (AgentS) */}
                    <section>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {agents.map((agent) => {
                                const isActive = activeAgents[agent.id];
                                return (
                                    <div key={agent.id} className="glass-card rounded-2xl p-6 border border-slate-700/40 relative overflow-hidden group hover:border-slate-500/60 transition-colors flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 duration-300">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={cn("p-3.5 rounded-2xl border", agent.bg, agent.color, agent.border)}>
                                                <agent.icon size={26} />
                                            </div>
                                            <button
                                                className={cn(
                                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors mt-2 ring-1 ring-slate-800/50 shadow-inner",
                                                    isActive ? "bg-indigo-500" : "bg-slate-800"
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-[0_2px_5px_rgba(0,0,0,0.2)]",
                                                        isActive ? "translate-x-6" : "translate-x-1"
                                                    )}
                                                />
                                            </button>
                                        </div>

                                        <h3 className="text-xl font-outfit font-bold text-slate-100 mb-2">{agent.name}</h3>
                                        <p className="text-sm text-slate-400/90 mb-8 min-h-[60px] leading-relaxed">{agent.description}</p>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                                            <span className={cn(
                                                "text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5",
                                                isActive ? "text-indigo-400 bg-indigo-500/10" : "text-slate-400 bg-slate-800"
                                            )}>
                                                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_5px_rgba(99,102,241,0.6)]"></span>}
                                                {isActive ? t("activeStatus") : t("inactiveStatus")}
                                            </span>
                                            <button
                                                className="text-sm text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors group/btn"
                                            >
                                                <Settings size={14} /> {t("configureAgent")}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Agent Automation Workflow Builder */}
                    <section className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-outfit font-bold text-white mb-2">{t("automationFlows" as any) || "Automation Flows"}</h2>
                        </div>
                        <AgentFlowBuilder />
                    </section>
                </div>
            </div>

            {/* Pro Paywall Overlay */}
            {!isPro && (
                <div className="absolute inset-x-0 bottom-0 top-32 z-50 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl glass-panel bg-slate-900/60 backdrop-blur-3xl border border-slate-700/50 rounded-3xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden"
                    >
                        {/* Background flare */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 blur-[100px] rounded-full -ml-20 -mb-20"></div>

                        <div className="relative z-10 text-center space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
                                <Sparkles size={14} /> Follio Pro Feature
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-4xl sm:text-5xl font-outfit font-bold text-white tracking-tight leading-tight">
                                    Put your portfolio on <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Autopilot</span>
                                </h2>
                                <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed italic">
                                    "Deploy our fleet of autonomous AI agents to find deals and manage your assets while you sleep."
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-sm mx-auto">
                                <div className="flex items-center gap-2.5 text-slate-300 text-sm">
                                    <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500"><Check size={12} /></div>
                                    24/7 Market Surveillance
                                </div>
                                <div className="flex items-center gap-2.5 text-slate-300 text-sm">
                                    <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500"><Check size={12} /></div>
                                    Custom Automation Flows
                                </div>
                                <div className="flex items-center gap-2.5 text-slate-300 text-sm">
                                    <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500"><Check size={12} /></div>
                                    High-Volume Scraping
                                </div>
                                <div className="flex items-center gap-2.5 text-slate-300 text-sm">
                                    <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500"><Check size={12} /></div>
                                    Private Deal Pipeline
                                </div>
                            </div>

                            <div className="pt-8">
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <div className="text-left">
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none mb-1">Monthly Subscription</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold text-white">$195</span>
                                            <span className="text-slate-500 font-medium">/month</span>
                                        </div>
                                    </div>

                                    <button
                                        className="group relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold px-10 py-5 rounded-2xl shadow-[0_10px_30px_rgba(59,130,246,0.3)] transition-all transform hover:-translate-y-1 active:scale-[0.98]"
                                        onClick={() => setIsPro(true)} // Mock upgrade function
                                    >
                                        <Zap size={18} className="fill-current" />
                                        <span>Upgrade to Follio Pro</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-600 mt-8 underline cursor-pointer uppercase font-black tracking-tighter">Skip for now</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            <AgentConfigModal
                isOpen={!!configuringAgent}
                onClose={() => setConfiguringAgent(null)}
                agentId={configuringAgent?.id || ""}
                agentName={configuringAgent?.name || ""}
            />
        </motion.div>
    );
}
