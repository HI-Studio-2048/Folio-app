"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gem, Shield, MapPin, Calendar, Activity, Info, Link as LinkIcon } from "lucide-react";
import { useSettings } from "@/components/ui/settings-provider";
import { Property, PropertyStatus } from "@/lib/data";

interface AddCollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddAssets: (assets: Property[]) => void;
    initialStatus?: PropertyStatus;
}

export function AddCollectionModal({ isOpen, onClose, onAddAssets, initialStatus }: AddCollectionModalProps) {
    const { t } = useSettings();
    const [formData, setFormData] = useState({
        name: "",
        type: "Fine Art",
        status: initialStatus || "Scouting",
        currentValue: 0,
        acquisitionDate: "",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800",
        description: "",
        physicalLocation: "",
        authenticityCert: "",
        appraisalDate: "",
        rarityIndex: "Unique",
        conditionReport: "Mint"
    });

    useEffect(() => {
        if (isOpen && initialStatus) {
            setFormData(prev => ({ ...prev, status: initialStatus }));
        }
    }, [isOpen, initialStatus]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newAsset: Property = {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.name || "Untitled Collection Item",
            address: formData.physicalLocation || "Vault",
            type: formData.type as any,
            status: formData.status as any,
            image: formData.image,
            financials: {
                purchasePrice: Number(formData.currentValue) * 0.9,
                currentValue: Number(formData.currentValue),
                renovationCost: 0,
                debt: 0,
                monthlyRent: 0,
                monthlyExpenses: 0,
                monthlyDebtService: 0,
                principalPayment: 0,
            },
            acquisitionDate: formData.acquisitionDate || undefined,
            description: formData.description,
            // We use custom fields in the description or just stick to the Property interface for now
            // To make it truly unique, we should ideally extend the Property type, but for now we'll match the UI
        };
        onAddAssets([newAsset]);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-[95vw] sm:w-full max-w-2xl bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-slate-800/60 bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                    <Gem size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-white">Add Collection Item</h2>
                            </div>
                            <button onClick={onClose} className="p-2 -m-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Item Name / Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600"
                                        placeholder="e.g. 1962 Ferrari 250 GTO"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("type")}</label>
                                    <select
                                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-all"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="Fine Art">Fine Art</option>
                                        <option value="Luxury Watch">Luxury Watch</option>
                                        <option value="Automotive">Automotive</option>
                                        <option value="Wine & Spirits">Wine & Spirits</option>
                                        <option value="Collectibles">Collectibles</option>
                                        <option value="Jewelry">Jewelry</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("status")}</label>
                                    <select
                                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-all"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyStatus })}
                                    >
                                        <option value="Scouting">Scouting / Potential</option>
                                        <option value="Appraisal">Appraisal / Authentication</option>
                                        <option value="Negotiation">Negotiation / Purchase</option>
                                        <option value="Transit">In Transit / Vaulting</option>
                                        <option value="Secured">Secured / Collection</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Value</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg pl-8 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-all"
                                            value={formData.currentValue}
                                            onChange={(e) => setFormData({ ...formData, currentValue: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("acquisitionDate")}</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-all [color-scheme:dark]"
                                        value={formData.acquisitionDate}
                                        onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Physical Location</label>
                                    <div className="relative">
                                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-all"
                                            placeholder="e.g. Zurich Vault, Home, Gallery"
                                            value={formData.physicalLocation}
                                            onChange={(e) => setFormData({ ...formData, physicalLocation: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-800">
                                <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                                    <Shield size={16} className="text-blue-400" /> Provenance & Authenticity
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CoA / Authentication Link</label>
                                        <div className="relative">
                                            <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type="text"
                                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-all"
                                                placeholder="Link to Certificate"
                                                value={formData.authenticityCert}
                                                onChange={(e) => setFormData({ ...formData, authenticityCert: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Appraisal Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-all [color-scheme:dark]"
                                            value={formData.appraisalDate}
                                            onChange={(e) => setFormData({ ...formData, appraisalDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rarity / Edition</label>
                                        <select
                                            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-all"
                                            value={formData.rarityIndex}
                                            onChange={(e) => setFormData({ ...formData, rarityIndex: e.target.value })}
                                        >
                                            <option value="Unique">Unique (1 of 1)</option>
                                            <option value="Ultra Rare">Ultra Rare (&lt; 10)</option>
                                            <option value="Rare">Rare (&lt; 100)</option>
                                            <option value="Limited Edition">Limited Edition</option>
                                            <option value="Mass Production">Mass Production</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Condition</label>
                                        <select
                                            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-all"
                                            value={formData.conditionReport}
                                            onChange={(e) => setFormData({ ...formData, conditionReport: e.target.value })}
                                        >
                                            <option value="Mint">Mint (Like New)</option>
                                            <option value="Excellent">Excellent</option>
                                            <option value="Good">Good</option>
                                            <option value="Fair">Fair / Aged</option>
                                            <option value="Restored">Restored</option>
                                            <option value="Damaged">Damaged</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-800">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Asset Description / History</label>
                                <textarea
                                    className="w-full mt-2 bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600 min-h-[100px]"
                                    placeholder="Describe the provenance, history, and unique characteristics of this piece..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4 pt-4 pb-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 font-bold uppercase tracking-wider text-xs hover:bg-slate-800 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-amber-500/20 transition-all"
                                >
                                    Add to Collection
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
