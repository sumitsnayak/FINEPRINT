import React from 'react';
import { ProductCatalogItem } from '../types';
import { ScoreBadge } from './ScoreBadge';
import { useScan } from '../context/ScanContext';
import { Plus, Scale, Bookmark } from 'lucide-react';
import { api } from '../services/api';

interface ProductCardProps {
  product: ProductCatalogItem;
  onView?: (id: number) => void;
  onQuickLog?: (product: ProductCatalogItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onQuickLog,
}) => {
  const { compareList, addToCompare, removeFromCompare } = useScan();
  const [saved, setSaved] = React.useState(false);

  const isInCompare = compareList.some((p) => p.id === product.id);

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (saved) {
        await api.removeSavedProduct(product.id);
        setSaved(false);
      } else {
        await api.saveProduct(product.id);
        setSaved(true);
      }
    } catch {}
  };

  return (
    <div
      onClick={() => onView && onView(product.id)}
      className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer group shadow-sm"
    >
      <div className="relative aspect-video bg-slate-100 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
            No Label Image
          </div>
        )}

        <div className="absolute top-2.5 right-2.5">
          <ScoreBadge score={product.overall_score} size="sm" />
        </div>

        {product.is_verified && (
          <div className="absolute top-2.5 left-2.5 bg-emerald-600/95 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
            FSSAI Verified
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 font-semibold">
            <span>{product.brand || 'Packaged Brand'}</span>
            <span>{product.package_weight || ''}</span>
          </div>

          <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>

          <p className="text-[11px] text-slate-500 mt-0.5">{product.category}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleToggleCompare}
            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border text-xs font-bold transition-all ${
              isInCompare
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isInCompare ? 'Comparing' : 'Compare'}</span>
          </button>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={handleBookmark}
              title="Bookmark product"
              className={`p-1.5 rounded-full border transition-all ${
                saved
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-xs'
                  : 'border-slate-200 text-slate-400 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>

            {onQuickLog && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickLog(product);
                }}
                title="Log Food"
                className="p-1.5 rounded-full border border-slate-200 text-slate-500 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
