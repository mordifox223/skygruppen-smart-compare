
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Providers table
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  logo TEXT,
  price DECIMAL(10,2) NOT NULL,
  price_label JSONB DEFAULT '{"nb": "kr/mnd", "en": "NOK/month"}',
  rating DECIMAL(3,2) DEFAULT 0.0,
  features JSONB DEFAULT '{}',
  url TEXT NOT NULL,
  offer_url TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Error logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  category TEXT NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  resolved BOOLEAN DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate clicks table  
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id),
  provider_name TEXT NOT NULL,
  category TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  url TEXT,
  ip_address INET,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price history table for analytics
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id),
  price DECIMAL(10,2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_providers_category ON providers(category);
CREATE INDEX IF NOT EXISTS idx_providers_active ON providers(is_active);
CREATE INDEX IF NOT EXISTS idx_providers_updated ON providers(last_updated);
CREATE INDEX IF NOT EXISTS idx_error_logs_provider ON error_logs(provider);
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_provider ON affiliate_clicks(provider_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_timestamp ON affiliate_clicks(timestamp);
CREATE INDEX IF NOT EXISTS idx_price_history_provider ON price_history(provider_id);

-- RLS (Row Level Security) policies
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active providers
CREATE POLICY "Allow public read on active providers" ON providers
  FOR SELECT USING (is_active = true);

-- Allow public insert on affiliate clicks (for tracking)
CREATE POLICY "Allow public insert on affiliate clicks" ON affiliate_clicks
  FOR INSERT WITH CHECK (true);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (id, name, description, icon) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Insurance', 'Comprehensive insurance comparison', 'shield'),
('550e8400-e29b-41d4-a716-446655440002', 'Electricity', 'Power provider comparison', 'zap'),
('550e8400-e29b-41d4-a716-446655440003', 'Mobile', 'Mobile plan comparison', 'smartphone'),
('550e8400-e29b-41d4-a716-446655440004', 'Loan', 'Banking and loan comparison', 'landmark')
ON CONFLICT (id) DO NOTHING;
