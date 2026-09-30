import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { SEO } from '../../components/SEO';
import api from '../../services/api';
import { IBrand } from '../../types';

export const AdminBrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<IBrand | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const loadBrands = async () => {
    setLoading(true);
    try {
      const res = await api.get('/brands');
      setBrands(res.data.brands || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const openCreate = () => {
    setEditingBrand(null);
    setName('');
    setDescription('');
    setModalOpen(true);
  };

  const openEdit = (b: IBrand) => {
    setEditingBrand(b);
    setName(b.name);
    setDescription(b.description || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await api.put(`/brands/${editingBrand._id}`, { name, description });
      } else {
        await api.post('/brands', { name, description });
      }
      setModalOpen(false);
      loadBrands();
    } catch (err: any) {
      alert(err.message || 'Failed to save brand.');
    }
  };

  const handleDelete = async (id: string, bName: string) => {
    if (!confirm(`Delete brand "${bName}"?`)) return;
    try {
      await api.delete(`/brands/${id}`);
      loadBrands();
    } catch {
      alert('Failed to delete brand.');
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Admin Brand Management" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-gray-900 tracking-tight">
            Manufacturer Brands ({brands.length})
          </h1>
          <p className="text-xs text-gray-500">
            Manage manufacturer profiles and partner brand names.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 bg-[#F28C28] hover:bg-[#d9771e] text-white font-bold text-xs rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <table className="w-full text-xs text-left divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Brand Name</th>
              <th className="p-3.5">Slug</th>
              <th className="p-3.5">Associated Products</th>
              <th className="p-3.5">Description</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {brands.map(b => (
              <tr key={b._id} className="hover:bg-gray-50/50">
                <td className="p-3.5 font-bold text-gray-900">{b.name}</td>
                <td className="p-3.5 font-mono text-gray-500">{b.slug}</td>
                <td className="p-3.5 font-semibold text-gray-700">{b.productCount || 0}</td>
                <td className="p-3.5 text-gray-500 max-w-sm truncate">{b.description || '—'}</td>
                <td className="p-3.5 text-right space-x-2">
                  <button onClick={() => openEdit(b)} className="p-1 text-gray-600 hover:text-[#F28C28]">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(b._id, b.name)} className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 z-10 text-xs space-y-4">
            <h3 className="font-bold text-base text-gray-900">
              {editingBrand ? 'Edit Brand' : 'Create Brand'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded font-semibold text-gray-600">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#F28C28] text-white font-bold rounded">
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
