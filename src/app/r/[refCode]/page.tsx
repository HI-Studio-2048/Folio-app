import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function ReferralRedirectPage({
    params,
}: {
    params: { refCode: string };
}) {
    const { refCode } = await Promise.resolve(params);
    const code = refCode.toUpperCase();

    // Validate the ref code and increment click count
    const { data: affiliate } = await supabase
        .from("affiliates")
        .select("id, total_clicks, status")
        .eq("ref_code", code)
        .eq("status", "active")
        .single();

    if (affiliate) {
        // Fire-and-forget: increment click counter and log click
        await Promise.all([
            supabase
                .from("affiliates")
                .update({ total_clicks: (affiliate.total_clicks || 0) + 1 })
                .eq("id", affiliate.id),
            supabase
                .from("affiliate_clicks")
                .insert([{ affiliate_id: affiliate.id, ref_code: code, landing_page: `/r/${code}` }]),
        ]);
    }

    // Redirect to homepage with ref param — AffiliateTracker picks it up client-side
    redirect(`/?ref=${code}`);
}
