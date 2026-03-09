import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { plan } = await req.json();

        if (!plan) {
            return new NextResponse("Plan is required", { status: 400 });
        }

        // Map plan to Price ID (replace with actual Stripe Price IDs)
        const priceIds: Record<string, string> = {
            "Pro": process.env.STRIPE_PRO_PRICE_ID || "price_pro_mock",
            "Enterprise": process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise_mock",
        };

        const priceId = priceIds[plan];

        if (!priceId) {
            return new NextResponse("Invalid plan", { status: 400 });
        }

        // 1. Check if user already has a stripe_customer_id in our database
        let { data: subscription } = await supabase
            .from("subscriptions")
            .select("stripe_customer_id")
            .eq("user_id", userId)
            .single();

        let stripeCustomerId = subscription?.stripe_customer_id;

        // 2. If not, create a new customer in Stripe
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress,
                metadata: {
                    clerkUserId: userId,
                },
            });
            stripeCustomerId = customer.id;

            // Save to database
            await supabase.from("subscriptions").upsert({
                user_id: userId,
                stripe_customer_id: stripeCustomerId,
                plan: "Free",
                status: "inactive"
            });
        }

        // 3. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/#pricing`,
            metadata: {
                userId,
                plan,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("[CHECKOUT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
