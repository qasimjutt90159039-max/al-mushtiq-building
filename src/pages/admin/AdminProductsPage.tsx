import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
  Package,
  Layers
} from 'lucide-react';
import { SEO } from '../../components/SEO';
import api from '../../services/api';
import { IProduct, ICategory, IBrand } from '../../types';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Edit / Create modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [formData, setFormData] = useState<Partial<IProduct>>({
    name: '',
    sku: '',
    brand: 'DG Khan',
    category: 'Cement',
    unit: 'Bag',
    price: 0,
    stock: 100,
    description: '',
    shortDescription: '',
    isFeatured: false,
    isDeal: false,
    isQuotationRequired: false,
    images: ['https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80'
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products?limit=200');
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    api.get('/categories').then(res => setCategories(res.data.categories || []));
    api.get('/brands').then(res => setBrands(res.data.brands || []));
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `AMS-PRD-${Date.now().toString().slice(-4)}`,
      brand: brands[0]?.name || 'DG Khan',
      category: categories[0]?.name || 'Cement',
      unit: 'Piece',
      price: 1000,
      stock: 50,
      description: 'High-quality building material suited for construction applications.',
      shortDescription: 'Industrial grade construction supply item.',
      isFeatured: false,
      isDeal: false,
      isQuotationRequired: false,
      images: ['https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80'],
      thumbnail: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80'
    });
    setModalOpen(true);
  };

  const openEditModal = (p: IProduct) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      setModalOpen(false);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to save product.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  // Quick price update directly in table
  const handleQuickPrice = async (id: string, newPrice: number) => {
    try {
      await api.put(`/products/${id}`, { price: newPrice });
      setProducts(prev => prev.map(p => p._id === id ? { ...p, price: newPrice } : p));
    } catch {
      alert('Failed to update price.');
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || p.category.toLowerCase() === selectedCat.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <SEO title="Admin Product Management" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-gray-900 tracking-tight">
            Product Management ({products.length} Items)
          </h1>
          <p className="text-xs text-gray-500">
            Create, edit prices, update stock, and control specifications across all building materials.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#F28C28] hover:bg-[#d9771e] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 outline-none focus:border-[#F28C28]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="font-semibold text-gray-500 whitespace-nowrap">Filter Category:</span>
          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-[#F28C28] w-full sm:w-auto"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map(c => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left divide-y divide-gray-200">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Material</th>
                <th className="p-3.5">SKU / Brand</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Unit</th>
                <th className="p-3.5">Price (PKR)</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Flags</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">Loading catalog...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">No matching products found.</td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-3.5 max-w-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.thumbnail || p.images[0] || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80'}
                          alt=""
                          className="w-9 h-9 object-contain bg-gray-50 rounded border border-gray-200 p-1 shrink-0"
                        />
                        <span className="font-bold text-gray-900 line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-gray-700 font-semibold block">{p.sku}</span>
                      <span className="text-[11px] text-gray-400 uppercase">{p.brand}</span>
                    </td>
                    <td className="p-3.5 font-medium text-gray-600">{p.category}</td>
                    <td className="p-3.5 font-semibold text-gray-800">{p.unit}</td>
                    <td className="p-3.5 font-bold text-gray-900 tabular-nums">
                      {p.isQuotationRequired ? (
                        <span className="text-[#F28C28]">Quote Req</span>
                      ) : (
                        `Rs. ${p.price.toLocaleString()}`
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`font-bold tabular-nums ${p.stock <= 10 ? 'text-red-600' : 'text-emerald-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-3.5 space-x-1">
                      {p.isFeatured && <span className="px-1.5 py-0.5 bg-orange-100 text-[#F28C28] rounded text-[10px] font-bold">Featured</span>}
                      {p.isDeal && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold">Deal</span>}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-gray-600 hover:text-[#F28C28] hover:bg-gray-100 rounded"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 z-10 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-lg font-bold text-gray-900 mb-4">
              {editingProduct ? 'Edit Product: ' + editingProduct.name : 'Create New Building Material'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Catalog SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku || ''}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#F28C28]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                  >
                    {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Brand *</label>
                  <select
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                  >
                    {brands.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Unit of Measure *</label>
                  <input
                    type="text"
                    required
                    value={formData.unit || ''}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="Bag, Ton, Box, Piece"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock || 0}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="flex flex-col justify-end space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isQuotationRequired)}
                      onChange={e => setFormData({ ...formData, isQuotationRequired: e.target.checked })}
                    />
                    <span className="font-semibold text-gray-700">Quotation Required (No Fixed Price)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isFeatured)}
                      onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    />
                    <span className="font-semibold text-gray-700">Featured in Storefront</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription || ''}
                  onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Full Technical Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#F28C28] hover:bg-[#d9771e] text-white font-bold rounded"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
