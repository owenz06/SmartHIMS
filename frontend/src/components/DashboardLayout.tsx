import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { X } from 'lucide-react';
import { getNavigationForRole } from '../config/navigation';
import AppLogoIcon from './AppLogoIcon';
import AppHeader from './AppHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  headerActions?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  showSearch = true,
  headerActions,
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user ? getNavigationForRole(user.role) : [];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <AppLogoIcon className="h-5 w-5 fill-current text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm">Hospital Inventory</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-sidebar-foreground hover:text-primary transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
                          : 'text-sidebar-foreground hover:bg-primary/10 hover:text-primary hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
                        isActive ? '' : 'group-hover:scale-110'
                      }`} />
                      <span className="transition-all duration-200">{item.title}</span>
                      {!isActive && (
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer - Optional branding or version */}
          <div className="border-t border-sidebar-border p-4">
            <p className="text-xs text-sidebar-foreground/60 text-center">
              SHIMS v1.0.0
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AppHeader
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          showSearch={showSearch}
          actions={headerActions}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
