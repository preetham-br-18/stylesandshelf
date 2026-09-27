import React, { useState } from 'react';
import { 
  Heart, Star, ExternalLink, ArrowLeft, Copy, Check, 
  ShieldCheck, Sparkles, Tag, ShoppingBag, Share2, Info, Trash2
} from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from './ProductCard';
import { User } from 'firebase/auth';

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
  adminUser?: User | null;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onDeleteProduct?: (id: number | string) => void;
  onOpenLegal: (type: 'disclosure' | 'privacy' | 'terms') => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  allProducts,
  adminUser,
  onBack,
  onSelectProduct,
  onBuyNow,
  onDeleteProduct,
  onOpenLegal
}) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [imgError, setImgError] = useState(false);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const savings = product.originalPrice - product.price;

  // Recommendations: same category or brand, excluding current
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-in fade-in duration-300">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          id="back-to-browse-btn"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-950 transition-colors py-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-stone-400">
          <span className="hidden sm:inline">Discovery</span>
          <span className="hidden sm:inline">/</span>
          <span className="text-stone-600 font-medium">{product.category}</span>
          <span>/</span>
          <span className="text-rose-900 font-medium truncate max-w-[120px] sm:max-w-[200px]">
            {product.brand}
          </span>
        </div>
      </div>

      {/* Admin Action Bar */}
      {adminUser && onDeleteProduct && (
        <div className="mb-6 p-3 sm:p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-950">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Admin Active • Item #{product.id} ({product.category})</span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Permanently remove "${product.name}" from the store catalog?`)) {
                onDeleteProduct(product.id);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Product</span>
          </button>
        </div>
      )}

      {/* Main Product Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-2xl p-4 sm:p-8 border border-rose-100/70 shadow-xs">
        
        {/* Left: Visual Gallery / Large Image */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="relative aspect-4/5 w-full rounded-xl overflow-hidden bg-[#FAF6F6] border border-rose-100/60 shadow-2xs">
            {imgError ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-stone-400">
                <ShoppingBag className="w-12 h-12 text-stone-300 mb-2" />
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">{product.brand}</span>
                <span className="text-base font-serif mt-1 text-stone-800">{product.name}</span>
              </div>
            ) : (
              <img
                src={product.image}
                alt={product.name}
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            )}

            {/* Badges on Image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.discount > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#8E3B52] text-white shadow-xs">
                  {product.discount}% OFF
                </span>
              )}
              {product.bestseller && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-100 text-amber-900 border border-amber-200">
                  Bestseller
                </span>
              )}
            </div>

            {/* Retailer Verified Watermark */}
            <div className="absolute bottom-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-white/95 text-stone-800 shadow-xs border border-stone-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Available at {product.store}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Editorial & Purchase Details */}
        <div className="lg:col-span-6 flex flex-col">
          
          {/* Brand & Category Strip */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#8E3B52]">
              {product.brand}
            </span>
            <div className="flex items-center gap-2">
              <button
                id="share-product-btn"
                type="button"
                onClick={handleShare}
                className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                title="Share link"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                id={`detail-wishlist-${product.id}`}
                type="button"
                onClick={() => toggleWishlist(product.id, product.name)}
                className="p-2 rounded-full text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                aria-label="Wishlist toggle"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-[#C46D82] text-[#C46D82]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Product Full Name */}
          <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-bold leading-tight mb-3">
            {product.name}
          </h1>

          {/* Rating & Verified Reviews */}
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-rose-100/60">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-semibold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-stone-500">
              {product.reviews.toLocaleString()} ratings &amp; customer reviews on {product.store}
            </span>
          </div>

          {/* Pricing Box */}
          <div className="bg-[#FAF6F6] rounded-xl p-4 sm:p-5 mb-6 border border-rose-100">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-extrabold text-stone-950">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-stone-400 line-through">
                  MRP {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8E3B52] text-white">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {savings > 0 && (
              <p className="text-xs text-emerald-800 font-semibold mt-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                <span>You save {formatPrice(savings)} today ({product.discount}% discount)</span>
              </p>
            )}

            {/* Coupon Code Strip if available */}
            {product.coupon && (
              <div className="mt-3.5 pt-3 border-t border-rose-200/60 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-700">Promo Coupon:</span>
                  <code className="px-2.5 py-1 rounded bg-white font-mono text-xs font-bold text-[#8E3B52] border border-dashed border-rose-300">
                    {product.coupon}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCoupon(product.coupon!)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#8E3B52] hover:text-[#6a2537] cursor-pointer"
                >
                  {copiedCoupon ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Primary BUY NOW Affiliate CTA Button (PRD Section 15 & 16) */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              id="product-buy-now-cta"
              type="button"
              onClick={() => onBuyNow(product)}
              className="w-full py-4 px-6 rounded-xl bg-[#8E3B52] hover:bg-[#783145] active:bg-[#632737] text-white font-bold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>BUY NOW AT {product.store.toUpperCase()}</span>
              <ExternalLink className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <p className="text-[11px] text-center text-stone-500">
              Direct secure redirect to {product.store}. Checkout, payment &amp; delivery handled by retailer.
            </p>
          </div>

          {/* Mandatory Affiliate Disclosure Box (PRD Section 17) */}
          <div className="bg-rose-50/50 rounded-xl p-3.5 border border-rose-200/60 mb-6 text-xs text-stone-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#8E3B52] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-900">Affiliate Disclosure:</span> Some links on Style &amp; Shelf are affiliate links. If you purchase through one of these links, we may earn a commission at no additional cost to you.{' '}
              <button 
                onClick={() => onOpenLegal('disclosure')}
                className="underline text-[#8E3B52] hover:text-rose-900 font-medium cursor-pointer"
              >
                Learn more
              </button>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Editorial Overview
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Key Specifications / Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Key Highlights
                </h3>
                <ul className="space-y-1.5">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
                      <Sparkles className="w-3.5 h-3.5 text-[#8E3B52] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Recommendations Strip */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 sm:mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                You May Also Like
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Curated recommendations from {product.category}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(rel => (
              <ProductCard
                key={rel.id}
                product={rel}
                onSelect={onSelectProduct}
                onQuickBuy={onBuyNow}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
