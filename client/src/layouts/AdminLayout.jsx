import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { brand } from '../utils/brandConfig';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Store,
  FileText, Settings, LogOut, MessageSquare,
} from 'lucide-react';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/wholesale', icon: Store, label: 'Wholesale' },
  { to: '/admin/customers', icon: Users, label: 'Customers' },
  { to: '/admin/blog', icon: FileText, label: 'Blog' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();

  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-charcoal text-white shrink-0">
        <div className="p-6 border-b border-gray-700">
          <p className="font-display text-xl text-gold">{brand.name}</p>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-gold text-white' : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 w-full mt-4"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
