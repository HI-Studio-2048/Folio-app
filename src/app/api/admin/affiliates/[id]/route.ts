import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function requireAdmin() {
    const { userId, sessionClaims } = await auth();
    if (!userId) return false;
    return (sessionClaims?.metadata as any)?.role === "admin";
}

// PATCH /api/admin/affiliates/[id]  — update status, tier, payout_email
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    try {
        const body = await req.json();
        const allowedFields = ["status", "tier", "commission_pct", "downline_pct", "payout_email", "name"];
        const update: any = {};
        for (const key of allowedFields) {
            if (key in body) update[key] = body[key];
        }
        update.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from("affiliates")
            .update(update)
            .eq("id", params.id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/admin/affiliates/[id]/payout  — trigger manual payout
export async function POST(req: Request, { params }: { params: { id: string } }) {
    if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    try {
        const body = await req.json();
        const { amount, method, note } = body;

        // Record payout
        const { data: payout, error: payoutErr } = await supabase
            .from("affiliate_payouts")
            .insert([{ affiliate_id: params.id, amount, method: method || "paypal", status: "processing", note }])
            .select()
            .single();

        if (payoutErr) throw payoutErr;

        // Reset pending_payout balance
        const { error: updateErr } = await supabase
            .from("affiliates")
            .update({ pending_payout: 0, updated_at: new Date().toISOString() })
            .eq("id", params.id);

        if (updateErr) throw updateErr;

        return NextResponse.json({ success: true, payout });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
