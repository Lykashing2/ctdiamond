-- CT DIAMOND JEWELRY - Supabase Schema
-- Run this in the Supabase SQL Editor (safe to re-run multiple times)

DROP TABLE IF EXISTS otp_codes CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS gold_rates CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- GOLD RATES TABLE (reference only)
CREATE TABLE IF NOT EXISTS gold_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purity_type_en TEXT NOT NULL,
  purity_type_km TEXT NOT NULL,
  base_rate_per_unit_usd DECIMAL(12,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_sku TEXT UNIQUE NOT NULL,
  sku_prefix TEXT NOT NULL DEFAULT '',
  category JSONB NOT NULL DEFAULT '{"en":"","km":""}',
  title JSONB NOT NULL DEFAULT '{"en":"","km":""}',
  description JSONB DEFAULT '{"en":"","km":""}',
  images TEXT[] DEFAULT '{}',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  stock_status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (stock_status IN ('AVAILABLE','PENDING_PAYMENT','SOLD')),
  pricing JSONB NOT NULL DEFAULT '{
    "line_items": [],
    "discount_usd": 0,
    "total_cost_usd": 0,
    "total_selling_usd": 0,
    "net_profit_usd": 0,
    "markup_percentage": 0,
    "profit_margin_percentage": 0
  }',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_visible ON products(is_visible);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_status);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(product_sku);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(product_id),
  customer_phone TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  delivery_address TEXT NOT NULL DEFAULT '',
  delivery_zone TEXT NOT NULL DEFAULT 'phnom_penh',
  subtotal_usd DECIMAL(12,2) NOT NULL DEFAULT 0,
  shipping_fee_usd DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_usd DECIMAL(12,2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'khqr',
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING','PAID','FAILED','REFUNDED')),
  stock_status TEXT NOT NULL DEFAULT 'AVAILABLE',
  is_international BOOLEAN NOT NULL DEFAULT false,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  consultation_type TEXT NOT NULL,
  sizing_info TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','CONFIRMED','CANCELLED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- OTP TABLE for verification
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gold_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Anyone can view available products" ON products;
CREATE POLICY "Anyone can view available products" ON products FOR SELECT
  USING (is_visible = true AND stock_status = 'AVAILABLE');

DROP POLICY IF EXISTS "Anyone can insert appointments" ON appointments;
CREATE POLICY "Anyone can insert appointments" ON appointments FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can view own appointments" ON appointments;
CREATE POLICY "Anyone can view own appointments" ON appointments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can view own orders" ON orders;
CREATE POLICY "Anyone can view own orders" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert OTP" ON otp_codes;
CREATE POLICY "Anyone can insert OTP" ON otp_codes FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can verify OTP" ON otp_codes;
CREATE POLICY "Anyone can verify OTP" ON otp_codes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert customers" ON customers;
CREATE POLICY "Anyone can insert customers" ON customers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can view customers" ON customers;
CREATE POLICY "Anyone can view customers" ON customers FOR SELECT USING (true);

-- Enable Realtime
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'products') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE products;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'gold_rates') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE gold_rates;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'orders') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE orders;
    END IF;
  END IF;
END $$;

-- Seed default gold rates
INSERT INTO gold_rates (purity_type_en, purity_type_km, base_rate_per_unit_usd) VALUES
  ('24K Gold', 'មាស ២៤K', 72.50),
  ('22K Gold', 'មាស ២២K', 66.80),
  ('18K Gold', 'មាស ១៨K', 54.20),
  ('White Gold 18K', 'មាសស ១៨K', 58.00)
ON CONFLICT DO NOTHING;

-- Sample products with line-item pricing
INSERT INTO products (product_sku, sku_prefix, category, title, description, images, is_visible, stock_status, pricing) VALUES
(
  'CTD-DIA-001', 'CTD-DIA',
  '{"en":"Diamond Jewelry","km":"គ្រឿងអលង្ការពេជ្រ"}',
  '{"en":"Classic Diamond Solitaire Ring","km":"ចិញ្ចៀនពេជ្រស្តង់ដារ"}',
  '{"en":"Elegant 1-carat diamond solitaire set in 18K white gold.","km":"ពេជ្រ ១ ការ៉ាត់ ក្នុងមាសស ១៨K"}',
  ARRAY['/images/ring-1.svg'],
  true, 'AVAILABLE',
  '{
    "line_items": [
      {"id":"li-1","name_km":"មាសទឹក ៧.៥","name_en":"18K Gold","quantity":1,"unit_cost_usd":23.00,"unit_selling_usd":615.00},
      {"id":"li-2","name_km":"ពេជ្រ 1.7 លី","name_en":"1.7mm Diamond","quantity":66,"unit_cost_usd":13.83,"unit_selling_usd":19.00},
      {"id":"li-3","name_km":"ពេជ្រ 2 លី","name_en":"2mm Diamond","quantity":20,"unit_cost_usd":23.60,"unit_selling_usd":31.00},
      {"id":"li-4","name_km":"ពេជ្រ 3.80 លី","name_en":"3.80mm Diamond","quantity":2,"unit_cost_usd":294.67,"unit_selling_usd":370.00},
      {"id":"li-5","name_km":"តម្លៃពលកម្ម","name_en":"Labor Cost","quantity":1,"unit_cost_usd":0,"unit_selling_usd":200.00}
    ],
    "discount_usd": 0,
    "total_cost_usd": 2166.00,
    "total_selling_usd": 3429.00,
    "net_profit_usd": 1263.00,
    "markup_percentage": 58.31,
    "profit_margin_percentage": 36.83
  }'
),
(
  'CTD-GOLD-001', 'CTD-GOLD',
  '{"en":"Italian Gold","km":"មាសអ៊ីតាលី"}',
  '{"en":"Italian Gold Chain Necklace","km":"ខ្សែកមាសអ៊ីតាលី"}',
  '{"en":"Premium 24K Italian gold chain, handcrafted with precision.","km":"មាស ២៤K អ៊ីតាលី ធ្វើដោយដៃយ៉ាងម៉ត់ចត់"}',
  ARRAY['/images/necklace-1.svg'],
  true, 'AVAILABLE',
  '{
    "line_items": [
      {"id":"li-1","name_km":"មាស ២៤K","name_en":"24K Gold","quantity":15,"unit_cost_usd":58.00,"unit_selling_usd":68.00},
      {"id":"li-2","name_km":"តម្លៃពលកម្ម","name_en":"Labor Cost","quantity":1,"unit_cost_usd":0,"unit_selling_usd":200.00}
    ],
    "discount_usd": 0,
    "total_cost_usd": 870.00,
    "total_selling_usd": 1220.00,
    "net_profit_usd": 350.00,
    "markup_percentage": 40.23,
    "profit_margin_percentage": 28.69
  }'
),
(
  'CTD-WG-001', 'CTD-WG',
  '{"en":"White Gold","km":"មាសស"}',
  '{"en":"White Gold Eternity Band","km":"ចិញ្ចៀនមាសសពេជ្រជុំវិញ"}',
  '{"en":"18K white gold band with pave diamond setting.","km":"មាសស ១៨K ជាមួយពេជ្រតូចៗ"}',
  ARRAY['/images/band-1.svg'],
  true, 'AVAILABLE',
  '{
    "line_items": [
      {"id":"li-1","name_km":"មាសស ១៨K","name_en":"White Gold 18K","quantity":3.2,"unit_cost_usd":45.00,"unit_selling_usd":55.00},
      {"id":"li-2","name_km":"ពេជ្រ 2mm","name_en":"2mm Diamond","quantity":18,"unit_cost_usd":120.00,"unit_selling_usd":160.00},
      {"id":"li-3","name_km":"តម្លៃពលកម្ម","name_en":"Labor Cost","quantity":1,"unit_cost_usd":0,"unit_selling_usd":120.00}
    ],
    "discount_usd": 0,
    "total_cost_usd": 2304.00,
    "total_selling_usd": 3160.00,
    "net_profit_usd": 856.00,
    "markup_percentage": 37.15,
    "profit_margin_percentage": 27.09
  }'
)
ON CONFLICT DO NOTHING;
