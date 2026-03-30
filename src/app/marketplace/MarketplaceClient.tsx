"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Filter, TrendingUp, TrendingDown, Star, ExternalLink, ShieldCheck, MapPin, Building2, Briefcase, Coins, LayoutDashboard } from "lucide-react";
import { AnimatedLogo } from "@/components/ui/shared";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

const MOCK_PORTFOLIOS = [
  {
    id: 1,
    name: "Downtown Commercial Real Estate",
    type: "Real Estate",
    location: "Global / New York",
    value: "$4.5M",
    roi: "+12.4%",
    status: "Selling",
    description: "A secure, cash-flowing commercial real estate portfolio comprising 3 prime downtown units.",
    icon: Building2,
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    id: 2,
    name: "Tech Startup Seed Portfolio",
    type: "Business",
    location: "Silicon Valley",
    value: "$1.2M",
    roi: "+45.2%",
    status: "Buying",
    description: "Actively acquiring early-stage SaaS and AI startups with strong MRR growth.",
    icon: Briefcase,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: 3,
    name: "High-Yield Dividend Stocks",
    type: "Stocks",
    location: "Global / US Equities",
    value: "$850k",
    roi: "+8.1%",
    status: "Selling",
    description: "Stable dividend-paying stocks spanning energy, healthcare, and consumer staples.",
    icon: TrendingUp,
    gradient: "from-rose-500 to-orange-500",
  },
  {
    id: 4,
    name: "Rare Modern Art Collection",
    type: "Collection",
    location: "London, UK",
    value: "$2.1M",
    roi: "+15.5%",
    status: "Selling",
    description: "Curated collection of post-war and contemporary art pieces with authenticated provenance.",
    icon: Star,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 5,
    name: "Emerging Markets Real Estate",
    type: "Real Estate",
    location: "Southeast Asia",
    value: "$3.8M",
    roi: "+18.2%",
    status: "Buying",
    description: "Seeking high-growth residential and commercial properties in developing urban centers.",
    icon: MapPin,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: 6,
    name: "Web3 & Crypto Assets",
    type: "Alternative",
    location: "Decentralized",
    value: "$5.4M",
    roi: "+85.0%",
    status: "Selling",
    description: "Diversified crypto portfolio including major L1s, DeFi protocols, and blue-chip NFTs.",
    icon: Coins,
    gradient: "from-cyan-500 to-blue-500",
  }
];

export default function MarketplaceClient() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col bg-slate-950 text-slate-200">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl z-50 flex items-center justify-between px-6 md:px-16">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
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
              className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow"
            >
              <AnimatedLogo size={18} />
            </motion.div>
            <span className="font-outfit text-2xl font-bold tracking-wide text-white flex flex-col">
              Follio <span className="text-[10px] uppercase text-blue-400 font-black tracking-widest leading-none">Marketplace</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-2 ml-8 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full">
            <Search size={16} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Search portfolios, assets, locations..." 
              className="bg-transparent border-none text-sm text-slate-200 focus:outline-none w-64 placeholder:text-slate-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hidden sm:flex text-sm font-medium text-slate-400 hover:text-white transition-colors items-center gap-2">
            <LayoutDashboard size={16} /> My Dashboard
          </Link>
          {isLoaded && !isSignedIn ? (
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <UserButton />
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col relative z-10 pt-32 pb-20 px-6 md:px-16 w-full max-w-7xl mx-auto">
        <div className="mb-16 space-y-6 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest"
            >
              <ShieldCheck size={14} /> Global Beta Access
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest"
            >
              <Star size={14} className="animate-pulse" /> Coming Soon
            </motion.div>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-outfit font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tight"
          >
            Discover, Buy & Sell <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              Premium Portfolios.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed"
          >
            Connect with verified global investors. Browse high-performing asset collections or list your own portfolio directly on the Follio network.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center gap-3 mb-10"
        >
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 border border-blue-500">
            All Portfolios
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium border border-slate-800 transition-colors">
            Buying
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium border border-slate-800 transition-colors">
            Selling
          </button>
          <div className="w-px h-8 bg-slate-800 mx-2"></div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-slate-400 hover:text-white rounded-xl text-sm font-medium border border-transparent hover:border-slate-700 transition-colors">
            <Filter size={16} /> Filters
          </button>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PORTFOLIOS.map((portfolio, idx) => (
            <motion.div
              key={portfolio.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
              className="glass-card bg-slate-900/40 border border-slate-800 hover:border-slate-600/80 rounded-3xl p-6 transition-all group overflow-hidden relative cursor-pointer hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${portfolio.gradient} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity rounded-full -mr-10 -mt-10`}></div>
              
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${portfolio.gradient} p-[1px] shadow-lg`}>
                  <div className="w-full h-full bg-slate-900 rounded-[15px] flex items-center justify-center">
                    <portfolio.icon size={20} className="text-white" />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                    portfolio.status === 'Selling' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {portfolio.status}
                  </span>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                     <MapPin size={12} /> {portfolio.location}
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{portfolio.name}</h3>
              <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                {portfolio.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-slate-800/60">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Target Value</p>
                  <p className="text-xl font-bold text-slate-200">{portfolio.value}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Expected ROI</p>
                  <p className="text-xl font-bold text-emerald-400">{portfolio.roi}</p>
                </div>
              </div>

              <button className="w-full py-3 rounded-xl bg-slate-800 text-white text-sm font-bold border border-slate-700 hover:bg-slate-700 hover:border-slate-500 transition-all flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:border-blue-500">
                View Details <ExternalLink size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>
    </div>
  );
}
