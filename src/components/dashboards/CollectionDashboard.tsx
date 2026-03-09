import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Plus, TrendingUp, Gem, Shield, Crown } from "lucide-react";
import { StatCard } from "@/components/ui/shared";
import { formatCurrency, formatCompactCurrency, cn } from "@/lib/utils";

const performanceData = [
    { month: "Jan", value: 3.2, cashflow: 0 },
    { month: "Feb", value: 3.25, cashflow: 0 },
    { month: "Mar", value: 3.3, cashflow: 0 },
    { month: "Apr", value: 3.3, cashflow: 0 },
    { month: "May", value: 3.48, cashflow: 0 },
    { month: "Jun", value: 3.5, cashflow: 0 },
    { month: "Jul", value: 3.8, cashflow: 0 },
    { month: "Aug", value: 4.1, cashflow: 0 },
];

export function CollectionDashboard({
    stats,
    t,
    currency,
    locale,
    setActiveTab,
    openAddModal
}: any) {
    return (
        <motion.div
            key="dashboard-collection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto space-y-8"
        >
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">{t("vaultOverview" as any) || "Vault Overview"}</h1>
                <p className="text-slate-400">Track and manage high-value physical assets. <span className="text-emerald-400 font-medium">+8.5%</span> {t("thisQuarter")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Estimated Value"
                    value={formatCurrency(4100000, currency, locale)}
                    trend="+14.2% YoY"
                    icon={Gem}
                    color="text-rose-400"
                    bg="bg-rose-500/10"
                />
                <StatCard
                    title="Items in Vault"
                    value="42"
                    trend="+3"
                    icon={Crown}
                    color="text-amber-400"
                    bg="bg-amber-500/10"
                />
                <StatCard
                    title="Unrealized Gain"
                    value={formatCurrency(1850000, currency, locale)}
                    trend="+4.1%"
                    icon={TrendingUp}
                    color="text-emerald-400"
                    bg="bg-emerald-500/10"
                />
                <StatCard
                    title="Insured Value"
                    value={formatCurrency(3800000, currency, locale)}
                    trend="Needs Review"
                    icon={Shield}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                    trendDown
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-700/30">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-outfit font-semibold text-white">{t("appreciationHistory" as any) || "Appreciation History"}</h2>
                        <div className="flex bg-slate-800/80 p-1 rounded-lg">
                            <button className="py-1 px-3 text-xs font-semibold rounded bg-amber-500 text-white shadow-sm">All Time</button>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValueCollection" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
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
                                    itemStyle={{ color: '#fda4af' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorValueCollection)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-slate-700/30 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-outfit font-semibold text-white">{t("recentAcquisitions" as any) || "Recent Acquisitions"}</h2>
                        <button
                            onClick={() => setActiveTab("pipeline")}
                            className="text-sm text-rose-400 hover:text-rose-300 font-medium"
                        >
                            {t("viewAll")}
                        </button>
                    </div>

                    <div className="flex-1 space-y-4">
                        {[
                            { id: '1', name: '1962 Ferrari 250 GTO', category: 'Automotive', value: 2400000, status: 'Vaulted' },
                            { id: '2', name: 'Rolex Daytona Paul Newman', category: 'Watches', value: 185000, status: 'Authenticator' },
                            { id: '3', name: 'Basquiat Untitled (1982)', category: 'Fine Art', value: 850000, status: 'In Transit' },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-700/50 cursor-pointer group">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                                    <Gem size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-rose-400 transition-colors">{item.name}</p>
                                    <div className="flex items-center justify-between mt-1">
                                        <p className="text-xs text-slate-400 truncate text-ellipsis">{item.category} • {formatCompactCurrency(item.value, currency, locale)}</p>
                                        <span className={cn(
                                            "text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm",
                                            item.status === "Authenticator" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                                                item.status === "In Transit" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" :
                                                    "bg-slate-700/50 text-slate-300 border border-slate-600/50"
                                        )}>
                                            {item.status}
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
                        <Plus size={16} /> Add Item
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
