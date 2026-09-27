import { AffiliateClickEvent, Product } from '../types';

const CLICKS_STORAGE_KEY = 'style-shelf-clicks';

export function getAffiliateClicks(): AffiliateClickEvent[] {
  try {
    const raw = localStorage.getItem(CLICKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function trackAffiliateClick(product: Product): AffiliateClickEvent {
  const event: AffiliateClickEvent = {
    productId: product.id,
    productName: product.name,
    brand: product.brand,
    store: product.store,
    category: product.category,
    price: product.price,
    timestamp: new Date().toISOString(),
    affiliateUrl: product.affiliateUrl
  };

  try {
    const existing = getAffiliateClicks();
    const updated = [event, ...existing].slice(0, 100); // keep last 100 events
    localStorage.setItem(CLICKS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('style-shelf-affiliate-click', { detail: event }));
  } catch (err) {
    console.warn('Unable to persist click tracking event:', err);
  }

  // Also log for debugging & analytics reporting
  console.info('[Style & Shelf Analytics] affiliate_click:', event);
  return event;
}

export function trackEvent(name: string, payload?: Record<string, unknown>) {
  console.info(`[Style & Shelf Analytics] ${name}:`, payload);
}
