import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Plus, TrendingUp, TrendingDown, Activity, Wallet, PieChart } from "lucide-react";
import { StatCard } from "@/components/ui/shared";
import { formatCurrency, formatCompactCurrency, cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Loader2, Search, X } from "lucide-react";

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
    properties,
    stats,
    t,
    currency,
    locale,
    setActiveTab,
    openAddModal,
    onAddAssets
}: any) {
    const [newTicker, setNewTicker] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [liveQuotes, setLiveQuotes] = useState<any>({});

    const stockAssets = (properties || []).filter((p: any) => p.ticker || p.type === 'stocks');

    useEffect(() => {
        const fetchQuotes = async () => {
            if (stockAssets.length === 0) return;
            const tickers = stockAssets.map((p: any) => p.ticker || p.name).join(",");
            try {
                const res = await fetch(`/api/stocks/quote?symbols=${tickers}`);
                const data = await res.json();
                if (data.result) {
                    const quotesMap: any = {};
                    data.result.forEach((q: any) => {
                        quotesMap[q.symbol] = q;
                    });
                    setLiveQuotes(quotesMap);
                }
            } catch (e) {
                console.error("Failed to fetch live quotes:", e);
            }
        };

        fetchQuotes();
        const interval = setInterval(fetchQuotes, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [properties]);

    const handleAddTicker = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTicker || isAdding) return;

        setIsAdding(true);
        setError(null);

        try {
            const res = await fetch(`/api/stocks/quote?symbols=${newTicker.toUpperCase()}`);
            const data = await res.json();
            const quote = data.result?.[0];

            if (!quote) {
                throw new Error("Invalid ticker or data unavailable");
            }

            const newAsset: any = {
                id: Math.random().toString(36).substring(7),
                name: quote.longName || quote.shortName || newTicker.toUpperCase(),
                ticker: quote.symbol,
                address: quote.fullExchangeName || "Public Equity",
                status: "Lead / Prospect", // Watchlist
                type: "Stocks",
                image: `https://logo.clearbit.com/${quote.symbol.toLowerCase()}.com`,
                financials: {
                    purchasePrice: quote.regularMarketPrice,
                    currentValue: quote.regularMarketPrice,
                    renovationCost: 0,
                    debt: 0,
                    monthlyRent: 0,
                    monthlyExpenses: 0,
                    monthlyDebtService: 0,
                    principalPayment: 0
                }
            };

            await onAddAssets([newAsset]);
            setNewTicker("");
        } catch (e: any) {
            setError(e.message || "Failed to add ticker");
        } finally {
            setIsAdding(false);
        }
    };

    const totalPortfolioValue = stockAssets.reduce((acc: number, p: any) => {
        const quote = liveQuotes[p.ticker || p.name];
        const price = quote?.regularMarketPrice || p.financials?.currentValue || 0;
        return acc + price;
    }, 0);

    const totalDayChange = stockAssets.reduce((acc: number, p: any) => {
        const quote = liveQuotes[p.ticker || p.name];
        return acc + (quote?.regularMarketChange || 0);
    }, 0);

    const totalDayChangePercent = totalPortfolioValue > 0 ? (totalDayChange / totalPortfolioValue) * 100 : 0;

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
                    value={formatCurrency(totalPortfolioValue || 1340000, currency, locale)}
                    trend={totalDayChangePercent ? `${totalDayChangePercent.toFixed(2)}% Today` : "+2.1% Today"}
                    trendDown={totalDayChange < 0}
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
                    value={formatCurrency(totalDayChange || 28000, currency, locale)}
                    trend={totalDayChangePercent ? `${totalDayChangePercent.toFixed(2)}%` : "+2.1%"}
                    trendDown={totalDayChange < 0}
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
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card rounded-2xl p-6 border border-slate-700/30">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-outfit font-semibold text-white">Add Tickers</h2>
                            <p className="text-xs text-slate-500 italic">Enter symbols like AAPL, TSLA, BTC-USD</p>
                        </div>
                        <form onSubmit={handleAddTicker} className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    value={newTicker}
                                    onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                                    placeholder="Enter Ticker Symbol..."
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isAdding || !newTicker}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                            >
                                {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                Add Ticker
                            </button>
                        </form>
                        {error && <p className="text-rose-400 text-xs mt-3 flex items-center gap-1"><X size={12} /> {error}</p>}
                    </div>

                    <div className="glass-card rounded-2xl p-6 border border-slate-700/30">
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
                        {stockAssets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-800/20 rounded-xl border border-dashed border-slate-800">
                                <Activity size={32} className="text-slate-700 mb-3" />
                                <p className="text-slate-500 text-xs">No holdings yet.<br />Add a ticker to monitor real-time data.</p>
                            </div>
                        ) : (
                            stockAssets.slice(0, 6).map((stock: any) => {
                                const quote = liveQuotes[stock.ticker || stock.name];
                                const isUp = quote ? quote.regularMarketChange >= 0 : true;
                                const change = quote ? `${quote.regularMarketChangePercent?.toFixed(2)}%` : "0.00%";
                                const price = quote?.regularMarketPrice || stock.financials?.currentValue || 0;

                                return (
                                    <div key={stock.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-700/50 cursor-pointer group">
                                        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs tracking-wider border border-slate-700/30 overflow-hidden">
                                            {stock.image ? (
                                                <img src={stock.image} alt={stock.ticker} className="w-full h-full object-cover" onError={(e) => (e.target as any).src = ""} />
                                            ) : (
                                                stock.ticker?.slice(0, 4) || stock.name?.slice(0, 4)
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-emerald-400 transition-colors uppercaseTracking-tight">{stock.name}</p>
                                                <span className={cn("text-xs font-medium flex items-center gap-0.5", isUp ? "text-emerald-400" : "text-rose-400")}>
                                                    {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                    {change}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{stock.ticker || "EQUITY"}</p>
                                                <span className="text-xs text-slate-300 font-medium">{formatCurrency(price, currency, locale)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
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
