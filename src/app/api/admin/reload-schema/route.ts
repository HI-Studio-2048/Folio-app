import { NextResponse } from "next/server";
import { reloadPgrstSchema } from "@/lib/reload-pgrst-schema";

/**
 * Reloads PostgREST schema cache (fixes PGRST205).
 * Requires SUPABASE_DB_URL in .env.local - get it from:
 * Supabase Dashboard → Settings → Database → Connection string (URI)
 */
export async function GET() {
    return handleReload();
}

export async function POST() {
    return handleReload();
}

async function handleReload() {
    if (!process.env.SUPABASE_DB_URL) {
        return NextResponse.json(
            {
                error: "SUPABASE_DB_URL not set",
                hint: "Add it to Vercel/env from Supabase Dashboard → Settings → Database → Connection string (URI).",
            },
            { status: 503 }
        );
    }

    const ok = await reloadPgrstSchema();
    if (!ok) {
        return NextResponse.json({
            error: "Failed to reload schema",
            details: "Check if SUPABASE_DB_URL is correct and has a valid password."
        }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: "PostgREST schema reload requested successfully." });
}
