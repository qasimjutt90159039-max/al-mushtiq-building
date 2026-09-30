import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';

export const ComparePage: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (compareList.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <SEO title="Compare Products" />
        <div className="w-16 h-16 rounded-full bg-orange-50 text-[#F28C28] flex items-center justify-center mx-auto">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900">No Products Selected to Compare</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Compare specifications, materials, and pricing side-by-side for up to 4 products.
        </p>
        <Link
          to="/shop"
          className="inline-block px-5 py-2.5 bg-[#17191C] text-white font-bold text-xs rounded-lg"
        >
          Browse Materials to Compare
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SEO title="Compare Specifications" description="Side-by-side technical specification comparison of building materials." />

      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Material Specifications Comparison ({compareList.length}/4)
          </h1>
          <p className="text-xs text-gray-500">Side-by-side technical evaluation for project procurement</p>
        </div>
        <button
          onClick={clearCompare}
          className="text-xs font-semibold text-red-600 hover:underline"
        >
          Clear Comparison
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
        <table className="w-full text-xs text-left divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-100">
            {/* Visual & Product Row */}
            <tr className="bg-gray-50/50">
              <td className="p-4 font-bold text-gray-900 w-44">Product</td>
              {compareList.map(p => (
                <td key={p._id} className="p-4 min-w-[220px]">
                  <div className="space-y-2">
                    <div className="relative aspect-4/3 bg-white rounded border border-gray-200 p-2 flex items-center justify-center">
                      <img
                        src={p.thumbnail || p.images[0] || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80'}
                        alt={p.name}
                        className="max-h-28 object-contain"
                      />
                      <button
                        onClick={() => removeFromCompare(p._id)}
                        className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-500 bg-white/80 rounded"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <Link to={`/product/${p.slug}`}>
                      <h4 className="font-bold text-gray-900 hover:text-[#F28C28] line-clamp-2">
                        {p.name}
                      </h4>
                    </Link>
                  </div>
                </td>
              ))}
            </tr>

            {/* Brand */}
            <tr>
              <td className="p-4 font-semibold text-gray-500">Brand / Origin</td>
              {compareList.map(p => (
                <td key={p._id} className="p-4 font-bold text-gray-800 uppercase">{p.brand}</td>
              ))}
            </tr>

            {/* Category */}
            <tr>
              <td className="p-4 font-semibold text-gray-500">Category</td>
              {compareList.map(p => (
                <td key={p._id} className="p-4">{p.category}</td>
              ))}
            </tr>

            {/* SKU */}
            <tr>
              <td className="p-4 font-semibold text-gray-500">Catalog SKU</td>
              {compareList.map(p => (
                <td key={p._id} className="p-4 font-mono font-bold text-gray-700">{p.sku}</td>
              ))}
            </tr>

            {/* Price */}
            <tr>
              <td className="p-4 font-semibold text-gray-500">Unit Price</td>
              {compareList.map(p => (
                <td key={p._id} className="p-4">
                  {p.isQuotationRequired ? (
                    <span className="font-bold text-[#F28C28]">Price on Request</span>
                  ) : (
                    <span className="text-sm font-black text-gray-900 tabular-nums">
                      Rs. {p.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">/{p.unit}</span>
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Sales Unit */}
            <tr>
              <td className="p-4 font-semibold text-gray-500">Standard Unit</td>
              {compareList.map(p => (
                <td key={p._id} className="p-4 font-semibold">{p.unit}</td>
              ))}
            </tr>

            {/* Material */}
            <tr>
              <td className="p-4 font-semibold text-gray-500">Primary Material</td>
              {compareList.map(p => (
                <td key={p._id} className="p-4 text-gray-700">{p.material || 'Standard Composition'}</td>
              ))}
            </tr>

            {/* Specifications */}
            <tr>
              <td className="p-4 font-semibold text-gray-500">Key Specifications</td>
              {compareList.map(p => (
                <td key={p._id} className="p-4">
                  <div className="space-y-1">
                    {p.specifications && Object.entries(p.specifications).slice(0, 4).map(([k, v]) => (
                      <div key={k} className="text-[11px]">
                        <span className="text-gray-400">{k}: </span>
                        <span className="font-medium text-gray-800">{v}</span>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Warranty */}
            <tr>
              <td className="p-4 font-semibold text-gray-500">Warranty Standard</td>
              {compareList.map(p => (
                <td key={p._id} className="p-4 text-gray-700">{p.warranty || 'Manufacturer Warranty'}</td>
              ))}
            </tr>

            {/* Action Row */}
            <tr className="bg-gray-50/50">
              <td className="p-4 font-bold text-gray-900">Purchase Action</td>
              {compareList.map(p => (
                <td key={p._id} className="p-4">
                  {p.isQuotationRequired ? (
                    <Link
                      to={`/product/${p.slug}`}
                      className="inline-block w-full py-2 bg-[#17191C] hover:bg-[#28323A] text-white text-center rounded text-xs font-bold"
                    >
                      Request Quote
                    </Link>
                  ) : (
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="w-full py-2 bg-[#F28C28] hover:bg-[#d9771e] text-white rounded text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
