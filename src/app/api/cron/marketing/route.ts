import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";
import { NotificationEmail } from "@/components/emails/NotificationEmail";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req: Request) {
    // Basic security check for cron (verify header if configured in vercel.json)
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const now = new Date().toISOString();

        // 1. Get users due for an email
        const { data: pendingUsers, error: fetchError } = await supabaseAdmin
            .from("user_marketing_progress")
            .select(`
                *,
                flow:marketing_flows(*),
                current_step:marketing_flow_steps(*)
            `)
            .lte("next_send_at", now)
            .eq("status", "active");

        if (fetchError) throw fetchError;
        if (!pendingUsers || pendingUsers.length === 0) {
            return NextResponse.json({ message: "No pending marketing emails." });
        }

        const stats = { sent: 0, errors: 0 };
        const client = await clerkClient();

        for (const progress of pendingUsers) {
            try {
                // Determine the next step
                // If last_step_sent is null, we need the first step (day_offset 0)
                // Otherwise we need the next step in the flow
                const { data: steps } = await supabaseAdmin
                    .from("marketing_flow_steps")
                    .select("*")
                    .eq("flow_id", progress.flow_id)
                    .order("day_offset", { ascending: true });

                const lastStepIndex = progress.last_step_sent
                    ? (steps || []).findIndex((s: any) => s.id === progress.last_step_sent)
                    : -1;

                const nextStep = (steps || [])[lastStepIndex + 1];

                if (!nextStep) {
                    // No more steps, mark as completed
                    await supabaseAdmin
                        .from("user_marketing_progress")
                        .update({ status: "completed" })
                        .eq("id", progress.id);
                    continue;
                }

                // 2. Fetch user details from Clerk
                const user = await client.users.getUser(progress.user_id);
                const email = user.emailAddresses[0]?.emailAddress;

                if (!email) {
                    console.error(`[Marketing Cron] No email found for user ${progress.user_id}`);
                    continue;
                }

                // 3. Send the email
                await resend.emails.send({
                    from: 'Follio <updates@follio.app>',
                    to: email,
                    subject: nextStep.subject,
                    react: NotificationEmail({
                        title: nextStep.subject,
                        message: nextStep.body,
                        actionText: "Open Follio",
                        actionUrl: "https://follio.app/dashboard"
                    }),
                });

                // 4. Update progress
                const nextStepInList = (steps || [])[lastStepIndex + 2];
                let nextSendAt = null;
                if (nextStepInList) {
                    const daysToWait = nextStepInList.day_offset - nextStep.day_offset;
                    const date = new Date();
                    date.setDate(date.getDate() + daysToWait);
                    nextSendAt = date.toISOString();
                }

                await supabaseAdmin
                    .from("user_marketing_progress")
                    .update({
                        last_step_sent: nextStep.id,
                        last_sent_at: now,
                        next_send_at: nextSendAt,
                        status: nextStepInList ? "active" : "completed"
                    })
                    .eq("id", progress.id);

                stats.sent++;
            } catch (err) {
                console.error(`[Marketing Cron] Error processing user ${progress.user_id}:`, err);
                stats.errors++;
            }
        }

        return NextResponse.json({ success: true, stats });
    } catch (err: any) {
        console.error("[Marketing Cron] Fatal error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
