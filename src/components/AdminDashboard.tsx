import React, { useState } from 'react';
import { 
  Plus, Edit3, Trash2, Search, Filter, Sparkles, Flame, Tag, 
  ExternalLink, ArrowLeft, LogOut, CheckCircle2, AlertCircle, 
  Image as ImageIcon, RefreshCw, X, ShieldCheck, Eye, Store
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { User } from 'firebase/auth';
import { 
  addProductToStore, 
  updateProductInStore, 
  removeProductFromStore, 
  resetCatalogToDefaults 
} from '../lib/productStore';

interface AdminDashboardProps {
  products: Product[];
  currentUser: User | null;
  onUpdateProducts: (products: Product[]) => void;
  onResetCatalog: () => void;
  onSignOut: () => void;
  onBackToStore: () => void;
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

const SAMPLE_IMAGE_PRESETS = [
  { label: 'Smartwatch / Tech', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80' },
  { label: 'Headphones / Audio', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Serum / Skincare', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80' },
  { label: 'Lipstick / Beauty', url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80' },
  { label: 'Dress / Fashion', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80' },
  { label: 'Sneakers / Shoes', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80' },
  { label: 'Tote Bag', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80' },
  { label: 'Aroma Candle', url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80' },
  { label: 'Ceramic Mug', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80' },
  { label: 'Yoga Mat / Fitness', url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Journal / Book', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  currentUser,
  onUpdateProducts,
  onResetCatalog,
  onSignOut,
  onBackToStore
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [storeFilter, setStoreFilter] = useState<string>('All');
  
  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const defaultFormData: ProductFormData = {
    name: '',
    slug: '',
    brand: '',
    category: 'Beauty',
    customCategory: '',
    subcategory: '',
    price: 999,
    originalPrice: 1499,
    discount: 33,
    rating: 4.6,
    reviews: 120,
    image: SAMPLE_IMAGE_PRESETS[0].url,
    description: '',
    store: 'Amazon',
    customStore: '',
    affiliateUrl: 'https://www.amazon.in',
    coupon: '',
    featured: false,
    bestseller: false,
    highlights: 'Clean formulation, Dermatologist tested, 100% Authentic'
  };

  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);

  // Computed discount on price change
  const handlePriceChange = (price: number, originalPrice: number) => {
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

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalCategory = formData.category;
    if (formData.category === 'Custom Category') {
      finalCategory = formData.customCategory.trim() || 'General';
    }

    let finalStore = formData.store;
    if (formData.store === 'Custom Store') {
      finalStore = formData.customStore.trim() || 'Online Store';
    }

    const highlightsArray = formData.highlights
      ? formData.highlights.split(',').map(h => h.trim()).filter(Boolean)
      : ['100% Authentic Retailer Deal'];

    if (editingProduct) {
      // Update existing
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
      showNotification(`Updated "${formData.name}" successfully!`);
    } else {
      // Add new
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
      showNotification(`Added new product "${newProduct.name}"!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: number | string) => {
    const updatedList = removeProductFromStore(id, products);
    onUpdateProducts(updatedList);
    setDeleteConfirmId(null);
    showNotification('Product removed from catalog permanently.');
  };

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Filter products for management view
  const filteredProducts = products.filter(p => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match = 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.store.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (storeFilter !== 'All' && p.store !== storeFilter) return false;
    return true;
  });

  const uniqueStores = Array.from(new Set(products.map(p => p.store))).sort();
  const uniqueCategories = Array.from(new Set(products.map(p => p.category))).sort();
  const featuredCount = products.filter(p => p.featured).length;
  const bestsellerCount = products.filter(p => p.bestseller).length;

  return (
    <div className="min-h-screen bg-[#FCF9F9] pb-16">
      
      {/* Top Admin Navigation Header */}
      <div className="bg-[#1E1B1E] text-white border-b border-stone-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-bold tracking-wider uppercase">
              Style &amp; Shelf
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#8E3B52] text-[10px] font-bold uppercase tracking-wider text-rose-100">
              Admin Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              id="admin-view-store-btn"
              type="button"
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Storefront</span>
            </button>

            <div className="h-4 w-px bg-stone-700 hidden sm:block" />

            <div className="hidden md:flex flex-col text-right">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Logged in as</span>
              <span className="text-xs text-stone-200 font-medium truncate max-w-[160px]">
                {currentUser?.email || 'admin@store.com'}
              </span>
            </div>

            <button
              id="admin-logout-btn"
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Success Alert Banner */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs sm:text-sm font-medium animate-in fade-in shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-950">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Catalog</span>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{products.length}</p>
            <span className="text-[11px] text-stone-500 mt-0.5 block">Active products in catalog</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Trending / Featured</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{featuredCount}</p>
            <span className="text-[11px] text-stone-500 mt-0.5 block">Visible in hero &amp; trending</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Best Sellers</span>
              <Sparkles className="w-4 h-4 text-purple-500" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{bestsellerCount}</p>
            <span className="text-[11px] text-stone-500 mt-0.5 block">High-demand picks</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Retailers</span>
              <Store className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">{uniqueStores.length}</p>
            <span className="text-[11px] text-stone-500 mt-0.5 block">Myntra, Amazon, Nykaa...</span>
          </div>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                id="admin-search-products"
                type="text"
                placeholder="Search products by title, brand, store..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#FAF6F6] border border-rose-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8E3B52]/20 focus:border-[#8E3B52]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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

            {/* Filter Dropdowns & Add Button */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#FAF6F6] border border-rose-200 text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={storeFilter}
                onChange={(e) => setStoreFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#FAF6F6] border border-rose-200 text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Stores</option>
                {uniqueStores.map(store => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>

              <button
                id="admin-add-product-btn"
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8E3B52] hover:bg-[#783145] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset product catalog back to factory initial demo list?')) {
                    onResetCatalog();
                    showNotification('Catalog reset to initial products.');
                  }
                }}
                title="Reset to default"
                className="p-2 rounded-xl border border-stone-200 text-stone-500 hover:bg-stone-50 text-xs transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-2xl border border-rose-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF6F6] border-b border-rose-100 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Store</th>
                  <th className="py-3.5 px-4">Price / Discount</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100/60 text-xs">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-400">
                      <p className="font-semibold text-stone-600">No products match your search/filter.</p>
                      <button
                        onClick={() => { setSearchQuery(''); setCategoryFilter('All'); setStoreFilter('All'); }}
                        className="mt-2 text-[#8E3B52] underline font-semibold text-xs cursor-pointer"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-rose-50/30 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-11 h-11 object-cover rounded-lg border border-stone-200 shrink-0"
                          />
                          <div className="max-w-[200px] sm:max-w-xs truncate">
                            <span className="text-[10px] font-bold text-rose-900 uppercase tracking-wider block">
                              {p.brand}
                            </span>
                            <span className="font-semibold text-stone-900 block truncate" title={p.name}>
                              {p.name}
                            </span>
                            {p.coupon && (
                              <span className="inline-block font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 mt-0.5">
                                Code: {p.coupon}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-stone-800">{p.category}</span>
                        {p.subcategory && (
                          <span className="block text-[11px] text-stone-400">{p.subcategory}</span>
                        )}
                      </td>

                      {/* Store */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-semibold text-[11px]">
                          {p.store}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          <span className="line-through">₹{p.originalPrice.toLocaleString('en-IN')}</span>{' '}
                          <span className="text-emerald-700 font-bold">({p.discount}% OFF)</span>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-stone-800">★ {p.rating}</span>
                        <span className="text-[10px] text-stone-400 block">({p.reviews} reviews)</span>
                      </td>

                      {/* Badges */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          {p.featured && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 w-fit">
                              <Flame className="w-3 h-3 text-amber-600" />
                              <span>Trending</span>
                            </span>
                          )}
                          {p.bestseller && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 w-fit">
                              <Sparkles className="w-3 h-3 text-purple-600" />
                              <span>Bestseller</span>
                            </span>
                          )}
                          {!p.featured && !p.bestseller && (
                            <span className="text-stone-400 text-[11px]">Standard</span>
                          )}
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={p.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Visit Affiliate Link"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          <button
                            id={`edit-product-${p.id}`}
                            type="button"
                            onClick={() => openEditModal(p)}
                            title="Edit product"
                            className="p-1.5 rounded-lg text-stone-600 hover:text-[#8E3B52] hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            id={`delete-product-${p.id}`}
                            type="button"
                            onClick={() => setDeleteConfirmId(p.id)}
                            title="Delete product"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="py-3 px-4 bg-[#FAF6F6] border-t border-rose-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products</span>
            <span className="text-[11px] text-stone-400">All changes persist in application catalog state</span>
          </div>
        </div>

      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-rose-100 flex flex-col max-h-[90vh] overflow-hidden">
            
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#8E3B52] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h2 className="font-serif text-lg font-bold text-stone-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="overflow-y-auto py-4 space-y-4 pr-1 text-xs sm:text-sm">
              
              {/* Name & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10% Vitamin C Radiance Serum"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8E3B52]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Minimalist, Lakmé, Nykaa"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8E3B52]/20"
                  />
                </div>
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl focus:bg-white focus:outline-none cursor-pointer text-xs font-medium"
                  >
                    {PRESET_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {formData.category === 'Custom Category' && (
                    <input
                      type="text"
                      placeholder="Type custom category name (e.g. Gaming, Stationery)"
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
                    placeholder="e.g. Skincare, Dresses, Home Accents"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8E3B52]/20 text-xs font-medium"
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
                    onChange={(e) => handlePriceChange(Number(e.target.value), formData.originalPrice)}
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
                    onChange={(e) => handlePriceChange(formData.price, Number(e.target.value))}
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

              {/* Store & Affiliate URL */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Retailer Store *
                  </label>
                  <select
                    value={formData.store}
                    onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl focus:bg-white focus:outline-none cursor-pointer text-xs font-medium"
                  >
                    {PRESET_STORES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {formData.store === 'Custom Store' && (
                    <input
                      type="text"
                      placeholder="Type store name"
                      value={formData.customStore}
                      onChange={(e) => setFormData({ ...formData, customStore: e.target.value })}
                      className="mt-2 w-full p-2 bg-white border border-rose-200 rounded-lg text-xs"
                      required
                    />
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Affiliate Tracking URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={formData.affiliateUrl}
                    onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Image URL & Preset Samples */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Product Image URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="preview"
                      className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
                    />
                  )}
                </div>

                {/* Preset image suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Quick presets:</span>
                  {SAMPLE_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset.url })}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 hover:bg-rose-50 hover:text-[#8E3B52] text-stone-600 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Compelling product details, benefits and why it is recommended..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              {/* Highlights & Coupon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Coupon Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GLOW15"
                    value={formData.coupon}
                    onChange={(e) => setFormData({ ...formData, coupon: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl focus:bg-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Highlights (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Cotton, Breathable, Easy Care"
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF6F6] border border-rose-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Status Toggles: Featured & Bestseller */}
              <div className="flex items-center gap-6 pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8E3B52] focus:ring-[#8E3B52]"
                  />
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Featured (Trending)</span>
                  </span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8E3B52] focus:ring-[#8E3B52]"
                  />
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    <span>Best Seller</span>
                  </span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-rose-100 flex items-center justify-end gap-2">
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
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-rose-100 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
              Delete this product?
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              This will remove the item from the live catalog. You can restore it later by resetting to default.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
