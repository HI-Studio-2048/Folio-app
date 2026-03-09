"use client";

import { useState } from "react";
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
    const { t, setPortfolioType } = useSettings();
    const router = useRouter();
    const [step, setStep] = useState(1);
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
        router.push("/dashboard?tutorial=true");
    };

    const skipTutorial = () => {
        router.push("/dashboard");
    };

    return (
        <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] sm:w-[50%] sm:h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] sm:w-[50%] sm:h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>
            </div>

            <main className="w-full max-w-md z-10">
                <div className="flex justify-center mb-6 sm:mb-8">
                    <Link href="/" className="flex items-center gap-3">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                borderRadius: ["20%", "40%", "20%"]
                            }}
                            transition={{
                                duration: 3,
                                ease: "easeInOut",
                                repeat: Infinity
                            }}
                            className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20"
                        >
                            <AnimatedLogo size={22} />
                        </motion.div>
                        <span className="font-outfit text-2xl font-bold tracking-wide text-white">Follio</span>
                    </Link>
                </div>

                <div className="glass-card backdrop-blur-xl bg-slate-900/40 border border-slate-700/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-5 sm:space-y-6"
                            >
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">{t("onboardingTitle")}</h1>
                                    <p className="text-slate-400 text-xs sm:text-sm">{t("onboardingSubtitle")}</p>
                                </div>

                                <div className="space-y-2.5 sm:space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
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
                                        active={formData.portfolioType === "company"}
                                        onClick={() => setFormData({ ...formData, portfolioType: "company", portfolioRole: "" })}
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

                                <button
                                    onClick={handleNext}
                                    disabled={!formData.portfolioType}
                                    className="w-full py-3 sm:py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                >
                                    {t("continue")}
                                    <ChevronRight size={18} />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-5 sm:space-y-6"
                            >
                                <div>
                                    <button
                                        onClick={handleBack}
                                        className="text-slate-400 hover:text-white flex items-center gap-1 text-xs sm:text-sm mb-3 sm:mb-4 transition-colors w-fit"
                                    >
                                        <ArrowLeft size={14} />
                                        {t("back")}
                                    </button>
                                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">{t("chooseFocus")}</h1>
                                    <p className="text-slate-400 text-xs sm:text-sm">{t("chooseFocusDesc")}</p>
                                </div>

                                <div className="space-y-2.5 sm:space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {formData.portfolioType === "realEstate" && (
                                        <>
                                            <PortfolioOption
                                                icon={Briefcase}
                                                title={t("investorLongTerm")}
                                                description={t("investorLongTermDesc")}
                                                active={formData.portfolioRole === "investor"}
                                                onClick={() => setFormData({ ...formData, portfolioRole: "investor" })}
                                            />
                                            <PortfolioOption
                                                icon={Zap}
                                                title={t("flipper")}
                                                description={t("flipperDesc")}
                                                active={formData.portfolioRole === "flipper"}
                                                onClick={() => setFormData({ ...formData, portfolioRole: "flipper" })}
                                            />
                                            <PortfolioOption
                                                icon={Users}
                                                title={t("sellerAgent")}
                                                description={t("sellerDesc")}
                                                active={formData.portfolioRole === "seller"}
                                                onClick={() => setFormData({ ...formData, portfolioRole: "seller" })}
                                            />
                                        </>
                                    )}
                                    {formData.portfolioType === "company" && (
                                        <>
                                            <PortfolioOption
                                                icon={Building2}
                                                title={t("hedgeFund")}
                                                description={t("hedgeFundDesc")}
                                                active={formData.portfolioRole === "hedge_fund"}
                                                onClick={() => setFormData({ ...formData, portfolioRole: "hedge_fund" })}
                                            />
                                            <PortfolioOption
                                                icon={TrendingUp}
                                                title={t("angelInvestor")}
                                                description={t("angelInvestorDesc")}
                                                active={formData.portfolioRole === "angel_investor"}
                                                onClick={() => setFormData({ ...formData, portfolioRole: "angel_investor" })}
                                            />
                                        </>
                                    )}
                                    {formData.portfolioType === "stocks" && (
                                        <>
                                            <PortfolioOption
                                                icon={User}
                                                title={t("retail")}
                                                description={t("retailDesc")}
                                                active={formData.portfolioRole === "retail"}
                                                onClick={() => setFormData({ ...formData, portfolioRole: "retail" })}
                                            />
                                            <PortfolioOption
                                                icon={Briefcase}
                                                title={t("commercial")}
                                                description={t("commercialDesc")}
                                                active={formData.portfolioRole === "commercial"}
                                                onClick={() => setFormData({ ...formData, portfolioRole: "commercial" })}
                                            />
                                        </>
                                    )}
                                    {formData.portfolioType === "collection" && (
                                        <>
                                            <PortfolioOption
                                                icon={Paintbrush}
                                                title={t("art")}
                                                description={t("artDesc")}
                                                active={formData.portfolioRole === "art"}
                                                onClick={() => setFormData({ ...formData, portfolioRole: "art" })}
                                            />
                                            <PortfolioOption
                                                icon={Car}
                                                title={t("cars")}
                                                description={t("carsDesc")}
                                                active={formData.portfolioRole === "cars"}
                                                onClick={() => setFormData({ ...formData, portfolioRole: "cars" })}
                                            />
                                            <PortfolioOption
                                                icon={Wine}
                                                title={t("wine")}
                                                description={t("wineDesc")}
                                                active={formData.portfolioRole === "wine"}
                                                onClick={() => setFormData({ ...formData, portfolioRole: "wine" })}
                                            />
                                            <PortfolioOption
                                                icon={Gem}
                                                title={t("collectables")}
                                                description={t("collectablesDesc")}
                                                active={formData.portfolioRole === "collectables"}
                                                onClick={() => setFormData({ ...formData, portfolioRole: "collectables" })}
                                            />
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={finishOnboarding}
                                    disabled={!formData.portfolioRole}
                                    className="w-full py-3 sm:py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                >
                                    {t("finishSetup")}
                                    <Check size={18} />
                                </button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6 sm:space-y-8"
                            >
                                <div className="text-center pt-4">
                                    <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                        <Lightbulb size={28} />
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t("onboardingTutorialTitle")}</h1>
                                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed px-2">{t("onboardingTutorialDesc")}</p>
                                </div>

                                <div className="space-y-3 pt-4">
                                    <button
                                        onClick={startTutorial}
                                        className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 text-sm sm:text-base"
                                    >
                                        <Lightbulb size={18} />
                                        {t("startTutorial")}
                                    </button>
                                    <button
                                        onClick={skipTutorial}
                                        className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-2 transition-all border border-slate-700/50 text-sm sm:text-base"
                                    >
                                        {t("skipTutorial")}
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-6 sm:mt-8 text-center">
                    <p className="text-slate-500 text-xs sm:text-sm">
                        {t("preferExplore")}{" "}
                        <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            {t("enterAsGuest")}
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}

function PortfolioOption({
    icon: Icon,
    title,
    description,
    active,
    onClick
}: {
    icon: any,
    title: string,
    description: string,
    active: boolean,
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-all text-left group",
                active
                    ? "bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-500/5"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
            )}
        >
            <div className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                active ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 group-hover:text-slate-300 group-hover:bg-slate-700"
            )}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className={cn(
                    "text-sm sm:text-base font-bold transition-colors truncate",
                    active ? "text-white" : "text-slate-200"
                )}>{title}</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 line-clamp-2 leading-relaxed">{description}</p>
            </div>
            {active && (
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0 ml-2">
                    <Check size={12} className="text-white" />
                </div>
            )}
        </button>
    );
}
