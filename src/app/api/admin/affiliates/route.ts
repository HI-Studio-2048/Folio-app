import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/admin/affiliates  — list all affiliates with stats
export async function GET(req: Request) {
    try {
        const { data: affiliates, error } = await supabase
            .from("affiliates")
            .select(`
                *,
                conversions:affiliate_conversions(id, amount_usd, commission_earned, downline_earned, status, created_at),
                payouts:affiliate_payouts(id, amount, status, paid_at)
            `)
            .order("total_earned", { ascending: false });

        if (error) throw error;
        return NextResponse.json(affiliates);
    } catch (err: any) {
        console.error("[Affiliates GET]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/admin/affiliates  — create affiliate
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { user_id, email, name, tier, payout_email } = body;

        if (!user_id || !email) {
            return NextResponse.json({ error: "user_id and email are required" }, { status: 400 });
        }

        // Auto-generate ref code from name
        const baseCode = (name || email).slice(0, 5).toUpperCase().replace(/\s/g, "") + Math.floor(Math.random() * 90 + 10);
        const commission_pct = tier === "elite" ? 40 : 30;
        const downline_pct = 10;

        const { data, error } = await supabase
            .from("affiliates")
            .insert([{ user_id, email, name, ref_code: baseCode, tier: tier || "standard", commission_pct, downline_pct, payout_email, status: "active" }])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (err: any) {
        console.error("[Affiliates POST]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
