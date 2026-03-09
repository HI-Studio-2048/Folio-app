import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-01-27-preview", // Use latest or appropriate version
    appInfo: {
        name: "Follio",
        version: "0.1.0",
    },
});
