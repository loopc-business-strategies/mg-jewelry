import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { brand } from '../utils/brandConfig';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Store,
  FileText, Settings, LogOut, Coins, FileCheck, ClipboardList,
} from 'lucide-react';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/gold-buying', icon: Coins, label: 'Gold Buying' },
  { to: '/admin/buyers', icon: Store, label: 'International Buyers' },
  { to: '/admin/rfqs', icon: ClipboardList, label: 'RFQs' },
  { to: '/admin/quotes', icon: FileCheck, label: 'Quotes' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/customers', icon: Users, label: 'Customers' },
  { to: '/admin/blog', icon: FileText, label: 'Content' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();

  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-dark border-r border-gold/10 shrink-0">
        <div className="p-6 border-b border-gold/10">
          <div className="flex items-center gap-2">
            <img src={brand.logo} alt={brand.name} className="h-8 w-8" />
            <div>
              <p className="font-display text-sm font-semibold text-off-white">{brand.name}</p>
              <p className="text-[10px] text-gold/60 uppercase tracking-wider">Admin</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-gold/20 text-gold' : 'text-off-white/70 hover:text-gold hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-off-white/50 hover:text-off-white w-full mt-4"
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
