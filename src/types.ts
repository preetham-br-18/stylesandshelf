export type ProductCategory = 
  | 'Beauty' 
  | 'Fashion' 
  | 'Lifestyle' 
  | 'Electronics' 
  | 'Home & Living' 
  | 'Fitness' 
  | 'Accessories' 
  | 'Books & Media'
  | string;

export interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subcategory?: string;

  price: number;
  originalPrice: number;
  discount: number;

  rating: number;
  reviews: number;

  image: string;
  description: string;

  store: string;
  affiliateUrl: string;

  coupon?: string;
  featured?: boolean;
  bestseller?: boolean;
  highlights?: string[];
}

export type SortOption =
  | 'relevant'
  | 'popular'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'discount'
  | 'newest';

export type PriceFilter = 'all' | 'under500' | 'under1000' | '1000to2000' | 'above2000';
export type DiscountFilter = 0 | 20 | 30 | 40 | 50;
export type RatingFilter = 0 | 4 | 4.5;
export type DiscoveryType = 'all' | 'trending' | 'bestseller' | 'deals';

export interface FilterState {
  category: ProductCategory | 'All';
  subcategory: string | 'All';
  priceRange: PriceFilter;
  discount: DiscountFilter;
  rating: RatingFilter;
  type: DiscoveryType;
  brand: string | 'All';
  store: string | 'All';
  searchQuery: string;
}

export interface AffiliateClickEvent {
  productId: number;
  productName: string;
  brand: string;
  store: string;
  category: string;
  price: number;
  timestamp: string;
  affiliateUrl: string;
}

export type ActiveView = 
  | 'home' 
  | 'store'
  | 'search' 
  | 'category' 
  | 'product' 
  | 'wishlist' 
  | 'account' 
  | 'deals' 
  | 'admin' 
  | 'admin-login';

