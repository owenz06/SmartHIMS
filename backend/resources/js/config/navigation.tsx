import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Building2,
  Tags,
  TrendingUp,
  ClipboardList,
  PackagePlus,
  PackageMinus,
  BarChart3,
  Shield,
  Bell,
  Boxes,
  MessageSquare,
} from 'lucide-react';
import type { NavItem } from '@/types/navigation';

// Role types based on your Laravel application
export type UserRole = 'admin' | 'super_admin' | 'manager' | 'pharmacist' | 'procurement_officer';

// Navigation configuration for each role
export const navigationConfig: Record<UserRole, NavItem[]> = {
  // Super Admin - Full access to everything
  super_admin: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Predictive Analytics',
      href: '/predictive-dashboard',
      icon: TrendingUp,
    },
    {
      title: 'Inventory',
      href: '/admin/inventory',
      icon: Package,
    },
    {
      title: 'Purchase Orders',
      href: '/admin/purchase-orders',
      icon: ShoppingCart,
    },
    {
      title: 'Requisitions',
      href: '/admin/requisitions',
      icon: ClipboardList,
    },
    {
      title: 'Stock In',
      href: '/admin/stock-in',
      icon: PackagePlus,
    },
    {
      title: 'Stock Out',
      href: '/stock-out',
      icon: PackageMinus,
    },
    {
      title: 'Suppliers',
      href: '/admin/suppliers',
      icon: Building2,
    },
    {
      title: 'Categories',
      href: '/admin/categories',
      icon: Tags,
    },
    {
      title: 'Departments',
      href: '/admin/departments',
      icon: Boxes,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Reports',
      href: '/admin/reports',
      icon: BarChart3,
    },
    {
      title: 'Audit Logs',
      href: '/admin/audit-logs',
      icon: Shield,
    },
    {
      title: 'Messages',
      href: '/messages',
      icon: MessageSquare,
    },
  ],

  // Admin - Similar to super admin but may have some restrictions
  admin: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Predictive Analytics',
      href: '/predictive-dashboard',
      icon: TrendingUp,
    },
    {
      title: 'Inventory',
      href: '/admin/inventory',
      icon: Package,
    },
    {
      title: 'Purchase Orders',
      href: '/admin/purchase-orders',
      icon: ShoppingCart,
    },
    {
      title: 'Requisitions',
      href: '/admin/requisitions',
      icon: ClipboardList,
    },
    {
      title: 'Stock In',
      href: '/admin/stock-in',
      icon: PackagePlus,
    },
    {
      title: 'Stock Out',
      href: '/stock-out',
      icon: PackageMinus,
    },
    {
      title: 'Suppliers',
      href: '/admin/suppliers',
      icon: Building2,
    },
    {
      title: 'Categories',
      href: '/admin/categories',
      icon: Tags,
    },
    {
      title: 'Departments',
      href: '/admin/departments',
      icon: Boxes,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Reports',
      href: '/admin/reports',
      icon: BarChart3,
    },
    {
      title: 'Audit Logs',
      href: '/admin/audit-logs',
      icon: Shield,
    },
    {
      title: 'Messages',
      href: '/messages',
      icon: MessageSquare,
    },
  ],

  // Manager - Inventory management and stock control
  manager: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Inventory',
      href: '/admin/inventory',
      icon: Package,
    },
    {
      title: 'Stock Requests',
      href: '/admin/stock-requests',
      icon: ShoppingCart,
    },
    {
      title: 'Stock In',
      href: '/admin/stock-in',
      icon: PackagePlus,
    },
    {
      title: 'Stock Out',
      href: '/stock-out',
      icon: PackageMinus,
    },
    {
      title: 'Requisitions',
      href: '/admin/requisitions',
      icon: ClipboardList,
    },
    {
      title: 'Categories',
      href: '/admin/categories',
      icon: Tags,
    },
    {
      title: 'Reports',
      href: '/admin/reports',
      icon: BarChart3,
    },
    {
      title: 'Notifications',
      href: '/notifications',
      icon: Bell,
    },
    {
      title: 'Messages',
      href: '/messages',
      icon: MessageSquare,
    },
  ],

  // Pharmacist - Dispensing and stock requests
  pharmacist: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Inventory',
      href: '/admin/inventory',
      icon: Package,
    },
    {
      title: 'Dispense',
      href: '/stock-out',
      icon: PackageMinus,
    },
    {
      title: 'Request Stock',
      href: '/admin/requisitions',
      icon: ClipboardList,
    },
    {
      title: 'Notifications',
      href: '/notifications',
      icon: Bell,
    },
    {
      title: 'Messages',
      href: '/messages',
      icon: MessageSquare,
    },
  ],

  // Procurement Officer - Purchase orders and supplier management
  procurement_officer: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Stock Requests',
      href: '/admin/stock-requests',
      icon: ClipboardList,
    },
    {
      title: 'Purchase Orders',
      href: '/admin/purchase-orders',
      icon: ShoppingCart,
    },
    {
      title: 'Suppliers',
      href: '/admin/suppliers',
      icon: Building2,
    },
    {
      title: 'Stock In',
      href: '/admin/stock-in',
      icon: PackagePlus,
    },
    {
      title: 'Inventory',
      href: '/admin/inventory',
      icon: Package,
    },
    {
      title: 'Reports',
      href: '/admin/reports',
      icon: BarChart3,
    },
    {
      title: 'Notifications',
      href: '/notifications',
      icon: Bell,
    },
    {
      title: 'Messages',
      href: '/messages',
      icon: MessageSquare,
    },
  ],
};

// Get navigation items based on user role
export function getNavigationForRole(role: UserRole): NavItem[] {
  return navigationConfig[role] || navigationConfig.pharmacist; // Default to pharmacist if role not found
}

// Check if user has access to a specific route
export function hasAccessToRoute(role: UserRole, href: string): boolean {
  const navItems = getNavigationForRole(role);
  return navItems.some((item) => item.href === href);
}

// Get role display name
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    super_admin: 'Super Administrator',
    admin: 'Administrator',
    manager: 'Inventory Manager',
    pharmacist: 'Pharmacist',
    procurement_officer: 'Procurement Officer',
  };
  return roleNames[role] || role;
}

// Get role badge color
export function getRoleBadgeColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    manager: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pharmacist: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    procurement_officer: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };
  return colors[role] || colors.pharmacist;
}
