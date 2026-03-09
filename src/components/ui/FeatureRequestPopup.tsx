"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeatureRequestPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"feature" | "support">("feature");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSending(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSending(false);
        setIsSubmitted(true);
        setMessage("");

        // Auto close after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setIsOpen(false);
        }, 3000);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all border shadow-lg",
                    isOpen
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
                )}
                title="Help & Feedback"
            >
                <MessageSquare size={20} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10, x: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10, x: -10 }}
                        className="absolute top-12 right-0 w-85 z-[100] glass-card border border-slate-700/50 shadow-2xl overflow-hidden"
                    >
                        {!isSubmitted ? (
                            <div className="flex flex-col h-full">
                                {/* Header / Tabs */}
                                <div className="flex border-b border-slate-800">
                                    <button
                                        onClick={() => setActiveTab("feature")}
                                        className={cn(
                                            "flex-1 py-3 text-xs font-bold transition-all relative",
                                            activeTab === "feature" ? "text-white" : "text-slate-500 hover:text-slate-300"
                                        )}
                                    >
                                        Feature Request
                                        {activeTab === "feature" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("support")}
                                        className={cn(
                                            "flex-1 py-3 text-xs font-bold transition-all relative",
                                            activeTab === "support" ? "text-white" : "text-slate-500 hover:text-slate-300"
                                        )}
                                    >
                                        Get Support
                                        {activeTab === "support" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
                                    </button>
                                </div>

                                <div className="p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                                            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", activeTab === "feature" ? "bg-blue-500" : "bg-indigo-500")}></div>
                                            {activeTab === "feature" ? "New Suggestion" : "Support Ticket"}
                                        </h3>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="text-slate-500 hover:text-white transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <p className="text-[11px] text-slate-400 leading-relaxed">
                                        {activeTab === "feature"
                                            ? "Have an idea for a new metric or tool? We'd love to hear how we can improve Follio for you."
                                            : "Experiencing an issue or need help with your portfolio? Our team is here to assist you."
                                        }
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-3">
                                        <textarea
                                            autoFocus
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder={activeTab === "feature" ? "Describe the feature or metric..." : "What can we help you with?"}
                                            className="w-full h-28 bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                                    handleSubmit(e);
                                                }
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!message.trim() || isSending}
                                            className={cn(
                                                "w-full py-2.5 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg",
                                                activeTab === "feature"
                                                    ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
                                                    : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20"
                                            )}
                                        >
                                            {isSending ? (
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    {activeTab === "feature" ? "Submit Request" : "Send Message"}
                                                    <Send size={14} />
                                                </>
                                            )}
                                        </button>
                                        <p className="text-[10px] text-center text-slate-500 italic">Press CMD+Enter to submit</p>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="py-8 flex flex-col items-center text-center space-y-4"
                            >
                                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                    <CheckCircle2 size={32} />
                                </div>
                                <div className="px-6">
                                    <h4 className="font-bold text-white text-lg">Message Sent!</h4>
                                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                        {activeTab === "feature"
                                            ? "Your feature request is in the hands of our product team."
                                            : "Our support team will get back to you shortly at your registered email."
                                        }
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
