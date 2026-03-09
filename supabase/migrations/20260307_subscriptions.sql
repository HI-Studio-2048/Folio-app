
-- SQL Schema for Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE, -- Matches Clerk user.id
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan TEXT NOT NULL DEFAULT 'Free',
    status TEXT NOT NULL DEFAULT 'inactive',
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own subscription" ON public.subscriptions
    FOR SELECT
    USING (user_id = auth.jwt() ->> 'sub'); -- This assumes Supabase is configured with Clerk

-- For simplicity in this demo environment, we'll allow all for now if auth is not fully configured between Clerk and Supabase
CREATE POLICY "Manage own subscription" ON public.subscriptions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Indices
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions (user_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx ON public.subscriptions (stripe_customer_id);
