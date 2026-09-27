import React, { useState, useRef, useEffect } from 'react';
import { Search, Heart, User, Menu, X, Sparkles, Tag, Flame, Compass, ChevronRight, ArrowRight, Lock, ShoppingBag } from 'lucide-react';
import { ProductCategory, DiscoveryType, ActiveView, Product } from '../types';
import { useWishlist } from '../context/WishlistContext';

interface HeaderProps {
  activeView: ActiveView;
  currentCategory: ProductCategory | 'All';
  currentType: DiscoveryType;
  searchQuery: string;
  products: Product[];
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: ActiveView, options?: { category?: ProductCategory | 'All'; type?: DiscoveryType }) => void;
  onOpenLegal: (type: 'disclosure' | 'privacy' | 'terms') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  currentCategory,
  currentType,
  searchQuery,
  products,
  onSearchChange,
  onSearchSubmit,
  onSelectProduct,
  onNavigate,
  onOpenLegal
}) => {
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        searchContainerRef.current && !searchContainerRef.current.contains(target) &&
        mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matchingSuggestions = React.useMemo(() => {
    const q = searchInput.trim().toLowerCase();
    if (!q) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [products, searchInput]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim().toLowerCase();
    if (!q) return;

    // 1. Direct matching to product
    const exactMatch = products.find(p => p.name.toLowerCase() === q || p.slug.toLowerCase() === q);
    const titleMatch = products.find(p => p.name.toLowerCase().includes(q));
    const brandMatch = products.find(p => p.brand.toLowerCase().includes(q));
    const subCatMatch = products.find(p => p.subcategory && p.subcategory.toLowerCase().includes(q));
    const descMatch = products.find(p => p.description.toLowerCase().includes(q));

    const directTarget = exactMatch || titleMatch || brandMatch || subCatMatch || descMatch;

    setShowSuggestions(false);
    if (directTarget) {
      onSelectProduct(directTarget);
      setSearchInput('');
      return;
    }

    onSearchSubmit(searchInput);
  };

  const handleSuggestionClick = (product: Product) => {
    setShowSuggestions(false);
    setSearchInput('');
    onSelectProduct(product);
  };

  const navLinks = [
    { label: 'Home', view: 'home' as ActiveView, active: activeView === 'home' },
    { 
      label: 'Store', 
      view: 'store' as ActiveView, 
      active: activeView === 'store',
      icon: ShoppingBag
    },
    { 
      label: 'Beauty', 
      view: 'category' as ActiveView, 
      category: 'Beauty' as ProductCategory, 
      active: activeView === 'category' && currentCategory === 'Beauty' && currentType === 'all'
    },
    { 
      label: 'Fashion', 
      view: 'category' as ActiveView, 
      category: 'Fashion' as ProductCategory, 
      active: activeView === 'category' && currentCategory === 'Fashion' && currentType === 'all'
    },
    { 
      label: 'Lifestyle', 
      view: 'category' as ActiveView, 
      category: 'Lifestyle' as ProductCategory, 
      active: activeView === 'category' && currentCategory === 'Lifestyle' && currentType === 'all'
    },
    { 
      label: 'Trending', 
      view: 'category' as ActiveView, 
      type: 'trending' as DiscoveryType, 
      icon: Flame,
      active: (activeView === 'category' || activeView === 'home') && currentType === 'trending'
    },
    { 
      label: 'Best Sellers', 
      view: 'category' as ActiveView, 
      type: 'bestseller' as DiscoveryType, 
      icon: Sparkles,
      active: activeView === 'category' && currentType === 'bestseller'
    },
    { 
      label: 'Deals', 
      view: 'category' as ActiveView, 
      type: 'deals' as DiscoveryType, 
      icon: Tag,
      active: activeView === 'category' && currentType === 'deals'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100/70 shadow-2xs">
      {/* Promotional Top Bar */}
      <div className="bg-[#1E1B1E] text-stone-200 text-xs py-1.5 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <span>✨ Discover better. Shop smarter. Curated beauty, fashion & lifestyle finds.</span>
        <button 
          onClick={() => onOpenLegal('disclosure')}
          className="underline text-stone-300 hover:text-white text-[11px] ml-1 transition-colors cursor-pointer"
        >
          Affiliate Disclosure
        </button>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="cursor-pointer flex flex-col items-center sm:items-start select-none group"
            id="brand-logo"
          >
            <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-wider text-[#1E1B1E] group-hover:text-[#8E3B52] transition-colors uppercase">
              Style &amp; Shelf
            </span>
            <span className="text-[10px] tracking-[0.25em] text-stone-500 uppercase -mt-0.5 hidden sm:block">
              Curated Discovery
            </span>
          </div>

          {/* Search Bar (Desktop & Tablet) */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl mx-2 hidden sm:block relative">
            <form onSubmit={handleFormSubmit} className="relative">
              <input
                id="desktop-search-input"
                type="text"
                placeholder="Search products (e.g. Lakmé, linen dress, serum, candle)..."
                value={searchInput}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  onSearchChange(e.target.value);
                  setShowSuggestions(true);
                }}
                className="w-full bg-[#FAF6F6] border border-rose-200/80 rounded-full py-2.5 pl-11 pr-10 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    onSearchChange('');
                    setShowSuggestions(false);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Live Autocomplete Dropdown - direct product links */}
            {showSuggestions && matchingSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-rose-100 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                <div className="px-3.5 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Direct Product Matches</span>
                  <span className="text-[10px] lowercase text-stone-400">click or press enter to open directly</span>
                </div>
                <div className="divide-y divide-rose-50">
                  {matchingSuggestions.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSuggestionClick(product)}
                      className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-rose-50/70 cursor-pointer transition-colors group"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-[#8E3B52] uppercase tracking-wider truncate">
                          {product.brand}
                        </div>
                        <div className="text-xs font-medium text-stone-900 truncate group-hover:text-[#8E3B52] transition-colors">
                          {product.name}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-stone-900">₹{product.price.toLocaleString('en-IN')}</div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-[#8E3B52] font-medium">
                          {product.store}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#8E3B52] shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions: Admin Login, Wishlist, Account */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Icon for Mobile */}
            <button
              id="mobile-search-btn"
              type="button"
              onClick={() => onNavigate('search')}
              className="sm:hidden p-2 rounded-full text-stone-700 hover:bg-stone-100"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Login Button */}
            <button
              id="header-admin-login-btn"
              type="button"
              onClick={() => onNavigate('admin-login')}
              title="Admin Login (Sign in to edit products)"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                activeView === 'admin' || activeView === 'admin-login'
                  ? 'bg-[#8E3B52] text-white shadow-xs'
                  : 'text-[#8E3B52] bg-rose-50 border border-rose-200 hover:bg-[#8E3B52] hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin Login</span>
            </button>

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              type="button"
              onClick={() => onNavigate('wishlist')}
              className="relative p-2 sm:px-3 sm:py-2 rounded-full text-stone-700 hover:bg-rose-50 hover:text-[#8E3B52] transition-colors flex items-center gap-1.5 cursor-pointer"
              aria-label="View your saved wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-rose-100 text-[#8E3B52]' : ''}`} />
              <span className="hidden sm:inline text-xs font-medium">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 sm:static sm:top-auto sm:right-auto inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full text-[11px] font-bold bg-[#8E3B52] text-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account / Dashboard Button */}
            <button
              id="header-account-btn"
              type="button"
              onClick={() => onNavigate('account')}
              className={`p-2 sm:px-3 sm:py-2 rounded-full text-stone-700 hover:bg-rose-50 hover:text-[#8E3B52] transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeView === 'account' ? 'bg-rose-50 text-[#8E3B52]' : ''
              }`}
              aria-label="View your personal dashboard and click history"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-medium">Account</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input Bar with Live Autocomplete */}
        <div ref={mobileSearchContainerRef} className="pb-3 sm:hidden relative">
          <form onSubmit={handleFormSubmit} className="relative">
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Search products directly..."
              value={searchInput}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchInput(e.target.value);
                onSearchChange(e.target.value);
                setShowSuggestions(true);
              }}
              className="w-full bg-[#FAF6F6] border border-rose-200/80 rounded-full py-2 pl-10 pr-9 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  onSearchChange('');
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>

          {/* Mobile Live Suggestions Dropdown */}
          {showSuggestions && matchingSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-rose-100 py-1.5 z-50 overflow-hidden">
              {matchingSuggestions.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-rose-50 cursor-pointer border-b border-rose-50 last:border-b-0"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#8E3B52] uppercase truncate">{product.brand}</p>
                    <p className="text-xs font-medium text-stone-800 truncate">{product.name}</p>
                  </div>
                  <span className="text-xs font-bold text-stone-900 shrink-0">₹{product.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Primary Navigation Bar */}
        <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 py-2 border-t border-rose-100/50">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  onNavigate(item.view, { category: item.category, type: item.type });
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  item.active
                    ? 'bg-[#8E3B52] text-white shadow-2xs'
                    : 'text-stone-700 hover:bg-rose-50 hover:text-[#8E3B52]'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-rose-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-2 pt-1">
            Browse Categories &amp; Highlights
          </div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(item.view, { category: item.category, type: item.type });
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-rose-50 text-[#8E3B52] font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {Icon ? <Icon className="w-4 h-4 text-[#8E3B52]" /> : <Compass className="w-4 h-4 text-stone-400" />}
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300" />
              </button>
            );
          })}

          <div className="pt-3 border-t border-rose-100 flex flex-col gap-2">
            <button
              id="mobile-admin-login-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('admin-login');
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl text-xs font-bold text-[#8E3B52] bg-rose-50 border border-rose-200 hover:bg-[#8E3B52] hover:text-white transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Admin Login (Edit Products)</span>
            </button>

            <div className="flex items-center justify-around text-xs text-stone-500 pt-1">
              <button onClick={() => { setMobileMenuOpen(false); onOpenLegal('disclosure'); }} className="hover:underline">
                Affiliate Disclosure
              </button>
              <span>•</span>
              <button onClick={() => { setMobileMenuOpen(false); onOpenLegal('privacy'); }} className="hover:underline">
                Privacy
              </button>
              <span>•</span>
              <button onClick={() => { setMobileMenuOpen(false); onOpenLegal('terms'); }} className="hover:underline">
                Terms
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
