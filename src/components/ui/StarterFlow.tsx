"use client";

import { motion } from "framer-motion";
import { Plus, PlayCircle, FileUp, Building2, TrendingUp, Briefcase, Gem } from "lucide-react";
import { useSettings } from "@/components/ui/settings-provider";
import { cn } from "@/lib/utils";

interface StarterFlowProps {
    onOpenAddModal: () => void;
    onStartTutorial: () => void;
}

export function StarterFlow({ onOpenAddModal, onStartTutorial }: StarterFlowProps) {
    const { t, portfolioType } = useSettings();

    const icons = {
        realEstate: Building2,
        stocks: TrendingUp,
        company: Briefcase,
        collection: Gem
    };

    const Icon = icons[portfolioType] || Building2;

    return (
        <div className="absolute inset-0 z-[40] flex items-center justify-center p-6 sm:p-12">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md pointer-events-auto"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-2xl glass-card rounded-3xl border border-blue-500/20 shadow-2xl p-8 sm:p-12 bg-slate-900 overflow-hidden text-center"
            >
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -z-10" />

                <div className="flex flex-col items-center">
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-20 h-20 bg-blue-600/10 text-blue-400 rounded-3xl flex items-center justify-center mb-8 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                    >
                        <Icon size={40} />
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl font-outfit font-bold text-white mb-4">
                        {t("starterFlowTitle")}
                    </h2>
                    <p className="text-slate-400 text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed">
                        {t("starterFlowSubtitle")}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                        <button
                            onClick={onOpenAddModal}
                            className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-500/20 group overflow-hidden relative"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <span className="font-bold">{t("addFirstAsset")}</span>
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>

                        <button
                            onClick={onStartTutorial}
                            className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700/50 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                <PlayCircle size={24} className="text-blue-400" />
                            </div>
                            <span className="font-bold">{t("takeTheTour")}</span>
                        </button>
                    </div>

                    <button
                        className="mt-8 text-sm text-slate-500 hover:text-slate-300 flex items-center gap-2 transition-colors"
                        onClick={() => { }}
                    >
                        <FileUp size={14} />
                        {t("importCsvSoon")}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
