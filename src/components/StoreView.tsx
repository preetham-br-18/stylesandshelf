import React, { useState, useMemo } from 'react';
import { 
  Plus, Edit3, Trash2, Search, Filter, Sparkles, Flame, Tag, 
  ExternalLink, ArrowLeft, CheckCircle2, AlertCircle, ShoppingBag, 
  SlidersHorizontal, X, ArrowDownUp, ShieldCheck, Star, Layers,
  ExternalLink as LinkIcon, Heart, Store as StoreIcon
} from 'lucide-react';
import { Product, ProductCategory, SortOption } from '../types';
import { User } from 'firebase/auth';
import { ProductCard } from './ProductCard';
import { 
  addProductToStore, 
  updateProductInStore, 
  removeProductFromStore 
} from '../lib/productStore';
import { PhotoUploader } from './PhotoUploader';

interface StoreViewProps {
  products: Product[];
  adminUser: User | null;
  onSelectProduct: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  onUpdateProducts: (products: Product[]) => void;
  onOpenAdminDashboard: () => void;
  onOpenAdminLogin: () => void;
}

interface ProductFormData {
  id?: number;
  name: string;
  slug: string;
  brand: string;
  category: string;
  customCategory: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  store: string;
  customStore: string;
  affiliateUrl: string;
  coupon: string;
  featured: boolean;
  bestseller: boolean;
  highlights: string;
}

const PRESET_CATEGORIES = [
  'Beauty',
  'Fashion',
  'Lifestyle',
  'Electronics & Gadgets',
  'Home & Living',
  'Fitness & Wellness',
  'Accessories & Jewelry',
  'Books & Stationery',
  'Footwear',
  'Kitchen & Dining',
  'Custom Category'
];

const PRESET_STORES = [
  'Amazon',
  'Myntra',
  'Flipkart',
  'Nykaa',
  'Ajio',
  'Meesho',
  'Zara',
  'H&M',
  'Tata CLiQ',
  'Custom Store'
];

const CURATED_IMAGE_PRESETS = [
  { label: 'Smartwatch / Tech', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80' },
  { label: 'Wireless Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Serum / Skincare', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80' },
  { label: 'Makeup / Lipstick', url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80' },
  { label: 'Dress / Fashion', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80' },
  { label: 'Sneakers / Shoes', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80' },
  { label: 'Tote Bag', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80' },
  { label: 'Aroma Candle', url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80' },
  { label: 'Ceramic Mug / Home', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80' },
  { label: 'Yoga Mat / Fitness', url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Leather Journal / Book', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' },
  { label: 'Sunglasses / Eyewear', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80' }
];

export const StoreView: React.FC<StoreViewProps> = ({
  products,
  adminUser,
  onSelectProduct,
  onQuickBuy,
  onUpdateProducts,
  onOpenAdminDashboard,
  onOpenAdminLogin
}) => {
  // Navigation & Filtering State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('relevant');

  // Modals & Notifications
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const initialForm: ProductFormData = {
    name: '',
    slug: '',
    brand: '',
    category: 'Beauty',
    customCategory: '',
    subcategory: '',
    price: 999,
    originalPrice: 1499,
    discount: 33,
    rating: 4.5,
    reviews: 120,
    image: '',
    description: '',
    store: 'Amazon',
    customStore: '',
    affiliateUrl: 'https://www.amazon.in',
    coupon: '',
    featured: false,
    bestseller: false,
    highlights: '100% Genuine, Fast Delivery, Verified Merchant Deal'
  };

  const [formData, setFormData] = useState<ProductFormData>(initialForm);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Collect all unique categories present in existing products
  const dynamicCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Unique stores present in current products
  const dynamicStores = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.store) set.add(p.store);
    });
    return Array.from(set).sort();
  }, [products]);

  // Combined category tabs for quick filter
  const categoryTabs = useMemo(() => {
    const base = ['All'];
    // Merge existing categories
    dynamicCategories.forEach(cat => {
      if (!base.includes(cat)) base.push(cat);
    });
    return base;
  }, [dynamicCategories]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Store filter
      if (selectedStore !== 'All' && p.store !== selectedStore) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchSub = p.subcategory ? p.subcategory.toLowerCase().includes(q) : false;
        const matchStore = p.store.toLowerCase().includes(q);
        const matchDesc = p.description ? p.description.toLowerCase().includes(q) : false;
        if (!matchName && !matchBrand && !matchCat && !matchSub && !matchStore && !matchDesc) {
          return false;
        }
      }

      // Price filter
      if (priceRange === 'under500' && p.price >= 500) return false;
      if (priceRange === 'under1000' && p.price >= 1000) return false;
      if (priceRange === '1000to2000' && (p.price < 1000 || p.price > 2000)) return false;
      if (priceRange === 'above2000' && p.price <= 2000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discount - a.discount;
      if (sortBy === 'popular') return b.reviews - a.reviews;
      if (sortBy === 'newest') return Number(b.id) - Number(a.id);
      return 0; // 'relevant' maintains default curation order
    });
  }, [products, selectedCategory, selectedStore, searchQuery, priceRange, sortBy]);

  // Calculate discount automatically when price or originalPrice changes
  const handlePriceUpdate = (price: number, originalPrice: number) => {
    let discount = 0;
    if (originalPrice > 0 && price <= originalPrice) {
      discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    setFormData(prev => ({
      ...prev,
      price,
      originalPrice,
      discount
    }));
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...initialForm,
      category: selectedCategory !== 'All' ? selectedCategory : 'Beauty'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    const isCustomCat = !PRESET_CATEGORIES.slice(0, -1).includes(product.category);
    const isCustomStore = !PRESET_STORES.slice(0, -1).includes(product.store);

    setFormData({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      category: isCustomCat ? 'Custom Category' : product.category,
      customCategory: isCustomCat ? product.category : '',
      subcategory: product.subcategory || '',
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      description: product.description,
      store: isCustomStore ? 'Custom Store' : product.store,
      customStore: isCustomStore ? product.store : '',
      affiliateUrl: product.affiliateUrl,
      coupon: product.coupon || '',
      featured: !!product.featured,
      bestseller: !!product.bestseller,
      highlights: product.highlights ? product.highlights.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine resolved category
    let finalCategory = formData.category;
    if (formData.category === 'Custom Category') {
      finalCategory = formData.customCategory.trim() || 'General';
    }

    // Determine resolved store
    let finalStore = formData.store;
    if (formData.store === 'Custom Store') {
      finalStore = formData.customStore.trim() || 'Online Store';
    }

    const highlightsArray = formData.highlights
      ? formData.highlights.split(',').map(h => h.trim()).filter(Boolean)
      : ['100% Genuine Retailer Item'];

    if (!formData.image || !formData.image.trim()) {
      showToast('Please upload a product photo before saving.');
      return;
    }

    if (editingProduct) {
      // Update existing product
      const updatedProduct: Product = {
        ...editingProduct,
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        category: finalCategory,
        subcategory: formData.subcategory.trim() || undefined,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        discount: Number(formData.discount),
        rating: Number(formData.rating),
        reviews: Number(formData.reviews),
        image: formData.image.trim(),
        description: formData.description.trim(),
        store: finalStore,
        affiliateUrl: formData.affiliateUrl.trim(),
        coupon: formData.coupon.trim() || undefined,
        featured: formData.featured,
        bestseller: formData.bestseller,
        highlights: highlightsArray
      };

      const updatedList = updateProductInStore(updatedProduct, products);
      onUpdateProducts(updatedList);
      showToast(`Updated "${updatedProduct.name}" in store catalog.`);
    } else {
      // Add new product
      const { updatedProducts, newProduct } = addProductToStore({
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        category: finalCategory,
        subcategory: formData.subcategory.trim() || undefined,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        discount: Number(formData.discount),
        rating: Number(formData.rating),
        reviews: Number(formData.reviews),
        image: formData.image.trim(),
        description: formData.description.trim(),
        store: finalStore,
        affiliateUrl: formData.affiliateUrl.trim(),
        coupon: formData.coupon.trim() || undefined,
        featured: formData.featured,
        bestseller: formData.bestseller,
        highlights: highlightsArray
      }, products);

      onUpdateProducts(updatedProducts);
      showToast(`Added new product "${newProduct.name}" to the store!`);
      // If added under a specific category, switch to it or stay on All
      if (selectedCategory !== 'All' && selectedCategory !== finalCategory) {
        setSelectedCategory('All');
      }
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmProduct) return;
    const removedName = deleteConfirmProduct.name;
    const updated = removeProductFromStore(deleteConfirmProduct.id, products);
    onUpdateProducts(updated);
    setDeleteConfirmProduct(null);
    showToast(`Removed "${removedName}" from store catalog.`);
  };

  return (
    <div className="min-h-screen bg-[#FCF9F9] pb-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-[#1E1B1E] text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 border border-stone-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Hero / Header Section */}
      <section className="bg-gradient-to-b from-[#FCEEF1] via-[#FAF3F4] to-[#FCF9F9] border-b border-rose-100/70 pt-8 pb-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-rose-200 shadow-2xs text-xs font-semibold text-[#8E3B52] mb-3">
                <StoreIcon className="w-3.5 h-3.5" />
                <span>Style &amp; Shelf Storefront</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
                All Store Products
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl mt-2 leading-relaxed">
                Discover all handpicked fashion, beauty, electronics, home decor &amp; lifestyle finds with verified retailer discounts.
              </p>
            </div>

            {/* Admin Store Bar Action */}
            <div className="flex flex-wrap items-center gap-3">
              {adminUser ? (
                <div className="flex flex-wrap items-center gap-2 bg-white/90 p-2.5 rounded-2xl border border-rose-200 shadow-xs">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Admin Active</span>
                  </div>

                  <button
                    id="store-add-product-btn"
                    type="button"
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8E3B52] hover:bg-[#783145] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product to Store</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenAdminDashboard}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-stone-500" />
                    <span>Admin Portal</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAdminLogin}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-stone-700 hover:text-[#8E3B52] hover:border-rose-300 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8E3B52]" />
                  <span>Admin Store Login</span>
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Category Filter Pills */}
          <div className="mt-8 pt-6 border-t border-rose-100 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoryTabs.map((cat) => {
              const count = cat === 'All' 
                ? products.length 
                : products.filter(p => p.category === cat).length;
              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#8E3B52] text-white shadow-xs'
                      : 'bg-white text-stone-600 border border-stone-200/80 hover:border-rose-300 hover:text-stone-900'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Main Store Grid & Filter Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Controls Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-rose-100/80 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Live Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by title, brand, or store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-[#FAF6F6] border border-rose-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8E3B52]/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            {/* Store Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500 font-medium hidden sm:inline">Store:</span>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="py-2 px-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl text-xs font-medium text-stone-700 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="All">All Stores</option>
                {dynamicStores.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500 font-medium hidden sm:inline">Price:</span>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="py-2 px-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl text-xs font-medium text-stone-700 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="under500">Under ₹500</option>
                <option value="under1000">Under ₹1,000</option>
                <option value="1000to2000">₹1,000 – ₹2,000</option>
                <option value="above2000">Above ₹2,000</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5">
              <ArrowDownUp className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="py-2 px-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl text-xs font-medium text-stone-700 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="relevant">Featured / Curation</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Customer Rating</option>
                <option value="discount">Biggest Discount %</option>
                <option value="popular">Most Reviewed</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          </div>

        </div>

        {/* Results Counter & Admin Tip */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <span className="text-xs font-semibold text-stone-600">
            Showing <strong className="text-stone-900">{filteredProducts.length}</strong> items in store
            {selectedCategory !== 'All' && <span> under <em>{selectedCategory}</em></span>}
          </span>

          {adminUser && (
            <span className="text-[11px] text-[#8E3B52] bg-rose-50 px-2.5 py-1 rounded-lg font-medium">
              Hover over any item to Edit or Delete instantly
            </span>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-rose-100 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-[#8E3B52] flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              No products found
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              We couldn't find any products matching your current filters. Try changing your search query or selecting a different category.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setSelectedStore('All');
                  setPriceRange('all');
                }}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
              {adminUser && (
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 rounded-xl bg-[#8E3B52] hover:bg-[#783145] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  + Add First Product Here
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickBuy={onQuickBuy}
                />

                {/* Admin Quick Action Floating Bar */}
                {adminUser && (
                  <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-stone-200 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      id={`store-edit-${product.id}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditModal(product);
                      }}
                      title="Edit this product"
                      className="p-1 rounded text-stone-600 hover:text-[#8E3B52] hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`store-delete-${product.id}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmProduct(product);
                      }}
                      title="Delete this product"
                      className="p-1 rounded text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-rose-100 flex flex-col max-h-[92vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#8E3B52] flex items-center justify-center">
                  {editingProduct ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    {editingProduct ? 'Edit Store Product' : 'Add New Product to Store'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Add products from any category and any retailer into the Style &amp; Shelf catalog.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              
              {/* Product Title */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Noise ColorFit Pro 5 Smartwatch with AMOLED Display"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8E3B52]/20"
                />
              </div>

              {/* Brand & Store */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Noise, Apple, Minimalist, ZARA, Sony"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8E3B52]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Retailer Store *
                  </label>
                  <select
                    value={formData.store}
                    onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {PRESET_STORES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {formData.store === 'Custom Store' && (
                    <input
                      type="text"
                      placeholder="Type custom store name (e.g. Croma, Reliance)"
                      value={formData.customStore}
                      onChange={(e) => setFormData({ ...formData, customStore: e.target.value })}
                      className="mt-2 w-full p-2 bg-white border border-rose-200 rounded-lg text-xs"
                      required
                    />
                  )}
                </div>
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Product Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {PRESET_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {formData.category === 'Custom Category' && (
                    <input
                      type="text"
                      placeholder="Type custom category (e.g. Gaming, Pet Supplies)"
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      className="mt-2 w-full p-2 bg-white border border-rose-200 rounded-lg text-xs"
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Subcategory (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Smartwatches, Dresses, Skincare, Audio"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8E3B52]/20"
                  />
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-[#FAF6F6] rounded-xl border border-rose-100">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Offer Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) => handlePriceUpdate(Number(e.target.value), formData.originalPrice)}
                    className="w-full p-2 bg-white border border-rose-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    MRP Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.originalPrice}
                    onChange={(e) => handlePriceUpdate(formData.price, Number(e.target.value))}
                    className="w-full p-2 bg-white border border-rose-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-rose-200 rounded-lg text-xs font-semibold text-emerald-800"
                  />
                </div>
              </div>

              {/* Affiliate URL */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Affiliate / Product Link *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.amazon.in/dp/...?tag=yourtag"
                  value={formData.affiliateUrl}
                  onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8E3B52]/20"
                />
              </div>

              {/* Product Photo Upload Access */}
              <PhotoUploader
                value={formData.image}
                onChange={(photoUrl) => setFormData({ ...formData, image: photoUrl })}
                required
                presets={CURATED_IMAGE_PRESETS}
              />

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Key product highlights, features, and specs..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                />
              </div>

              {/* Highlights & Coupon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Key Features (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Year Warranty, Fast Charging, Water Resistant"
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Promo Coupon Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TECH20, DEALS10"
                    value={formData.coupon}
                    onChange={(e) => setFormData({ ...formData, coupon: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl text-xs font-mono uppercase"
                  />
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-6 p-3 bg-[#FAF6F6] rounded-xl border border-rose-100">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8E3B52] focus:ring-[#8E3B52]"
                  />
                  <span>Mark as Trending / Featured</span>
                </label>

                <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-rose-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8E3B52] hover:bg-[#783145] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Add to Store'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-rose-100 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
              Remove Product?
            </h3>
            <p className="text-xs text-stone-500 mb-2 font-medium">
              "{deleteConfirmProduct.name}"
            </p>
            <p className="text-[11px] text-stone-400 mb-6">
              This will remove the item permanently from the store catalog.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmProduct(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
