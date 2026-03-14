-- Marketing Flows Migration
-- Enables automated email sequences and flow management

-- 1. Table for email flows (e.g., "3-Month Onboarding")
CREATE TABLE IF NOT EXISTS public.marketing_flows (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  description  TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table for steps within a flow
CREATE TABLE IF NOT EXISTS public.marketing_flow_steps (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id      UUID NOT NULL REFERENCES public.marketing_flows(id) ON DELETE CASCADE,
  day_offset   INT NOT NULL, -- Days since enrollment (e.g., 0, 3, 7)
  subject      TEXT NOT NULL,
  body         TEXT NOT NULL, -- Markdown/HTML content
  template_id  TEXT,          -- Optional: reference to a specific React Email template
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(flow_id, day_offset)
);

-- 3. Table to track user progress
CREATE TABLE IF NOT EXISTS public.user_marketing_progress (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            TEXT NOT NULL, -- Clerk User ID
  flow_id            UUID NOT NULL REFERENCES public.marketing_flows(id) ON DELETE CASCADE,
  enrolled_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_step_sent     UUID REFERENCES public.marketing_flow_steps(id),
  last_sent_at       TIMESTAMPTZ,
  next_send_at       TIMESTAMPTZ,
  status             TEXT NOT NULL DEFAULT 'active', -- 'active' | 'paused' | 'completed' | 'unsubscribed'
  UNIQUE(user_id, flow_id)
);

-- 4. Enable RLS
ALTER TABLE public.marketing_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_flow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_marketing_progress ENABLE ROW LEVEL SECURITY;

-- Admin-only access (via service role primarily)
-- Users shouldn't see these internal marketing tables

-- 5. Seed the default 3-Month Onboarding Flow
INSERT INTO public.marketing_flows (id, name, description)
VALUES ('00000000-0000-0000-0000-000000000001', '3-Month Onboarding', 'Automated welcome and nurture sequence for new Follio users.')
ON CONFLICT DO NOTHING;

INSERT INTO public.marketing_flow_steps (flow_id, day_offset, subject, body)
VALUES 
('00000000-0000-0000-0000-000000000001', 0, 'Welcome to Follio! 🚀', 'Hi there! Welcome to Follio. We are excited to help you manage your portfolio visually. Start by adding your first property...'),
('00000000-0000-0000-0000-000000000001', 3, 'Pro Tip: Managing Multiple Properties', 'Managing multiple properties is easy with our bulk upload and visual filters. Check out these tips...'),
('00000000-0000-0000-0000-000000000001', 7, 'How is your Portfolio Health?', 'Follio tracks your portfolio health in real-time. Learn how to interpret your health score...'),
('00000000-0000-0000-0000-000000000001', 14, 'Advanced Visualization & Insights', 'Did you know you can customize your view settings? Dive deep into your data today...'),
('00000000-0000-0000-0000-000000000001', 30, '1-Month Milestone: Your Progress', 'You have been with us for a month! Let is review how your portfolio has performed...'),
('00000000-0000-0000-0000-000000000001', 60, 'Scaling Strategies for your Portfolio', 'Ready to add more assets? Here is how Follio helps you scale safely...'),
('00000000-0000-0000-0000-000000000001', 90, 'The Road Ahead: 3-Month Review', 'Three months in! It is time for a long-term projection review. Let is look at the next year...')
ON CONFLICT DO NOTHING;
