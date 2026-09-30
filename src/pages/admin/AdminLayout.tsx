import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  ShoppingCart,
  FileText,
  MessageSquare,
  Settings,
  Users,
  LogOut,
  Store
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/Logo';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Admin Authorization Required</h2>
        <p className="text-xs text-gray-500">Please sign in with administrator credentials.</p>
        <Link to="/admin/login" className="inline-block px-5 py-2.5 bg-[#17191C] text-white text-xs font-bold rounded-lg">
          Go to Admin Sign In
        </Link>
      </div>
    );
  }

  const menu = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products (100+)', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Brands', path: '/admin/brands', icon: Tag },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Quote Requests', path: '/admin/quotes', icon: FileText },
    { name: 'Customer Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F8] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#17191C] text-white shrink-0 p-5 flex flex-col justify-between border-r border-[#28323A]">
        <div className="space-y-6">
          <div className="pb-4 border-b border-[#28323A]">
            <Logo variant="light" />
            <span className="text-[10px] font-mono tracking-widest text-[#F28C28] uppercase mt-1 block">
              Control Console
            </span>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {menu.map(item => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? 'bg-[#F28C28] text-white font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-[#28323A]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[#28323A] space-y-2 text-xs">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white py-1.5 transition-colors"
          >
            <Store className="w-4 h-4 text-[#F4B942]" />
            <span>View Public Store</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 py-1.5 w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin View Container */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
};
