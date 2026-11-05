import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ProductCatalogItem } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Bookmark } from 'lucide-react';

interface SavedProductsPageProps {
  onNavigate: (tab: string) => void;
  onSelectProduct: (productId: number) => void;
}

export const SavedProductsPage: React.FC<SavedProductsPageProps> = ({
  onNavigate,
  onSelectProduct,
}) => {
  const [savedProducts, setSavedProducts] = useState<ProductCatalogItem[]>([]);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const items = await api.getSavedProducts();
        setSavedProducts(items);
      } catch (err) {
        console.error('Failed to load saved products:', err);
      }
    };
    fetchSaved();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
          <Bookmark className="w-5 h-5 fill-emerald-600 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">Saved Food Products</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Your bookmarked and monitored packaged items.</p>
        </div>
      </div>

      {savedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onView={(id) => onSelectProduct(id)}
              onQuickLog={() => onNavigate('diary')}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 max-w-md mx-auto shadow-sm">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">No saved products yet</h3>
          <p className="text-xs text-slate-500">
            Click the bookmark icon on any product or scan report to keep track of it here.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
          >
            Explore Product Catalog
          </button>
        </div>
      )}
    </div>
  );
};
