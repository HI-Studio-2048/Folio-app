"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Loader2, ArrowRight, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/components/ui/settings-provider";

export function PricingSection() {
    const { t } = useSettings();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const handleCheckout = async (plan: string) => {
        try {
            setLoadingPlan(plan);
            const response = await fetch("/api/checkout", {
                method: "POST",
                body: JSON.stringify({ plan }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Checkout failed:", error);
        } finally {
            setLoadingPlan(null);
        }
    };

    const plans = [
        {
            name: "Pro",
            price: "$90",
            period: "/month",
            description: "Advanced analytics and unlimited assets for serious investors building and scaling their portfolio.",
            features: [
                "Unlimited asset tiles",
                "Deep financial integration",
                "Multiple portfolio workspaces",
                "Priority AI Analysis (Unlimited)",
                "Bulk import / export",
                "Collaborator access",
                "Portfolio public sharing",
                "Mobile-optimized view",
            ],
            buttonText: "Get Pro Access",
            highlight: true,
            icon: Zap,
            badge: "Most Popular",
            color: "blue",
        },
        {
            name: "Enterprise",
            price: "$490",
            period: "/month",
            description: "Full-scale institutional solution for fund managers, family offices, and multi-team operations.",
            features: [
                "Everything in Pro",
                "Custom visual branding",
                "Advanced team permissions",
                "Dedicated database node",
                "Full API access for integrations",
                "White-label portfolio sharing",
                "Priority onboarding call",
                "24/7 dedicated support",
            ],
            buttonText: "Go Enterprise",
            highlight: false,
            icon: Crown,
            badge: null,
            color: "indigo",
        },
    ];

    return (
        <section className="py-24 px-6 relative overflow-hidden" id="pricing">
            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        Transparent Pricing
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-outfit font-bold text-white mb-4"
                    >
                        Built for portfolios of any size
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 max-w-2xl mx-auto"
                    >
                        Choose the plan that matches your acquisition strategy and scale your portfolio with confidence.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "glass-card rounded-3xl border p-8 flex flex-col relative group transition-all duration-500",
                                plan.highlight
                                    ? "bg-blue-600/5 border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.12)] scale-[1.02] z-20"
                                    : "bg-slate-900/40 border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/60"
                            )}
                        >
                            {plan.badge && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-blue-600/40">
                                    {plan.badge}
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500",
                                    plan.color === "blue"
                                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white"
                                        : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white"
                                )}>
                                    <plan.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-5xl font-extrabold text-white tracking-tighter">{plan.price}</span>
                                    <span className="text-slate-500 font-medium text-sm">{plan.period}</span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">{plan.description}</p>
                            </div>

                            <div className="space-y-3.5 mb-8 flex-1">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                                            plan.highlight ? "bg-blue-500/20 text-blue-400" : "bg-indigo-500/20 text-indigo-400"
                                        )}>
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className="text-sm text-slate-300 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleCheckout(plan.name)}
                                disabled={loadingPlan !== null}
                                className={cn(
                                    "w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2",
                                    plan.highlight
                                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20 hover:shadow-blue-500/40 active:scale-95"
                                        : "bg-slate-800 hover:bg-indigo-600 text-white border border-slate-700 hover:border-indigo-500 active:scale-95",
                                    loadingPlan !== null && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {loadingPlan === plan.name ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>{plan.buttonText} <ArrowRight size={16} /></>
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <p className="text-slate-500 text-sm italic">
                        All plans include a 14-day money-back guarantee. Secure payments by Stripe.
                    </p>
                </motion.div>
            </div>

            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />
        </section>
    );
}
