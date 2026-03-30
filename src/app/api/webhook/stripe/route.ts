import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ELITE_CONVERSION_THRESHOLD = 20;

// Auto-promote affiliate to Elite if they've hit the threshold
async function checkAndPromoteToElite(affiliateId: string) {
    const { data: aff } = await supabase
        .from("affiliates")
        .select("tier, total_conversions")
        .eq("id", affiliateId)
        .single();

    if (aff && (aff as any).tier !== "elite" && (aff as any).total_conversions >= ELITE_CONVERSION_THRESHOLD) {
        await supabase
            .from("affiliates")
            .update({ tier: "elite", commission_pct: 40 })
            .eq("id", affiliateId);
    }
}

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

        const userId = session.metadata.userId;
        const amountUsd = (session.amount_total ?? 0) / 100;

        await supabase.from("subscriptions").upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            plan: session.metadata.plan || "Pro",
            status: subscription.status,
            current_period_end: new Date((subscription.items.data[0]?.current_period_end ?? 0) * 1000).toISOString(),
        });

        // Process affiliate commission if this user was referred
        const affiliateRefCode = session.metadata.affiliateRefCode;
        if (affiliateRefCode) {
            // Get affiliate record
            const { data: affiliate } = await supabase
                .from("affiliates")
                .select("id, commission_pct, downline_pct, total_earned, pending_payout, parent_affiliate_id")
                .eq("ref_code", affiliateRefCode)
                .eq("status", "active")
                .single();

            if (affiliate) {
                const aff = affiliate as any;
                const commission = parseFloat(((aff.commission_pct / 100) * amountUsd).toFixed(2));

                // Update the pending conversion to confirmed with commission amount
                await supabase
                    .from("affiliate_conversions")
                    .update({
                        status: "confirmed",
                        amount_usd: amountUsd,
                        commission_earned: commission,
                    })
                    .eq("affiliate_id", aff.id)
                    .eq("referred_user_id", userId)
                    .eq("status", "pending");

                // Update affiliate totals
                await supabase
                    .from("affiliates")
                    .update({
                        total_earned: (aff.total_earned || 0) + commission,
                        pending_payout: (aff.pending_payout || 0) + commission,
                        total_conversions: (aff.total_conversions || 0) + 1,
                    })
                    .eq("id", aff.id);

                await checkAndPromoteToElite(aff.id);

                // Pay downline commission to parent affiliate if one exists
                if (aff.parent_affiliate_id) {
                    const { data: parent } = await supabase
                        .from("affiliates")
                        .select("id, downline_pct, total_earned, pending_payout")
                        .eq("id", aff.parent_affiliate_id)
                        .eq("status", "active")
                        .single();

                    if (parent) {
                        const p = parent as any;
                        const downlineEarned = parseFloat(((p.downline_pct / 100) * amountUsd).toFixed(2));

                        await supabase.from("affiliate_conversions").insert([{
                            affiliate_id: p.id,
                            referred_user_id: userId,
                            status: "confirmed",
                            amount_usd: amountUsd,
                            commission_earned: 0,
                            downline_earned: downlineEarned,
                        }]);

                        await supabase
                            .from("affiliates")
                            .update({
                                total_earned: (p.total_earned || 0) + downlineEarned,
                                pending_payout: (p.pending_payout || 0) + downlineEarned,
                            })
                            .eq("id", p.id);
                    }
                }
            }
        }
    }

    if (event.type === "invoice.payment_succeeded") {
        const invoice = event.data.object as Stripe.Invoice;
        // Only process recurring renewals, not the initial checkout (handled above)
        if (invoice.billing_reason !== "subscription_cycle") {
            return new NextResponse(null, { status: 200 });
        }

        const customerId = invoice.customer as string;
        const amountUsd = (invoice.amount_paid ?? 0) / 100;

        // Look up user by stripe customer id
        const { data: sub } = await supabase
            .from("subscriptions")
            .select("user_id")
            .eq("stripe_customer_id", customerId)
            .single();

        if (sub) {
            const userId = sub.user_id;

            // Find the affiliate who referred this user
            const { data: conversion } = await supabase
                .from("affiliate_conversions")
                .select("affiliate_id, affiliates(id, commission_pct, downline_pct, total_earned, pending_payout, parent_affiliate_id)")
                .eq("referred_user_id", userId)
                .eq("status", "confirmed")
                .single();

            if (conversion?.affiliates) {
                const aff = conversion.affiliates as any;
                const commission = parseFloat(((aff.commission_pct / 100) * amountUsd).toFixed(2));

                // Insert a new confirmed conversion for this renewal
                await supabase.from("affiliate_conversions").insert([{
                    affiliate_id: aff.id,
                    referred_user_id: userId,
                    status: "confirmed",
                    amount_usd: amountUsd,
                    commission_earned: commission,
                    downline_earned: 0,
                }]);

                await supabase
                    .from("affiliates")
                    .update({
                        total_earned: (aff.total_earned || 0) + commission,
                        pending_payout: (aff.pending_payout || 0) + commission,
                        total_conversions: (aff.total_conversions || 0) + 1,
                    })
                    .eq("id", aff.id);

                await checkAndPromoteToElite(aff.id);

                // Downline commission for parent
                if (aff.parent_affiliate_id) {
                    const { data: parent } = await supabase
                        .from("affiliates")
                        .select("id, downline_pct, total_earned, pending_payout")
                        .eq("id", aff.parent_affiliate_id)
                        .eq("status", "active")
                        .single();

                    if (parent) {
                        const p = parent as any;
                        const downlineEarned = parseFloat(((p.downline_pct / 100) * amountUsd).toFixed(2));

                        await supabase.from("affiliate_conversions").insert([{
                            affiliate_id: p.id,
                            referred_user_id: userId,
                            status: "confirmed",
                            amount_usd: amountUsd,
                            commission_earned: 0,
                            downline_earned: downlineEarned,
                        }]);

                        await supabase
                            .from("affiliates")
                            .update({
                                total_earned: (p.total_earned || 0) + downlineEarned,
                                pending_payout: (p.pending_payout || 0) + downlineEarned,
                            })
                            .eq("id", p.id);
                    }
                }
            }
        }
    }

    if (event.type === "customer.subscription.updated") {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase.from("subscriptions").update({
            status: subscription.status,
            current_period_end: new Date((subscription.items.data[0]?.current_period_end ?? 0) * 1000).toISOString(),
        }).eq("stripe_subscription_id", subscription.id);
    }

    if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase.from("subscriptions").update({
            status: "canceled",
            plan: "Free",
        }).eq("stripe_subscription_id", subscription.id);

        // Clawback: find the user and reverse any unpaid commissions
        const { data: sub } = await supabase
            .from("subscriptions")
            .select("user_id")
            .eq("stripe_subscription_id", subscription.id)
            .single();

        if (sub) {
            // Find all confirmed conversions for this referred user that are still pending payout
            const { data: conversions } = await supabase
                .from("affiliate_conversions")
                .select("id, affiliate_id, commission_earned, downline_earned")
                .eq("referred_user_id", sub.user_id)
                .eq("status", "confirmed");

            if (conversions && conversions.length > 0) {
                // Mark all as cancelled
                await supabase
                    .from("affiliate_conversions")
                    .update({ status: "cancelled" })
                    .eq("referred_user_id", sub.user_id)
                    .eq("status", "confirmed");

                // Group total clawback per affiliate
                const clawbackMap: Record<string, number> = {};
                for (const c of conversions as any[]) {
                    const earned = (c.commission_earned || 0) + (c.downline_earned || 0);
                    clawbackMap[c.affiliate_id] = (clawbackMap[c.affiliate_id] || 0) + earned;
                }

                // Reverse pending_payout for each affected affiliate (floor at 0)
                for (const [affiliateId, amount] of Object.entries(clawbackMap)) {
                    const { data: aff } = await supabase
                        .from("affiliates")
                        .select("pending_payout, total_earned")
                        .eq("id", affiliateId)
                        .single();

                    if (aff) {
                        const a = aff as any;
                        await supabase
                            .from("affiliates")
                            .update({
                                pending_payout: Math.max(0, (a.pending_payout || 0) - amount),
                                total_earned: Math.max(0, (a.total_earned || 0) - amount),
                            })
                            .eq("id", affiliateId);
                    }
                }
            }
        }
    }

    return new NextResponse(null, { status: 200 });
}
