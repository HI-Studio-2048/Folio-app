"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Globe, Lock, Share2, Mail, Send, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/components/ui/settings-provider";
import { useUser } from "@clerk/nextjs";

interface SharePortfolioModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SharePortfolioModal({ isOpen, onClose }: SharePortfolioModalProps) {
    const { user, isLoaded } = useUser();
    const { portfolioName, setPortfolioName } = useSettings();
    const [activeTab, setActiveTab] = useState<"link" | "email">("link");

    // Link Tab State
    const [isPublic, setIsPublic] = useState(false);
    const [copied, setCopied] = useState(false);

    // Private Invites State
    const [inviteEmail, setInviteEmail] = useState("");
    const [invitedList, setInvitedList] = useState<string[]>(["teammate@example.com"]);

    // Email Tab State
    const [recipientEmail, setRecipientEmail] = useState("");
    const [emailSubject, setEmailSubject] = useState("Check out my portfolio");
    const [emailMessage, setEmailMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    // Permissions/Data sections
    const [sharedData, setSharedData] = useState({
        totalValue: true,
        monthlyCashFlow: true,
        mapView: true,
        assetList: true,
        pipeline: false,
        reports: false,
    });

    const handleCopyLink = () => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://follio.app';
        const urlParams = new URLSearchParams();
        if (portfolioName && portfolioName !== 'My Portfolio') {
            urlParams.set('name', portfolioName);
        }
        const queryString = urlParams.toString() ? `?${urlParams.toString()}` : "";
        const shareId = user?.id || Math.random().toString(36).substring(2, 10);
        navigator.clipboard.writeText(`${baseUrl}/share/p/${shareId}${queryString}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleInvite = () => {
        if (inviteEmail && !invitedList.includes(inviteEmail)) {
            setInvitedList([...invitedList, inviteEmail]);
            setInviteEmail("");
        }
    };

    const handleSendEmail = () => {
        if (!recipientEmail) return;
        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            setIsSent(true);
            setTimeout(() => {
                setIsSent(false);
                setRecipientEmail("");
                setEmailMessage("");
            }, 3000);
        }, 1500);
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
                        className="relative w-[95vw] sm:w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="flex items-center justify-between p-5 border-b border-slate-800/60 bg-slate-900/50 shrink-0">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Share2 size={18} className="text-blue-400" /> Share Portfolio
                            </h2>
                            <button onClick={onClose} className="p-1.5 -m-1.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-800 shrink-0 bg-slate-900">
                            <button
                                onClick={() => setActiveTab("link")}
                                className={cn(
                                    "flex-1 py-3 text-sm font-semibold transition-all relative flex items-center justify-center gap-2",
                                    activeTab === "link" ? "text-white" : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                <LinkIcon size={16} /> Share Link
                                {activeTab === "link" && <motion.div layoutId="share-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                            </button>
                            <button
                                onClick={() => setActiveTab("email")}
                                className={cn(
                                    "flex-1 py-3 text-sm font-semibold transition-all relative flex items-center justify-center gap-2",
                                    activeTab === "email" ? "text-white" : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                <Mail size={16} /> Email Portfolio
                                {activeTab === "email" && <motion.div layoutId="share-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                            {activeTab === "link" ? (
                                <>
                                    {/* Naming System */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Public Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                                            placeholder="Beautiful Portfolio Name"
                                            value={portfolioName}
                                            onChange={(e) => setPortfolioName(e.target.value)}
                                        />
                                    </div>

                                    {/* Privacy Toggle */}
                                    <div className="flex items-center gap-2 p-1 bg-slate-950/50 border border-slate-800 rounded-lg">
                                        <button
                                            onClick={() => setIsPublic(false)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${!isPublic ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
                                        >
                                            <Lock size={14} /> Private
                                        </button>
                                        <button
                                            onClick={() => setIsPublic(true)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${isPublic ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
                                        >
                                            <Globe size={14} /> Public
                                        </button>
                                    </div>

                                    {!isPublic && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="space-y-4"
                                        >
                                            <div className="bg-blue-950/20 border border-blue-900/50 rounded-lg p-3 text-xs text-blue-200/70 leading-relaxed">
                                                <span className="font-semibold text-blue-400 flex items-center gap-1.5 mb-1"><Lock size={12} /> Restricted Access</span>
                                                Only emails listed below can access the link. Anyone else with the link will be prompted to request access from you.
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Invite People</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="email"
                                                        placeholder="colleague@example.com"
                                                        className="flex-1 bg-slate-950/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                                                        value={inviteEmail}
                                                        onChange={(e) => setInviteEmail(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                                                    />
                                                    <button
                                                        onClick={handleInvite}
                                                        disabled={!inviteEmail}
                                                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 border border-slate-700"
                                                    >
                                                        Invite
                                                    </button>
                                                </div>
                                            </div>

                                            {invitedList.length > 0 && (
                                                <div className="space-y-2">
                                                    {invitedList.map(email => (
                                                        <div key={email} className="flex justify-between items-center p-2 rounded-md bg-slate-800/30 border border-slate-800">
                                                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                                                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold uppercase">
                                                                    {email[0]}
                                                                </div>
                                                                {email}
                                                            </div>
                                                            <button
                                                                onClick={() => setInvitedList(invitedList.filter(e => e !== email))}
                                                                className="text-slate-500 hover:text-red-400 transition-colors"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* Data Options */}
                                    <div className="space-y-3 pt-4 border-t border-slate-800/50">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Data included in link</label>
                                        <DataOptionsGrid sharedData={sharedData} setSharedData={setSharedData} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Send To</label>
                                            <input
                                                type="email"
                                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                                                placeholder="investor@example.com"
                                                value={recipientEmail}
                                                onChange={(e) => setRecipientEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject</label>
                                            <input
                                                type="text"
                                                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                                                value={emailSubject}
                                                onChange={(e) => setEmailSubject(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Message (Optional)</label>
                                            <textarea
                                                className="w-full h-24 bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 resize-none"
                                                placeholder="Add a personal note..."
                                                value={emailMessage}
                                                onChange={(e) => setEmailMessage(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Data Options */}
                                    <div className="space-y-3 pt-4 border-t border-slate-800/50">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Data to attach</label>
                                        <DataOptionsGrid sharedData={sharedData} setSharedData={setSharedData} />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-5 border-t border-slate-800 bg-slate-900/50 flex justify-between gap-3 shrink-0">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>

                            {activeTab === "link" ? (
                                <button
                                    onClick={handleCopyLink}
                                    disabled={!isLoaded || !user}
                                    className={`px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${copied
                                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/50'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 border border-blue-500/50 disabled:opacity-50'
                                        }`}
                                >
                                    {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy Link</>}
                                </button>
                            ) : (
                                <button
                                    onClick={handleSendEmail}
                                    disabled={!recipientEmail || isSending || isSent}
                                    className={`px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${isSent
                                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/50'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 border border-blue-500/50 disabled:opacity-50 disabled:shadow-none'
                                        }`}
                                >
                                    {isSent ? (
                                        <><Check size={16} /> Sent Successfully</>
                                    ) : isSending ? (
                                        <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Sending...</div>
                                    ) : (
                                        <><Send size={16} /> Send Email</>
                                    )}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function LinkIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    )
}

function DataOptionsGrid({ sharedData, setSharedData }: any) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {[
                { key: "totalValue", label: "Total Value" },
                { key: "monthlyCashFlow", label: "Cash Flow" },
                { key: "mapView", label: "Map View" },
                { key: "assetList", label: "Asset List" },
                { key: "pipeline", label: "Pipeline Stats" },
                { key: "reports", label: "Reports" },
            ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                        <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={sharedData[key]}
                            onChange={() => setSharedData({ ...sharedData, [key]: !sharedData[key] })}
                        />
                        <div className="w-4 h-4 rounded border border-slate-600 bg-slate-900 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-colors"></div>
                        <Check size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</span>
                </label>
            ))}
        </div>
    );
}
