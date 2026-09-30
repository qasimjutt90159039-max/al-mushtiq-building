import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import api from '../services/api';
import { IBrand } from '../types';

export const BrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/brands')
      .then(res => setBrands(res.data.brands || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <SEO
        title="Manufacturer Brands &amp; Mills"
        description="Explore building materials from DG Khan, Bestway, Maple Leaf, Lucky, Fauji, Mughal Steel, Master, Berger, Nippon, and Popular."
      />

      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-display text-3xl font-black text-gray-900 tracking-tight">
          Manufacturer Brands &amp; Mills
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Explore building materials supplied from recognized domestic and international manufacturers.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="h-36 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map(brand => (
            <Link
              key={brand._id}
              to={`/shop?brand=${brand.slug}`}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#F28C28] hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-black text-gray-900 group-hover:text-[#F28C28] transition-colors">
                  {brand.name}
                </span>
                <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                  {brand.productCount || 0} items
                </span>
              </div>

              {brand.description && (
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {brand.description}
                </p>
              )}

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#F28C28]">
                <span>View Products</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
