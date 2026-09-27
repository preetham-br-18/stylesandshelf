import React from 'react';
import { RotateCcw, SlidersHorizontal, Check, ArrowDownUp } from 'lucide-react';
import { FilterState, SortOption, ProductCategory, DiscoveryType, PriceFilter, DiscountFilter, RatingFilter } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  sortBy: SortOption;
  totalResults: number;
  availableBrands: string[];
  availableStores: string[];
  availableCategories?: string[];
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  sortBy,
  totalResults,
  availableBrands,
  availableStores,
  availableCategories,
  onFilterChange,
  onSortChange,
  onResetFilters
}) => {
  const categories: (ProductCategory | 'All')[] = availableCategories && availableCategories.length > 0
    ? ['All', ...availableCategories]
    : ['All', 'Beauty', 'Fashion', 'Lifestyle'];

  const priceOptions: { label: string; value: PriceFilter }[] = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under ₹500', value: 'under500' },
    { label: 'Under ₹1,000', value: 'under1000' },
    { label: '₹1,000 – ₹2,000', value: '1000to2000' },
    { label: 'Above ₹2,000', value: 'above2000' }
  ];

  const discountOptions: { label: string; value: DiscountFilter }[] = [
    { label: 'All Discounts', value: 0 },
    { label: '20%+ Off', value: 20 },
    { label: '30%+ Off', value: 30 },
    { label: '40%+ Off', value: 40 },
    { label: '50%+ Off', value: 50 }
  ];

  const ratingOptions: { label: string; value: RatingFilter }[] = [
    { label: 'All Ratings', value: 0 },
    { label: '4.0★ & above', value: 4 },
    { label: '4.5★ & above', value: 4.5 }
  ];

  const typeOptions: { label: string; value: DiscoveryType }[] = [
    { label: 'All Products', value: 'all' },
    { label: 'Trending', value: 'trending' },
    { label: 'Best Sellers', value: 'bestseller' },
    { label: 'Deals Only', value: 'deals' }
  ];

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Most Relevant', value: 'relevant' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Top Customer Rating', value: 'rating' },
    { label: 'Biggest Discount', value: 'discount' }
  ];

  const isFiltered =
    filters.category !== 'All' ||
    filters.subcategory !== 'All' ||
    filters.priceRange !== 'all' ||
    filters.discount !== 0 ||
    filters.rating !== 0 ||
    filters.type !== 'all' ||
    filters.brand !== 'All' ||
    filters.store !== 'All' ||
    filters.searchQuery !== '';

  return (
    <div className="w-full bg-white rounded-2xl p-5 border border-rose-100/70 shadow-xs space-y-6">
      
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-rose-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#8E3B52]" />
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Filters
          </h2>
          <span className="text-xs bg-rose-50 text-[#8E3B52] font-semibold px-2 py-0.5 rounded-full">
            {totalResults}
          </span>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-medium text-[#8E3B52] hover:text-[#632737] flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Quick Sort Section in Sidebar */}
      <div>
        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
          <ArrowDownUp className="w-3 h-3 text-stone-400" />
          <span>Sort By</span>
        </label>
        <select
          id="sort-select-sidebar"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Sort products by"
          className="w-full text-xs font-medium bg-[#FAF6F6] border border-rose-200/80 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          {sortOptions.map(s => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Section */}
      <div>
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
          Category
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => {
            const active = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onFilterChange('category', cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#8E3B52] text-white shadow-2xs'
                    : 'bg-[#FAF6F6] text-stone-700 hover:bg-rose-50 hover:text-[#8E3B52]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Discovery Type */}
      <div>
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
          Curated Collection
        </h3>
        <div className="flex flex-col gap-1">
          {typeOptions.map(opt => {
            const checked = filters.type === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange('type', opt.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                  checked ? 'bg-rose-50 text-[#8E3B52] font-semibold' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{opt.label}</span>
                {checked && <Check className="w-3.5 h-3.5 text-[#8E3B52]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
          Budget / Price
        </h3>
        <div className="flex flex-col gap-1">
          {priceOptions.map(p => {
            const checked = filters.priceRange === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => onFilterChange('priceRange', p.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                  checked ? 'bg-rose-50 text-[#8E3B52] font-semibold' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{p.label}</span>
                {checked && <Check className="w-3.5 h-3.5 text-[#8E3B52]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Discount Tier */}
      <div>
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
          Minimum Discount
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {discountOptions.map(d => {
            const active = filters.discount === d.value;
            return (
              <button
                key={d.value}
                type="button"
                onClick={() => onFilterChange('discount', d.value)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-center cursor-pointer ${
                  active
                    ? 'bg-[#8E3B52] text-white'
                    : 'bg-[#FAF6F6] text-stone-700 hover:bg-rose-50 hover:text-[#8E3B52]'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
          Customer Rating
        </h3>
        <div className="flex flex-col gap-1">
          {ratingOptions.map(r => {
            const active = filters.rating === r.value;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => onFilterChange('rating', r.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                  active ? 'bg-rose-50 text-[#8E3B52] font-semibold' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{r.label}</span>
                {active && <Check className="w-3.5 h-3.5 text-[#8E3B52]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Retailer Store */}
      {availableStores.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
            Retailer Store
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onFilterChange('store', 'All')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                filters.store === 'All'
                  ? 'bg-stone-900 text-white'
                  : 'bg-[#FAF6F6] text-stone-700 hover:bg-stone-100'
              }`}
            >
              All Stores
            </button>
            {availableStores.map(st => {
              const active = filters.store === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => onFilterChange('store', st)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-stone-900 text-white'
                      : 'bg-[#FAF6F6] text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Brand Selection */}
      {availableBrands.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
            Brand
          </h3>
          <select
            id="brand-filter-select"
            value={filters.brand}
            onChange={(e) => onFilterChange('brand', e.target.value)}
            aria-label="Filter by brand"
            className="w-full text-xs font-medium bg-[#FAF6F6] border border-rose-200/80 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            <option value="All">All Brands</option>
            {availableBrands.map(b => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}

    </div>
  );
};
