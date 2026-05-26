import { getSupabaseClient } from './client';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

export interface CatalogProduct {
  id: string;
  name: string;
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings';
  subcategory: string | null;
  price_usd: number;
  price_khr: number | null;
  description: string | null;
  material: string | null;
  gold_type: 'white gold' | 'yellow gold' | 'rose gold' | 'platinum' | null;
  carat_weight: number | null;
  diamond_clarity: string | null;
  diamond_color: string | null;
  certification: 'GIA' | 'IGI' | 'none' | null;
  certificate_number: string | null;
  images: string[];
  is_featured: boolean;
  is_available: boolean;
  created_at: string;
}

export interface CatalogFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  materials?: string[];
  certifications?: string[];
  minCarat?: number;
  maxCarat?: number;
  sort?: 'featured' | 'price_asc' | 'price_desc' | 'newest';
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

const KHR_RATE = 4100;

export function computeKhr(usd: number): number {
  return Math.round(usd * KHR_RATE);
}

function buildQuery(filters: CatalogFilters) {
  const supabase = getSupabaseClient();
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_available', true);

  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte('price_usd', filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte('price_usd', filters.maxPrice);
  }

  if (filters.materials && filters.materials.length > 0) {
    query = query.in('gold_type', filters.materials);
  }

  if (filters.certifications && filters.certifications.length > 0) {
    const mapped = filters.certifications.map((c) => {
      if (c === 'uncertified') return 'none';
      return c.toLowerCase();
    });
    query = query.in('certification', mapped);
  }

  if (filters.minCarat !== undefined) {
    query = query.gte('carat_weight', filters.minCarat);
  }
  if (filters.maxCarat !== undefined) {
    query = query.lte('carat_weight', filters.maxCarat);
  }

  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  const sortMap: Record<string, { column: string; ascending: boolean }> = {
    featured: { column: 'is_featured', ascending: false },
    price_asc: { column: 'price_usd', ascending: true },
    price_desc: { column: 'price_usd', ascending: false },
    newest: { column: 'created_at', ascending: false },
  };

  const sortConfig = sortMap[filters.sort || 'featured'];
  query = query.order(sortConfig.column, { ascending: sortConfig.ascending });
  query = query.order('created_at', { ascending: false });

  return query;
}

export async function getProducts(filters: CatalogFilters = {}) {
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const query = buildQuery(filters);
  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  return {
    products: (data || []) as CatalogProduct[],
    total: count || 0,
    page,
    pageSize,
    totalPages: count ? Math.ceil(count / pageSize) : 0,
  };
}

export async function getProductById(id: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_available', true)
    .single();

  if (error) return null;
  return data as CatalogProduct;
}

export async function getRelatedProducts(product: CatalogProduct, limit = 4) {
  const supabase = getSupabaseClient();
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .neq('id', product.id)
    .eq('category', product.category)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    const fallback = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .neq('id', product.id)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (fallback.error) return [];
    return fallback.data as CatalogProduct[];
  }

  return data as CatalogProduct[];
}

export async function getCategoryCounts(): Promise<CategoryCount[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('is_available', true);

  if (error) return [];

  const counts: Record<string, number> = {};
  for (const row of data) {
    const cat = (row as { category: string }).category;
    counts[cat] = (counts[cat] || 0) + 1;
  }

  return Object.entries(counts).map(([category, count]) => ({
    category,
    count,
  }));
}

export async function getFeaturedProducts(limit = 4) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data as CatalogProduct[];
}
