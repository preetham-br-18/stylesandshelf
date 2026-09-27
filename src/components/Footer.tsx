import React from 'react';
import { ShieldCheck, Heart, Sparkles, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { ProductCategory, DiscoveryType, ActiveView } from '../types';

interface FooterProps {
  onNavigate: (view: ActiveView, options?: { category?: ProductCategory | 'All'; type?: DiscoveryType }) => void;
  onOpenLegal: (type: 'disclosure' | 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenLegal
}) => {
  return (
    <footer className="bg-[#1E1B1E] text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-stone-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-serif text-2xl font-bold tracking-wider text-white uppercase block">
              Style &amp; Shelf
            </span>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Curated product discovery &amp; recommendation platform for beauty, fashion, and lifestyle finds in India. Connecting you with trusted retailers like Myntra, Amazon, and Nykaa.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Independent editorial curation &amp; verified deals</span>
            </div>
          </div>

          {/* Categories Col */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button 
                  onClick={() => onNavigate('category', { category: 'Beauty' })}
                  className="hover:text-rose-200 transition-colors"
                >
                  Beauty &amp; Skincare
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('category', { category: 'Fashion' })}
                  className="hover:text-rose-200 transition-colors"
                >
                  Fashion &amp; Apparel
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('category', { category: 'Lifestyle' })}
                  className="hover:text-rose-200 transition-colors"
                >
                  Home &amp; Lifestyle
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('store')}
                  className="hover:text-rose-200 transition-colors font-medium text-rose-100"
                >
                  Store (All Products)
                </button>
              </li>
            </ul>
          </div>

          {/* Highlights Col */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Discover
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button 
                  onClick={() => onNavigate('category', { type: 'trending' })}
                  className="hover:text-rose-200 transition-colors"
                >
                  Trending Now
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('category', { type: 'bestseller' })}
                  className="hover:text-rose-200 transition-colors"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('category', { type: 'deals' })}
                  className="hover:text-rose-200 transition-colors"
                >
                  Deals &amp; Discounts
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('wishlist')}
                  className="hover:text-rose-200 transition-colors"
                >
                  Your Saved Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Tools Col */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Transparency
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button 
                  onClick={() => onOpenLegal('disclosure')}
                  className="hover:text-rose-200 transition-colors text-left"
                >
                  Affiliate Disclosure
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-rose-200 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-rose-200 transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  id="footer-admin-btn"
                  onClick={() => onNavigate('admin-login')}
                  className="text-stone-400 hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Affiliate Disclosure Paragraph */}
        <div className="pt-6 pb-4 text-[11px] text-stone-500 leading-relaxed max-w-4xl">
          <p>
            <strong className="text-stone-400 font-semibold">Affiliate Disclosure:</strong> Style &amp; Shelf is an affiliate recommendation service. When you purchase through links on our site, we may earn an affiliate commission from our merchant partners at no extra cost to you. Style &amp; Shelf does not process payments, store customer credit card details, warehouse physical goods, or handle order shipping and returns; all transactions are securely executed by the respective retailer.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Style &amp; Shelf. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onOpenLegal('disclosure')} className="hover:underline">
              Affiliate Notice
            </button>
            <span>•</span>
            <button onClick={() => onOpenLegal('privacy')} className="hover:underline">
              Privacy
            </button>
            <span>•</span>
            <button onClick={() => onOpenLegal('terms')} className="hover:underline">
              Terms
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
