import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId) {
            return new NextResponse("User id is required", { status: 400 });
        }

        await supabase.from("subscriptions").upsert({
            user_id: session.metadata.userId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            plan: session.metadata.plan || "Pro",
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        });
    }

    if (event.type === "customer.subscription.updated") {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase.from("subscriptions").update({
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        }).eq("stripe_subscription_id", subscription.id);
    }

    if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase.from("subscriptions").update({
            status: "canceled",
            plan: "Free",
        }).eq("stripe_subscription_id", subscription.id);
    }

    return new NextResponse(null, { status: 200 });
}
