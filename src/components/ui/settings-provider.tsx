"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, Currency, translations, TranslationKey } from "@/lib/translations";

export type PortfolioType = "realEstate" | "company" | "stocks" | "collection";

interface SettingsContextType {
    language: Language;
    currency: Currency;
    portfolioType: PortfolioType;
    setLanguage: (lang: Language) => void;
    setCurrency: (currency: Currency) => void;
    setPortfolioType: (type: PortfolioType) => void;
    portfolioName: string;
    setPortfolioName: (name: string) => void;
    onboardingCompleted: boolean;
    setOnboardingCompleted: (completed: boolean) => void;
    t: (key: TranslationKey) => string;
    locale: string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");
    const [currency, setCurrency] = useState<Currency>("USD");
    const [portfolioType, setPortfolioType] = useState<PortfolioType>("realEstate");
    const [portfolioName, setPortfolioName] = useState<string>("My Portfolio");
    const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedName = localStorage.getItem("portfolioName");
            if (savedName) setPortfolioName(savedName);

            const savedOnboarding = localStorage.getItem("onboardingCompleted");
            if (savedOnboarding === "true") setOnboardingCompleted(true);
        }
    }, []);

    const handleSetOnboardingCompleted = (completed: boolean) => {
        setOnboardingCompleted(completed);
        if (typeof window !== "undefined") {
            localStorage.setItem("onboardingCompleted", completed.toString());
        }
    };

    const handleSetPortfolioName = (name: string) => {
        setPortfolioName(name);
        if (typeof window !== "undefined") {
            localStorage.setItem("portfolioName", name);
        }
    };

    const t = (key: TranslationKey) => {
        return translations[language][key] || translations["en"][key] || key;
    };

    const getLocale = (lang: Language) => {
        switch (lang) {
            case "es": return "es-ES";
            case "fr": return "fr-FR";
            case "zh": return "zh-CN";
            case "ja": return "ja-JP";
            default: return "en-US";
        }
    };

    return (
        <SettingsContext.Provider value={{
            language,
            currency,
            portfolioType,
            portfolioName,
            onboardingCompleted,
            setLanguage,
            setCurrency,
            setPortfolioType,
            setPortfolioName: handleSetPortfolioName,
            setOnboardingCompleted: handleSetOnboardingCompleted,
            t,
            locale: getLocale(language)
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
