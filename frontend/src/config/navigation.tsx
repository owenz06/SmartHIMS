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
import type { NavItem } from '../types';

export type UserRole = 'admin' | 'super_admin' | 'manager' | 'pharmacist' | 'procurement_officer';

export const navigationConfig: Record<UserRole, NavItem[]> = {
  super_admin: [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Predictive Analytics', href: '/predictive-dashboard', icon: TrendingUp },
    { title: 'Inventory', href: '/admin/inventory', icon: Package },
    { title: 'Purchase Orders', href: '/admin/purchase-orders', icon: ShoppingCart },
    { title: 'Requisitions', href: '/admin/requisitions', icon: ClipboardList },
    { title: 'Stock In', href: '/admin/stock-in', icon: PackagePlus },
    { title: 'Stock Out', href: '/stock-out', icon: PackageMinus },
    { title: 'Suppliers', href: '/admin/suppliers', icon: Building2 },
    { title: 'Categories', href: '/admin/categories', icon: Tags },
    { title: 'Departments', href: '/admin/departments', icon: Boxes },
    { title: 'Users', href: '/admin/users', icon: Users },
    { title: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { title: 'Audit Logs', href: '/admin/audit-logs', icon: Shield },
    { title: 'Messages', href: '/messages', icon: MessageSquare },
  ],
  admin: [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Predictive Analytics', href: '/predictive-dashboard', icon: TrendingUp },
    { title: 'Inventory', href: '/admin/inventory', icon: Package },
    { title: 'Purchase Orders', href: '/admin/purchase-orders', icon: ShoppingCart },
    { title: 'Requisitions', href: '/admin/requisitions', icon: ClipboardList },
    { title: 'Stock In', href: '/admin/stock-in', icon: PackagePlus },
    { title: 'Stock Out', href: '/stock-out', icon: PackageMinus },
    { title: 'Suppliers', href: '/admin/suppliers', icon: Building2 },
    { title: 'Categories', href: '/admin/categories', icon: Tags },
    { title: 'Departments', href: '/admin/departments', icon: Boxes },
    { title: 'Users', href: '/admin/users', icon: Users },
    { title: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { title: 'Audit Logs', href: '/admin/audit-logs', icon: Shield },
    { title: 'Messages', href: '/messages', icon: MessageSquare },
  ],
  manager: [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Inventory', href: '/admin/inventory', icon: Package },
    { title: 'Stock Requests', href: '/admin/stock-requests', icon: ShoppingCart },
    { title: 'Stock In', href: '/admin/stock-in', icon: PackagePlus },
    { title: 'Stock Out', href: '/stock-out', icon: PackageMinus },
    { title: 'Requisitions', href: '/admin/requisitions', icon: ClipboardList },
    { title: 'Categories', href: '/admin/categories', icon: Tags },
    { title: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { title: 'Notifications', href: '/notifications', icon: Bell },
    { title: 'Messages', href: '/messages', icon: MessageSquare },
  ],
  pharmacist: [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Inventory', href: '/admin/inventory', icon: Package },
    { title: 'Dispense', href: '/stock-out', icon: PackageMinus },
    { title: 'Request Stock', href: '/admin/requisitions', icon: ClipboardList },
    { title: 'Notifications', href: '/notifications', icon: Bell },
    { title: 'Messages', href: '/messages', icon: MessageSquare },
  ],
  procurement_officer: [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Stock Requests', href: '/admin/stock-requests', icon: ClipboardList },
    { title: 'Purchase Orders', href: '/admin/purchase-orders', icon: ShoppingCart },
    { title: 'Suppliers', href: '/admin/suppliers', icon: Building2 },
    { title: 'Stock In', href: '/admin/stock-in', icon: PackagePlus },
    { title: 'Inventory', href: '/admin/inventory', icon: Package },
    { title: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { title: 'Notifications', href: '/notifications', icon: Bell },
    { title: 'Messages', href: '/messages', icon: MessageSquare },
  ],
};

export function getNavigationForRole(role: UserRole): NavItem[] {
  return navigationConfig[role] || navigationConfig.pharmacist;
}

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
