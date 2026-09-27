import React, { useState, useEffect, useCallback } from 'react';
import { Product, FilterState, SortOption, ProductCategory, DiscoveryType, ActiveView } from './types';
import { WishlistProvider } from './context/WishlistContext';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { StoreView } from './components/StoreView';
import { SearchCategoryView } from './components/SearchCategoryView';
import { ProductDetail } from './components/ProductDetail';
import { WishlistView } from './components/WishlistView';
import { AccountView } from './components/AccountView';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { AffiliateRedirectModal } from './components/AffiliateRedirectModal';
import { LegalModal } from './components/LegalModals';
import { trackEvent } from './lib/analytics';
import { auth, logoutUser } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { loadStoredProducts, saveStoredProducts, resetCatalogToDefaults, removeProductFromStore } from './lib/productStore';

export default function App() {
  // 1. Catalog State (persisted via productStore)
  const [products, setProducts] = useState<Product[]>(() => loadStoredProducts());

  // Listen for catalog sync updates
  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<Product[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setProducts(customEvent.detail);
      }
    };
    window.addEventListener('style-shelf-catalog-sync', handleSync);
    return () => window.removeEventListener('style-shelf-catalog-sync', handleSync);
  }, []);

  // 2. Navigation State
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 3. Admin Auth State
  const [adminUser, setAdminUser] = useState<User | null>(() => auth?.currentUser || null);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 4. Filter & Sort State
  const initialFilters: FilterState = {
    category: 'All',
    subcategory: 'All',
    priceRange: 'all',
    discount: 0,
    rating: 0,
    type: 'all',
    brand: 'All',
    store: 'All',
    searchQuery: ''
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>('relevant');

  // 5. Modals State
  const [redirectProduct, setRedirectProduct] = useState<Product | null>(null);
  const [legalModalType, setLegalModalType] = useState<'disclosure' | 'privacy' | 'terms' | null>(null);

  // Sync with URL parameters on initial mount & back/forward
  useEffect(() => {
    const handleUrlState = () => {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      const catParam = params.get('category');
      const typeParam = params.get('type') as DiscoveryType | null;
      const searchParam = params.get('search');
      const productSlug = params.get('product') || window.location.hash.replace('#/product/', '');

      if (pathname.includes('/admin/login') || hash.includes('/admin/login') || viewParam === 'admin-login') {
        setActiveView('admin-login');
        return;
      }

      if (pathname === '/admin' || pathname.startsWith('/admin') || hash.includes('/admin') || viewParam === 'admin') {
        if (auth?.currentUser) {
          setActiveView('admin');
        } else {
          setActiveView('admin-login');
        }
        return;
      }

      if (pathname === '/store' || hash.includes('/store') || viewParam === 'store') {
        setActiveView('store');
        return;
      }

      if (productSlug) {
        const found = products.find(p => p.slug === productSlug || String(p.id) === productSlug);
        if (found) {
          setSelectedProduct(found);
          setActiveView('product');
          return;
        }
      }

      if (searchParam) {
        const trimmed = searchParam.trim().toLowerCase();
        const directMatch = products.find(p => 
          p.name.toLowerCase() === trimmed ||
          p.slug.toLowerCase() === trimmed ||
          p.name.toLowerCase().includes(trimmed) ||
          p.brand.toLowerCase().includes(trimmed)
        );
        if (directMatch) {
          setSelectedProduct(directMatch);
          setActiveView('product');
          return;
        }

        setFilters(prev => ({ ...prev, searchQuery: searchParam }));
        setActiveView('search');
        return;
      }

      if (typeParam && ['trending', 'bestseller', 'deals'].includes(typeParam)) {
        setFilters(prev => ({ ...prev, type: typeParam, category: (catParam as ProductCategory) || 'All' }));
        setActiveView('category');
        return;
      }

      if (catParam && ['Beauty', 'Fashion', 'Lifestyle'].includes(catParam)) {
        setFilters(prev => ({ ...prev, category: catParam as ProductCategory, type: 'all' }));
        setActiveView('category');
        return;
      }
    };

    handleUrlState();
    window.addEventListener('popstate', handleUrlState);
    return () => window.removeEventListener('popstate', handleUrlState);
  }, [products]);

  // Handle URL updates smoothly without full reloads
  const updateUrl = useCallback((view: ActiveView, options?: { category?: string; type?: string; productSlug?: string; search?: string }) => {
    try {
      const url = new URL(window.location.href);
      url.search = '';
      url.hash = '';

      if (view === 'admin-login') {
        url.pathname = '/admin/login';
      } else if (view === 'admin') {
        url.pathname = '/admin';
      } else if (view === 'store') {
        url.pathname = '/';
        url.searchParams.set('view', 'store');
      } else {
        url.pathname = '/';
        if (view === 'product' && options?.productSlug) {
          url.searchParams.set('product', options.productSlug);
        } else if (view === 'search' && options?.search) {
          url.searchParams.set('search', options.search);
        } else if (view === 'category') {
          if (options?.category && options.category !== 'All') {
            url.searchParams.set('category', options.category);
          }
          if (options?.type && options.type !== 'all') {
            url.searchParams.set('type', options.type);
          }
        }
      }
      window.history.pushState({}, '', url.toString());
    } catch {
      // safe fallback if in sandboxed iframe without history permissions
    }
  }, []);

  const handleNavigate = (view: ActiveView, options?: { category?: ProductCategory | 'All'; type?: DiscoveryType }) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('page_view', { view, ...options });

    if (view === 'admin' || view === 'admin-login') {
      if (adminUser) {
        setActiveView('admin');
        updateUrl('admin');
      } else {
        setActiveView('admin-login');
        updateUrl('admin-login');
      }
      return;
    }

    if (view === 'category' || view === 'search') {
      setFilters(prev => ({
        ...prev,
        category: options?.category !== undefined ? options.category : prev.category,
        type: options?.type !== undefined ? options.type : 'all'
      }));
      updateUrl(view, { category: options?.category, type: options?.type });
    } else {
      updateUrl(view);
    }

    setActiveView(view);
    setSelectedProduct(null);
  };

  const handleAdminLoginSuccess = (user: User) => {
    setAdminUser(user);
    setActiveView('admin');
    updateUrl('admin');
  };

  const handleAdminSignOut = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    setAdminUser(null);
    setActiveView('home');
    updateUrl('home');
  };

  const handleSearchSubmit = (q: string) => {
    const trimmed = q.trim().toLowerCase();
    if (trimmed) {
      // Direct product match: exact title/slug, title contains, brand contains, or subcategory contains
      const exactMatch = products.find(p => p.name.toLowerCase() === trimmed || p.slug.toLowerCase() === trimmed);
      const titleMatch = products.find(p => p.name.toLowerCase().includes(trimmed));
      const brandMatch = products.find(p => p.brand.toLowerCase() === trimmed || p.brand.toLowerCase().includes(trimmed));
      const subCatMatch = products.find(p => p.subcategory && p.subcategory.toLowerCase().includes(trimmed));
      const descMatch = products.find(p => p.description.toLowerCase().includes(trimmed));

      const directMatch = exactMatch || titleMatch || brandMatch || subCatMatch || descMatch;
      if (directMatch) {
        handleSelectProduct(directMatch);
        return;
      }
    }

    setFilters(prev => ({ ...prev, searchQuery: q }));
    setActiveView('search');
    updateUrl('search', { search: q });
    trackEvent('search', { query: q });
  };

  const handleSelectProduct = (product: Product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedProduct(product);
    setActiveView('product');
    updateUrl('product', { productSlug: product.slug });
    trackEvent('product_view', { productId: product.id, name: product.name, store: product.store });
  };

  const handleBuyNow = (product: Product) => {
    setRedirectProduct(product);
  };

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    trackEvent('filter_used', { key, value });
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveStoredProducts(newProducts);
    if (selectedProduct && !newProducts.some(p => String(p.id) === String(selectedProduct.id))) {
      setSelectedProduct(null);
      if (activeView === 'product') {
        setActiveView('store');
      }
    }
  };

  const handleResetCatalogToDefault = () => {
    const initial = resetCatalogToDefaults();
    setProducts(initial);
  };

  return (
    <WishlistProvider>
      <div className="min-h-screen flex flex-col bg-[#FCF9F9] text-[#1E1B1E] font-sans selection:bg-rose-100 selection:text-rose-900">
        
        {/* Navigation & Header (Hidden when inside full Admin Dashboard) */}
        {activeView !== 'admin' && (
          <Header
            activeView={activeView}
            currentCategory={filters.category}
            currentType={filters.type}
            searchQuery={filters.searchQuery}
            products={products}
            onSearchChange={(q) => setFilters(prev => ({ ...prev, searchQuery: q }))}
            onSearchSubmit={handleSearchSubmit}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
            onOpenLegal={(type) => setLegalModalType(type)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1">
          {activeView === 'home' && (
            <HomeView
              products={products}
              onSelectProduct={handleSelectProduct}
              onQuickBuy={handleBuyNow}
              onNavigateCategory={(cat, type) => handleNavigate('category', { category: cat, type: type || 'all' })}
              onFilterByBrand={(brand) => {
                setFilters(prev => ({ ...prev, brand, category: 'All' }));
                setActiveView('search');
              }}
              onNavigateStore={() => handleNavigate('store')}
              onOpenLegal={(type) => setLegalModalType(type)}
            />
          )}

          {activeView === 'store' && (
            <StoreView
              products={products}
              adminUser={adminUser}
              onSelectProduct={handleSelectProduct}
              onQuickBuy={handleBuyNow}
              onUpdateProducts={handleUpdateProducts}
              onOpenAdminDashboard={() => handleNavigate('admin')}
              onOpenAdminLogin={() => handleNavigate('admin-login')}
            />
          )}

          {(activeView === 'category' || activeView === 'search' || activeView === 'deals') && (
            <SearchCategoryView
              products={products}
              filters={filters}
              sortBy={sortBy}
              onFilterChange={handleFilterChange}
              onSortChange={setSortBy}
              onResetFilters={handleResetFilters}
              onSelectProduct={handleSelectProduct}
              onQuickBuy={handleBuyNow}
            />
          )}

          {activeView === 'product' && selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              allProducts={products}
              adminUser={adminUser}
              onBack={() => handleNavigate('store')}
              onSelectProduct={handleSelectProduct}
              onBuyNow={handleBuyNow}
              onDeleteProduct={(id) => {
                const updated = removeProductFromStore(id, products);
                handleUpdateProducts(updated);
                handleNavigate('store');
              }}
              onOpenLegal={(type) => setLegalModalType(type)}
            />
          )}

          {activeView === 'wishlist' && (
            <WishlistView
              products={products}
              onSelectProduct={handleSelectProduct}
              onBuyNow={handleBuyNow}
              onExplore={() => handleNavigate('home')}
            />
          )}

          {activeView === 'account' && (
            <AccountView
              products={products}
              onNavigate={handleNavigate}
              onSelectProduct={handleSelectProduct}
              onBuyNow={handleBuyNow}
              onOpenLegal={(type) => setLegalModalType(type)}
            />
          )}

          {activeView === 'admin-login' && (
            <AdminLogin
              onLoginSuccess={handleAdminLoginSuccess}
              onBackToStore={() => handleNavigate('home')}
            />
          )}

          {activeView === 'admin' && (
            adminUser ? (
              <AdminDashboard
                products={products}
                currentUser={adminUser}
                onUpdateProducts={handleUpdateProducts}
                onResetCatalog={handleResetCatalogToDefault}
                onSignOut={handleAdminSignOut}
                onBackToStore={() => handleNavigate('home')}
              />
            ) : (
              <AdminLogin
                onLoginSuccess={handleAdminLoginSuccess}
                onBackToStore={() => handleNavigate('home')}
              />
            )
          )}
        </main>

        {/* Reusable Outbound Affiliate Redirect Modal (PRD Section 16 & 37) */}
        <AffiliateRedirectModal
          product={redirectProduct}
          isOpen={redirectProduct !== null}
          onClose={() => setRedirectProduct(null)}
        />

        {/* Legal Transparency Modals (PRD Section 17 & 58) */}
        <LegalModal
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
        />

        {/* Editorial Footer (Hidden in full Admin Dashboard) */}
        {activeView !== 'admin' && (
          <Footer
            onNavigate={handleNavigate}
            onOpenLegal={(type) => setLegalModalType(type)}
          />
        )}

      </div>
    </WishlistProvider>
  );
}
