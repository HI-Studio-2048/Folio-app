import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Metadata } from 'next';
import { Calendar, ChevronRight } from 'lucide-react';
import { AnimatedLogo } from '@/components/ui/shared';

export const metadata: Metadata = {
  title: 'Insights | Follio Portfolio Management',
  description: 'Expert insights, strategies, and market analysis for visual asset management, real estate, and modern portfolio tracking.',
};

export const revalidate = 60; // ISR cache every minute

export default async function BlogIndexPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, description, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#06080F] flex flex-col items-center">
      {/* Dynamic Header */}
      <header className="w-full fixed top-0 z-50 bg-[#06080F]/80 backdrop-blur-xl border-b border-white/5 px-6 sm:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <AnimatedLogo size={20} />
          </div>
          <span className="text-xl font-bold font-outfit text-white tracking-tight">FOLLIO<span className="text-blue-500">.</span></span>
        </Link>
        <Link href="/dashboard" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-xl shadow-blue-500/25">
          Enter App
        </Link>
      </header>

      <main className="w-full max-w-5xl mt-32 px-6 pb-24">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-outfit font-black text-white tracking-tight">
            Follio <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Insights</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Deep dives into asset portfolio dynamics, tech ventures, and modern wealth visualization strategies explicitly sourced for the next generation.
          </p>
        </div>

        {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl text-center">
                Could not load insights at this time. Database migration pending.
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 md:p-8 hover:bg-slate-800/60 hover:border-blue-500/30 transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 bg-slate-950/50 w-fit px-3 py-1.5 rounded-full border border-white/5">
                  <Calendar size={14} className="text-blue-400" />
                  {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                </div>

                <h2 className="text-2xl font-bold font-outfit text-white mb-3 group-hover:text-blue-200 transition-colors leading-tight">
                  {post.title}
                </h2>
                
                <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-6">
                  {post.description}
                </p>

                <div className="flex items-center text-blue-500 font-bold text-sm gap-2 mt-auto group-hover:text-blue-400 transition-colors">
                  Read Article <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
          {!posts?.length && !error && (
             <div className="col-span-full py-24 text-center text-slate-500 font-medium">
                No insights published yet. The Agent is brewing up the first post...
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
