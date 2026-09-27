import React from 'react';
import { X, ShieldCheck, FileText, Lock, Mail } from 'lucide-react';

interface LegalModalProps {
  type: 'disclosure' | 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="legal-info-dialog"
        className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-rose-100 flex flex-col max-h-[85vh] overflow-hidden"
      >
        <div className="flex items-center justify-between pb-4 border-b border-rose-100">
          <div className="flex items-center gap-2">
            {type === 'disclosure' && <ShieldCheck className="w-5 h-5 text-[#8E3B52]" />}
            {type === 'privacy' && <Lock className="w-5 h-5 text-[#8E3B52]" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-[#8E3B52]" />}
            <h2 className="font-serif text-lg font-bold text-stone-900">
              {type === 'disclosure' && 'Affiliate Disclosure'}
              {type === 'privacy' && 'Privacy Policy'}
              {type === 'terms' && 'Terms & Conditions'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto py-4 space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed pr-1">
          {type === 'disclosure' && (
            <>
              <p className="font-medium text-stone-900">
                Style &amp; Shelf is an independent affiliate product discovery and recommendation platform dedicated to curating the finest in beauty, fashion, and lifestyle across India.
              </p>
              
              <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-[#8E3B52] font-medium text-xs">
                Important Statement: Some links on Style &amp; Shelf are affiliate tracking links. If you click on an affiliate link and make a qualifying purchase on a retailer’s website (such as Myntra, Amazon, Nykaa, Ajio, or Tata CLiQ), Style &amp; Shelf may receive a referral commission at no additional cost to you.
              </div>

              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider pt-2">
                Our Editorial Independence
              </h3>
              <p>
                Our editorial recommendations are driven by quality, customer ratings, pricing value, and verified popularity. Retailers and brands cannot pay to manipulate honest ratings or product specifications.
              </p>

              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider pt-2">
                Order Fulfillment Notice
              </h3>
              <p>
                Style &amp; Shelf is not an ecommerce merchant. We do not process payments, store credit cards, warehouse items, or handle shipping and returns. When you click BUY NOW, you complete your transaction directly on the retailer’s verified platform.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <p>
                At Style &amp; Shelf, we respect your privacy. We prioritize client-side local storage (for features like your wishlist) so you can freely explore without creating an account or submitting personal data.
              </p>
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider pt-2">
                Information We Store
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Local wishlist preferences (<code className="font-mono text-xs">style-shelf-wishlist</code>) saved in your browser.</li>
                <li>Anonymous discovery click analytics to improve curated recommendations.</li>
                <li>Firebase authentication credentials only if you explicitly choose to sign in.</li>
              </ul>
            </>
          )}

          {type === 'terms' && (
            <>
              <p>
                By using Style &amp; Shelf, you agree to these Terms. Style &amp; Shelf provides product discovery and comparison services. Prices, discounts, product availability, and promotional coupons are subject to change on retailer websites without prior notice.
              </p>
              <p>
                Always verify the final price, seller details, return policies, and product authenticity on the retailer’s checkout page before completing any purchase.
              </p>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-rose-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#8E3B52] hover:bg-[#783145] text-white text-xs font-semibold"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
