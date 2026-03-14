import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    // Mark as read (optional) — just fetch for now
    const { data, error } = await supabaseAdmin
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        // If table doesn't exist yet, return empty array gracefully
        return NextResponse.json([]);
    }

    return NextResponse.json(data ?? []);
}

export async function PATCH(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Mark all notifications as read for this user
    const { error } = await supabaseAdmin
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
