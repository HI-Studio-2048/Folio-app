import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase (Service Role to bypass RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Setup Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const maxDuration = 60; // Allow sufficient time for the LLM to generate content

export async function GET(request: Request) {
    try {
        // Basic Authorization check (Use VERCEL_CRON_SECRET or custom secret)
        const authHeader = request.headers.get('authorization');
        const expectedAuth = `Bearer ${process.env.CRON_SECRET || 'follio-agent-cron-key'}`;

        if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an expert financial analyst and SEO copywriter for 'Follio', a premium visual portfolio management app.
Your task is to write a highly engaging, SEO-optimized blog post about modern portfolio management, real estate investing, dividend tracking, or startup venture capital. 

Return the response strictly as a JSON object with the following structure. Do not include markdown code block syntax (like \`\`\`json) in your final output, just pure parseable JSON.

{
    "title": "A catchy, SEO-friendly H1 title",
    "slug": "url-friendly-slug-like-this",
    "description": "A 150-character meta description for Google snippets",
    "seo_keywords": ["keyword1", "keyword2", "keyword3", "long-tail keyword"],
    "content": "The full blog post content formatted beautifully in Markdown. Include headings (##), bullet points, and bold text for easy reading. Keep it around 500-800 words."
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        const postData = JSON.parse(responseText);

        // Sanitize data
        const { title, slug, description, seo_keywords, content } = postData;

        // Insert into Supabase
        const { data, error } = await supabase.from('blog_posts').insert({
            title,
            slug: `${slug}-${Math.floor(Math.random() * 1000)}`, // avoid collision if slug is reused
            description,
            content,
            seo_keywords,
            status: 'published',
            published_at: new Date().toISOString()
        }).select().single();

        if (error) {
            console.error("Supabase insert error:", error);
            throw new Error(error.message);
        }

        return NextResponse.json({
            success: true,
            message: "Successfully generated and published post",
            post: { id: data.id, title: data.title, slug: data.slug }
        });

    } catch (error: any) {
        console.error('Agent Post Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
