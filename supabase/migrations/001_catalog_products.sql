-- CT DIAMOND JEWELRY — Catalog Products
-- Run this in the Supabase SQL Editor

DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('rings', 'necklaces', 'bracelets', 'earrings')),
  subcategory TEXT,
  price_usd NUMERIC(10,2) NOT NULL,
  price_khr NUMERIC(14,0),
  description TEXT,
  material TEXT,
  gold_type TEXT CHECK (gold_type IN ('white gold', 'yellow gold', 'rose gold', 'platinum')),
  carat_weight NUMERIC(5,2),
  diamond_clarity TEXT,
  diamond_color TEXT,
  certification TEXT CHECK (certification IN ('GIA', 'IGI', 'none')),
  certificate_number TEXT,
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view available products" ON products;
CREATE POLICY "Anyone can view available products" ON products
  FOR SELECT
  USING (is_available = TRUE);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price_usd);
CREATE INDEX IF NOT EXISTS idx_products_certification ON products(certification);
CREATE INDEX IF NOT EXISTS idx_products_gold_type ON products(gold_type);
CREATE INDEX IF NOT EXISTS idx_products_carat ON products(carat_weight);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);

-- Sample products
INSERT INTO products (name, category, subcategory, price_usd, price_khr, description, material, gold_type, carat_weight, diamond_clarity, diamond_color, certification, certificate_number, images, is_featured, is_available) VALUES
(
  'Classic Diamond Solitaire Ring',
  'rings',
  'solitaire',
  3429.00,
  14058900,
  'Elegant 1-carat diamond solitaire set in 18K white gold. GIA certified diamond with exceptional brilliance.',
  'Diamond',
  'white gold',
  1.00,
  'VS1',
  'G',
  'GIA',
  'GIA-123456789',
  ARRAY['/images/ring-1.svg', '/images/ring-1.svg'],
  TRUE,
  TRUE
),
(
  'Italian Gold Chain Necklace',
  'necklaces',
  'chain',
  1220.00,
  5002000,
  'Premium 24K Italian gold chain, handcrafted with precision. Perfect for everyday elegance.',
  'Gold',
  'yellow gold',
  NULL,
  NULL,
  NULL,
  'none',
  NULL,
  ARRAY['/images/necklace-1.svg'],
  TRUE,
  TRUE
),
(
  'White Gold Eternity Band',
  'rings',
  'eternity',
  3160.00,
  12956000,
  '18K white gold band with pave diamond setting. A timeless symbol of eternal love.',
  'Diamond',
  'white gold',
  0.75,
  'VS2',
  'H',
  'IGI',
  'IGI-987654321',
  ARRAY['/images/band-1.svg'],
  TRUE,
  TRUE
),
(
  'Rose Gold Pearl Earrings',
  'earrings',
  'stud',
  890.00,
  3649000,
  'Stunning pearl earrings set in 18K rose gold. Each pearl is hand-selected for its luster.',
  'Pearl',
  'rose gold',
  NULL,
  NULL,
  NULL,
  'none',
  NULL,
  ARRAY['/images/earring-1.svg'],
  FALSE,
  TRUE
),
(
  'Platinum Diamond Bracelet',
  'bracelets',
  'tennis',
  5200.00,
  21320000,
  'Breathtaking platinum tennis bracelet featuring 5 carats of GIA certified diamonds.',
  'Diamond',
  'platinum',
  5.00,
  'VVS1',
  'D',
  'GIA',
  'GIA-456789123',
  ARRAY['/images/bracelet-1.svg'],
  TRUE,
  TRUE
),
(
  'Yellow Gold Hoop Earrings',
  'earrings',
  'hoop',
  680.00,
  2788000,
  'Classic 18K yellow gold hoop earrings. Lightweight and comfortable for all-day wear.',
  'Gold',
  'yellow gold',
  NULL,
  NULL,
  NULL,
  'none',
  NULL,
  ARRAY['/images/earring-2.svg'],
  FALSE,
  TRUE
)
ON CONFLICT DO NOTHING;
