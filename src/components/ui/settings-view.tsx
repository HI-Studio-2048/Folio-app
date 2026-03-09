"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, Target, CalendarDays, CheckCircle, TrendingUp } from "lucide-react";
import { useSettings } from "@/components/ui/settings-provider";
import { cn } from "@/lib/utils";

export function SettingsView() {
    const { t } = useSettings();
    const [saved, setSaved] = useState(false);

    const [notifications, setNotifications] = useState({
        push: true,
        email: false,
        deals: true,
        rent: true,
        milestones: false,
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <div>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">{t("settingsHeader")}</h1>
                <p className="text-slate-400">{t("settingsSubtext")}</p>
            </div>

            <div className="flex gap-8">
                {/* Sidebar Navigation for Settings (Static for now, but provides structure) */}
                <div className="hidden md:block w-64 space-y-2 shrink-0">
                    <button className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-slate-200 bg-blue-500/10 border border-blue-500/20 text-sm flex items-center gap-3">
                        <Bell size={16} className="text-blue-400" />
                        {t("notificationsTab")}
                    </button>
                    {/* Placeholder for future settings tabs */}
                </div>

                {/* Notifications Engine */}
                <div className="flex-1 space-y-6">
                    <div className="glass-card rounded-2xl border border-slate-700/40 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Bell className="text-blue-400" size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">{t("notificationsTab")}</h2>
                                <p className="text-sm text-slate-400">Control how and when we alert you.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Individual Toggles */}
                            <NotificationToggle
                                icon={Bell}
                                title={t("pushNotifications")}
                                description={t("pushDesc")}
                                checked={notifications.push}
                                onChange={(val) => setNotifications({ ...notifications, push: val })}
                            />

                            <hr className="border-slate-800" />

                            <NotificationToggle
                                icon={Mail}
                                title={t("emailAlerts")}
                                description={t("emailAlertsDesc")}
                                checked={notifications.email}
                                onChange={(val) => setNotifications({ ...notifications, email: val })}
                            />

                            <hr className="border-slate-800" />

                            <NotificationToggle
                                icon={Target}
                                title={t("dealAlerts")}
                                description={t("dealAlertsDesc")}
                                checked={notifications.deals}
                                onChange={(val) => setNotifications({ ...notifications, deals: val })}
                            />

                            <hr className="border-slate-800" />

                            <NotificationToggle
                                icon={CalendarDays}
                                title={t("rentReminders")}
                                description={t("rentRemindersDesc")}
                                checked={notifications.rent}
                                onChange={(val) => setNotifications({ ...notifications, rent: val })}
                            />

                            <hr className="border-slate-800" />

                            <NotificationToggle
                                icon={TrendingUp}
                                title={t("portfolioMilestones")}
                                description={t("portfolioMilestonesDesc")}
                                checked={notifications.milestones}
                                onChange={(val) => setNotifications({ ...notifications, milestones: val })}
                            />
                        </div>

                        <div className="mt-10 flex items-center justify-between border-t border-slate-800 pt-6">
                            <div>
                                {saved && (
                                    <motion.p
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-emerald-400 text-sm font-medium flex items-center gap-2"
                                    >
                                        <CheckCircle size={16} /> {t("settingsSaved")}
                                    </motion.p>
                                )}
                            </div>
                            <button
                                onClick={handleSave}
                                className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
                            >
                                {t("saveSettings")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function NotificationToggle({
    icon: Icon,
    title,
    description,
    checked,
    onChange
}: {
    icon: any;
    title: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-start justify-between group">
            <div className="flex gap-4">
                <div className="mt-1 text-slate-500 group-hover:text-slate-400 transition-colors">
                    <Icon size={18} />
                </div>
                <div>
                    <h3 className="text-slate-200 font-medium">{title}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{description}</p>
                </div>
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 mt-1",
                    checked ? "bg-blue-500" : "bg-slate-700"
                )}
            >
                <span className="sr-only">Toggle {title}</span>
                <span
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        checked ? "translate-x-5" : "translate-x-0"
                    )}
                />
            </button>
        </div>
    );
}
