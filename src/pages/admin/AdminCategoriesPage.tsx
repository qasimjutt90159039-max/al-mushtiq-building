import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Layers } from 'lucide-react';
import { SEO } from '../../components/SEO';
import api from '../../services/api';
import { ICategory } from '../../types';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<ICategory | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(1);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreate = () => {
    setEditingCat(null);
    setName('');
    setDescription('');
    setOrder(categories.length + 1);
    setModalOpen(true);
  };

  const openEdit = (cat: ICategory) => {
    setEditingCat(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setOrder(cat.order || 1);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await api.put(`/categories/${editingCat._id}`, { name, description, order });
      } else {
        await api.post('/categories', { name, description, order });
      }
      setModalOpen(false);
      loadCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to save category.');
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      loadCategories();
    } catch {
      alert('Failed to delete category.');
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Admin Category Management" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-gray-900 tracking-tight">
            Store Categories ({categories.length})
          </h1>
          <p className="text-xs text-gray-500">
            Manage product taxonomy, category orders, and descriptions.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 bg-[#F28C28] hover:bg-[#d9771e] text-white font-bold text-xs rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <table className="w-full text-xs text-left divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Order</th>
              <th className="p-3.5">Category Name</th>
              <th className="p-3.5">Slug</th>
              <th className="p-3.5">Products Count</th>
              <th className="p-3.5">Description</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map(c => (
              <tr key={c._id} className="hover:bg-gray-50/50">
                <td className="p-3.5 font-bold tabular-nums text-gray-400">#{c.order}</td>
                <td className="p-3.5 font-bold text-gray-900">{c.name}</td>
                <td className="p-3.5 font-mono text-gray-500">{c.slug}</td>
                <td className="p-3.5 font-semibold text-gray-700">{c.productCount || 0}</td>
                <td className="p-3.5 text-gray-500 max-w-sm truncate">{c.description || '—'}</td>
                <td className="p-3.5 text-right space-x-2">
                  <button onClick={() => openEdit(c)} className="p-1 text-gray-600 hover:text-[#F28C28]">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(c._id, c.name)} className="p-1 text-gray-400 hover:text-red-600">
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
              {editingCat ? 'Edit Category' : 'Create Category'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Display Order</label>
                <input
                  type="number"
                  value={order}
                  onChange={e => setOrder(Number(e.target.value))}
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
