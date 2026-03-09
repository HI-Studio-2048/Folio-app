"use client";

import { motion } from "framer-motion";
import { UserPlus, Users, Trash2, Mail } from "lucide-react";
import { useSettings } from "@/components/ui/settings-provider";
import { useState } from "react";

const INITIAL_COLLABORATORS = [
    { id: 1, name: "Jane Doe", email: "jane@example.com", role: "Property Manager", access: "Limited", initials: "JD", color: "from-purple-500 to-blue-600" },
    { id: 2, name: "Mike Kurz", email: "mike@example.com", role: "CPA / Accountant", access: "Read Only", initials: "MK", color: "from-amber-500 to-orange-600" }
];

export function CollaboratorsDashboard() {
    const { t } = useSettings();
    const [collaborators, setCollaborators] = useState(INITIAL_COLLABORATORS);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("");

    const handleRemove = (id: number) => {
        setCollaborators(prev => prev.filter(c => c.id !== id));
    };

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;

        const newCollab = {
            id: Date.now(),
            name: inviteEmail.split('@')[0],
            email: inviteEmail,
            role: inviteRole || "Collaborator",
            access: "Limited",
            initials: inviteEmail.substring(0, 2).toUpperCase(),
            color: "from-slate-600 to-slate-800"
        };

        setCollaborators(prev => [...prev, newCollab]);
        setInviteEmail("");
        setInviteRole("");
        setIsInviteModalOpen(false);
    };

    return (
        <motion.div
            key="collaborators"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-6xl mx-auto pb-12 w-full"
        >
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">{t("humanTeam")}</h1>
                    <p className="text-slate-400">{t("collaboratorsSubtext")}</p>
                </div>
            </div>

            <div className="space-y-12">
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                <Users className="text-blue-400" size={20} />
                            </div>
                            <h2 className="text-xl font-outfit font-semibold text-slate-100">{t("humanTeam")}</h2>
                        </div>
                        <button
                            onClick={() => setIsInviteModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                        >
                            <UserPlus size={16} /> {t("inviteMember")}
                        </button>
                    </div>

                    <div className="glass-card rounded-2xl border border-slate-700/40 overflow-hidden bg-slate-900/30">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-950/40 text-xs uppercase tracking-wider text-slate-500">
                                        <th className="px-6 py-4 font-semibold w-1/3">Name</th>
                                        <th className="px-6 py-4 font-semibold w-1/4">Role</th>
                                        <th className="px-6 py-4 font-semibold w-1/4">Access Level</th>
                                        <th className="px-6 py-4 font-semibold w-[10%] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {collaborators.map((collab) => (
                                        <tr key={collab.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group">
                                            <td className="px-6 py-4 flex items-center gap-4">
                                                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${collab.color} flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
                                                    {collab.initials}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-200">{collab.name}</p>
                                                    <p className="text-xs text-slate-500">{collab.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-300">
                                                {collab.role}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1.5 rounded-md text-xs font-medium border ${collab.access === "Full"
                                                        ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                                                        : collab.access === "Read Only"
                                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                            : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                                    }`}>
                                                    {collab.access}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleRemove(collab.id)}
                                                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {collaborators.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                                                No team members added yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        onClick={() => setIsInviteModalOpen(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="glass-card relative w-full max-w-md border border-slate-700/50 rounded-2xl p-8 shadow-2xl bg-slate-900"
                    >
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                            <Mail className="text-blue-400" size={24} />
                            Invite Member
                        </h2>
                        <p className="text-slate-400 text-sm mb-6">Send an invite link to someone to join your dashboard.</p>

                        <form onSubmit={handleInvite} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="colleague@example.com"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Property Manager, Partner"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    Send Invite
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
