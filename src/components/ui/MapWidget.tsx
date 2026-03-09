"use client";

import { useEffect, useState, useMemo } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Property } from "@/lib/data";
import { formatCompactCurrency, cn } from "@/lib/utils";
import { useSettings } from "@/components/ui/settings-provider";
import { Map as MapIcon, ChevronRight, X } from "lucide-react";

// The user must provide a Mapbox token in .env.local
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapWidgetProps {
    properties: Property[];
    activeFilter: string;
    pinAsset?: Property | null;
    editProperty?: (prop: Property) => void;
    onPinComplete?: (lat: number, lng: number) => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "Active": return "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]";
        case "Renovation": return "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
        case "Incoming Asset":
        case "Incoming":
        case "Under Contract": return "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]";
        default: return "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]";
    }
};

export default function MapWidget({ properties, activeFilter, pinAsset, editProperty, onPinComplete }: MapWidgetProps) {
    const { t, currency, locale } = useSettings();
    const [mounted, setMounted] = useState(false);
    const [popupInfo, setPopupInfo] = useState<Property | null>(null);
    const [viewState, setViewState] = useState({
        longitude: -98.5795,
        latitude: 39.8283,
        zoom: 3.5
    });
    const [tempMarker, setTempMarker] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Filter properties based on the selected tab
    const filteredProperties = useMemo(() => {
        return properties.filter(p => {
            if (activeFilter === "all") return true;
            if (activeFilter === "active" && p.status === "Active") return true;
            if (activeFilter === "renovation" && p.status === "Renovation") return true;
            if (activeFilter === "incoming" && ["Incoming", "Incoming Asset", "Under Contract"].includes(p.status)) return true;
            return false;
        });
    }, [properties, activeFilter]);

    // Ensure we only mark properties with latitude and longitude
    const validProps = useMemo(() => {
        return filteredProperties.filter(p =>
            p.lat !== null && p.lng !== null &&
            p.lat !== undefined && p.lng !== undefined &&
            !isNaN(Number(p.lat)) && !isNaN(Number(p.lng))
        );
    }, [filteredProperties]);

    if (!mounted) {
        return <div className="w-full h-full bg-slate-900/50 flex items-center justify-center rounded-2xl border border-slate-700/50"><div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div></div>;
    }

    if (!MAPBOX_TOKEN) {
        return (
            <div className="w-full h-full bg-slate-900/80 flex flex-col gap-4 items-center justify-center text-center p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
                <MapIcon size={48} className="text-blue-500/50 mb-2" />
                <h3 className="text-xl font-bold text-white">Mapbox Token Required</h3>
                <p className="text-slate-400 max-w-md">
                    To render the map, please add your Mapbox API Key to your <code className="bg-slate-800 px-1 rounded">.env.local</code> file as <code className="bg-slate-800 px-1 text-blue-400 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code> and restart the server.
                </p>
                <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors">
                    Get Free Token First
                </a>
            </div>
        );
    }

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden glass-card border border-slate-700/50 shadow-2xl relative map-container">
            {validProps.length === 0 && (
                <div className="absolute inset-0 z-[1000] flex items-center justify-center pointer-events-none">
                    <div className="bg-slate-900/80 backdrop-blur text-slate-300 px-4 py-2 rounded-lg text-sm border border-slate-700/50 shadow-xl">
                        {t("noPropertiesOnMap" as any) || "No map coordinates found"}
                    </div>
                </div>
            )}

            <Map
                {...viewState}
                onMove={(evt: any) => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
                style={{ width: "100%", height: "100%" }}
                onClick={(e: any) => {
                    if (pinAsset && onPinComplete) {
                        const { lng, lat } = e.lngLat;
                        setTempMarker({ lat, lng });
                    }
                }}
                cursor={pinAsset ? 'crosshair' : 'grab'}
            >
                {/* Temporary pinning marker */}
                {pinAsset && tempMarker && (
                    <Popup
                        longitude={tempMarker.lng}
                        latitude={tempMarker.lat}
                        anchor="bottom"
                        closeButton={false}
                        closeOnClick={false}
                        onClose={() => setTempMarker(null)}
                        className="z-[2000] pin-confirm-popup"
                    >
                        <div className="p-3 bg-slate-900 border border-blue-500 rounded-xl shadow-2xl flex flex-col gap-3 min-w-[180px]">
                            <p className="text-xs font-bold text-white text-center">{t("confirmPin")}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setTempMarker(null)}
                                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold transition-colors"
                                >
                                    {t("cancel")}
                                </button>
                                <button
                                    onClick={() => {
                                        if (onPinComplete && tempMarker) {
                                            onPinComplete(tempMarker.lat, tempMarker.lng);
                                        }
                                        setTempMarker(null);
                                    }}
                                    className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold transition-all shadow-lg shadow-blue-500/20"
                                >
                                    {t("saveAsset")}
                                </button>
                            </div>
                        </div>
                    </Popup>
                )}
                {validProps.map(prop => (
                    <Marker
                        key={`marker-${prop.id}`}
                        longitude={prop.lng!}
                        latitude={prop.lat!}
                        anchor="bottom"
                        onClick={(e: any) => {
                            e.originalEvent.stopPropagation();
                            setPopupInfo(prop);
                        }}
                    >
                        <div className="relative group cursor-pointer w-full h-full flex justify-center pb-2">
                            <div className={cn("relative w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center backdrop-blur-md transition-transform group-hover:scale-110 z-10", getStatusColor(prop.status))}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M3 21h18" /><path d="M9 8h1" /><path d="M9 12h1" /><path d="M9 16h1" /><path d="M14 8h1" /><path d="M14 12h1" /><path d="M14 16h1" /><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" /></svg>
                            </div>
                            <div className="absolute bottom-0 w-1 h-3 bg-gradient-to-t from-transparent to-white/40 group-hover:h-4 transition-all"></div>
                        </div>
                    </Marker>
                ))}

                {popupInfo && (
                    <Popup
                        anchor="top"
                        longitude={popupInfo.lng!}
                        latitude={popupInfo.lat!}
                        onClose={() => setPopupInfo(null)}
                        closeOnClick={false}
                        className="custom-mapbox-popup z-50"
                        maxWidth="260px"
                    >
                        <div className="w-64 -m-[10px] bg-slate-900 border border-slate-700 overflow-hidden rounded-xl shadow-2xl">
                            <div className="h-24 relative overflow-hidden">
                                <img src={popupInfo.image} alt={popupInfo.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                                <div className="absolute top-2 left-2">
                                    <span className={cn(
                                        "text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg border border-white/10",
                                        popupInfo.status === "Active" ? "bg-emerald-500 text-white" :
                                            ["Incoming", "Incoming Asset"].includes(popupInfo.status) ? "bg-purple-500 text-white" :
                                                popupInfo.status === "Renovation" ? "bg-amber-500 text-white" :
                                                    "bg-slate-700 text-slate-300"
                                    )}>
                                        {popupInfo.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-3">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 border-b border-slate-700/50 pb-3">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                                            <img src={popupInfo.image} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-white truncate pr-2">{popupInfo.name}</h3>
                                            <p className="text-[10px] text-slate-400 font-medium truncate">{popupInfo.address}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t("currentValue")}</p>
                                            <p className="text-xs font-bold text-blue-400">{formatCompactCurrency(popupInfo.financials.currentValue, currency, locale)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t("equity")}</p>
                                            <p className="text-xs font-bold text-emerald-400">{formatCompactCurrency(popupInfo.financials.currentValue - popupInfo.financials.debt, currency, locale)}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-1">
                                        <button
                                            onClick={() => editProperty?.(popupInfo)}
                                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            {t("editAsset")}
                                        </button>
                                        <button
                                            onClick={() => setPopupInfo(null)}
                                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors border border-slate-700"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
}
