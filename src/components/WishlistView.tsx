import React from 'react';
import { Heart, Trash2, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from './ProductCard';

interface WishlistViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onExplore: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  products,
  onSelectProduct,
  onBuyNow,
  onExplore
}) => {
  const { wishlistIds, clearWishlist, wishlistCount } = useWishlist();

  const wishlistedProducts = products.filter(p => wishlistIds.includes(String(p.id)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-200">
      
      {/* Title & Clear Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-rose-100">
        <div>
          <div className="flex items-center gap-2.5">
            <Heart className="w-6 h-6 fill-[#C46D82] text-[#C46D82]" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Your Saved Wishlist
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {wishlistCount === 0
              ? 'No products saved yet. Keep track of items you love while browsing.'
              : `${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'} saved locally in your browser.`}
          </p>
        </div>

        {wishlistCount > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-500 hover:text-rose-700 hover:bg-rose-50 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Wishlist</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 sm:p-16 border border-rose-100 text-center max-w-lg mx-auto shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-[#8E3B52] mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
            Your wishlist is waiting
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mb-6 leading-relaxed">
            Explore curated beauty, fashion, and lifestyle finds. Tap the heart icon on any card to save it here for quick referral anytime.
          </p>
          <button
            type="button"
            onClick={onExplore}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8E3B52] hover:bg-[#783145] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>Start Discovering</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickBuy={onBuyNow}
            />
          ))}
        </div>
      )}

      {/* Affiliate Reassurance */}
      <div className="mt-12 p-4 rounded-xl bg-stone-100/70 border border-stone-200/80 text-xs text-stone-600 flex items-center justify-between gap-4 flex-wrap">
        <span>Wishlist items are saved in your browser storage (<code className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border">style-shelf-wishlist</code>) without requiring an account.</span>
        <button
          onClick={onExplore}
          className="text-[#8E3B52] font-semibold hover:underline cursor-pointer"
        >
          Browse more products →
        </button>
      </div>

    </div>
  );
};
