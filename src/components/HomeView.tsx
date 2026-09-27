import React from 'react';
import { 
  Sparkles, Flame, Tag, ArrowRight, ShieldCheck, 
  ShoppingBag, Award, HeartHandshake, CheckCircle2, ChevronRight
} from 'lucide-react';
import { Product, ProductCategory, DiscoveryType } from '../types';
import { ProductCard } from './ProductCard';

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  onNavigateCategory: (category: ProductCategory | 'All', type?: DiscoveryType) => void;
  onFilterByBrand: (brand: string) => void;
  onNavigateStore?: () => void;
  onOpenLegal: (type: 'disclosure' | 'privacy' | 'terms') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onSelectProduct,
  onQuickBuy,
  onNavigateCategory,
  onFilterByBrand,
  onNavigateStore,
  onOpenLegal
}) => {
  // Trending products (featured === true)
  const trendingProducts = products.filter(p => p.featured).slice(0, 4);
  // Best Sellers (bestseller === true)
  const bestsellerProducts = products.filter(p => p.bestseller).slice(0, 4);

  const categories = [
    {
      name: 'Beauty',
      sub: 'Makeup, Skincare, Hair Care & Fragrance',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
      category: 'Beauty' as ProductCategory
    },
    {
      name: 'Fashion',
      sub: 'Dresses, Tops, Bags, Shoes & Accents',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
      category: 'Fashion' as ProductCategory
    },
    {
      name: 'Lifestyle',
      sub: 'Home Accents, Self Care & Workspace',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
      category: 'Lifestyle' as ProductCategory
    }
  ];

  const brandShowcase = [
    'Lakmé',
    'Maybelline New York',
    'Minimalist',
    'Nykaa',
    'H&M',
    'ZARA',
    'Forest Essentials',
    'Blue Heaven',
    'Plum',
    'Chumbak'
  ];

  const collections = [
    { title: 'Daily Beauty Ritual', desc: 'Serums, cleansers and radiant primers', category: 'Beauty' as ProductCategory },
    { title: 'Capsule Wardrobe', desc: 'Linen essentials and tailored silhouettes', category: 'Fashion' as ProductCategory },
    { title: 'Self-Care Sanctuary', desc: 'Aromatherapy candles and botanical scrubs', category: 'Lifestyle' as ProductCategory },
    { title: 'Statement Accents', desc: 'Structured totes, ceramics and mugs', category: 'Lifestyle' as ProductCategory }
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* SECTION 4 — HERO (PRD Section 10) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FCEEF1] via-[#FAF3F4] to-[#FCF9F9] border-b border-rose-100/60 pt-12 pb-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-rose-200/80 shadow-2xs text-xs font-semibold text-[#8E3B52] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Affiliate Discovery Platform</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Discover products <span className="italic font-normal text-[#8E3B52]">you’ll love</span>.
          </h1>

          <p className="font-sans text-sm sm:text-lg text-stone-600 max-w-2xl mx-auto mt-4 sm:mt-5 leading-relaxed">
            Curated beauty, fashion and lifestyle finds from Myntra, Amazon, Nykaa and trusted retailers across India.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8">
            {onNavigateStore && (
              <button
                id="hero-explore-store-btn"
                type="button"
                onClick={onNavigateStore}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#8E3B52] hover:bg-[#783145] active:bg-[#632737] text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore All Store Products</span>
              </button>
            )}

            <button
              id="hero-explore-trending-btn"
              type="button"
              onClick={() => onNavigateCategory('All', 'trending')}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-full font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                onNavigateStore 
                  ? 'bg-white hover:bg-rose-50/60 text-stone-900 border border-stone-200 shadow-2xs hover:border-rose-300' 
                  : 'bg-[#8E3B52] hover:bg-[#783145] text-white shadow-xs'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Explore Trending</span>
            </button>

            <button
              id="hero-view-bestsellers-btn"
              type="button"
              onClick={() => onNavigateCategory('All', 'bestseller')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-rose-50/60 text-stone-900 font-semibold text-xs sm:text-sm border border-stone-200 shadow-2xs hover:border-rose-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Best Sellers</span>
            </button>
          </div>

          {/* Trust Clarification Badge */}
          <p className="text-[11px] text-stone-400 mt-6 max-w-lg mx-auto">
            Direct affiliate referral to retailer platforms. Fulfillment, payments &amp; shipping handled securely by retailer.
          </p>
        </div>
      </section>

      {/* SECTION 6 — BENEFITS / TRUST AREA (PRD Section 10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 bg-white rounded-2xl p-4 sm:p-6 border border-rose-100 shadow-xs">
          
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#8E3B52] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Curated Finds</h4>
              <p className="text-[11px] text-stone-500">Hand-selected editorial picks</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Trending Now</h4>
              <p className="text-[11px] text-stone-500">Real-time popular finds</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Great Deals</h4>
              <p className="text-[11px] text-stone-500">Up to 78% OFF + coupons</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Trusted Retailers</h4>
              <p className="text-[11px] text-stone-500">Myntra, Amazon &amp; Nykaa</p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5 — CATEGORY STRIP (PRD Section 10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Explore by Category
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Refined product discovery across beauty, fashion &amp; lifestyle
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              id={`cat-card-${cat.name.toLowerCase()}`}
              onClick={() => onNavigateCategory(cat.category)}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all border border-rose-100"
            >
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs uppercase tracking-widest text-rose-200 font-semibold mb-1">
                  Discover
                </span>
                <h3 className="font-serif text-2xl font-bold mb-1 group-hover:text-rose-100 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-1 mb-3">
                  {cat.sub}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:underline">
                  <span>Browse Category</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7 — TRENDING PRODUCTS (PRD Section 10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8E3B52] mb-1">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Trending Now</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Featured Trending Finds
            </h2>
          </div>

          <button
            onClick={() => onNavigateCategory('All', 'trending')}
            className="text-xs sm:text-sm font-semibold text-[#8E3B52] hover:text-[#6a2537] flex items-center gap-1 cursor-pointer"
          >
            <span>View All Trending</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={onSelectProduct}
              onQuickBuy={onQuickBuy}
            />
          ))}
        </div>
      </section>

      {/* SECTION 9 — DEAL BANNER (PRD Section 10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#8E3B52] via-[#7A2E44] to-[#5C1E30] rounded-2xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              Limited-Time Retailer Deals
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Up to 78% OFF Curated Beauty &amp; Fashion
            </h3>
            <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
              Hand-picked discounts with verified promo codes from Myntra, Amazon, and Nykaa. Save big on bridal sets, linen wraps &amp; skincare.
            </p>
          </div>

          <div className="z-10 shrink-0">
            <button
              id="deal-banner-cta"
              type="button"
              onClick={() => onNavigateCategory('All', 'deals')}
              className="px-6 py-3.5 rounded-full bg-white text-[#8E3B52] hover:bg-rose-50 font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Shop Deals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8 — BEST SELLERS (PRD Section 10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
              <Award className="w-4 h-4" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Best Sellers
            </h2>
          </div>

          <button
            onClick={() => onNavigateCategory('All', 'bestseller')}
            className="text-xs sm:text-sm font-semibold text-[#8E3B52] hover:text-[#6a2537] flex items-center gap-1 cursor-pointer"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellerProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={onSelectProduct}
              onQuickBuy={onQuickBuy}
            />
          ))}
        </div>
      </section>

      {/* SECTION 10 — CURATED COLLECTIONS (PRD Section 10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Curated Collections
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Carefully assembled themes for your lifestyle &amp; wardrobe
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((col, idx) => (
            <div
              key={idx}
              onClick={() => onNavigateCategory(col.category)}
              className="bg-white rounded-xl p-5 border border-rose-100 hover:border-rose-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8E3B52] mb-1 block">
                Collection {idx + 1}
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#8E3B52] transition-colors">
                {col.title}
              </h3>
              <p className="text-xs text-stone-500 mt-1 mb-4">
                {col.desc}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 group-hover:text-[#8E3B52]">
                <span>Explore</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 11 — BRANDS SHOWCASE (PRD Section 10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-rose-100 text-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
            Top Retailer &amp; Verified Brands
          </h3>
          <p className="font-serif text-lg font-bold text-stone-800 mb-6">
            Discover official products from leading beauty &amp; fashion houses
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {brandShowcase.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => onFilterByBrand(brand)}
                className="px-4 py-2 rounded-full bg-[#FAF6F6] hover:bg-rose-50 text-stone-700 hover:text-[#8E3B52] border border-rose-100 text-xs font-medium transition-colors cursor-pointer"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
