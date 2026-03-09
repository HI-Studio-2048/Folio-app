"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Mail, Phone, Key, HelpCircle, MessageSquare, Settings2, Send } from "lucide-react";

interface AgentConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    agentName: string;
    agentId: string;
}

export function AgentConfigModal({ isOpen, onClose, agentName, agentId }: AgentConfigModalProps) {
    const [activeTab, setActiveTab] = useState<"config" | "chat">("chat");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [llmProvider, setLlmProvider] = useState("openai");
    const [apiKey, setApiKey] = useState("");

    // Chat State
    const [message, setMessage] = useState("");

    // Auto-generate starter conversation based on agent type
    const getStarterMessages = () => {
        let text = `Hi! I'm ${agentName}. How can I help you set up my parameters today?`;

        if (agentId === "prospector") {
            text = `Hi! I'm your ${agentName}. To get started, what type of properties are you looking for? (e.g., "Find me Multi-family properties in Austin under $1M with at least 8% cap rate"). I'll search for these daily!`;
        } else if (agentId === "portfolioManager") {
            text = `Hello! I'm your ${agentName}. I can monitor your cash flow and alert you to issues. To start, what is your threshold for unexpected expenses? (e.g., "Alert me if any single repair exceeds $500").`;
        } else if (agentId === "coffeeGirl") {
            text = `Good morning! I'm ${agentName} ☕️. I'll send you executive summaries of your portfolio. How often would you like your updates? (e.g., "Send me a daily text at 8 AM" or "Just a weekly email on Friday afternoons").`;
        }

        return [{ id: "1", role: "assistant", text }];
    };

    const [messages, setMessages] = useState(getStarterMessages());

    const handleSave = () => {
        // Here you would typically save to your backend/db
        console.log("Saving config for", agentId, { email, phone, llmProvider, apiKey });
        onClose();
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;

        // Add user message
        const newMessages = [...messages, { id: Date.now().toString(), role: "user", text: message }];
        setMessages(newMessages);
        setMessage("");

        // Simulate agent typing and replying
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    text: `I've noted that! I'm ready to update my configuration. Would you like me to adjust my search parameters or update my communication rules?`
                }
            ]);
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                    className="relative w-full max-w-2xl glass-card rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col h-[600px] overflow-hidden bg-slate-900/90"
                >
                    <div className="flex items-center justify-between p-6 border-b border-slate-800/60 bg-slate-950/40">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                                {activeTab === "chat" ? <MessageSquare size={20} /> : <Settings2 size={20} />}
                            </div>
                            <div>
                                <h2 className="text-xl font-outfit font-bold text-white">{agentName}</h2>
                                <p className="text-sm text-slate-400">Status: <span className="text-emerald-400 font-medium tracking-wide">● Online</span></p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex border-b border-slate-800/60 bg-slate-900">
                        <button
                            onClick={() => setActiveTab("chat")}
                            className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === "chat" ? "text-blue-400 border-b-2 border-blue-500 bg-blue-500/5" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"}`}
                        >
                            <MessageSquare size={16} /> Direct Chat
                        </button>
                        <button
                            onClick={() => setActiveTab("config")}
                            className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === "config" ? "text-blue-400 border-b-2 border-blue-500 bg-blue-500/5" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"}`}
                        >
                            <Settings2 size={16} /> Configuration
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto w-full relative">
                        {activeTab === "chat" ? (
                            <div className="p-6 space-y-4 h-full flex flex-col justify-end">
                                <div className="space-y-6 overflow-y-auto mb-4 custom-scrollbar">
                                    {messages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm ${msg.role === "user"
                                                ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/20"
                                                : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50"
                                                }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="relative mt-auto">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type your instructions..."
                                        className="w-full bg-slate-800 border border-slate-700 rounded-full pl-5 pr-14 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 space-y-8">
                                {/* Communication Settings */}
                                <section>
                                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Communication Routing</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2 relative">
                                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                                <Mail size={14} className="text-slate-400" /> Authorized Sender Email
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="agent@yourdomain.com"
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                            />
                                        </div>

                                        <div className="space-y-2 relative">
                                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                                <Phone size={14} className="text-slate-400" /> Authorized SMS/Phone
                                            </label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+1 (555) 000-0000"
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* LLM Configuration Settings */}
                                <section>
                                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">LLM Engine Pipeline</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                                Select Intelligence Model
                                                <HelpCircle size={12} className="text-slate-500" />
                                            </label>
                                            <select
                                                value={llmProvider}
                                                onChange={(e) => setLlmProvider(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
                                            >
                                                <option value="openai">OpenAI (GPT-4o)</option>
                                                <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                                                <option value="google">Google (Gemini 1.5 Pro)</option>
                                                <option value="custom">Custom Endpoint</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                                <Key size={14} className="text-slate-400" /> LLM API Key
                                            </label>
                                            <input
                                                type="password"
                                                value={apiKey}
                                                onChange={(e) => setApiKey(e.target.value)}
                                                placeholder="sk-..."
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                            />
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>

                    {activeTab === "config" && (
                        <div className="p-6 border-t border-slate-800/60 bg-slate-950/40 flex justify-end gap-3 mt-auto">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                            >
                                <Save size={16} /> Save Agent Configuration
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
