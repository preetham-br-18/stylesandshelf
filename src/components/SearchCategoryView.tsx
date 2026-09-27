import React, { useState } from 'react';
import { SlidersHorizontal, ArrowDownUp, RotateCcw, Search, X, Check } from 'lucide-react';
import { Product, FilterState, SortOption, ProductCategory, DiscoveryType } from '../types';
import { ProductCard } from './ProductCard';
import { FilterSidebar } from './FilterSidebar';

interface SearchCategoryViewProps {
  products: Product[];
  filters: FilterState;
  sortBy: SortOption;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
}

export const SearchCategoryView: React.FC<SearchCategoryViewProps> = ({
  products,
  filters,
  sortBy,
  onFilterChange,
  onSortChange,
  onResetFilters,
  onSelectProduct,
  onQuickBuy
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Compute available unique brands and stores from live catalog
  const availableBrands = Array.from(new Set(products.map(p => p.brand))).sort();
  const availableStores = Array.from(new Set(products.map(p => p.store))).sort();
  const availableCategories = Array.from(new Set(products.map(p => p.category))).sort();

  // Filter products
  const filteredProducts = products.filter(p => {
    // 1. Search Query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchSub = p.subcategory ? p.subcategory.toLowerCase().includes(q) : false;
      const matchStore = p.store.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCat && !matchSub && !matchStore) {
        return false;
      }
    }

    // 2. Category
    if (filters.category !== 'All' && p.category !== filters.category) {
      return false;
    }

    // 3. Subcategory
    if (filters.subcategory !== 'All' && p.subcategory !== filters.subcategory) {
      return false;
    }

    // 4. Discovery Type
    if (filters.type === 'trending' && !p.featured) {
      return false;
    }
    if (filters.type === 'bestseller' && !p.bestseller) {
      return false;
    }
    if (filters.type === 'deals' && p.discount < 20) {
      return false;
    }

    // 5. Price Range
    if (filters.priceRange === 'under500' && p.price >= 500) {
      return false;
    }
    if (filters.priceRange === 'under1000' && p.price >= 1000) {
      return false;
    }
    if (filters.priceRange === '1000to2000' && (p.price < 1000 || p.price > 2000)) {
      return false;
    }
    if (filters.priceRange === 'above2000' && p.price <= 2000) {
      return false;
    }

    // 6. Discount
    if (filters.discount > 0 && p.discount < filters.discount) {
      return false;
    }

    // 7. Rating
    if (filters.rating > 0 && p.rating < filters.rating) {
      return false;
    }

    // 8. Brand
    if (filters.brand !== 'All' && p.brand !== filters.brand) {
      return false;
    }

    // 9. Store
    if (filters.store !== 'All' && p.store !== filters.store) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'discount':
        return b.discount - a.discount;
      case 'popular':
        return b.reviews - a.reviews;
      case 'relevant':
      default:
        // Prioritize matching search query or featured
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.id - b.id;
    }
  });

  const getPageHeading = () => {
    if (filters.searchQuery) {
      return `Results for "${filters.searchQuery}"`;
    }
    if (filters.type === 'trending') {
      return 'Trending Products';
    }
    if (filters.type === 'bestseller') {
      return 'Best Selling Products';
    }
    if (filters.type === 'deals') {
      return 'Exclusive Deals & Discounts';
    }
    if (filters.category !== 'All') {
      return `${filters.category} Collection`;
    }
    return 'All Curated Products';
  };

  const getPageDescription = () => {
    if (filters.type === 'deals') {
      return 'Verified high-discount items and coupon opportunities from trusted retailers.';
    }
    if (filters.type === 'trending') {
      return 'Curated products with high current demand and spotlight recommendations.';
    }
    if (filters.category !== 'All') {
      return `Explore handpicked ${filters.category.toLowerCase()} finds tailored for Indian shoppers.`;
    }
    return 'Browse our entire editorial catalog across beauty, fashion, and lifestyle.';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-in fade-in duration-200">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-6 border-b border-rose-100">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {getPageHeading()}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {getPageDescription()}
          </p>
        </div>

        {/* Mobile Filter Toggle & Quick Summary */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="mobile-filter-open-btn"
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-stone-800 text-xs font-semibold shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8E3B52]" />
            <span>Filters &amp; Sort</span>
            <span className="w-5 h-5 rounded-full bg-rose-50 text-[#8E3B52] text-[10px] flex items-center justify-center font-bold">
              {sortedProducts.length}
            </span>
          </button>

          <span className="hidden lg:inline text-xs text-stone-500 font-medium">
            Showing <strong>{sortedProducts.length}</strong> {sortedProducts.length === 1 ? 'find' : 'finds'}
          </span>
        </div>
      </div>

      {/* Active Filter Badges Strip (PRD Step 1: Fix Search UI alignment) */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        {filters.searchQuery && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-rose-200 text-stone-800 shadow-2xs">
            <span>Query: "{filters.searchQuery}"</span>
            <button onClick={() => onFilterChange('searchQuery', '')} className="text-stone-400 hover:text-stone-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}

        {filters.category !== 'All' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 border border-rose-200 text-[#8E3B52]">
            <span>Category: {filters.category}</span>
            <button onClick={() => onFilterChange('category', 'All')} className="text-rose-400 hover:text-[#8E3B52]">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}

        {filters.type !== 'all' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 border border-rose-200 text-[#8E3B52] capitalize">
            <span>Type: {filters.type}</span>
            <button onClick={() => onFilterChange('type', 'all')} className="text-rose-400 hover:text-[#8E3B52]">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}

        {filters.priceRange !== 'all' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-rose-200 text-stone-800">
            <span>Budget: {filters.priceRange}</span>
            <button onClick={() => onFilterChange('priceRange', 'all')} className="text-stone-400 hover:text-stone-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}

        {filters.discount > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-rose-200 text-stone-800">
            <span>{filters.discount}%+ Off</span>
            <button onClick={() => onFilterChange('discount', 0)} className="text-stone-400 hover:text-stone-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}

        {filters.brand !== 'All' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-rose-200 text-stone-800">
            <span>Brand: {filters.brand}</span>
            <button onClick={() => onFilterChange('brand', 'All')} className="text-stone-400 hover:text-stone-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}

        {filters.store !== 'All' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-rose-200 text-stone-800">
            <span>Store: {filters.store}</span>
            <button onClick={() => onFilterChange('store', 'All')} className="text-stone-400 hover:text-stone-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}

        {(filters.category !== 'All' || filters.priceRange !== 'all' || filters.discount > 0 || filters.brand !== 'All' || filters.store !== 'All' || filters.searchQuery || filters.type !== 'all') && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-[#8E3B52] hover:underline ml-1 cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Main Grid: Sidebar + Product Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Filter Sidebar (4 columns) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-28">
          <FilterSidebar
            filters={filters}
            sortBy={sortBy}
            totalResults={sortedProducts.length}
            availableBrands={availableBrands}
            availableStores={availableStores}
            availableCategories={availableCategories}
            onFilterChange={onFilterChange}
            onSortChange={onSortChange}
            onResetFilters={onResetFilters}
          />
        </div>

        {/* Product Grid Area (8 / 9 columns) */}
        <div className="lg:col-span-9">
          
          {/* Empty State (PRD Section 45) */}
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 sm:p-14 border border-rose-100 text-center max-w-md mx-auto shadow-2xs">
              <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-[#8E3B52] mx-auto mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
                No products found
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mb-6 leading-relaxed">
                Try changing your filters, clearing your search keywords, or selecting a broader price category.
              </p>
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8E3B52] hover:bg-[#783145] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Explore All Products</span>
              </button>
            </div>
          ) : (
            /* Responsive Grid */
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickBuy={onQuickBuy}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xs sm:max-w-sm h-full flex flex-col shadow-2xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-rose-100 mb-4">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Filters &amp; Sorting
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterSidebar
              filters={filters}
              sortBy={sortBy}
              totalResults={sortedProducts.length}
              availableBrands={availableBrands}
              availableStores={availableStores}
              availableCategories={availableCategories}
              onFilterChange={onFilterChange}
              onSortChange={onSortChange}
              onResetFilters={onResetFilters}
            />

            <div className="mt-auto pt-4 border-t border-rose-100">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 rounded-xl bg-[#8E3B52] text-white font-semibold text-xs shadow-xs"
              >
                Apply Filters ({sortedProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
