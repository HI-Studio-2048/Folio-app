"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { X, ChevronRight, Check } from "lucide-react";
import { useSettings } from "@/components/ui/settings-provider";
import { cn } from "@/lib/utils";

const tutorialSteps = [
    {
        title: "Welcome to Follio",
        description: "This is your main dashboard. From here you can track your entire portfolio at a glance.",
        target: "header",
        position: "center"
    },
    {
        title: "Acquisition Pipeline",
        description: "Move deals through different stages visually in a Kanban board style.",
        target: "pipeline",
        position: "center"
    },
    {
        title: "Portfolio Map",
        description: "See exactly what properties you have and their health metrics across different lifecycles.",
        target: "portfolioMap",
        position: "center"
    },
    {
        title: "AI Agents (AgentS)",
        description: "Configure your autonomous helpers like Prospector, Portfolio Manager, and Coffee Girl to handle tasks for you.",
        target: "agents",
        position: "center"
    }
];

export function TutorialOverlay() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const isTutorial = searchParams.get("tutorial") === "true";
    const [step, setStep] = useState(0);

    const { t } = useSettings();

    useEffect(() => {
        if (!isTutorial) return;

        // Optionally disable scrolling or add highlights to targets based on step
        // For a simple version we just show a centered modal overlay that describes the steps.
    }, [isTutorial, step]);

    const handleNext = () => {
        if (step < tutorialSteps.length - 1) {
            setStep(step + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("tutorial");
        router.replace(pathname + newUrl.search);
        setStep(0);
    };

    if (!isTutorial) return null;

    const currentStep = tutorialSteps[step];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm pointer-events-auto"
                />

                <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-md glass-card rounded-2xl border border-blue-500/30 shadow-2xl p-6 bg-slate-900 overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                        <motion.div 
                            className="h-full bg-blue-500"
                            initial={{ width: `${(step / tutorialSteps.length) * 100}%` }}
                            animate={{ width: `${((step + 1) / tutorialSteps.length) * 100}%` }}
                        />
                    </div>
                    
                    <button
                        onClick={handleComplete}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="pt-4 space-y-4">
                        <div className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-2">
                            Step {step + 1} of {tutorialSteps.length}
                        </div>
                        <h2 className="text-2xl font-bold text-white">{currentStep.title}</h2>
                        <p className="text-slate-300 leading-relaxed">
                            {currentStep.description}
                        </p>

                        <div className="pt-6 flex justify-between items-center">
                            <button
                                onClick={handleComplete}
                                className="text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                Skip Tour
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                            >
                                {step === tutorialSteps.length - 1 ? (
                                    <>Finish <Check size={16} /></>
                                ) : (
                                    <>Next <ChevronRight size={16} /></>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

