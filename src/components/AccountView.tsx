import React, { useEffect, useState } from 'react';
import { 
  User, Heart, Sparkles, Flame, Tag, ExternalLink, 
  Clock, ShieldCheck, Lock, LogOut, CheckCircle, ArrowRight, Edit3
} from 'lucide-react';
import { Product, AffiliateClickEvent, ActiveView, ProductCategory, DiscoveryType } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { getAffiliateClicks } from '../lib/analytics';
import { auth, logoutUser } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface AccountViewProps {
  products: Product[];
  onNavigate: (view: ActiveView, options?: { category?: ProductCategory | 'All'; type?: DiscoveryType }) => void;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onOpenLegal: (type: 'disclosure' | 'privacy' | 'terms') => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  products,
  onNavigate,
  onSelectProduct,
  onBuyNow,
  onOpenLegal
}) => {
  const { wishlistIds, wishlistCount } = useWishlist();
  const [clickHistory, setClickHistory] = useState<AffiliateClickEvent[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    setClickHistory(getAffiliateClicks());

    if (auth) {
      const unsub = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsub();
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Logout error:', err);
    }
  };

  const wishlistedProducts = products.filter(p => wishlistIds.includes(String(p.id)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-200">
      
      {/* Account Header Hero */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-rose-100 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#8E3B52] shrink-0 overflow-hidden">
              {user ? (
                <ShieldCheck className="w-8 h-8 text-[#8E3B52]" />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
                <span>{user ? 'Store Administrator Portal' : 'Shopper & Store Dashboard'}</span>
                {user && (
                  <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Admin Active
                  </span>
                )}
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                {user 
                  ? `Signed in as ${user.email} (Authorized to edit products)` 
                  : 'Track your wishlist and explore curated lifestyle products.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <>
                <button
                  id="go-to-admin-dashboard-btn"
                  onClick={() => onNavigate('admin')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8E3B52] hover:bg-[#783145] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Open Admin Dashboard (Edit Products)</span>
                </button>
                <button
                  id="firebase-logout-btn"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                id="admin-login-nav-btn"
                onClick={() => onNavigate('admin-login')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8E3B52] hover:bg-[#783145] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login (Edit Products)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards (PRD Section 19) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        
        {/* Wishlist Card */}
        <div 
          onClick={() => onNavigate('wishlist')}
          className="bg-white rounded-xl p-5 border border-rose-100 hover:border-rose-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-[#8E3B52] group-hover:bg-[#8E3B52] group-hover:text-white transition-colors">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#8E3B52] bg-rose-50 px-2 py-0.5 rounded-full">
              {wishlistCount} Saved
            </span>
          </div>
          <h3 className="font-semibold text-stone-900 text-sm group-hover:text-[#8E3B52] transition-colors">
            Your Wishlist
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Access items you've bookmarked to buy later.
          </p>
        </div>

        {/* Trending Now */}
        <div 
          onClick={() => onNavigate('category', { type: 'trending' })}
          className="bg-white rounded-xl p-5 border border-rose-100 hover:border-rose-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-semibold text-stone-900 text-sm group-hover:text-[#8E3B52] transition-colors">
            Trending Now
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Discover popular products catching attention today.
          </p>
        </div>

        {/* Best Sellers */}
        <div 
          onClick={() => onNavigate('category', { type: 'bestseller' })}
          className="bg-white rounded-xl p-5 border border-rose-100 hover:border-rose-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700 group-hover:bg-purple-700 group-hover:text-white transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-semibold text-stone-900 text-sm group-hover:text-[#8E3B52] transition-colors">
            Best Sellers
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            High-rated crowd favorites and verified bestsellers.
          </p>
        </div>

        {/* Deals & Coupons */}
        <div 
          onClick={() => onNavigate('category', { type: 'deals' })}
          className="bg-white rounded-xl p-5 border border-rose-100 hover:border-rose-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-semibold text-stone-900 text-sm group-hover:text-[#8E3B52] transition-colors">
            Deals &amp; Coupons
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Browse discounted finds and verified coupon codes.
          </p>
        </div>

      </div>

      {/* Two-Column Section: Wishlist Preview & Recent Clicked Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Wishlist Snapshot */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#8E3B52]" />
              <h2 className="font-serif text-base font-bold text-stone-900">
                Your Saved Wishlist ({wishlistedProducts.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigate('wishlist')}
              className="text-xs font-semibold text-[#8E3B52] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="py-8 text-center text-stone-400">
              <Heart className="w-10 h-10 mx-auto mb-2 text-stone-200" />
              <p className="text-xs font-medium text-stone-600">Your wishlist is empty</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Click the heart icon on any product to save it here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlistedProducts.slice(0, 4).map(prod => (
                <div 
                  key={prod.id}
                  onClick={() => onSelectProduct(prod)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF6F6] transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-900">{prod.brand}</span>
                      <p className="text-xs font-semibold text-stone-900 truncate">{prod.name}</p>
                      <span className="text-xs font-bold text-stone-900">₹{prod.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBuyNow(prod);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#8E3B52] text-white text-[11px] font-semibold shrink-0 hover:bg-[#783145]"
                  >
                    Buy Deal
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Clicked Deals / Referral Activity (PRD Section 36) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-600" />
              <h2 className="font-serif text-base font-bold text-stone-900">
                Recent Referral Activity ({clickHistory.length})
              </h2>
            </div>
            <span className="text-[11px] text-stone-400">Stored locally</span>
          </div>

          {clickHistory.length === 0 ? (
            <div className="py-8 text-center text-stone-400">
              <ExternalLink className="w-10 h-10 mx-auto mb-2 text-stone-200" />
              <p className="text-xs font-medium text-stone-600">No recent store clicks yet</p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                When you click "Buy Now" on any retailer deal, your history will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {clickHistory.slice(0, 6).map((click, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF6F6] border border-rose-100 text-xs">
                  <div className="overflow-hidden mr-2">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{click.store}</span>
                    <p className="font-semibold text-stone-900 truncate">{click.productName}</p>
                    <p className="text-[11px] text-stone-500">₹{click.price.toLocaleString('en-IN')}</p>
                  </div>
                  <a
                    href={click.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-[11px] shrink-0"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Trust Notice */}
      <div className="mt-8 p-4 rounded-xl bg-stone-100/70 border border-stone-200/80 text-xs text-stone-600 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-stone-900">Affiliate Discovery Commitment:</span> Style &amp; Shelf does not handle order shipments, warehouse goods, or collect payment details. All purchases are fulfilled safely by the verified retailers.{' '}
          <button onClick={() => onOpenLegal('disclosure')} className="underline text-stone-900 font-medium">
            Read Full Disclosure
          </button>
        </div>
      </div>

    </div>
  );
};
