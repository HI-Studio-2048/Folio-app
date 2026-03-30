"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    ChevronRight,
    ArrowLeft,
    Building2,
    TrendingUp,
    Car,
    Check,
    Briefcase,
    Zap,
    Users,
    User,
    Paintbrush,
    Wine,
    Gem,
    Lightbulb,
    ArrowRight
} from "lucide-react";
import { useSettings } from "@/components/ui/settings-provider";
import { cn } from "@/lib/utils";
import { AnimatedLogo } from "@/components/ui/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const { t, setPortfolioType, setOnboardingCompleted } = useSettings();
    const router = useRouter();
    const { isSignedIn } = useUser();
    const [step, setStep] = useState(1);

    // Attribution: when user is signed in, send any stored ref code to the API
    useEffect(() => {
        if (!isSignedIn) return;
        const refCode = localStorage.getItem("affiliate_ref");
        if (!refCode) return;
        fetch("/api/user/affiliate/attribute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refCode }),
        }).then(() => {
            localStorage.removeItem("affiliate_ref");
        }).catch(() => {});
    }, [isSignedIn]);
    const [formData, setFormData] = useState({
        portfolioType: "" as any,
        portfolioRole: "",
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const finishOnboarding = () => {
        if (formData.portfolioType) {
            setPortfolioType(formData.portfolioType);
        }
        setStep(3);
    };

    const startTutorial = () => {
        setOnboardingCompleted(true);
        router.push("/dashboard?tutorial=true");
    };

    const skipTutorial = () => {
        setOnboardingCompleted(true);
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen w-full bg-[#06080F] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
            {/* Rich Ambient Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 50, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-600/20 blur-[150px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, -50, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[80%] bg-indigo-600/10 blur-[150px] rounded-full"
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <main className="w-full max-w-xl z-10 flex flex-col items-center">
                {/* Brand Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-10 sm:mb-12"
                >
                    <Link href="/" className="flex flex-col items-center gap-4 group">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 relative"
                        >
                            <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <AnimatedLogo size={32} />
                        </motion.div>
                        <h1 className="text-3xl font-outfit font-black tracking-tighter text-white">
                            FOLLIO<span className="text-blue-500">.</span>
                        </h1>
                    </Link>
                </motion.div>

                {/* Main Interaction Card */}
                <div className="w-full glass-card backdrop-blur-3xl bg-slate-900/60 border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-3xl relative overflow-hidden group">
                    {/* Subtle Internal Glow */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ type: "spring", damping: 25 }}
                                className="space-y-8"
                            >
                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl sm:text-3xl font-outfit font-bold text-white mb-2 leading-tight">
                                        Personalize Your Follio
                                    </h2>
                                    <p className="text-slate-400 text-sm sm:text-base">
                                        What type of portfolio are you building today?
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <PortfolioOption
                                        icon={Building2}
                                        title={t("realEstate")}
                                        description={t("realEstateDesc")}
                                        active={formData.portfolioType === "realEstate"}
                                        onClick={() => setFormData({ ...formData, portfolioType: "realEstate", portfolioRole: "" })}
                                    />
                                    <PortfolioOption
                                        icon={Briefcase}
                                        title={t("companyPortfolio")}
                                        description={t("companyPortfolioDesc")}
                                        active={formData.portfolioType === "business"}
                                        onClick={() => setFormData({ ...formData, portfolioType: "business", portfolioRole: "" })}
                                    />
                                    <PortfolioOption
                                        icon={TrendingUp}
                                        title={t("stocks")}
                                        description={t("stocksDesc")}
                                        active={formData.portfolioType === "stocks"}
                                        onClick={() => setFormData({ ...formData, portfolioType: "stocks", portfolioRole: "" })}
                                    />
                                    <PortfolioOption
                                        icon={Gem}
                                        title={t("collections")}
                                        description={t("collectionsDesc")}
                                        active={formData.portfolioType === "collection"}
                                        onClick={() => setFormData({ ...formData, portfolioType: "collection", portfolioRole: "" })}
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleNext}
                                    disabled={!formData.portfolioType}
                                    className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/25 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed group/btn overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                    <span className="text-lg">{t("continue")}</span>
                                    <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                </motion.button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ type: "spring", damping: 25 }}
                                className="space-y-8"
                            >
                                <div>
                                    <button
                                        onClick={handleBack}
                                        className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group/back"
                                    >
                                        <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center group-hover/back:border-slate-600">
                                            <ArrowLeft size={16} />
                                        </div>
                                        <span className="text-sm font-medium">{t("back")}</span>
                                    </button>
                                    <h2 className="text-2xl sm:text-3xl font-outfit font-bold text-white mb-2 leading-tight">
                                        Choose Your Focus
                                    </h2>
                                    <p className="text-slate-400 text-sm sm:text-base">
                                        Tell us more about your role and strategy.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                    {formData.portfolioType === "realEstate" && (
                                        <>
                                            <PortfolioOption
                                                icon={Briefcase}
                                                title={t("investorLongTerm")}
                                                description={t("investorLongTermDesc")}
                                                active={formData.portfolioRole === "investor"}
                                                onClick={() => setFormData({ ...formData, portfolioRole: "investor" })}
                                                large
                                            />
                                            <PortfolioOption
                                                icon={Zap}
                                                title={t("flipper")}
                                                description={t("flipperDesc")}
                                                active={formData.portfolioRole === "flipper"}
                                                onClick={() => setFormData({ ...formData, portfolioRole: "flipper" })}
                                                large
                                            />
                                            <PortfolioOption
                                                icon={Users}
                                                title={t("sellerAgent")}
                                                description={t("sellerDesc")}
                                                active={formData.portfolioRole === "seller"}
                                                onClick={() => setFormData({ ...formData, portfolioRole: "seller" })}
                                                large
                                            />
                                        </>
                                    )}
                                    {/* ... rest of options similarly ... */}
                                    {formData.portfolioType === "business" && (
                                        <>
                                            <PortfolioOption icon={Building2} title={t("hedgeFund")} description={t("hedgeFundDesc")} active={formData.portfolioRole === "hedge_fund"} onClick={() => setFormData({ ...formData, portfolioRole: "hedge_fund" })} large />
                                            <PortfolioOption icon={TrendingUp} title={t("angelInvestor")} description={t("angelInvestorDesc")} active={formData.portfolioRole === "angel_investor"} onClick={() => setFormData({ ...formData, portfolioRole: "angel_investor" })} large />
                                        </>
                                    )}
                                    {formData.portfolioType === "stocks" && (
                                        <>
                                            <PortfolioOption icon={User} title={t("retail")} description={t("retailDesc")} active={formData.portfolioRole === "retail"} onClick={() => setFormData({ ...formData, portfolioRole: "retail" })} large />
                                            <PortfolioOption icon={Briefcase} title={t("commercial")} description={t("commercialDesc")} active={formData.portfolioRole === "commercial"} onClick={() => setFormData({ ...formData, portfolioRole: "commercial" })} large />
                                        </>
                                    )}
                                    {formData.portfolioType === "collection" && (
                                        <>
                                            <PortfolioOption icon={Paintbrush} title={t("art")} description={t("artDesc")} active={formData.portfolioRole === "art"} onClick={() => setFormData({ ...formData, portfolioRole: "art" })} large />
                                            <PortfolioOption icon={Car} title={t("cars")} description={t("carsDesc")} active={formData.portfolioRole === "cars"} onClick={() => setFormData({ ...formData, portfolioRole: "cars" })} large />
                                            <PortfolioOption icon={Wine} title={t("wine")} description={t("wineDesc")} active={formData.portfolioRole === "wine"} onClick={() => setFormData({ ...formData, portfolioRole: "wine" })} large />
                                            <PortfolioOption icon={Gem} title={t("collectables")} description={t("collectablesDesc")} active={formData.portfolioRole === "collectables"} onClick={() => setFormData({ ...formData, portfolioRole: "collectables" })} large />
                                        </>
                                    )}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={finishOnboarding}
                                    disabled={!formData.portfolioRole}
                                    className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/25 disabled:opacity-40 disabled:cursor-not-allowed group/btn"
                                >
                                    <span className="text-lg">{t("finishSetup")}</span>
                                    <Check size={20} />
                                </motion.button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", damping: 20 }}
                                className="flex flex-col items-center py-6"
                            >
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        boxShadow: ["0 0 20px rgba(59,130,246,0.1)", "0 0 40px rgba(59,130,246,0.3)", "0 0 20px rgba(59,130,246,0.1)"]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-24 h-24 bg-blue-500/10 text-blue-400 rounded-3xl flex items-center justify-center mb-10 border border-blue-500/20 shadow-2xl relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent" />
                                    <Lightbulb size={48} className="relative" />
                                </motion.div>

                                <div className="text-center space-y-4 mb-12">
                                    <h2 className="text-3xl sm:text-4xl font-outfit font-bold text-white tracking-tight">
                                        Ready to Build?
                                    </h2>
                                    <p className="text-slate-400 text-lg max-w-sm mx-auto leading-relaxed">
                                        Let's kickstart your journey with a quick overview of your new command center.
                                    </p>
                                </div>

                                <div className="w-full space-y-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={startTutorial}
                                        className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/25 text-lg"
                                    >
                                        <Zap size={20} className="fill-current" />
                                        Take the Tour
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={skipTutorial}
                                        className="w-full py-5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-center gap-3 transition-all border border-slate-700/50 hover:border-slate-600"
                                    >
                                        Jump to Dashboard
                                        <ArrowRight size={20} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 text-center"
                >
                    <p className="text-slate-500 text-sm">
                        Prefer to browse first?{" "}
                        <Link href="/dashboard" className="text-slate-300 hover:text-white font-semibold transition-colors decoration-blue-500/30 underline underline-offset-4 decoration-2">
                            Enter as guest
                        </Link>
                    </p>
                </motion.div>
            </main>
        </div>
    );
}

function PortfolioOption({
    icon: Icon,
    title,
    description,
    active,
    onClick,
    large = false
}: {
    icon: any,
    title: string,
    description: string,
    active: boolean,
    onClick: () => void,
    large?: boolean
}) {
    return (
        <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "group relative w-full flex flex-col p-5 rounded-3xl border transition-all text-left",
                active
                    ? "bg-blue-600/10 border-blue-500 shadow-2xl shadow-blue-500/10"
                    : "bg-slate-900/40 border-white/5 hover:border-white/10 hover:bg-slate-800/40"
            )}
        >
            <div className="flex items-center gap-4 mb-3">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all shadow-lg",
                    active ? "bg-blue-600 text-white shadow-blue-500/20" : "bg-slate-800 text-slate-400 group-hover:text-blue-400 group-hover:bg-slate-700"
                )}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h3 className={cn(
                        "text-base font-bold transition-all",
                        active ? "text-white" : "text-slate-200 group-hover:text-white"
                    )}>{title}</h3>
                </div>
                {active && (
                    <motion.div
                        layoutId="check-badge"
                        className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg"
                    >
                        <Check size={14} strokeWidth={3} />
                    </motion.div>
                )}
            </div>
            <p className={cn(
                "text-xs leading-relaxed line-clamp-2",
                active ? "text-blue-100/70" : "text-slate-500 group-hover:text-slate-400"
            )}>
                {description}
            </p>
            {active && (
                <div className="absolute inset-0 border-2 border-blue-500/50 rounded-3xl pointer-events-none" />
            )}
        </motion.button>
    );
}
