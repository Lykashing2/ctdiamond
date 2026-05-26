'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const MATERIALS = [
  { value: 'white gold', label: 'White Gold' },
  { value: 'yellow gold', label: 'Yellow Gold' },
  { value: 'rose gold', label: 'Rose Gold' },
  { value: 'platinum', label: 'Platinum' },
];

const CERTIFICATIONS = [
  { value: 'GIA', label: 'GIA' },
  { value: 'IGI', label: 'IGI' },
  { value: 'uncertified', label: 'Uncertified' },
];

function useFilterActions() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const buildHref = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        params.delete(key);
        if (value === null) continue;
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      return `/catalog${qs ? `?${qs}` : ''}`;
    },
    [searchParams]
  );

  const navigate = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      router.push(buildHref(updates), { scroll: false });
    },
    [router, buildHref]
  );

  return { searchParams, navigate, buildHref };
}

interface SidebarContentProps {
  isDesktop?: boolean;
  onClose?: () => void;
}

function SidebarContent({ isDesktop, onClose }: SidebarContentProps) {
  const { searchParams, navigate } = useFilterActions();

  const currentCategory = searchParams.get('category') || 'all';
  const currentMinPrice = Number(searchParams.get('minPrice')) || 0;
  const currentMaxPrice = Number(searchParams.get('maxPrice')) || 50000;
  const currentMaterials = searchParams.getAll('material');
  const currentCertifications = searchParams.getAll('certification');
  const currentMinCarat = Number(searchParams.get('minCarat')) || 0;
  const currentMaxCarat = Number(searchParams.get('maxCarat')) || 10;
  const currentSort = searchParams.get('sort') || 'featured';

  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [minCarat, setMinCarat] = useState(currentMinCarat);
  const [maxCarat, setMaxCarat] = useState(currentMaxCarat);

  const setCategory = (cat: string) => {
    navigate({ category: cat === 'all' ? null : cat });
  };

  const toggleMaterial = (material: string) => {
    const current = [...currentMaterials];
    const idx = current.indexOf(material);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(material);
    navigate({ material: current.length > 0 ? current : null });
  };

  const toggleCertification = (cert: string) => {
    const current = [...currentCertifications];
    const idx = current.indexOf(cert);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(cert);
    navigate({ certification: current.length > 0 ? current : null });
  };

  const applyPrice = () => {
    const updates: Record<string, string | null> = {};
    updates.minPrice = minPrice > 0 ? String(minPrice) : null;
    updates.maxPrice = maxPrice < 50000 ? String(maxPrice) : null;
    navigate(updates);
  };

  const applyCarat = () => {
    const updates: Record<string, string | null> = {};
    updates.minCarat = minCarat > 0 ? String(minCarat) : null;
    updates.maxCarat = maxCarat < 10 ? String(maxCarat) : null;
    navigate(updates);
  };

  const setSort = (sort: string) => {
    navigate({ sort: sort === 'featured' ? null : sort });
  };

  const clearAll = () => {
    navigate({});
    setMinPrice(0);
    setMaxPrice(50000);
    setMinCarat(0);
    setMaxCarat(10);
  };

  const activeCount = useMemo(() => {
    let count = 0;
    if (currentCategory !== 'all') count++;
    if (currentMinPrice > 0 || currentMaxPrice < 50000) count++;
    if (currentMaterials.length > 0) count++;
    if (currentCertifications.length > 0) count++;
    if (currentMinCarat > 0 || currentMaxCarat < 10) count++;
    if (currentSort !== 'featured') count++;
    return count;
  }, [currentCategory, currentMinPrice, currentMaxPrice, currentMaterials, currentCertifications, currentMinCarat, currentMaxCarat, currentSort]);

  const showCarat = currentCategory === 'all' || currentCategory === 'rings' || currentCategory === 'earrings';

  return (
    <div className="space-y-6">
      {isDesktop && activeCount > 0 && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 font-medium transition-colors"
          aria-label="Clear all filters"
        >
          <X size={12} />
          Clear all filters ({activeCount})
        </button>
      )}

      {/* Sort */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">Sort by</h3>
        <select
          value={currentSort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          aria-label="Sort products"
        >
          <option value="featured">Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">Category</h3>
        <div className="space-y-1">
          {['all', 'rings', 'necklaces', 'bracelets', 'earrings'].map((cat) => {
            const label = cat === 'all' ? 'All Items' : cat.charAt(0).toUpperCase() + cat.slice(1);
            const isActive = currentCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors',
                  isActive
                    ? 'bg-amber-50 text-amber-700 font-medium'
                    : 'text-gray-600 hover:text-amber-700'
                )}
                aria-pressed={isActive}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">Price Range</h3>
        <div className="space-y-3">
          <div className="relative h-2 bg-gray-100 rounded-full">
            <div
              className="absolute h-full bg-amber-700 rounded-full"
              style={{
                left: `${(minPrice / 50000) * 100}%`,
                right: `${100 - (maxPrice / 50000) * 100}%`,
              }}
            />
            <input
              type="range"
              min={0}
              max={50000}
              step={100}
              value={minPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMinPrice(Math.min(val, maxPrice - 100));
              }}
              onMouseUp={applyPrice}
              onTouchEnd={applyPrice}
              className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-700 [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-700 [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer"
              aria-label="Minimum price"
            />
            <input
              type="range"
              min={0}
              max={50000}
              step={100}
              value={maxPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMaxPrice(Math.max(val, minPrice + 100));
              }}
              onMouseUp={applyPrice}
              onTouchEnd={applyPrice}
              className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-700 [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-700 [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer"
              aria-label="Maximum price"
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">${minPrice.toLocaleString()}</span>
            <span className="text-gray-500">${maxPrice.toLocaleString()}</span>
          </div>
          <p className="text-[10px] text-gray-400 -mt-1">
            ៛ {(minPrice * 4100).toLocaleString()} — ៛ {(maxPrice * 4100).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Material */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">Material</h3>
        <div className="space-y-1.5">
          {MATERIALS.map((mat) => {
            const isChecked = currentMaterials.includes(mat.value);
            return (
              <label
                key={mat.value}
                className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleMaterial(mat.value)}
                  className="w-4 h-4 rounded border-gray-300 text-amber-700 focus:ring-amber-500 accent-amber-700"
                />
                {mat.label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Certification */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">Certification</h3>
        <div className="space-y-1.5">
          {CERTIFICATIONS.map((cert) => {
            const isChecked = currentCertifications.includes(cert.value);
            return (
              <label
                key={cert.value}
                className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCertification(cert.value)}
                  className="w-4 h-4 rounded border-gray-300 text-amber-700 focus:ring-amber-500 accent-amber-700"
                />
                {cert.label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Carat */}
      {showCarat && (
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">Diamond Carat</h3>
          <div className="space-y-3">
            <div className="relative h-2 bg-gray-100 rounded-full">
              <div
                className="absolute h-full bg-amber-700 rounded-full"
                style={{
                  left: `${(minCarat / 10) * 100}%`,
                  right: `${100 - (maxCarat / 10) * 100}%`,
                }}
              />
              <input
                type="range"
                min={0}
                max={10}
                step={0.25}
                value={minCarat}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMinCarat(Math.min(val, maxCarat - 0.25));
                }}
                onMouseUp={applyCarat}
                onTouchEnd={applyCarat}
                className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-700 [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-700 [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer"
                aria-label="Minimum carat"
              />
              <input
                type="range"
                min={0}
                max={10}
                step={0.25}
                value={maxCarat}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMaxCarat(Math.max(val, minCarat + 0.25));
                }}
                onMouseUp={applyCarat}
                onTouchEnd={applyCarat}
                className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-700 [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-700 [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer"
                aria-label="Maximum carat"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{minCarat.toFixed(2)}ct</span>
              <span>{maxCarat.toFixed(2)}ct</span>
            </div>
          </div>
        </div>
      )}

      {!isDesktop && (
        <div className="flex gap-2 pt-2">
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-md text-gray-600 hover:text-amber-700 hover:border-amber-300 transition-colors"
            >
              Clear all ({activeCount})
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 text-xs bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}

export function FilterSidebarDesktop() {
  return (
    <aside className="w-64 shrink-0">
      <SidebarContent isDesktop />
    </aside>
  );
}

export function FilterSidebarMobile({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="font-semibold text-sm text-gray-900">Filters</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close filters"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          <SidebarContent onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
