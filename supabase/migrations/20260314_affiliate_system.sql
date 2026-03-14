-- ====================================================================
-- FOLLIO AFFILIATE SYSTEM MIGRATION
-- Run this in your Supabase SQL Editor
-- ====================================================================

-- Affiliates: one row per affiliate account
CREATE TABLE IF NOT EXISTS affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL,          -- Clerk user ID
    email TEXT NOT NULL,
    name TEXT,
    ref_code TEXT UNIQUE NOT NULL,         -- e.g. "DAVID42"
    tier TEXT NOT NULL DEFAULT 'standard', -- 'standard' | 'elite'
    commission_pct NUMERIC(5,2) NOT NULL DEFAULT 30.00, -- Direct commission
    downline_pct NUMERIC(5,2) NOT NULL DEFAULT 10.00,   -- Sub-affiliate commission
    status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'paused' | 'banned'
    payout_email TEXT,                     -- PayPal or Stripe Connect email
    total_clicks INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    total_earned NUMERIC(12,2) DEFAULT 0,
    pending_payout NUMERIC(12,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral clicks tracking
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
    ref_code TEXT NOT NULL,
    ip_hash TEXT,                          -- Hashed IP for dedup
    user_agent TEXT,
    landing_page TEXT,
    converted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversions: when a referred user subscribes
CREATE TABLE IF NOT EXISTS affiliate_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES affiliates(id) ON DELETE SET NULL,
    parent_affiliate_id UUID REFERENCES affiliates(id) ON DELETE SET NULL, -- for downline
    referred_user_id TEXT,                -- Clerk user ID
    plan TEXT NOT NULL,                   -- 'pro' | 'enterprise'
    stripe_subscription_id TEXT,
    amount_usd NUMERIC(10,2),             -- subscription amount (MRR)
    commission_earned NUMERIC(10,2),      -- affiliate cut
    downline_earned NUMERIC(10,2),        -- parent affiliate downline cut
    status TEXT DEFAULT 'pending',        -- 'pending' | 'confirmed' | 'paid'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payouts log
CREATE TABLE IF NOT EXISTS affiliate_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    method TEXT DEFAULT 'paypal',          -- 'paypal' | 'stripe'
    status TEXT DEFAULT 'processing',      -- 'processing' | 'paid' | 'failed'
    note TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_affiliates_ref_code ON affiliates(ref_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate_id ON affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_affiliate_id ON affiliate_conversions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_affiliate_id ON affiliate_payouts(affiliate_id);

-- Seed 3 demo affiliates for UI testing
INSERT INTO affiliates (user_id, email, name, ref_code, tier, commission_pct, downline_pct, total_clicks, total_conversions, total_earned, pending_payout)
VALUES
  ('demo_001', 'david@sterling-res.com', 'David Sterling', 'DAVID42', 'elite', 40.00, 10.00, 1842, 48, 5614.80, 980.00),
  ('demo_002', 'emma.rod@outlook.com', 'Emma Rodriguez', 'EMMAF5', 'standard', 30.00, 10.00, 612, 14, 1215.60, 290.00),
  ('demo_003', 'm.chen@venture-capital.io', 'Michael Chen', 'MCHEN9', 'standard', 30.00, 10.00, 274, 5, 435.00, 435.00)
ON CONFLICT (user_id) DO NOTHING;
