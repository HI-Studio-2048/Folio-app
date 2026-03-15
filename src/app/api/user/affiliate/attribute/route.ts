import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { refCode } = await req.json();
        if (!refCode) return NextResponse.json({ error: "refCode required" }, { status: 400 });

        // Check if user is already attributed
        const { data: existingAttr } = await supabase
            .from("affiliate_conversions")
            .select("id")
            .eq("referred_user_id", userId)
            .single();

        if (existingAttr) {
            return NextResponse.json({ message: "User already attributed" });
        }

        // Get affiliate ID
        const { data: affiliate, error: affError } = await supabase
            .from("affiliates")
            .select("id, total_conversions")
            .eq("ref_code", refCode)
            .single();

        if (affError || !affiliate) {
            return NextResponse.json({ error: "Invalid ref code" }, { status: 404 });
        }

        const aff = affiliate as { id: string, total_conversions: number };

        // Record the conversion (Initial Attribution)
        const { error: convError } = await supabase
            .from("affiliate_conversions")
            .insert([{
                affiliate_id: aff.id,
                referred_user_id: userId,
                status: "pending", // Will become 'confirmed' on first payment
                amount_usd: 0,
                commission_earned: 0
            }]);

        if (convError) throw convError;

        // Increment total conversions on affiliate record
        await supabase
            .from("affiliates")
            .update({ total_conversions: (aff.total_conversions || 0) + 1 })
            .eq("id", aff.id);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("[Affiliate Attribute POST]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
