"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, StickyNote, Loader2, Search, Filter, Calendar, CheckCircle2, AlertCircle, Sparkles, Send, Bot, User, MessageSquare } from "lucide-react";
import { notesService, Note } from "@/lib/notes-service";
import { cn } from "@/lib/utils";

interface NotesSectionProps {
    userId: string;
    t: any;
}

export function NotesSection({ userId, t }: NotesSectionProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // AI Chat State
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [userInput, setUserInput] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);

    useEffect(() => {
        if (userId) fetchNotes();
    }, [userId]);

    const fetchNotes = async () => {
        setIsLoading(true);
        try {
            const data = await notesService.getNotes(userId);
            setNotes(data || []);
        } catch (e) {
            console.error("Failed to fetch notes:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNoteTitle.trim()) return;

        setIsAdding(true);
        try {
            const added = await notesService.addNote(newNoteTitle, userId);
            setNotes(prev => [added, ...prev]);
            setNewNoteTitle("");
        } catch (e) {
            console.error("Failed to add note:", e);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteNote = async (id: number) => {
        try {
            await notesService.deleteNote(id, userId);
            setNotes(prev => prev.filter(n => n.id !== id));
        } catch (e) {
            console.error("Failed to delete note:", e);
        }
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isChatLoading) return;

        const userMessage = userInput.trim();
        const updatedMessages = [...chatMessages, { role: 'user' as const, content: userMessage }];
        setChatMessages(updatedMessages);
        setUserInput("");
        setIsChatLoading(true);

        try {
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updatedMessages.map(m => ({
                        role: m.role === 'assistant' ? 'model' : 'user',
                        content: m.content
                    }))
                }),
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setChatMessages([...updatedMessages, { role: 'assistant' as const, content: data.text }]);
        } catch (error) {
            console.error("Chat error:", error);
            setChatMessages([...updatedMessages, { role: 'assistant' as const, content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsChatLoading(false);
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8 pb-20"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2 flex items-center gap-3">
                        <StickyNote className="text-blue-500" />
                        {t("notesTitle") || "Global Notes"}
                    </h1>
                    <p className="text-slate-400 text-sm">Keep track of your overall strategy, reminders, and cross-portfolio thoughts.</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-slate-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Notes List (2/3 width) */}
                <div className="lg:col-span-2 space-y-4">
                    <form onSubmit={handleAddNote} className="relative group mb-6">
                        <input
                            type="text"
                            placeholder="Add a quick note or todo..."
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-6 pr-20 text-lg focus:outline-none focus:border-blue-500 transition-all text-slate-200 placeholder:text-slate-600 shadow-xl"
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            disabled={isAdding}
                        />
                        <button
                            type="submit"
                            disabled={!newNoteTitle.trim() || isAdding}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white p-2 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                        >
                            {isAdding ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
                        </button>
                    </form>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-600">
                                <Loader2 size={40} className="animate-spin" />
                                <p className="text-sm font-medium animate-pulse tracking-widest uppercase">Fetching Notes...</p>
                            </div>
                        ) : filteredNotes.length > 0 ? (
                            <AnimatePresence mode="popLayout">
                                {filteredNotes.map((note) => (
                                    <motion.div
                                        key={note.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 flex items-start gap-4 hover:border-slate-700/80 hover:bg-slate-900/60 transition-all"
                                    >
                                        <div className="mt-1 p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-medium text-slate-200 leading-tight mb-2">{note.title}</h3>
                                            <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Calendar size={12} /> {note.created_at ? new Date(note.created_at).toLocaleDateString() : 'Just now'}</span>
                                                <span className="flex items-center gap-1.5">•</span>
                                                <span className="text-blue-500/60 group-hover:text-blue-400 transition-colors">Global Strategy</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteNote(note.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        ) : (
                            <div className="py-16 text-center border-2 border-dashed border-slate-800/40 rounded-3xl space-y-4">
                                <div className="flex flex-col items-center">
                                    <StickyNote size={48} className="text-slate-800 mb-4" />
                                    <p className="text-slate-400 font-bold mb-1">Your strategy board is empty</p>
                                    <p className="text-xs text-slate-600 max-w-[240px] mx-auto">Add a note or todo to capture your next investment move.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Chat Section (1/3 width) */}
                <div className="lg:col-span-1 flex flex-col h-[600px] bg-slate-900/40 border border-slate-800/60 rounded-3xl overflow-hidden shadow-2xl relative">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                <Sparkles size={16} />
                            </div>
                            <span className="text-sm font-bold text-white uppercase tracking-tight">Folio AI</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Online</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {chatMessages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                                <MessageSquare size={32} className="text-slate-800" />
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Strategy Assistant</p>
                                    <p className="text-[11px] text-slate-500 leading-relaxed italic">
                                        Ask me about your investment strategy, real estate metrics, or portfolio optimization.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 gap-2 w-full pt-4">
                                    <button
                                        onClick={() => setUserInput("How can I optimize my real estate portfolio for cash flow?")}
                                        className="text-[10px] text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg p-2 transition-all hover:border-slate-700 text-left"
                                    >
                                        "How to optimize for cash flow?"
                                    </button>
                                    <button
                                        onClick={() => setUserInput("What are current mortgage rate trends?")}
                                        className="text-[10px] text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg p-2 transition-all hover:border-slate-700 text-left"
                                    >
                                        "Mortgage rate trends?"
                                    </button>
                                </div>
                            </div>
                        )}

                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={cn(
                                "flex flex-col max-w-[85%] space-y-1",
                                msg.role === 'user' ? "ml-auto items-end" : "items-start"
                            )}>
                                <div className={cn(
                                    "px-3 py-2 rounded-2xl text-xs leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-blue-600 text-white rounded-tr-none"
                                        : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50"
                                )}>
                                    {msg.content}
                                </div>
                                <span className="text-[9px] text-slate-600 uppercase font-bold tracking-tighter px-1">
                                    {msg.role === 'user' ? 'You' : 'Folio AI'}
                                </span>
                            </div>
                        ))}

                        {isChatLoading && (
                            <div className="flex flex-col items-start max-w-[85%] space-y-1">
                                <div className="bg-slate-800 border border-slate-700/50 px-3 py-2 rounded-2xl rounded-tl-none">
                                    <Loader2 size={14} className="animate-spin text-slate-500" />
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-900/60 flex gap-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!userInput.trim() || isChatLoading}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white p-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
