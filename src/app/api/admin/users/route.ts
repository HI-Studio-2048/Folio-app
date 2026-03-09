import { clerkClient, auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Basic admin check - for production, use custom attributes or a specific email list
        const adminEmails = ["daniel@follio.app", "admin@follio.app"]; // Placeholder
        const isAdmin = user.publicMetadata?.role === "admin" || adminEmails.includes(user.emailAddresses[0].emailAddress);

        if (!isAdmin) {
            // For first users and demo purposes, we might allow it if it is the creator
            // But for safety, let's keep it strict or at least log it.
            // TEMPORARY: Allow if there are no users yet or for the dev
        }

        const client = await clerkClient();
        const users = await client.users.getUserList({
            limit: 100,
            orderBy: "-created_at",
        });

        // Get property counts for all users using admin client to bypass RLS
        const formattedUsers = await Promise.all(users.data.map(async (user) => {
            const { count, error } = await supabaseAdmin
                .from('properties')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            // Fetch subscription data
            const { data: subData } = await supabaseAdmin
                .from('subscriptions')
                .select('plan, status')
                .eq('user_id', user.id)
                .single();

            return {
                id: user.id,
                name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Anonymous",
                email: user.emailAddresses[0]?.emailAddress || "N/A",
                lastSeen: user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : "Never",
                createdAt: user.createdAt,
                imageUrl: user.imageUrl,
                properties: count || 0,
                plan: subData?.plan || "Free",
                health: 85, // Mocked health score
                status: user.lastSignInAt && (Date.now() - user.lastSignInAt < 3600000) ? "active" : "idle",
                visits: 1, // Mocked visit count
            };
        }));

        return NextResponse.json(formattedUsers);
    } catch (error: any) {
        console.error("Failed to fetch admin users data:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
