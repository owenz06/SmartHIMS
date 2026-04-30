export interface User {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager' | 'pharmacist' | 'procurement_officer';
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  inventory: {
    total_items: number;
    low_stock_items: number;
    out_of_stock_items: number;
    total_value: string | number;
  };
  purchase_orders: {
    total: number;
    pending: number;
    approved: number;
    received: number;
  };
  requisitions: {
    total: number;
    pending: number;
    approved: number;
    fulfilled: number;
  };
  users?: {
    total: number;
    active: number;
    by_role: Record<string, number>;
  };
}

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string | number;
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
}
