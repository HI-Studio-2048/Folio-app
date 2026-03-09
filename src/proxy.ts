import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/signup(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
}, {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_Y2xlYXItcXVhaWwtNDEuY2xlcmsuYWNjb3VudHMuZGV2JA",
    secretKey: process.env.CLERK_SECRET_KEY || "sk_test_eCbN0jS4cYHZLvfTBnphGrJG6RawYEa8oP6OR3aO9P"
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
