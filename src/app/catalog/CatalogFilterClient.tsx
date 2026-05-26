'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FilterSidebarMobile } from '@/components/catalog/FilterSidebar';

export function CatalogFilterClient() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();

  const activeCount = (() => {
    let count = 0;
    const cat = searchParams.get('category');
    if (cat && cat !== 'all') count++;
    const minP = Number(searchParams.get('minPrice')) || 0;
    const maxP = Number(searchParams.get('maxPrice')) || 50000;
    if (minP > 0 || maxP < 50000) count++;
    if (searchParams.getAll('material').length > 0) count++;
    if (searchParams.getAll('certification').length > 0) count++;
    if (searchParams.get('sort') && searchParams.get('sort') !== 'featured') count++;
    return count;
  })();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:border-amber-300 text-gray-600 hover:text-amber-700 transition-colors lg:hidden"
        aria-label="Open filters"
      >
        <SlidersHorizontal size={16} />
        Filters
        {activeCount > 0 && (
          <span className="bg-amber-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ml-1">
            {activeCount}
          </span>
        )}
      </button>
      <FilterSidebarMobile isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
