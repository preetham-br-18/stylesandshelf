import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

const PRODUCTS_STORAGE_KEY = 'style-shelf-catalog';
const DELETED_IDS_STORAGE_KEY = 'style-shelf-deleted-ids';
const INITIALIZED_FLAG_KEY = 'style-shelf-catalog-initialized';

// Helper to get set of permanently deleted product IDs
export function getDeletedProductIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_IDS_STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return new Set(arr.map(String));
      }
    }
  } catch (e) {
    console.warn('Failed to parse deleted product IDs:', e);
  }
  return new Set<string>();
}

// Helper to record a deleted product ID
export function recordDeletedProductId(id: number | string): void {
  try {
    const deleted = getDeletedProductIds();
    deleted.add(String(id));
    localStorage.setItem(DELETED_IDS_STORAGE_KEY, JSON.stringify(Array.from(deleted)));
  } catch (e) {
    console.warn('Failed to record deleted product ID:', e);
  }
}

// Clear all recorded deletions (when resetting catalog)
export function clearDeletedProductIds(): void {
  try {
    localStorage.removeItem(DELETED_IDS_STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear deleted product IDs:', e);
  }
}

// Load products safely from storage
export function loadStoredProducts(): Product[] {
  try {
    const deletedIds = getDeletedProductIds();
    const isInitialized = localStorage.getItem(INITIALIZED_FLAG_KEY) === 'true';
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Filter out any explicitly deleted IDs
        const filtered = parsed.filter(p => p && p.id != null && !deletedIds.has(String(p.id)));
        return filtered;
      }
    }

    if (!isInitialized) {
      // First time initialization: store initial products, but respect any deleted IDs
      const initialFiltered = INITIAL_PRODUCTS.filter(p => !deletedIds.has(String(p.id)));
      saveStoredProducts(initialFiltered);
      localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
      return initialFiltered;
    }

    // If initialized and saved was empty array, return empty array (user deleted all items)
    return [];
  } catch (e) {
    console.warn('Failed to load stored products:', e);
    return INITIAL_PRODUCTS;
  }
}

// Save products to storage and notify listeners
export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
    // Dispatch window event so any listening tab or component updates immediately
    window.dispatchEvent(new CustomEvent('style-shelf-catalog-sync', { detail: products }));
  } catch (e) {
    console.warn('Failed to save stored products:', e);
  }
}

// Delete a product permanently
export function removeProductFromStore(id: number | string, currentProducts: Product[]): Product[] {
  recordDeletedProductId(id);
  const updated = currentProducts.filter(p => String(p.id) !== String(id));
  saveStoredProducts(updated);
  return updated;
}

// Add a product to the store
export function addProductToStore(
  productData: Omit<Product, 'id' | 'slug'> & { id?: number; slug?: string },
  currentProducts: Product[]
): { updatedProducts: Product[]; newProduct: Product } {
  // Generate safe numeric ID
  const numericIds = currentProducts
    .map(p => Number(p.id))
    .filter(n => !isNaN(n) && isFinite(n));
  const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : Date.now();

  const slug = productData.slug?.trim()
    ? productData.slug.trim()
    : `${productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${nextId}`;

  const newProduct: Product = {
    ...productData,
    id: nextId,
    slug
  };

  const updatedProducts = [newProduct, ...currentProducts];
  saveStoredProducts(updatedProducts);
  return { updatedProducts, newProduct };
}

// Update an existing product
export function updateProductInStore(
  updatedProduct: Product,
  currentProducts: Product[]
): Product[] {
  const updatedProducts = currentProducts.map(p => 
    String(p.id) === String(updatedProduct.id) ? updatedProduct : p
  );
  saveStoredProducts(updatedProducts);
  return updatedProducts;
}

// Reset catalog to initial state
export function resetCatalogToDefaults(): Product[] {
  clearDeletedProductIds();
  saveStoredProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
}
