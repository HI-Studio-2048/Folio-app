import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: userId } = await params;

    if (!userId) {
        return NextResponse.json({ error: "Missing User ID" }, { status: 400 });
    }

    try {
        // Use admin client to bypass RLS for shared viewing
        const { data, error } = await supabaseAdmin
            .from('properties')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Shared Fetch Error:", error);
            // If it's the schema cache issue, return a specific hint
            if (error.code === 'PGRST205') {
                return NextResponse.json({
                    error: "Database Schema Out of Sync",
                    hint: "Please refresh the Supabase schema cache using SQL NOTIFY pgrst, 'reload schema';"
                }, { status: 503 });
            }
            throw error;
        }

        return NextResponse.json({ properties: data || [] });
    } catch (error: any) {
        console.error("Internal Shared View Error:", error);
        return NextResponse.json({ error: "Failed to fetch shared data", details: error.message }, { status: 500 });
    }
}
