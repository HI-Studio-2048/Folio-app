import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
    try {
        const { refCode, landingPage, userAgent } = await req.json();

        if (!refCode) return NextResponse.json({ error: "refCode required" }, { status: 400 });

        // Get affiliate ID from ref code
        const { data: affiliate, error: affError } = await supabase
            .from("affiliates")
            .select("id, total_clicks")
            .eq("ref_code", refCode)
            .single();

        if (affError || !affiliate) {
            return NextResponse.json({ error: "Invalid ref code" }, { status: 404 });
        }

        const aff = affiliate as { id: string, total_clicks: number };

        // Record the click
        const { error: clickError } = await supabase
            .from("affiliate_clicks")
            .insert([{
                affiliate_id: aff.id,
                ref_code: refCode,
                landing_page: landingPage,
                user_agent: userAgent,
            }]);

        if (clickError) throw clickError;

        // Increment total clicks on affiliate record
        await supabase
            .from("affiliates")
            .update({ total_clicks: (aff.total_clicks || 0) + 1 })
            .eq("id", aff.id);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("[Affiliate Track POST]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
