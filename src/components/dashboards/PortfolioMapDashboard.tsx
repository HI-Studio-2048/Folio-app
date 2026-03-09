"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapIcon, List, Search, SlidersHorizontal } from "lucide-react";
import { Property } from "@/lib/data";
import { formatCompactCurrency, formatCurrency, cn } from "@/lib/utils";

// Prevent SSR for Leaflet which relies heavily on window object
const MapWidget = dynamic(() => import("@/components/ui/MapWidget"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-900/50 flex flex-col gap-4 items-center justify-center rounded-2xl border border-slate-800 animate-pulse">
            <MapIcon size={32} className="text-slate-600 mb-2" />
            <div className="text-slate-500 font-medium">Loading map tiles...</div>
        </div>
    )
});

interface PortfolioMapDashboardProps {
    properties: Property[];
    t: any;
    currency: string;
    locale: string;
    openAddModal?: () => void;
    removeProperty?: (id: string | number) => void;
    editProperty?: (prop: Property) => void;
    updateProperty?: (id: string, updates: Partial<Property>) => Promise<void>;
}

export function PortfolioMapDashboard({ properties, t, currency, locale, openAddModal, removeProperty, editProperty, updateProperty }: PortfolioMapDashboardProps) {
    const [viewMode, setViewMode] = useState<"map" | "grid">("map");
    const [activeFilter, setActiveFilter] = useState("all");
    const [pinAsset, setPinAsset] = useState<Property | null>(null);

    // Show all properties on the map so user can see every asset they've added
    const mapProperties = properties;
    const unpinnedAssets = properties.filter(p => !p.lat || !p.lng);

    return (
        <motion.div
            key="portfolio-map"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex flex-col space-y-6 max-h-[calc(100vh-120px)]"
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-xl sm:text-3xl font-outfit font-bold text-white mb-1 flex items-center gap-2 sm:gap-3">
                        <MapIcon className="text-blue-500" size={20} />
                        {t("portfolioMapHeader")}
                    </h1>
                    <p className="text-slate-400 text-[10px] sm:text-sm">{t("portfolioMapSubtext")}</p>
                </div>

                <div className="flex items-center gap-4 bg-slate-900/40 p-1.5 rounded-xl border border-slate-700/50 backdrop-blur-md shadow-xl overflow-x-auto no-scrollbar">
                    <div className="flex bg-slate-800/80 p-0.5 sm:p-1 rounded-lg shrink-0">
                        {["all", "active", "renovation", "incoming"].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={cn(
                                    "py-1 sm:py-1.5 px-3 sm:px-4 text-[10px] sm:text-xs font-semibold rounded-md transition-all whitespace-nowrap",
                                    activeFilter === filter
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                                )}
                            >
                                {t(filter as any) || filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-slate-700 mx-0.5 sm:mx-1 shrink-0"></div>

                    <div className="flex bg-slate-800/80 p-1 rounded-lg shrink-0">
                        <button
                            onClick={() => setViewMode("map")}
                            className={cn(
                                "p-1.5 sm:p-2 rounded-md transition-all flex items-center justify-center",
                                viewMode === "map"
                                    ? "bg-slate-700 text-blue-400 shadow-md"
                                    : "text-slate-400 hover:text-slate-200"
                            )}
                            title="Interactive Map View"
                        >
                            <MapIcon size={14} />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "p-1.5 sm:p-2 rounded-md transition-all flex items-center justify-center",
                                viewMode === "grid"
                                    ? "bg-slate-700 text-blue-400 shadow-md"
                                    : "text-slate-400 hover:text-slate-200"
                            )}
                            title="Tile Grid View"
                        >
                            <List size={14} />
                        </button>
                    </div>

                    <div className="h-6 w-px bg-slate-700 mx-0.5 sm:mx-1 shrink-0"></div>

                    <button
                        onClick={() => openAddModal?.()}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold shadow-md transition-colors whitespace-nowrap shrink-0"
                    >
                        + {t("addAsset")}
                    </button>
                </div>
            </div>

            <div className="flex-1 w-full relative min-h-[500px]">
                <AnimatePresence mode="wait">
                    {viewMode === "map" ? (
                        <motion.div
                            key="map-view"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                        >
                            <MapWidget
                                properties={mapProperties}
                                activeFilter={activeFilter}
                                pinAsset={pinAsset}
                                editProperty={editProperty}
                                onPinComplete={async (lat: number, lng: number) => {
                                    if (pinAsset && updateProperty) {
                                        await updateProperty(pinAsset.id, { lat, lng });
                                        setPinAsset(null);
                                    }
                                }}
                            />

                            {/* Unpinned Assets Overlay */}
                            {viewMode === "map" && unpinnedAssets.length > 0 && !pinAsset && (
                                <div className="absolute right-0 sm:right-4 bottom-0 sm:top-4 sm:bottom-4 w-full sm:w-72 z-50 pointer-events-none p-4 sm:p-0">
                                    <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col max-h-[40vh] sm:h-full pointer-events-auto overflow-hidden">
                                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 16a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm1-5.07V14h-2v-1.07c0-2 3-2 3-3.93A1.93 1.93 0 0 0 12 7a1.93 1.93 0 0 0-1.93 2H8.14A3.93 3.93 0 1 1 12 11.07z" /></svg>
                                                {t("unpinnedAssets")}
                                            </h3>
                                            <span className="bg-amber-500/20 text-amber-500 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/20">{unpinnedAssets.length}</span>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                                            {unpinnedAssets.map(asset => (
                                                <button
                                                    key={asset.id}
                                                    onClick={() => setPinAsset(asset)}
                                                    className="w-full text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/30 hover:border-blue-500/50 transition-all group group-hover:shadow-lg"
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-slate-950">
                                                            <img src={asset.image} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold text-slate-200 truncate group-hover:text-blue-400 transition-colors">{asset.name}</p>
                                                            <p className="text-[10px] text-slate-500 truncate mt-0.5">{asset.address}</p>
                                                            <span className="inline-block mt-2 text-[9px] font-bold text-blue-400 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {t("clickToPin")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Pinning Instructions Banner */}
                            {pinAsset && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] w-full max-w-md px-4">
                                    <div className="bg-blue-600 border border-blue-400/30 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black flex items-center gap-1.5 leading-none mb-1">
                                                    {t("pinOnMap")}
                                                </p>
                                                <p className="text-[11px] text-blue-100/80 leading-tight">
                                                    {t("pinInstructions")}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setPinAsset(null)}
                                            className="px-3 py-1.5 bg-blue-700 hover:bg-black/20 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                                        >
                                            {t("cancel")}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 overflow-y-auto pr-4 scrollbar-thin pb-20"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {mapProperties.filter(p => {
                                    if (activeFilter === "all") return true;
                                    if (activeFilter === "active" && p.status === "Active") return true;
                                    if (activeFilter === "renovation" && p.status === "Renovation") return true;
                                    if (activeFilter === "incoming" && ["Incoming", "Incoming Asset", "Under Contract"].includes(p.status)) return true;
                                    return false;
                                }).map((prop, i) => (
                                    <div
                                        key={prop.id}
                                        onClick={() => editProperty?.(prop)}
                                        className="group glass-card rounded-2xl overflow-hidden border border-slate-700/40 hover:border-blue-500/50 transition-all hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] cursor-pointer flex flex-col"
                                    >
                                        <div className="relative h-48 shrink-0 overflow-hidden">
                                            <img src={prop.image} alt={prop.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

                                            <div className="absolute top-4 left-4">
                                                <span className={cn(
                                                    "text-xs px-2.5 py-1 rounded-full font-semibold shadow-lg backdrop-blur-md border border-white/10",
                                                    prop.status === "Active" ? "bg-emerald-500/80 text-white" :
                                                        ["Incoming", "Incoming Asset"].includes(prop.status) ? "bg-purple-500/80 text-white" :
                                                            prop.status === "Renovation" ? "bg-amber-500/80 text-white" :
                                                                "bg-slate-800/80 text-slate-200"
                                                )}>
                                                    {prop.status}
                                                </span>
                                            </div>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeProperty?.(prop.id); }}
                                                className="absolute top-4 right-4 p-2 bg-slate-900/60 text-slate-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/80 hover:text-white backdrop-blur-md border border-white/10 shadow-lg"
                                                title="Remove Asset"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                            </button>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); editProperty?.(prop); }}
                                                className="absolute top-4 right-14 p-2 bg-slate-900/60 text-slate-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500/80 hover:text-white backdrop-blur-md border border-white/10 shadow-lg"
                                                title="Edit Asset"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            </button>

                                            <div className="absolute bottom-4 left-4 right-4">
                                                <h3 className="text-xl font-bold text-white truncate drop-shadow-md group-hover:text-blue-400 transition-colors">{prop.name}</h3>
                                                <p className="text-sm text-slate-300 truncate font-medium flex items-center gap-1.5 mt-0.5">
                                                    <MapIcon size={12} className="text-blue-400" /> {prop.address}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-5 grid grid-cols-2 gap-y-4 gap-x-2 bg-slate-950/40 flex-1">
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">{t("currentValue")}</p>
                                                <p className="text-slate-200 font-semibold">{formatCompactCurrency(prop.financials?.currentValue || 0, currency, locale)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">{t("equity")}</p>
                                                <p className="text-slate-200 font-semibold text-emerald-400">
                                                    {formatCompactCurrency((prop.financials?.currentValue || 0) - (prop.financials?.debt || 0), currency, locale)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">{t("netCashflow")}</p>
                                                <p className="text-slate-200 font-semibold">
                                                    {formatCurrency((prop.financials?.monthlyRent || 0) - (prop.financials?.monthlyExpenses || 0), currency, locale)}<span className="text-[10px] font-normal text-slate-500">/mo</span>
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">{t("type")}</p>
                                                <p className="text-slate-200 font-semibold text-sm truncate">
                                                    {prop.type === "Multi-unit" ? t("multiUnit") : prop.type === "Multi-family" ? t("multifamily") : prop.type === "Duplex" ? t("duplex") : prop.type === "Condo" ? t("condo") : prop.type === "Commercial" ? t("commercial") : t("singleFamily")}
                                                    {prop.units && prop.units > 1 && <span className="text-xs text-slate-500 ml-1">({prop.units})</span>}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
