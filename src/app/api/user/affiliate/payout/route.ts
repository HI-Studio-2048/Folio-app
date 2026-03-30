import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// POST /api/user/affiliate/payout — Request a payout
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { method, payoutEmail } = await req.json();
        if (!method || !payoutEmail) {
            return NextResponse.json({ error: "method and payoutEmail required" }, { status: 400 });
        }
        if (!["paypal", "stripe"].includes(method)) {
            return NextResponse.json({ error: "method must be paypal or stripe" }, { status: 400 });
        }

        // Get affiliate profile
        const { data: affiliate, error } = await supabase
            .from("affiliates")
            .select("id, pending_payout, status")
            .eq("user_id", userId)
            .single();

        if (error || !affiliate) {
            return NextResponse.json({ error: "Affiliate profile not found" }, { status: 404 });
        }

        const aff = affiliate as any;

        if (aff.status !== "active") {
            return NextResponse.json({ error: "Affiliate account is not active" }, { status: 403 });
        }

        if (!aff.pending_payout || aff.pending_payout <= 0) {
            return NextResponse.json({ error: "No pending balance to pay out" }, { status: 400 });
        }

        const amount = parseFloat(aff.pending_payout.toFixed(2));

        // Create payout record
        const { data: payout, error: payoutError } = await supabase
            .from("affiliate_payouts")
            .insert([{
                affiliate_id: aff.id,
                amount,
                method,
                status: "processing",
            }])
            .select()
            .single();

        if (payoutError) throw payoutError;

        // Zero out pending payout and update payout email
        await supabase
            .from("affiliates")
            .update({
                pending_payout: 0,
                payout_email: payoutEmail,
            })
            .eq("id", aff.id);

        return NextResponse.json({ success: true, payout });
    } catch (err: any) {
        console.error("[User Affiliate Payout POST]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
