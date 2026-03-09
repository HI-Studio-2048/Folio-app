import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Plus, Building2, PieChart, TrendingUp, BarChart3, Briefcase } from "lucide-react";
import { StatCard } from "@/components/ui/shared";
import { formatCurrency, formatCompactCurrency, cn } from "@/lib/utils";
import { Property } from "@/lib/data";

const performanceData = [
    { month: "Jan", value: 4.2, cashflow: 0 },
    { month: "Feb", value: 4.35, cashflow: 0 },
    { month: "Mar", value: 4.5, cashflow: 0 },
    { month: "Apr", value: 4.8, cashflow: 0 },
    { month: "May", value: 5.1, cashflow: 0 },
    { month: "Jun", value: 5.5, cashflow: 0 },
    { month: "Jul", value: 6.2, cashflow: 0 },
    { month: "Aug", value: 7.5, cashflow: 0 },
];

export function CompanyDashboard({
    properties, // Note: In a real app we'd map "Company" specific types here
    stats,
    t,
    currency,
    locale,
    setActiveTab,
    openAddModal
}: any) {
    return (
        <motion.div
            key="dashboard-company"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto space-y-8"
        >
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">{t("fundOverview" as any) || "Fund Overview"}</h1>
                <p className="text-slate-400">Track your private equity and venture capital positions. <span className="text-emerald-400 font-medium">+24.5% IRR</span> {t("thisQuarter")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total AUM"
                    value={formatCurrency(7500000, currency, locale)}
                    trend="+12.2%"
                    icon={Building2}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                />
                <StatCard
                    title="Deployed Capital"
                    value={formatCurrency(4200000, currency, locale)}
                    trend="+5.1%"
                    icon={Briefcase}
                    color="text-purple-400"
                    bg="bg-purple-500/10"
                />
                <StatCard
                    title="Dry Powder"
                    value={formatCurrency(3300000, currency, locale)}
                    trend="-12.4%"
                    icon={PieChart}
                    color="text-amber-400"
                    bg="bg-amber-500/10"
                    trendDown
                />
                <StatCard
                    title="Avg Multiple (MOIC)"
                    value="2.4x"
                    trend="+0.3x"
                    icon={TrendingUp}
                    color="text-emerald-400"
                    bg="bg-emerald-500/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-700/30">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-outfit font-semibold text-white">{t("fundPerformance" as any) || "Fund Performance"}</h2>
                        <div className="flex gap-2">
                            {["1M", "3M", "6M", "1Y", "ALL"].map(k => (
                                <button key={k} className={cn("px-3 py-1 rounded-md text-xs font-medium transition-colors", k === "1Y" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50")}>
                                    {k}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValueCompany" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis
                                    stroke="#475569"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `${currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'JPY' ? '¥' : '$'}${val}M`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                                    itemStyle={{ color: '#d8b4fe' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorValueCompany)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-slate-700/30 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-outfit font-semibold text-white">Active Deal Flow</h2>
                        <button
                            onClick={() => setActiveTab("pipeline")}
                            className="text-sm text-purple-400 hover:text-purple-300 font-medium"
                        >
                            {t("viewAll")}
                        </button>
                    </div>

                    <div className="flex-1 space-y-4">
                        {/* Placeholder mock data for companies */}
                        {[
                            { id: '1', name: 'TechFlow AI', status: 'Diligence', amount: 500000, sector: 'SaaS' },
                            { id: '2', name: 'GreenEnergy Co', status: 'Term Sheet', amount: 1200000, sector: 'Cleantech' },
                            { id: '3', name: 'MediSync', status: 'Sourcing', amount: 250000, sector: 'Healthtech' },
                        ].map((company) => (
                            <div key={company.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-700/50 cursor-pointer group">
                                <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                                    <Briefcase size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-purple-400 transition-colors">{company.name}</p>
                                    <div className="flex items-center justify-between mt-1">
                                        <p className="text-xs text-slate-400 truncate text-ellipsis">{company.sector} • {formatCompactCurrency(company.amount, currency, locale)}</p>
                                        <span className={cn(
                                            "text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm",
                                            company.status === "Term Sheet" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
                                                company.status === "Diligence" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                                                    "bg-slate-700/50 text-slate-300 border border-slate-600/50"
                                        )}>
                                            {company.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => openAddModal()}
                        className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-slate-700 text-slate-400 font-medium text-sm hover:text-white hover:border-slate-500 hover:bg-slate-800/30 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> New Deal
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
