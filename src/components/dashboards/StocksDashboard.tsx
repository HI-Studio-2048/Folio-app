import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Plus, TrendingUp, TrendingDown, Activity, Wallet, PieChart } from "lucide-react";
import { StatCard } from "@/components/ui/shared";
import { formatCurrency, formatCompactCurrency, cn } from "@/lib/utils";

const performanceData = [
    { month: "Jan", value: 1.0, cashflow: 0 },
    { month: "Feb", value: 1.05, cashflow: 0 },
    { month: "Mar", value: 0.98, cashflow: 0 },
    { month: "Apr", value: 1.12, cashflow: 0 },
    { month: "May", value: 1.15, cashflow: 0 },
    { month: "Jun", value: 1.08, cashflow: 0 },
    { month: "Jul", value: 1.25, cashflow: 0 },
    { month: "Aug", value: 1.34, cashflow: 0 },
];

export function StocksDashboard({
    stats,
    t,
    currency,
    locale,
    setActiveTab,
    openAddModal
}: any) {
    return (
        <motion.div
            key="dashboard-stocks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto space-y-8"
        >
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">{t("equitiesPortfolio" as any) || "Equities Portfolio"}</h1>
                <p className="text-slate-400">{t("equitiesPortfolioSubtext" as any) || "Monitor your public market positions."} <span className="text-emerald-400 font-medium">+14.2%</span> {t("thisQuarter")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Portfolio Value"
                    value={formatCurrency(1340000, currency, locale)}
                    trend="+2.1% Today"
                    icon={Wallet}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                />
                <StatCard
                    title="Total Return (All Time)"
                    value={formatCurrency(450500, currency, locale)}
                    trend="+34.2%"
                    icon={TrendingUp}
                    color="text-emerald-400"
                    bg="bg-emerald-500/10"
                />
                <StatCard
                    title="Day Change"
                    value={formatCurrency(28000, currency, locale)}
                    trend="+2.1%"
                    icon={Activity}
                    color="text-emerald-400"
                    bg="bg-emerald-500/10"
                />
                <StatCard
                    title="Dividend Yield"
                    value="2.8%"
                    trend="+0.2% YTD"
                    icon={PieChart}
                    color="text-purple-400"
                    bg="bg-purple-500/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-700/30">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-outfit font-semibold text-white">{t("performanceHistory" as any) || "Performance History"}</h2>
                        <div className="flex gap-2">
                            {["1D", "1W", "1M", "3M", "YTD", "ALL"].map(k => (
                                <button key={k} className={cn("px-3 py-1 rounded-md text-xs font-medium transition-colors", k === "YTD" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50")}>
                                    {k}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValueStocks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                                    itemStyle={{ color: '#6ee7b7' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValueStocks)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-slate-700/30 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-outfit font-semibold text-white">{t("topHoldings" as any) || "Top Holdings"}</h2>
                        <button
                            onClick={() => setActiveTab("pipeline")}
                            className="text-sm text-emerald-400 hover:text-emerald-300 font-medium"
                        >
                            {t("viewAll")}
                        </button>
                    </div>

                    <div className="flex-1 space-y-4">
                        {[
                            { ticker: 'AAPL', name: 'Apple Inc.', allocation: '18.5%', change: '+1.2%', up: true, value: 247900 },
                            { ticker: 'MSFT', name: 'Microsoft Corp.', allocation: '15.2%', change: '+0.8%', up: true, value: 203680 },
                            { ticker: 'TSLA', name: 'Tesla Inc.', allocation: '8.4%', change: '-2.4%', up: false, value: 112560 },
                            { ticker: 'NVDA', name: 'NVIDIA Corp.', allocation: '12.1%', change: '+4.5%', up: true, value: 162140 },
                        ].map((stock) => (
                            <div key={stock.ticker} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-700/50 cursor-pointer group">
                                <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs tracking-wider">
                                    {stock.ticker}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-emerald-400 transition-colors">{stock.name}</p>
                                        <span className={cn("text-xs font-medium flex items-center gap-0.5", stock.up ? "text-emerald-400" : "text-rose-400")}>
                                            {stock.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                            {stock.change}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <p className="text-xs text-slate-400">{stock.allocation} weight</p>
                                        <span className="text-xs text-slate-300 font-medium">{formatCompactCurrency(stock.value, currency, locale)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => openAddModal()}
                        className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-slate-700 text-slate-400 font-medium text-sm hover:text-white hover:border-slate-500 hover:bg-slate-800/30 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Trade Asset
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
