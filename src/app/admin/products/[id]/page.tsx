'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { supabase } from '@/lib/supabase/client';
import type { Product } from '@/lib/types';

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('products')
      .select('*')
      .eq('product_id', id)
      .single()
      .then(({ data }) => {
        if (data) setProduct(data as Product);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!product) return <div className="text-center py-12 text-gray-500">Product not found</div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}
