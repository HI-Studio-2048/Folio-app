import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import React from 'react';

export const revalidate = 60; // ISR cache

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, description, seo_keywords')
    .eq('slug', params.slug)
    .single();

  if (!post) {
    return { title: 'Post Not Found | Follio' };
  }

  return {
    title: `${post.title} | Follio Insights`,
    description: post.description,
    keywords: post.seo_keywords || [],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
    },
  };
}

// Ensure the dynamic params type checks appropriately
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !post) {
    notFound();
  }

  // Create highly customized markdown to HTML output. 
  // We use simple regex replacement here because we expect extremely standardized output from Gemini.
  const htmlContent = post.content
    .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold font-outfit text-white mt-8 mb-4 tracking-tight">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold font-outfit text-white mt-12 mb-6 tracking-tight border-b border-white/10 pb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold font-outfit text-white mt-12 mb-6 tracking-tight">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-blue-100">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="text-slate-300 italic">$1</em>')
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 bg-blue-500/10 p-4 my-6 rounded-r-xl text-blue-200 italic font-medium">$1</blockquote>')
    .replace(/^\- (.*$)/gim, '<li class="ml-6 mb-2 list-disc text-slate-300">$1</li>')
    .replace(/\n\n/gim, '</p><p class="text-slate-300 leading-relaxed mb-6 space-y-2 text-lg">');

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-300 selection:bg-blue-500/40">
      
      {/* Dynamic Header */}
      <header className="w-full bg-[#06080F]/90 backdrop-blur-xl border-b border-white/5 px-6 sm:px-12 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/blog" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> All Insights
        </Link>
        <Link href="/signup" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-xl shadow-blue-500/25">
          Build Your Follio
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        {/* Post Header */}
        <header className="mb-16 pb-12 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-500 mb-8">
            <div className="flex items-center gap-2 bg-slate-900 border border-white/5 px-4 py-2 rounded-full">
              <Calendar size={14} className="text-blue-400" />
              {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown'}
            </div>
            <div className="flex items-center gap-2 bg-slate-900 border border-white/5 px-4 py-2 rounded-full">
              <User size={14} className="text-blue-400" />
              Follio Agent
            </div>
            
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full text-blue-400">
               Auto-Gen Intelligence
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-outfit font-black text-white mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-slate-400 leading-relaxed font-light">
            {post.description}
          </p>
        </header>

        {/* Post Content */}
        <article 
          className="prose prose-invert prose-blue max-w-none text-lg"
          dangerouslySetInnerHTML={{ __html: `<p class="text-slate-300 leading-relaxed mb-6 space-y-2 text-lg">${htmlContent}</p>` }}
        />

        {/* Post Footer Tags */}
        <footer className="mt-24 pt-10 border-t border-white/10">
           <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Focus Areas</h4>
           <div className="flex flex-wrap gap-2">
             {post.seo_keywords?.map((keyword: string) => (
                <span key={keyword} className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 text-sm rounded-full font-medium">#{keyword}</span>
             ))}
           </div>
        </footer>
      </main>

      {/* CTA Footer */}
      <div className="bg-slate-900/40 border-t border-white/5 py-24 text-center mt-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full point-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
            <h3 className="text-3xl font-outfit font-bold text-white mb-4">Start visualizing your wealth today.</h3>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">Transform complex spreadsheets into a sweeping, unified dashboard mapping all your real estate, stock, and business assets globally.</p>
            <Link href="/signup" className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-xl shadow-blue-500/25 inline-block text-lg">
                Create Free Account
            </Link>
        </div>
      </div>
    </div>
  );
}
