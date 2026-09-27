import React, { useState } from 'react';
import { Heart, Star, ExternalLink, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickBuy?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onQuickBuy }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const [imgError, setImgError] = useState(false);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white rounded-xl border border-rose-100/60 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Visual Image Container */}
      <div 
        className="relative aspect-4/5 w-full overflow-hidden bg-[#FAF6F6] cursor-pointer"
        onClick={() => onSelect(product)}
      >
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-stone-400 bg-stone-100">
            <span className="text-xs uppercase tracking-wider font-medium text-stone-500">{product.brand}</span>
            <span className="text-sm font-serif mt-1 text-stone-700 line-clamp-2">{product.name}</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-300 ease-out"
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#8E3B52] text-white shadow-xs">
              {product.discount}% OFF
            </span>
          )}
          {product.bestseller && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-amber-100 text-amber-900 border border-amber-200">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id, product.name);
          }}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs hover:bg-white text-stone-600 transition-transform active:scale-90"
        >
          <Heart
            className={`w-4.5 h-4.5 transition-colors ${
              wishlisted ? 'fill-[#C46D82] text-[#C46D82]' : 'text-stone-600 hover:text-[#C46D82]'
            }`}
          />
        </button>

        {/* Store pill floating on image */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/95 text-stone-800 backdrop-blur-xs shadow-2xs border border-stone-200/50">
            {product.store}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        {/* Brand & Rating */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-800/80 truncate">
            {product.brand}
          </span>
          <div className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-700 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-stone-400">({product.reviews.toLocaleString()})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => onSelect(product)}
          className="text-sm font-medium text-stone-900 line-clamp-2 leading-snug cursor-pointer hover:text-rose-900 transition-colors mb-2.5"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Pricing Block */}
        <div className="mt-auto pt-2 border-t border-rose-50/80">
          <div className="flex items-baseline gap-2 flex-wrap mb-3">
            <span className="text-base sm:text-lg font-bold text-stone-950">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discount > 0 && (
              <span className="text-xs font-semibold text-[#8E3B52]">
                Save {product.discount}%
              </span>
            )}
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-2">
            <button
              id={`view-details-${product.id}`}
              type="button"
              onClick={() => onSelect(product)}
              className="w-full py-2 px-2.5 rounded-lg border border-stone-200 text-stone-700 hover:border-rose-200 hover:bg-rose-50/40 text-xs font-medium transition-colors text-center truncate cursor-pointer flex items-center justify-center gap-1"
            >
              <span>View Details</span>
            </button>

            <button
              id={`buy-now-card-${product.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onQuickBuy) {
                  onQuickBuy(product);
                } else {
                  onSelect(product);
                }
              }}
              className="w-full py-2 px-2.5 rounded-lg bg-[#8E3B52] hover:bg-[#783145] active:bg-[#632737] text-white text-xs font-semibold transition-colors text-center truncate cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
            >
              <span>Buy Now</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
