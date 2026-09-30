import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, MessageSquare, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { Logo } from './Logo';
import api from '../services/api';
import { ISiteSettings } from '../types';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<ISiteSettings | null>(null);

  useEffect(() => {
    api.get('/settings').then(res => {
      setSettings(res.data.settings);
    }).catch(() => {
      // Fallback defaults
    });
  }, []);

  const businessPhone = settings?.phone || '+92 301 3242408';
  const whatsappNum = settings?.whatsapp || '+92 301 3242408';
  const address = settings?.address || 'Basti Manzoorabad Pull, Manthar Road, Rahim Yar Khan, Pakistan';
  const openingHours = settings?.openingHours || 'Mon - Sat: 8:00 AM - 8:00 PM | Sun: Closed';

  return (
    <footer className="bg-[#17191C] text-gray-300 border-t border-[#28323A] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-gray-800">
          {/* Col 1: Brand & Contact Info */}
          <div className="space-y-4">
            <Logo variant="light" />
            <p className="text-xs text-gray-400 leading-relaxed">
              Your trusted partner for civil construction materials, hardware, plumbing, sanitary, and structural building supplies serving Rahim Yar Khan.
            </p>
            <div className="pt-2 space-y-2 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F28C28] shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F28C28] shrink-0" />
                <a href={`tel:${businessPhone.replace(/\s+/g, '')}`} className="hover:text-white font-medium">
                  {businessPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#F28C28] shrink-0" />
                <span>{openingHours}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Shop by Material */}
          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#F28C28] pl-2.5">
              Building Materials
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop?category=cement" className="hover:text-[#F28C28] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <span>Ordinary Portland Cement</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=bricks-blocks" className="hover:text-[#F28C28] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <span>Red Clay Bricks &amp; Blocks</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=steel-iron" className="hover:text-[#F28C28] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <span>Grade 60 Steel Rebars</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=sand-crush" className="hover:text-[#F28C28] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <span>River Sand &amp; Margalla Crush</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=tiles" className="hover:text-[#F28C28] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <span>Porcelain &amp; Ceramic Tiles</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=paints" className="hover:text-[#F28C28] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <span>Exterior &amp; Interior Paints</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=plumbing" className="hover:text-[#F28C28] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <span>PVC &amp; PPR Sanitary Pipes</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=electrical" className="hover:text-[#F28C28] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <span>Copper Cables &amp; Conduit</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#F28C28] pl-2.5">
              Customer Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/track-order" className="hover:text-[#F28C28] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <span>Track Your Order</span>
                </Link>
              </li>
              <li>
                <Link to="/request-quote" className="hover:text-[#F28C28] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <span>Request Project Quotation</span>
                </Link>
              </li>
              <li>
                <Link to="/bulk-order" className="hover:text-[#F28C28] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <span>Contractor Bulk Procurement</span>
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-[#F28C28] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <span>Compare Specifications</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F28C28] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <span>Store Contact &amp; Hours</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#F28C28] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <span>Frequently Asked Questions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Dispatch & Delivery Info */}
          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#F28C28] pl-2.5">
              Delivery &amp; Logistics
            </h4>
            <div className="space-y-3 text-xs text-gray-400">
              <p>
                Local delivery via mini-truck, pickup, or hydraulic dumper to construction sites in Rahim Yar Khan and adjacent areas.
              </p>
              <div className="bg-[#28323A] p-3 rounded-lg border border-[#374151]">
                <p className="font-bold text-white mb-1">Contractor Direct Hotline</p>
                <p className="text-gray-300">Call for immediate trailer or dumper dispatch:</p>
                <p className="font-mono text-sm font-bold text-[#F4B942] mt-1">+92 301 3242408</p>
              </div>

              {/* Social Media if valid URL exists */}
              {settings?.socialLinks && (
                <div className="flex items-center gap-2 pt-2">
                  {settings.socialLinks.facebook && (
                    <a
                      href={settings.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-xs rounded text-white"
                    >
                      Facebook
                    </a>
                  )}
                  {settings.socialLinks.instagram && (
                    <a
                      href={settings.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-xs rounded text-white"
                    >
                      Instagram
                    </a>
                  )}
                  {settings.socialLinks.youtube && (
                    <a
                      href={settings.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-xs rounded text-white"
                    >
                      YouTube
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Al Mushtaq Building Material Store. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-gray-300 transition-colors">About Us</Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
            <span>·</span>
            <Link to="/admin/login" className="hover:text-gray-300 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
