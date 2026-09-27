import React, { useEffect, useState } from 'react';
import { ExternalLink, ShieldCheck, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { Product } from '../types';
import { trackAffiliateClick } from '../lib/analytics';

interface AffiliateRedirectModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AffiliateRedirectModal: React.FC<AffiliateRedirectModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    if (!isOpen || !product) {
      setCountdown(2);
      return;
    }

    // Log the conversion event
    trackAffiliateClick(product);

    // Auto-countdown for convenience or manual click
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Trigger redirect
          window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer,sponsored');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleManualProceed = () => {
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer,sponsored');
    onClose();
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="affiliate-redirect-dialog"
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-100 relative text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Store Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#8E3B52] mx-auto mb-4">
          <ShoppingBag className="w-7 h-7" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-[#8E3B52]">
          Redirecting to {product.store}
        </span>

        <h3 className="font-serif text-lg font-bold text-stone-900 mt-1 mb-2">
          Taking you to the official deal
        </h3>

        <div className="p-3 bg-[#FAF6F6] rounded-xl border border-rose-100 mb-4 text-left">
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-14 h-14 object-cover rounded-lg shrink-0 border border-stone-200"
            />
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{product.brand}</p>
              <p className="text-xs font-semibold text-stone-900 truncate">{product.name}</p>
              <p className="text-xs font-bold text-[#8E3B52] mt-0.5">{formatPrice(product.price)}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-stone-500 mb-5 leading-relaxed">
          You are opening the authentic retailer website ({product.store}). Checkout, customer service, and order shipping are securely handled by the merchant.
        </p>

        <div className="space-y-2.5">
          <button
            id="proceed-to-retailer-btn"
            type="button"
            onClick={handleManualProceed}
            className="w-full py-3 px-4 rounded-xl bg-[#8E3B52] hover:bg-[#783145] active:bg-[#632737] text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue to {product.store}</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-3 text-xs text-stone-500 hover:text-stone-800 transition-colors"
          >
            Stay on Style &amp; Shelf
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-rose-100 text-[10px] text-stone-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Affiliate referral link • No extra cost to you</span>
        </div>
      </div>
    </div>
  );
};
