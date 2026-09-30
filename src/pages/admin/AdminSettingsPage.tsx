import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { SEO } from '../../components/SEO';
import api from '../../services/api';
import { ISiteSettings } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<ISiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    api.get('/settings')
      .then(res => setSettings(res.data.settings))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.put('/settings', settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      alert('Failed to save settings.');
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <SEO title="Admin Store Settings" />

      <div>
        <h1 className="font-display text-2xl font-black text-gray-900 tracking-tight">
          Store &amp; Business Configuration
        </h1>
        <p className="text-xs text-gray-500">
          Update business contact details, delivery charges, announcement texts, and policies.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Site settings successfully updated! Changes are live across storefront.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs">
        {/* Business Identity */}
        <div>
          <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2 mb-4">
            Business Contact Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Business Name</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={e => setSettings({ ...settings, businessName: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Business Category Subtitle</label>
              <input
                type="text"
                value={settings.subtitle}
                onChange={e => setSettings({ ...settings, subtitle: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">WhatsApp Hotline</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Store Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">City</label>
              <input
                type="text"
                value={settings.city}
                onChange={e => setSettings({ ...settings, city: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Operating Hours</label>
              <input
                type="text"
                value={settings.openingHours}
                onChange={e => setSettings({ ...settings, openingHours: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Delivery Charges */}
        <div>
          <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2 mb-4">
            Delivery &amp; Logistics Configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Standard Delivery Fee (PKR)</label>
              <input
                type="number"
                value={settings.deliveryFee}
                onChange={e => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Free Delivery Threshold (PKR)</label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={e => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Header Announcement */}
        <div>
          <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2 mb-4">
            Storefront Announcement Bar
          </h3>
          <div>
            <label className="block font-semibold mb-1">Top Bar Announcement Banner</label>
            <input
              type="text"
              value={settings.announcementBarText}
              onChange={e => setSettings({ ...settings, announcementBarText: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Social Media Links (Configurable as requested in Section 62) */}
        <div>
          <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2 mb-4">
            Social Media Links (Leave empty if none)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Facebook URL</label>
              <input
                type="url"
                value={settings.socialLinks?.facebook || ''}
                onChange={e => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                })}
                placeholder="https://facebook.com/your-page"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings.socialLinks?.instagram || ''}
                onChange={e => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                })}
                placeholder="https://instagram.com/your-handle"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">TikTok URL</label>
              <input
                type="url"
                value={settings.socialLinks?.tiktok || ''}
                onChange={e => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, tiktok: e.target.value }
                })}
                placeholder="https://tiktok.com/@your-handle"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">YouTube URL</label>
              <input
                type="url"
                value={settings.socialLinks?.youtube || ''}
                onChange={e => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                })}
                placeholder="https://youtube.com/@channel"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Policies */}
        <div>
          <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2 mb-4">
            Store Policies
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Return &amp; Refund Policy</label>
              <textarea
                rows={3}
                value={settings.returnPolicy}
                onChange={e => setSettings({ ...settings, returnPolicy: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Warranty Standard Policy</label>
              <textarea
                rows={3}
                value={settings.warrantyPolicy}
                onChange={e => setSettings({ ...settings, warrantyPolicy: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-[#F28C28] hover:bg-[#d9771e] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Save Store Settings</span>
        </button>
      </form>
    </div>
  );
};
