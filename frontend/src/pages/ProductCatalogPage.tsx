import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ProductCatalogItem } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, BookOpen } from 'lucide-react';

interface ProductCatalogPageProps {
  onSelectProduct: (productId: number) => void;
  onNavigate: (tab: string) => void;
}

export const ProductCatalogPage: React.FC<ProductCatalogPageProps> = ({
  onSelectProduct,
  onNavigate,
}) => {
  const [products, setProducts] = useState<ProductCatalogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Noodles & Pasta',
    'Biscuits & Cookies',
    'Chips & Crisps',
    'Dairy & Spreads',
    'Sauces & Condiments',
    'Namkeen & Snacks',
    'Beverages & Juices',
  ];

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const items = await api.getProducts({
        q: searchQuery,
        category: categoryFilter,
      });
      setProducts(items);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [categoryFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2 shadow-xs">
            <span>🌿</span>
            <span>Indian Food Repository</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Indian Packaged Food Database
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verified ingredients, nutrition tables, and transparent safety ratings.
          </p>
        </div>

        <button
          onClick={() => onNavigate('scanner')}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 self-start sm:self-auto"
        >
          Scan Unlisted Product
        </button>
      </div>

      {/* Search and Category Filter */}
      <div className="space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchCatalog();
          }}
          className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2"
        >
          <Search className="w-5 h-5 text-slate-400 ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, brand (e.g. Maggi, Lay's, Parle-G, Amul)..."
            className="flex-1 bg-transparent text-sm text-slate-900 focus:outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
          >
            Search
          </button>
        </form>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-16 text-xs text-slate-400">Loading verified catalog...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
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
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">No products match your search</h3>
          <p className="text-xs text-slate-500">
            You can capture its packaging label using our Instant Scanner to inspect its ingredients immediately!
          </p>
          <button
            onClick={() => onNavigate('scanner')}
            className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
          >
            Scan with Camera
          </button>
        </div>
      )}
    </div>
  );
};
