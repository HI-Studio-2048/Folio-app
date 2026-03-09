import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { data: subscription, error } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error && error.code !== "PGRST116") { // PGRST116 is code for 'no rows returned'
            throw error;
        }

        return NextResponse.json(subscription || { plan: "Free", status: "inactive" });
    } catch (error) {
        console.error("[SUBSCRIPTION_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
