"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Building2, Map as MapIcon, ShieldCheck } from "lucide-react";
import { useSettings } from "@/components/ui/settings-provider";
import { SettingsDropdown, AnimatedLogo } from "@/components/ui/shared";
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { InteractivePreview } from "@/components/ui/InteractivePreview";
import { PricingSection } from "@/components/ui/PricingSection";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { t } = useSettings();
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col text-slate-200">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 border-b border-slate-800/40 bg-slate-950/20 backdrop-blur-md z-50 flex items-center justify-between px-6 md:px-16">
        <div className="flex items-center gap-3">
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
            className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <AnimatedLogo size={18} />
          </motion.div>
          <span className="font-outfit text-2xl font-bold tracking-wide text-white">Follio</span>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden sm:block">
            <SettingsDropdown />
          </div>
          <Link href="#features" className="hidden lg:inline-block text-sm font-medium text-slate-300 hover:text-white transition-colors">
            {t("featuresNav")}
          </Link>
          <Link href="#pricing" className="hidden lg:inline-block text-sm font-medium text-slate-300 hover:text-white transition-colors">
            {t("pricingNav")}
          </Link>
          <Link href="/marketplace" className="hidden lg:inline-block text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
            Marketplace
          </Link>
          {isLoaded && !isSignedIn && (
            <div className="flex items-center gap-2 md:gap-4">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
                <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-2 md:px-4 py-2">
                  {t("signIn")}
                </button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/signup" forceRedirectUrl="/signup">
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all shadow-lg shadow-blue-600/20">
                  {t("createAccount")}
                </button>
              </SignUpButton>
            </div>
          )}
          {isLoaded && isSignedIn && (
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/dashboard" className="bg-slate-800 hover:bg-slate-700 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all border border-slate-700">
                {t("dashboardNav")}
              </Link>
              <UserButton />
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-24 md:pt-32 pb-20 px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {t("folioV1Live")}
          </div>

          <h1 className="text-5xl md:text-7xl font-outfit font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 tracking-tight leading-tight">
            {t("heroTitleLine1")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">
              {t("heroTitleLine2")}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] group"
            >
              {t("createAccount")}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-medium bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all backdrop-blur-sm"
            >
              {t("enterDashboard")}
            </Link>
          </div>
        </motion.div>

        {/* Floating Preview Image */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-6xl mt-20 relative glass-card rounded-2xl border border-slate-700/50 p-2 shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
          <InteractivePreview />
        </motion.div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-32 px-6 pt-20">
          <FeatureCard
            icon={MapIcon}
            title={t("portfolioMapping")}
            description={t("portfolioMappingDesc")}
          />
          <FeatureCard
            icon={BarChart3}
            title={t("simplifiedFinancials")}
            description={t("simplifiedFinancialsDesc")}
          />
          <FeatureCard
            icon={ShieldCheck}
            title={t("pipelineFeature")}
            description={t("pipelineFeatureDesc")}
          />
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="w-full pt-10">
          <PricingSection />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-auto py-8 text-center text-slate-500 text-sm">
        <p>© 2026 Project Follio. {t("rightsReserved")}</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="glass-card p-8 rounded-2xl border border-slate-800/50 hover:border-slate-600/50 transition-colors text-left group">
      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="text-blue-400" size={24} />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}
