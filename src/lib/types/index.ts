export type Language = 'en' | 'km';

export interface BilingualField {
  en: string;
  km: string;
}

export type StockStatus = 'AVAILABLE' | 'PENDING_PAYMENT' | 'SOLD';

export interface LineItem {
  id: string;
  name_km: string;
  name_en: string;
  quantity: number;
  unit_cost_usd: number;
  unit_selling_usd: number;
  gold_purity?: string | null;
  gold_weight_grams?: number | null;
}

export interface ProductPricing {
  line_items: LineItem[];
  discount_usd: number;
  total_cost_usd: number;
  total_selling_usd: number;
  net_profit_usd: number;
  markup_percentage: number;
  profit_margin_percentage: number;
}

export interface Product {
  product_id: string;
  product_sku: string;
  sku_prefix: string;
  category: BilingualField;
  title: BilingualField;
  description?: BilingualField;
  images: string[];
  is_visible: boolean;
  stock_status: StockStatus;
  pricing: ProductPricing;
  created_at: string;
  updated_at: string;
}

export interface GoldRate {
  id: string;
  purity_type_en: string;
  purity_type_km: string;
  base_rate_per_unit_usd: number;
  updated_at: string;
}

export interface Appointment {
  id: string;
  customer_name: string;
  customer_phone: string;
  date: string;
  time_slot: string;
  consultation_type: string;
  sizing_info?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  created_at: string;
}

export interface Order {
  id: string;
  product_id: string;
  customer_phone: string;
  customer_name: string;
  delivery_address: string;
  delivery_zone: string;
  subtotal_usd: number;
  shipping_fee_usd: number;
  total_usd: number;
  payment_method: string;
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  stock_status: StockStatus;
  is_international: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface TranslationMap {
  [key: string]: BilingualField;
}

export type ConsultationType = 'in_store_consultation' | 'bridal_fitting' | 'valuation' | 'custom_design';
