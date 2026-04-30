import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DashboardAPI } from '../lib/api';
import {
  Package,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  FileText,
  Users,
  RefreshCw,
  X,
  Building2,
  Activity,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import type { DashboardStats } from '../types';
import { getNavigationForRole } from '../config/navigation';
import AppLogoIcon from '../components/AppLogoIcon';
import AppHeader from '../components/AppHeader';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import ManagerDashboard from '../components/dashboards/ManagerDashboard';
import PharmacistDashboard from '../components/dashboards/PharmacistDashboard';
import ProcurementDashboard from '../components/dashboards/ProcurementDashboard';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ChartData {
  stock_trend: Array<{ day: string; stockIn: number; stockOut: number }>;
  category_distribution: Array<{ name: string; value: number }>;
  department_usage: Array<{ department: string; usage: number }>;
  recent_activity: Array<{
    id: number;
    action: string;
    description: string;
    user: string;
    created_at: string;
    type: string;
  }>;
  low_stock_items: Array<{
    id: number;
    name: string;
    current_quantity: number;
    reorder_point: number;
    category: string;
  }>;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLowStockDetails, setShowLowStockDetails] = useState(false);

  const navItems = user ? getNavigationForRole(user.role) : [];

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const fetchDashboardData = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // Fetch both stats and charts data in parallel
      const [statsResponse, chartsResponse] = await Promise.all([
        DashboardAPI.getStats(),
        DashboardAPI.getCharts(),
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      if (chartsResponse.data.success) {
        setChartData(chartsResponse.data.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Failed to Load Dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => fetchDashboardData()}>Try Again</Button>
        </div>
      </div>
    );
  }

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
          title="Dashboard"
          subtitle={user ? `Welcome back, ${user.name}!` : 'Welcome back!'}
          onMenuClick={() => setSidebarOpen(true)}
          showSearch={false}
        />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {stats && (
            <>
              {/* Role-Based Dashboard Views */}
              {(user?.role === 'super_admin' || user?.role === 'admin') && (
                <AdminDashboard stats={stats} chartData={chartData} user={user} />
              )}
              
              {user?.role === 'manager' && (
                <ManagerDashboard stats={stats} chartData={chartData} user={user} />
              )}
              
              {user?.role === 'pharmacist' && (
                <PharmacistDashboard stats={stats} chartData={chartData} user={user} />
              )}
              
              {user?.role === 'procurement_officer' && (
                <ProcurementDashboard stats={stats} chartData={chartData} user={user} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
