import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { flow_id, day_offset, subject, body: emailBody } = body;

    const { data, error } = await supabaseAdmin
        .from("marketing_flow_steps")
        .upsert([{
            flow_id,
            day_offset,
            subject,
            body: emailBody
        }], { onConflict: "flow_id,day_offset" })
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data[0]);
}
