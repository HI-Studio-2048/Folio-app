"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ClickTrackerInner() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get("ref");
        if (ref) {
            // Store in localStorage for attribution later
            localStorage.setItem("affiliate_ref", ref);

            // Record the click in the database
            fetch("/api/affiliate/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    refCode: ref,
                    landingPage: window.location.pathname,
                    userAgent: navigator.userAgent
                })
            }).catch(e => console.error("Failed to track affiliate click", e));
        }
    }, [searchParams]);

    return null;
}

export function AffiliateTracker() {
    return (
        <Suspense fallback={null}>
            <ClickTrackerInner />
        </Suspense>
    );
}
