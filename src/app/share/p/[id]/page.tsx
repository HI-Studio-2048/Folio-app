"use client";

import { useEffect, useState } from "react";
import { RealEstateDashboard } from "@/components/dashboards/RealEstateDashboard";
import { MOCK_PROPERTIES, getPortfolioStats, Property } from "@/lib/data";
import { useSettings } from "@/components/ui/settings-provider";
import { LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { PortfolioMapDashboard } from "@/components/dashboards/PortfolioMapDashboard";
import { supabaseService } from "@/lib/supabase-service";

export default function SharedPortfolioPage({ params }: { params: { id: string } }) {
    const { t, currency, locale } = useSettings();
    const [properties, setProperties] = useState<Property[]>([]);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [sharedName, setSharedName] = useState("Shared Portfolio View");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const nameParam = params.get("name");
            if (nameParam) {
                setSharedName(nameParam);
            }
        }
    }, []);

    useEffect(() => {
        const fetchSharedData = async () => {
            setIsLoading(true);
            try {
                // In this app, we are using the user_id as the sharing ID for now
                const data = await supabaseService.getProperties(params.id);
                if (data && data.length > 0) {
                    setProperties(data);
                } else {
                    // Fallback to mocks if no real data yet, or show empty
                    setProperties(MOCK_PROPERTIES);
                }
            } catch (error) {
                console.error("Error fetching shared portfolio:", error);
                setProperties(MOCK_PROPERTIES);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchSharedData();
        }
    }, [params.id]);

    const stats = getPortfolioStats(properties);

    return (
        <div className="flex w-full h-screen overflow-hidden text-slate-200 bg-slate-950">
            {/* Minimal Sidebar for Shared View */}
            <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                className="w-64 flex flex-col border-r border-slate-800/60 glass-panel bg-slate-950/40 backdrop-blur-2xl p-4 shrink-0"
            >
                <div className="flex items-center gap-3 px-2 py-4 mb-6">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            borderRadius: ["20%", "40%", "20%"]
                        }}
                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                        className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20"
                    >
                        <LayoutDashboard size={18} className="text-white" />
                    </motion.div>
                    <span className="font-outfit text-xl font-bold tracking-wide text-white">Follio</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <button
                        onClick={() => setActiveTab("dashboard")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab("portfolio")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'portfolio' ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                    >
                        Map View
                    </button>
                </nav>

                <div className="mt-auto p-4 border-t border-slate-800/50 flex flex-col items-center">
                    <p className="text-xs text-slate-500 text-center mb-3">Powered by Follio</p>
                    <a
                        href="/signup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg"
                    >
                        Create Your Own
                    </a>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-16 flex items-center justify-between px-8 border-b border-slate-800/40 bg-slate-900/20 backdrop-blur-md z-10">
                    <h1 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        {sharedName} <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400">READ-ONLY</span>
                    </h1>
                    <a href="/signup" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full transition-colors text-xs font-medium text-slate-200 group">
                        Built with Follio
                        <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">→</span>
                    </a>
                </header>

                <div className="flex-1 overflow-auto p-8 z-0 relative">
                    {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-medium animate-pulse">Loading shared portfolio...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === "dashboard" && (
                                <RealEstateDashboard
                                    properties={properties}
                                    stats={stats}
                                    t={t}
                                    currency={currency}
                                    locale={locale}
                                    setActiveTab={setActiveTab}
                                    openAddModal={() => { }}
                                    removeProperty={() => { }}
                                />
                            )}
                            {activeTab === "portfolio" && (
                                <PortfolioMapDashboard
                                    properties={properties}
                                    t={t}
                                    currency={currency}
                                    locale={locale}
                                    openAddModal={() => { }}
                                    removeProperty={() => { }}
                                />
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
