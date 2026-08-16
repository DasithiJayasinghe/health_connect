import { useState, type ReactNode } from 'react';
import { useNav, type Screen } from '@/lib/nav';
import { Logo } from '@/components/Logo';
import { LayoutDashboard, ShieldCheck, Users, Stethoscope, AlertTriangle, BarChart3, LogOut, Menu, X } from 'lucide-react';

const sidebarItems: { icon: typeof LayoutDashboard; label: string; screen: Screen }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', screen: 'admin-dashboard' },
  { icon: ShieldCheck, label: 'Verify Doctors', screen: 'admin-verify-doctors' },
  { icon: Users, label: 'Patients', screen: 'admin-patients' },
  { icon: Stethoscope, label: 'Doctors', screen: 'admin-doctors' },
  { icon: AlertTriangle, label: 'Reports', screen: 'admin-reports' },
  { icon: BarChart3, label: 'Analytics', screen: 'admin-analytics' },
];

export function AdminLayout({ children, active }: { children: ReactNode; active: Screen }) {
  const { navigate, setRole, showToast } = useNav();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavigate = (screen: Screen) => {
    navigate(screen);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    setRole(null);
    showToast('Logged out');
    navigate('landing');
  };

  const activeLabel = sidebarItems.find((i) => i.screen === active)?.label ?? 'Admin';

  return (
    <div className="phone-frame bg-gray-50 min-h-screen flex flex-col overflow-x-hidden">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Logo size="sm" light />
            <span className="text-sm font-medium text-gray-400 hidden">Administration</span>
          </div>
        </div>
        <span className="text-sm font-semibold">{activeLabel}</span>
      </header>

      {/* Drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 animate-fade-in" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Sidebar drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-gray-900 text-white flex flex-col transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div>
            <Logo size="sm" light />
            <p className="mt-2 text-xs text-gray-400 font-medium">Administration</p>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.screen;
            return (
              <button
                key={item.label}
                onClick={() => handleNavigate(item.screen)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}
