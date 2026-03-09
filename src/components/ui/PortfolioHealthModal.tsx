import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, AlertTriangle, Lightbulb, TrendingDown, Info, ShieldCheck, Activity } from "lucide-react";
import { Property } from "@/lib/data";
import { formatCurrency, formatCompactCurrency } from "@/lib/utils";

interface PortfolioHealthModalProps {
    isOpen: boolean;
    onClose: () => void;
    properties: Property[];
    currency: string;
    locale: string;
}

export function PortfolioHealthModal({ isOpen, onClose, properties, currency, locale }: PortfolioHealthModalProps) {
    if (!isOpen) return null;

    // Filter to active/relevant properties for health calculations
    const activeProperties = properties.filter(p => !["Lead / Prospect", "Under Analysis"].includes(p.status));

    // Calculate Portfolio Metrics
    const totalValue = activeProperties.reduce((sum, p) => sum + (p.financials?.currentValue || 0), 0);
    const totalDebt = activeProperties.reduce((sum, p) => sum + (p.financials?.debt || 0), 0);
    const totalEquity = totalValue - totalDebt;
    const ltv = totalValue > 0 ? (totalDebt / totalValue) * 100 : 0;

    // Monthly Cashflow & Debt Coverage
    const monthlyIncome = activeProperties.reduce((sum, p) => sum + (p.financials?.monthlyRent || 0), 0);
    const monthlyExpenses = activeProperties.reduce((sum, p) => sum + (p.financials?.monthlyExpenses || 0), 0);
    const monthlyDebtService = activeProperties.reduce((sum, p) => sum + (p.financials?.monthlyDebtService || 0), 0);
    const principalPaydown = activeProperties.reduce((sum, p) => sum + (p.financials?.principalPayment || 0), 0);

    const netCashflow = monthlyIncome - monthlyExpenses - monthlyDebtService;
    const dscr = monthlyDebtService > 0 ? (monthlyIncome - monthlyExpenses) / monthlyDebtService : 2.5; // Ideal > 1.25
    const cashflowMargin = monthlyIncome > 0 ? (netCashflow / monthlyIncome) * 100 : 0;

    // Calculate Dynamic Health Score (0-100)
    // - Based on LTV (ideal < 75%)
    // - Based on Cashflow margin (ideal > 30%)
    let score = 100;

    // Penalize high LTV
    if (ltv > 85) score -= 30;
    else if (ltv > 75) score -= 20;
    else if (ltv > 65) score -= 10;

    // Penalize low cashflow
    if (cashflowMargin < 0) score -= 40;
    else if (cashflowMargin < 15) score -= 20;
    else if (cashflowMargin < 30) score -= 10;

    // Debt Structure Penalties
    const variableDebtRatio = activeProperties.filter(p => p.financials?.debtType === "Variable" || p.financials?.debtType === "ARM").reduce((sum, p) => sum + (p.financials?.debt || 0), 0) / (totalDebt || 1);
    if (variableDebtRatio > 0.5) score -= 15;
    else if (variableDebtRatio > 0.25) score -= 5;

    const shortTermDebt = activeProperties.filter(p => p.financials?.fixedTermRemainingMonths && p.financials.fixedTermRemainingMonths <= 24).reduce((sum, p) => sum + (p.financials?.debt || 0), 0);
    if (shortTermDebt > 0) score -= 15; // Refinance risk penalty

    score = Math.max(0, Math.min(100, Math.round(score)));

    let healthStatus = "Excellent";
    let healthColor = "text-emerald-400";
    let bgHealthColor = "bg-emerald-400";
    if (score < 50) {
        healthStatus = "At Risk";
        healthColor = "text-rose-400";
        bgHealthColor = "bg-rose-400";
    } else if (score < 75) {
        healthStatus = "Fair";
        healthColor = "text-amber-400";
        bgHealthColor = "bg-amber-400";
    }

    // Generate Dynamic Suggestions
    const suggestions: { title: string; description: string; assetId?: string | number, type: "warning" | "opportunity" }[] = [];

    // Suggestion 1: Check for highest LTV property
    const highestLtvProp = [...activeProperties].sort((a, b) => {
        const aLtv = a.financials?.currentValue ? a.financials.debt / a.financials.currentValue : 0;
        const bLtv = b.financials?.currentValue ? b.financials.debt / b.financials.currentValue : 0;
        return bLtv - aLtv;
    })[0];

    if (highestLtvProp && highestLtvProp.financials && highestLtvProp.financials.currentValue > 0) {
        const pLtv = (highestLtvProp.financials.debt / highestLtvProp.financials.currentValue) * 100;
        if (pLtv > 80) {
            suggestions.push({
                title: `Refinance Risk: ${highestLtvProp.name}`,
                description: `This asset has a high LTV of ${pLtv.toFixed(1)}%. Consider equity injection or alternative financing before current interest rates climb higher.`,
                assetId: highestLtvProp.id,
                type: "warning"
            });
        } else if (pLtv < 40 && highestLtvProp.financials.currentValue > 500000) {
            suggestions.push({
                title: `Unlock Equity in ${highestLtvProp.name}`,
                description: `With an LTV of only ${pLtv.toFixed(1)}%, you have significant trapped equity. Consider a HELOC or cash-out refinance to acquire your next property.`,
                assetId: highestLtvProp.id,
                type: "opportunity"
            });
        }
    }

    // Suggestion 2: Find worst cash-flowing property
    const worstCashflowProp = [...activeProperties].sort((a, b) => {
        const aCf = (a.financials?.monthlyRent || 0) - (a.financials?.monthlyExpenses || 0);
        const bCf = (b.financials?.monthlyRent || 0) - (b.financials?.monthlyExpenses || 0);
        return aCf - bCf;
    })[0];

    if (worstCashflowProp) {
        const cf = (worstCashflowProp.financials?.monthlyRent || 0) - (worstCashflowProp.financials?.monthlyExpenses || 0);
        if (cf < 0) {
            suggestions.push({
                title: `Negative Cashflow: ${worstCashflowProp.name}`,
                description: `This asset is losing ${formatCurrency(Math.abs(cf), currency, locale)} per month. Review operating expenses or consider rent increases.`,
                assetId: worstCashflowProp.id,
                type: "warning"
            });
        }
    }

    // Suggestion 3: Maturing Debt Risk
    const maturingDebtProp = activeProperties.find(p => p.financials?.fixedTermRemainingMonths && p.financials.fixedTermRemainingMonths > 0 && p.financials.fixedTermRemainingMonths <= 24);
    if (maturingDebtProp) {
        suggestions.push({
            title: `Maturing Debt Risk: ${maturingDebtProp.name}`,
            description: `The debt on this asset matures or adjusts in ${maturingDebtProp.financials.fixedTermRemainingMonths} months. Begin exploring refinance options now to secure favorable rates.`,
            assetId: maturingDebtProp.id,
            type: "warning"
        });
    }

    // Suggestion 4: Golden Handcuffs (Low Interest Rate)
    const lowRateProp = activeProperties.find(p => p.financials?.interestRate && p.financials.interestRate < 4.0 && p.financials.debt > 0);
    if (lowRateProp) {
        suggestions.push({
            title: `Golden Handcuffs: ${lowRateProp.name}`,
            description: `This asset is locked in at a highly favorable ${lowRateProp.financials.interestRate}% interest rate. Avoid refinancing this debt unless absolutely necessary.`,
            assetId: lowRateProp.id,
            type: "opportunity"
        });
    }

    // Suggestion 5: Renovation/Status updates
    const renovationProp = activeProperties.find(p => p.status === "Renovation");
    if (renovationProp) {
        suggestions.push({
            title: `Accelerate Renovation for ${renovationProp.name}`,
            description: `This property is currently non-yielding. Expedite the renovation phase to bring this asset to market and improve portfolio cashflow margin.`,
            assetId: renovationProp.id,
            type: "opportunity"
        });
    }

    // Fill up to 3 if we don't have enough
    if (suggestions.length < 2 && ltv < 60) {
        suggestions.push({
            title: `Portfolio Expansion Capacity`,
            description: `Your overall portfolio LTV is ${ltv.toFixed(1)}%. Current market rates suggest it might be a favorable time to leverage your existing equity for expansion.`,
            type: "opportunity"
        });
    }

    const currentInterestRate = "6.5%"; // Mock real-time data
    const historicalAvgRate = "4.2%";
    const benchmarkLtv = "65%";

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl w-[95vw] sm:w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="flex items-center justify-between p-6 border-b border-slate-800/60 bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white font-outfit">Portfolio Health & Insights</h2>
                                <p className="text-sm text-slate-400">Real-time analysis based on {activeProperties.length} active assets</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Health Score Main Box */}
                            <div className="md:col-span-1 glass-card rounded-2xl p-6 border border-slate-700/30 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-1">
                                    <div className={`h-full ${bgHealthColor}`} style={{ width: `${score}%` }}></div>
                                </div>
                                <h3 className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Overall Health</h3>
                                <div className={`text-6xl font-bold mb-2 font-outfit ${healthColor}`}>
                                    {score}
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${score >= 75 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : score >= 50 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                    {healthStatus}
                                </div>
                            </div>

                            {/* Benchmarks & Real-Time Data */}
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <div className="glass-card rounded-xl p-5 border border-slate-700/30">
                                    <div className="flex items-center gap-2 text-slate-400 mb-3 text-sm font-medium">
                                        <ShieldCheck size={16} /> Debt Service Coverage (DSCR)
                                    </div>
                                    <div className="flex items-end gap-3">
                                        <div className="text-3xl font-bold text-white font-outfit">{dscr.toFixed(2)}x</div>
                                        <div className="text-sm text-slate-400 mb-1">Target: <span className="text-slate-300">1.25+</span></div>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden">
                                        <div className={`h-1.5 rounded-full ${dscr < 1.0 ? 'bg-rose-500' : dscr < 1.25 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (dscr / 2) * 100)}%` }}></div>
                                    </div>
                                </div>

                                <div className="glass-card rounded-xl p-5 border border-slate-700/30">
                                    <div className="flex items-center gap-2 text-slate-400 mb-3 text-sm font-medium">
                                        <TrendingUp size={16} /> Annual Principal Paydown
                                    </div>
                                    <div className="flex items-end gap-3">
                                        <div className="text-3xl font-bold text-white font-outfit">{formatCompactCurrency(principalPaydown * 12, currency, locale)}</div>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">Projected equity gain from debt reduction</p>
                                </div>

                                <div className="col-span-2 glass-card rounded-xl p-5 border border-slate-700/30 bg-slate-800/20">
                                    <div className="flex items-center gap-2 text-slate-400 mb-3 text-sm font-medium">
                                        <Info size={16} /> Combined Portfolio Metrics
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Portfolio LTV</p>
                                            <p className="text-sm font-bold text-slate-200">{ltv.toFixed(1)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Cashflow Margin</p>
                                            <p className={`text-sm font-bold ${cashflowMargin > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{cashflowMargin.toFixed(1)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Variable Exposure</p>
                                            <p className="text-sm font-bold text-slate-200">{(variableDebtRatio * 100).toFixed(0)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Short-Term Debt</p>
                                            <p className="text-sm font-bold text-slate-200">{formatCompactCurrency(shortTermDebt, currency, locale)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actionable Suggestions */}
                        <div className="mt-6">
                            <h3 className="text-lg font-outfit font-semibold text-white mb-4 flex items-center gap-2">
                                <Lightbulb className="text-amber-400" size={20} /> Actionable Asset Strategies
                            </h3>
                            <div className="space-y-4">
                                {suggestions.map((s, idx) => (
                                    <div key={idx} className={`p-4 rounded-xl border flex gap-4 ${s.type === 'warning' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-blue-500/5 border-blue-500/20'}`}>
                                        <div className={`mt-1 flex-shrink-0 ${s.type === 'warning' ? 'text-rose-400' : 'text-blue-400'}`}>
                                            {s.type === 'warning' ? <AlertTriangle size={20} /> : <TrendingUp size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="text-slate-100 font-semibold mb-1">{s.title}</h4>
                                            <p className="text-sm text-slate-400 leading-relaxed">{s.description}</p>
                                        </div>
                                    </div>
                                ))}
                                {suggestions.length === 0 && (
                                    <div className="p-4 rounded-xl border bg-slate-800/30 border-slate-700/50 text-slate-400 text-center text-sm">
                                        Your portfolio is highly optimized. No immediate actions recommended.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
