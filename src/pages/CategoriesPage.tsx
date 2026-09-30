import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ChevronRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import api from '../services/api';
import { ICategory } from '../types';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data.categories || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <SEO
        title="All Building Material Categories"
        description="Browse all 20 construction categories: Cement, Bricks, Steel, Sand, Tiles, Paints, Plumbing, Electrical, Hardware and Tools."
      />

      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-display text-3xl font-black text-gray-900 tracking-tight">
          All Material Categories ({categories.length})
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Explore specialized building materials and construction supplies available for order in Rahim Yar Khan.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="h-44 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="bg-white rounded-xl border border-gray-200 hover:border-[#F28C28] hover:shadow-lg transition-all group flex flex-col justify-between overflow-hidden"
            >
              <div className="relative aspect-16/9 w-full bg-[#F6F7F8] overflow-hidden">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#17191C] group-hover:text-[#F28C28]">
                    <Layers className="w-8 h-8" />
                  </div>
                )}
                <span className="absolute top-3 right-3 text-xs font-semibold text-gray-800 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
                  {cat.productCount !== undefined ? `${cat.productCount} items` : 'In Stock'}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-display text-base font-bold text-gray-900 group-hover:text-[#F28C28] transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#F28C28]">
                  <span>Browse Category</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
