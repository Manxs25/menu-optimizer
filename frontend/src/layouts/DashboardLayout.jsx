import React from 'react';
import { LayoutDashboard, Utensils, BarChart3, Sparkles, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard',  icon: LayoutDashboard, path: '/' },
    { label: 'Menu Items', icon: Utensils,         path: '/menu-items' },
    { label: 'Analysis',   icon: BarChart3,        path: '/analysis' },
    { label: 'AI Optimize',icon: Sparkles,         path: '/optimize' },
  ];

  const initial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-slate-800 text-emerald-400">
          MenuOptimizer
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <div
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition
                  ${isActive
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <div
            onClick={onLogout}
            className="flex items-center space-x-3 p-3 rounded-lg text-slate-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-slate-800">
            {navItems.find(n => n.path === location.pathname)?.label || 'Overview'}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-500">
              Welcome, {user?.name || 'User'}
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              {initial}
            </div>
          </div>
        </header>
        <section className="flex-1 overflow-y-auto p-8">
          {children}
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;